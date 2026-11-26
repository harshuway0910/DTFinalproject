import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv  # ← ADD THIS
import google.generativeai as genai  # ← ADD THIS

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-3.8-flash')

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.xlsx')

def init_db():
    if not os.path.exists(DB_FILE):
        with pd.ExcelWriter(DB_FILE, engine='openpyxl') as writer:
            pd.DataFrame(columns=['id', 'name', 'email', 'password', 'age', 'goal', 'notifications', 'xp', 'level', 'created_at']).to_excel(writer, sheet_name='users', index=False)
            pd.DataFrame(columns=['timestamp', 'email', 'travel', 'shopping', 'electricity', 'waste', 'total_footprint']).to_excel(writer, sheet_name='footprints', index=False)

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
        
        full_prompt = f"{system_prompt}\n\nUser: {user_message}\nEcoBot:"
        
        # Call Gemini 3.5 Flash with a fast timeout (3.5s)
        bot_response = None
        try:
            g_model = genai.GenerativeModel('gemini-3.5-flash')
            resp = g_model.generate_content(full_prompt, request_options={"timeout": 3.5})
            if resp and resp.text:
                bot_response = resp.text.strip()
        except Exception as e:
            # If Gemini hits rate limit/quota or takes too long, fall back instantly
            pass
        
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

@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.json
    email = data.get('email')
    
    travel_impact = data.get('travel', 0) * 0.12
    shopping_impact = data.get('shopping', 0) * 5.0
    electricity_impact = data.get('electricity', 0) * 0.85
    waste_impact = data.get('waste', 0) * 0.5
    
    total = travel_impact + shopping_impact + electricity_impact + waste_impact
    
    init_db()
    new_data = {
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'email': email,
        'travel': data.get('travel', 0),
        'shopping': data.get('shopping', 0),
        'electricity': data.get('electricity', 0),
        'waste': data.get('waste', 0),
        'total_footprint': total
    }
    
    footprints_df = pd.read_excel(DB_FILE, sheet_name='footprints')
    footprints_df = pd.concat([footprints_df, pd.DataFrame([new_data])], ignore_index=True)
    
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
        "xp_gained": xp_gained,
        "new_xp": int(new_xp),
        "new_level": int(new_level)
    })

@app.route('/api/tips', methods=['POST'])
def get_tips():
    data = request.json
    tips = []
    if data.get('travel', 0) > 100: tips.append("Your travel footprint is high. Consider carpooling.")
    if data.get('electricity', 0) > 300: tips.append("Reduce electricity usage by switching to LED bulbs.")
    if data.get('shopping', 0) > 20: tips.append("Fast fashion contributes heavily to emissions. Try second-hand.")
    if data.get('waste', 0) > 15: tips.append("Start a compost bin to reduce landfill contribution.")
    if not tips: tips.append("Great job! Your footprint is low.")
    return jsonify({"tips": tips})

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