import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types

app = Flask(__name__)
CORS(app)

# Load environment variables (DT1/.env takes precedence)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'), override=True)
load_dotenv()

# Resilient Gemini Client initialization
gemini_client = None
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    try:
        gemini_client = genai.Client(
            api_key=gemini_api_key.strip(),
            http_options=types.HttpOptions(timeout=15000)
        )
    except Exception as e:
        print(f"[Gemini Client Init Warning] Could not initialize client: {e}", flush=True)
        gemini_client = None
else:
    print("[Gemini Client Notice] GEMINI_API_KEY is not set. Chatbot will use fallback responses.", flush=True)

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.xlsx')

def init_db():
    if not os.path.exists(DB_FILE):
        with pd.ExcelWriter(DB_FILE, engine='openpyxl') as writer:
            pd.DataFrame(columns=['id', 'name', 'email', 'password', 'age', 'goal', 'notifications', 'xp', 'level', 'created_at']).to_excel(writer, sheet_name='users', index=False)
            pd.DataFrame(columns=['timestamp', 'email', 'travel', 'shopping', 'electricity', 'waste', 'food', 'cooking_gas', 'total_footprint']).to_excel(writer, sheet_name='footprints', index=False)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    init_db()
    users_df = pd.read_excel(DB_FILE, sheet_name='users')
    
    if data['email'] in users_df['email'].values:
        return jsonify({"success": False, "message": "Email already exists"}), 400
        
    new_user = {
        'id': len(users_df) + 1,
        'name': data.get('name', ''),
        'email': data.get('email', ''),
        'password': data.get('password', ''),
        'age': data.get('age', 0),
        'goal': data.get('goal', 0),
        'notifications': True,
        'xp': 0,
        'level': 1,
        'created_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    users_df = pd.concat([users_df, pd.DataFrame([new_user])], ignore_index=True)
    
    with pd.ExcelWriter(DB_FILE, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
        users_df.to_excel(writer, sheet_name='users', index=False)
        
    return jsonify({"success": True, "user": new_user})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    init_db()
    users_df = pd.read_excel(DB_FILE, sheet_name='users')
    
    user = users_df[(users_df['email'] == data.get('email')) & (users_df['password'] == data.get('password'))]
    if not user.empty:
        user_dict = user.iloc[0].to_dict()
        # Handle nan values
        for k,v in user_dict.items():
            if pd.isna(v): user_dict[k] = ""
        return jsonify({"success": True, "user": user_dict})
    
    # Try Google sign in
    if data.get('google_signin'):
        user = users_df[users_df['email'] == data.get('email')]
        if not user.empty:
            user_dict = user.iloc[0].to_dict()
            return jsonify({"success": True, "user": user_dict})
            
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

# ← ADD THE CHATBOT ROUTE HERE
SUPPORTED_MODELS = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash']

def get_eco_fallback_response(user_message):
    msg = user_message.lower()
    if any(k in msg for k in ['travel', 'car', 'flight', 'bike', 'bus', 'train', 'commute', 'transport']):
        return "🚗 Travel tips: Switching to public transport, carpooling, walking, or cycling even 2 days a week can cut your transport footprint by over 30%! For long trips, trains are much greener than flights."
    elif any(k in msg for k in ['electric', 'energy', 'power', 'light', 'solar', 'ac', 'appliance', 'kwh']):
        return "💡 Energy saving: Switch to LED bulbs, unplug phantom chargers when not in use, and keep your AC at 24°C–26°C. These simple tweaks can lower your electricity emissions by up to 25%."
    elif any(k in msg for k in ['shopping', 'clothes', 'fashion', 'buy', 'plastic', 'waste', 'garbage', 'recycle', 'trash']):
        return "🛍️ Waste & Consumption: Try the 5 R's—Refuse single-use plastics, Reduce unnecessary purchases, Reuse containers, Repurpose old goods, and Recycle properly. Composting kitchen scraps alone cuts methane emissions."
    elif any(k in msg for k in ['food', 'meat', 'diet', 'eat', 'vegan', 'plant', 'dairy']):
        return "🥗 Sustainable Eating: Adding more plant-based meals to your week is one of the most effective ways to lower your footprint! Locally sourced, seasonal produce has a significantly lower carbon cost."
    elif any(k in msg for k in ['footprint', 'what is', 'explain', 'meaning', 'calculate']):
        return "🌱 A carbon footprint is the total amount of greenhouse gases (mainly CO₂ and methane) released into the atmosphere by your daily choices—including travel, energy, shopping, and diet. Knowing your number is the first step to owning your change!"
    else:
        return "🌱 Great question! Every small action counts—from turning off standby power and walking short distances to choosing seasonal foods and reducing waste. Try logging your daily habits in the Calculator tab to see your impact in real time!"

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json or {}
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        system_prompt = (
            "You are EcoBot, a friendly and knowledgeable environmental sustainability assistant "
            "for a Carbon Footprint Calculator app called 'Footprint Fighter'. "
            "Your role is to help users understand their carbon footprint, provide actionable tips "
            "to reduce emissions, explain environmental concepts in simple terms, and motivate users "
            "to adopt eco-friendly habits. Keep responses concise (2-4 sentences) and encouraging."
        )
        
        # Call Gemini gemini-3.5-flash-lite with 15s timeout (set at client level)
        bot_response = None
        if gemini_client:
            try:
                config = types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.7,
                )
                resp = gemini_client.models.generate_content(
                    model='gemini-3.5-flash-lite',
                    contents=user_message,
                    config=config
                )
                if resp and resp.text:
                    bot_response = resp.text.strip()
            except Exception as e:
                print(f"[Gemini API Error] {type(e).__name__}: {e}", flush=True)
        
        # If Gemini is unavailable or rate-limited, provide instant eco response
        if not bot_response:
            bot_response = get_eco_fallback_response(user_message)
        
        return jsonify({
            'user_message': user_message,
            'bot_response': bot_response
        })
    
    except Exception as e:
        # Guarantee a helpful eco response even on unexpected exceptions
        return jsonify({
            'user_message': user_message if 'user_message' in locals() else '',
            'bot_response': get_eco_fallback_response(user_message if 'user_message' in locals() else '')
        })

# Sources: Diet values are UK estimates (Scarborough et al. 2014, doi 10.1007/s10584-014-1169-1, via Ethical Consumer); LPG is the DEFRA factor.
DIET_FACTORS = {
    'vegan': 19.2,
    'vegetarian': 26.7,
    'fish': 27.5,
    'low_meat': 32.7,
    'medium_meat': 38.5,
    'high_meat': 50.0
}
LPG_FACTOR = 2.94

@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.json or {}
    email = data.get('email')
    
    travel_impact = float(data.get('travel', 0) or 0) * 0.12
    shopping_impact = (float(data.get('shopping', 0) or 0) * 5.0) / 4.33
    electricity_impact = (float(data.get('electricity', 0) or 0) * 0.85) / 4.33
    waste_impact = float(data.get('waste', 0) or 0) * 0.5
    
    food_val = data.get('food')
    food_impact = DIET_FACTORS.get(food_val, 0.0)
    
    cooking_gas_val = max(0.0, float(data.get('cooking_gas', 0) or 0))
    cooking_gas_impact = cooking_gas_val * LPG_FACTOR
    
    total = travel_impact + shopping_impact + electricity_impact + waste_impact + food_impact + cooking_gas_impact
    
    breakdown = {
        'travel': round(travel_impact, 2),
        'shopping': round(shopping_impact, 2),
        'electricity': round(electricity_impact, 2),
        'waste': round(waste_impact, 2),
        'food': round(food_impact, 2),
        'cooking_gas': round(cooking_gas_impact, 2)
    }
    
    init_db()
    new_data = {
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'email': email,
        'travel': data.get('travel', 0),
        'shopping': data.get('shopping', 0),
        'electricity': data.get('electricity', 0),
        'waste': data.get('waste', 0),
        'food': data.get('food') or 0,
        'cooking_gas': cooking_gas_val,
        'total_footprint': total
    }
    
    footprints_df = pd.read_excel(DB_FILE, sheet_name='footprints')
    
    # Fill 0 only in the new food and cooking_gas columns
    if 'food' not in footprints_df.columns:
        footprints_df['food'] = 0
    else:
        footprints_df['food'] = footprints_df['food'].fillna(0)
        
    if 'cooking_gas' not in footprints_df.columns:
        footprints_df['cooking_gas'] = 0
    else:
        footprints_df['cooking_gas'] = footprints_df['cooking_gas'].fillna(0)
        
    footprints_df = pd.concat([footprints_df, pd.DataFrame([new_data])], ignore_index=True)
    footprints_df['food'] = footprints_df['food'].fillna(0)
    footprints_df['cooking_gas'] = footprints_df['cooking_gas'].fillna(0)
    
    with pd.ExcelWriter(DB_FILE, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
        footprints_df.to_excel(writer, sheet_name='footprints', index=False)
        
    # Give XP for calculation if footprint is below a certain threshold or just for calculating
    xp_gained = 50
    if total < 50:
        xp_gained += 100
        
    users_df = pd.read_excel(DB_FILE, sheet_name='users')
    user_idx = users_df.index[users_df['email'] == email]
    new_xp = 0
    new_level = 1
    if not user_idx.empty:
        idx = user_idx[0]
        users_df.at[idx, 'xp'] += xp_gained
        new_xp = users_df.at[idx, 'xp']
        new_level = int(new_xp / 1000) + 1
        users_df.at[idx, 'level'] = new_level
        with pd.ExcelWriter(DB_FILE, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            users_df.to_excel(writer, sheet_name='users', index=False)
            
    return jsonify({
        "success": True, 
        "total_footprint": total,
        "breakdown": breakdown,
        "xp_gained": xp_gained,
        "new_xp": int(new_xp),
        "new_level": int(new_level)
    })

@app.route('/api/tips', methods=['POST'])
def get_tips():
    data = request.json or {}
    
    travel_val = float(data.get('travel', 0) or 0)
    shopping_val = float(data.get('shopping', 0) or 0)
    electricity_val = float(data.get('electricity', 0) or 0)
    waste_val = float(data.get('waste', 0) or 0)
    food_val = data.get('food')
    cooking_gas_val = max(0.0, float(data.get('cooking_gas', 0) or 0))
    
    travel_impact = travel_val * 0.12
    shopping_impact = (shopping_val * 5.0) / 4.33
    electricity_impact = (electricity_val * 0.85) / 4.33
    waste_impact = waste_val * 0.5
    food_impact = DIET_FACTORS.get(food_val, 0.0)
    cooking_gas_impact = cooking_gas_val * LPG_FACTOR
    
    total = travel_impact + shopping_impact + electricity_impact + waste_impact + food_impact + cooking_gas_impact
    
    categories = []
    
    if travel_impact > 0:
        categories.append({
            'category': 'travel',
            'user_value': travel_val,
            'user_unit_key': 'travel_unit',
            'impact': round(travel_impact, 2),
            'action1_key': 'tip_travel_action1',
            'action1_saving': round(travel_impact * 0.10, 2),
            'action1_assumption_key': 'assumption_travel_10pct',
            'action2_key': 'tip_travel_action2',
            'action2_saving': None,
            'action2_assumption_key': None
        })
        
    if shopping_impact > 0:
        categories.append({
            'category': 'shopping',
            'user_value': shopping_val,
            'user_unit_key': 'shopping_unit',
            'impact': round(shopping_impact, 2),
            'action1_key': 'tip_shopping_action1',
            'action1_saving': round(5.0 / 4.33, 2) if shopping_val >= 1 else None,
            'action1_assumption_key': 'assumption_shopping_1fewer' if shopping_val >= 1 else None,
            'action2_key': 'tip_shopping_action2',
            'action2_saving': None,
            'action2_assumption_key': None
        })
        
    if electricity_impact > 0:
        categories.append({
            'category': 'electricity',
            'user_value': electricity_val,
            'user_unit_key': 'electricity_unit',
            'impact': round(electricity_impact, 2),
            'action1_key': 'tip_electricity_action1',
            'action1_saving': round(electricity_impact * 0.10, 2),
            'action1_assumption_key': 'assumption_electricity_10pct',
            'action2_key': 'tip_electricity_action2',
            'action2_saving': None,
            'action2_assumption_key': None
        })
        
    if waste_impact > 0:
        categories.append({
            'category': 'waste',
            'user_value': waste_val,
            'user_unit_key': 'waste_unit',
            'impact': round(waste_impact, 2),
            'action1_key': 'tip_waste_action1',
            'action1_saving': round(waste_impact * 0.20, 2),
            'action1_assumption_key': 'assumption_waste_20pct',
            'action2_key': 'tip_waste_action2',
            'action2_saving': None,
            'action2_assumption_key': None
        })
        
    if cooking_gas_impact > 0:
        categories.append({
            'category': 'cooking_gas',
            'user_value': cooking_gas_val,
            'user_unit_key': 'cooking_gas_unit',
            'impact': round(cooking_gas_impact, 2),
            'action1_key': 'tip_cooking_gas_action1',
            'action1_saving': round(cooking_gas_impact * 0.10, 2),
            'action1_assumption_key': 'assumption_cooking_gas_10pct',
            'action2_key': 'tip_cooking_gas_action2',
            'action2_saving': None,
            'action2_assumption_key': None
        })
        
    if food_impact > 0 and food_val:
        food_action1_key = f"tip_food_{food_val}_action1"
        food_action2_key = f"tip_food_{food_val}_action2"
        food_saving = None
        food_assumption_key = None
        
        if food_val == 'high_meat':
            food_saving = 11.5
            food_assumption_key = 'assumption_food_high_to_medium'
        elif food_val == 'medium_meat':
            food_saving = 5.8
            food_assumption_key = 'assumption_food_medium_to_low'
        elif food_val == 'low_meat':
            food_saving = 6.0
            food_assumption_key = 'assumption_food_low_to_veg'
        elif food_val == 'fish':
            food_saving = 0.8
            food_assumption_key = 'assumption_food_fish_to_veg'
        elif food_val == 'vegetarian':
            food_saving = 7.5
            food_assumption_key = 'assumption_food_veg_to_vegan'
            
        categories.append({
            'category': 'food',
            'user_value': food_val,
            'user_unit_key': 'diet_type',
            'impact': round(food_impact, 2),
            'action1_key': food_action1_key,
            'action1_saving': food_saving,
            'action1_assumption_key': food_assumption_key,
            'action2_key': food_action2_key,
            'action2_saving': None,
            'action2_assumption_key': None
        })
        
    # Sort categories by kg CO2e descending and take top 3
    categories.sort(key=lambda x: x['impact'], reverse=True)
    top_3 = categories[:3]
    
    # Encouragement message key if footprint is low or all numeric inputs are zero
    encouragement_key = None
    all_numeric_zero = (travel_val == 0 and shopping_val == 0 and electricity_val == 0 and waste_val == 0 and cooking_gas_val == 0)
    if total < 50 or all_numeric_zero:
        encouragement_key = 'tip_low_footprint_encouragement'
        
    return jsonify({
        "tips": top_3,
        "encouragement_key": encouragement_key
    })

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    init_db()
    users_df = pd.read_excel(DB_FILE, sheet_name='users')
    
    leaderboard = []
    for _, row in users_df.iterrows():
        leaderboard.append({
            'name': row['name'],
            'xp': row['xp'],
            'level': row['level']
        })
        
    leaderboard.sort(key=lambda x: x['xp'], reverse=True)
    return jsonify({"leaderboard": leaderboard[:10]})

@app.route('/api/user_data', methods=['GET'])
def get_user_data():
    email = request.args.get('email')
    if not email: return jsonify({"success": False})
    
    init_db()
    footprints_df = pd.read_excel(DB_FILE, sheet_name='footprints')
    user_footprints = footprints_df[footprints_df['email'] == email]
    
    history = []
    for _, row in user_footprints.iterrows():
        history.append({
            'timestamp': row['timestamp'],
            'total_footprint': row['total_footprint']
        })
        
    return jsonify({"success": True, "history": history})

@app.route('/api/settings', methods=['POST'])
def update_settings():
    data = request.json
    email = data.get('email')
    init_db()
    users_df = pd.read_excel(DB_FILE, sheet_name='users')
    user_idx = users_df.index[users_df['email'] == email]
    
    if not user_idx.empty:
        idx = user_idx[0]
        users_df.at[idx, 'goal'] = data.get('goal', users_df.at[idx, 'goal'])
        users_df.at[idx, 'notifications'] = data.get('notifications', users_df.at[idx, 'notifications'])
        with pd.ExcelWriter(DB_FILE, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            users_df.to_excel(writer, sheet_name='users', index=False)
        return jsonify({"success": True})
        
    return jsonify({"success": False})

init_db()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)