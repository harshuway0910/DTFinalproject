// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

// const resources = {
//   en: {
//     translation: {
//       "app_title": "EcoTrack",
//       "nav_dashboard": "Dashboard",
//       "nav_calculator": "Calculator",
//       "login": "Login / Register",
//       "travel": "Travel (km/week)",
//       "shopping": "Shopping (items/month)",
//       "electricity": "Electricity (kWh/month)",
//       "waste": "Waste (kg/week)",
//       "submit": "Calculate Footprint",
//       "modal_title": "Join EcoTrack",
//       "name": "Full Name",
//       "age": "Age",
//       "goal": "Reduction Goal (%)",
//       "email": "Email Address",
//       "google_signin": "Sign in with Google",
//       "dashboard_title": "Your Progress",
//       "level": "Level",
//       "xp": "XP"
//     }
//   },
//   hi: {
//     translation: {
//       "app_title": "इको-ट्रैक",
//       "nav_dashboard": "डैशबोर्ड",
//       "nav_calculator": "कैलकुलेटर",
//       "login": "लॉगिन / रजिस्टर",
//       "travel": "यात्रा (किमी/सप्ताह)",
//       "shopping": "खरीदारी (आइटम/महीना)",
//       "electricity": "बिजली (kWh/महीना)",
//       "waste": "कचरा (किलो/सप्ताह)",
//       "submit": "फुटप्रिंट की गणना करें",
//       "modal_title": "इको-ट्रैक से जुड़ें",
//       "name": "पूरा नाम",
//       "age": "आयु",
//       "goal": "कमी का लक्ष्य (%)",
//       "email": "ईमेल पता",
//       "google_signin": "Google के साथ साइन इन करें",
//       "dashboard_title": "आपकी प्रगति",
//       "level": "स्तर",
//       "xp": "एक्सपी"
//     }
//   }
// };

// i18n
//   .use(initReactI18next)
//   .init({
//     resources,
//     lng: "en",
//     fallbackLng: "en",
//     interpolation: {
//       escapeValue: false
//     }
//   });

// export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App & Navbar
      "app_title": "Footprint Fighter",
      "nav_dashboard": "Dashboard",
      "nav_calculator": "Calculator",
      "nav_learn": "Learn",
      "nav_leaderboard": "Leaderboard",
      "nav_profile": "Profile",
      "nav_help": "Help",
      "login": "Login / Register",
      "logout": "Logout",

      // Auth Modal
      "modal_title": "Join Footprint Fighter",
      "name": "Full Name",
      "age": "Age",
      "goal": "Reduction Goal (%)",
      "email": "Email Address",
      "password": "Password",
      "google_signin": "Sign in with Google",
      "register": "Register",
      "already_account": "Already have an account? Login",
      "no_account": "Don't have an account? Register",

      // Calculator
      "calculator_title": "Track Your Impact",
      "step_of": "Step {{current}} of {{total}}",
      "travel_label": "Weekly car/bike distance",
      "travel_unit": "km / week",
      "travel_helper": "Include all personal vehicle trips",
      "shopping_label": "Items purchased this month",
      "shopping_unit": "items / month",
      "shopping_helper": "Clothes, electronics, household goods",
      "electricity_label": "Monthly electricity usage",
      "electricity_unit": "kWh / month",
      "electricity_helper": "Check your electricity bill for this number",
      "electricity_tooltip": "India's grid emits ~0.82 kg CO₂ per kWh",
      "waste_label": "Weekly waste generated",
      "waste_unit": "kg / week",
      "waste_helper": "Include household garbage before recycling",
      "back": "← Back",
      "next": "Next →",
      "submit": "Calculate 🌱",
      "calculating": "Calculating...",
      "result_title": "Your Total Footprint",
      "result_unit": "kg CO₂",
      "xp_gained": "+{{xp}} XP",
      "solutions_title": "Personalized Solutions 🌱",
      "login_to_calculate": "Please login first to calculate your footprint!",

      // Dashboard
      "welcome": "Welcome, {{name}}",
      "share_profile": "Share Profile",
      "total_calculations": "Total Calculations",
      "current_level": "Current Level",
      "latest_footprint": "Latest Footprint",
      "eco_warrior": "Eco-Warrior",
      "missions_title": "Missions & Badges",
      "badge_earned": "Badge Earned",
      "mission_1": "Calculate footprint for the first time",
      "mission_2": "Keep footprint below 50 kg for a calculation",
      "mission_3": "Reach Level 2",
      "chart_title": "Your Footprint vs. India Average",
      "your_footprint": "Your Footprint",
      "avg_human": "India Average",
      "share_insights": "Share Insights (Daily)",
      "profile_shares": "Profile Shares",
      "profile_views": "Profile Views",
      "registrations": "Registrations from Link",
      "login_to_dashboard": "Please login to view your dashboard.",
      "level": "Level",
      "xp": "XP",

      // Learn
      "learn_title": "Understanding Carbon Footprint",
      "learn_subtitle": "Everything you need to know about your impact on the planet.",
      "history_title": "History & Details",
      "history_text": "The concept of a carbon footprint was popularized by BP in 2005, but its scientific basis dates to ecological footprint studies in the 1990s. It measures total greenhouse gas emissions caused directly or indirectly by a person, product, or organization.",
      "causes_title": "Causes & Effects",
      "causes_text": "Main causes include burning fossil fuels for electricity, heat, and transportation. Deforestation and industrial processes also contribute. Effects include global warming, extreme weather, rising sea levels, and biodiversity loss.",
      "reduce_title": "Ways to Reduce It",
      "transport_card": "Transportation",
      "transport_tip": "Use public transport, carpool, bike, or walk. Consider an electric vehicle.",
      "energy_card": "Energy",
      "energy_tip": "Switch to renewable energy, use efficient appliances, turn off unused lights.",
      "diet_card": "Diet",
      "diet_tip": "Eat less meat and dairy. Support local and organic foods to reduce transport emissions.",
      "waste_card": "Waste",
      "waste_tip": "Reduce, reuse, and recycle. Compost organic waste instead of landfill.",
      "solutions_section_title": "Green Solutions",
      "solution_1_title": "Use Public/Active Transport",
      "solution_1_save": "Save up to 1,200 kg CO₂/yr",
      "solution_1_tip1": "Switch to metro, bus, or carpool for daily commute",
      "solution_1_tip2": "Cycle or walk for trips under 5 km",
      "solution_2_title": "Switch to Renewable Energy",
      "solution_2_save": "Save up to 800 kg CO₂/yr",
      "solution_2_tip1": "Install rooftop solar panels",
      "solution_2_tip2": "Replace all bulbs with LED lighting",
      "solution_3_title": "Eat More Plant-Based Meals",
      "solution_3_save": "Save up to 500 kg CO₂/yr",
      "solution_3_tip1": "Try one meat-free day per week",
      "solution_3_tip2": "Choose local, seasonal produce",
      "solution_4_title": "Buy Less, Choose Better",
      "solution_4_save": "Save up to 300 kg CO₂/yr",
      "solution_4_tip1": "Buy second-hand or refurbished items",
      "solution_4_tip2": "Repair before replacing electronics",
      "solution_5_title": "Segregate & Recycle Waste",
      "solution_5_save": "Save up to 200 kg CO₂/yr",
      "solution_5_tip1": "Separate dry and wet waste daily",
      "solution_5_tip2": "Start a compost bin for kitchen waste",
      "solution_6_title": "Fly Less / Offset Flights",
      "solution_6_save": "Save up to 1,500 kg CO₂/yr",
      "solution_6_tip1": "Take trains for trips under 500 km",
      "solution_6_tip2": "Purchase carbon offsets for necessary flights",
      "difficulty_easy": "🟢 Easy",
      "difficulty_medium": "🟡 Medium",
      "difficulty_lifestyle": "🔴 Lifestyle Change",

      // Leaderboard
      "leaderboard_title": "Global Leaderboard",
      "leaderboard_subtitle": "Compete by reducing your footprint & earning XP",
      "no_leaderboard": "No leaderboard data available yet.",
      "total_xp": "Total XP",

      // Profile
      "profile_title": "My Profile",
      "save_settings": "Save Settings",
      "notifications": "Enable Notifications",
      "goal_label": "Monthly Reduction Goal (%)",

      // Help
      "help_title": "Help & FAQ",
      "help_q1": "How is my footprint calculated?",
      "help_a1": "We use standard emission factors: Travel × 0.12, Electricity × 0.85, Shopping × 5.0, Waste × 0.5.",
      "help_q2": "What is XP?",
      "help_a2": "XP (Experience Points) are earned by calculating your footprint. Low footprints earn bonus XP.",
      "help_q3": "How do I change the language?",
      "help_a3": "Click the EN / HI button in the top navbar to toggle between English and Hindi.",

      // Tips (dynamic from backend — fallback labels)
      "tip_travel": "Your travel footprint is high. Consider carpooling or public transport.",
      "tip_electricity": "Reduce electricity usage by switching to LED bulbs and solar.",
      "tip_shopping": "Fast fashion contributes heavily to emissions. Try second-hand shopping.",
      "tip_waste": "Start a compost bin to reduce your landfill contribution.",
      "tip_great": "Great job! Your footprint is low. Keep it up!"
    }
  },

  hi: {
    translation: {
      // App & Navbar
      "app_title": "फुटप्रिंट फाइटर",
      "nav_dashboard": "डैशबोर्ड",
      "nav_calculator": "कैलकुलेटर",
      "nav_learn": "जानें",
      "nav_leaderboard": "लीडरबोर्ड",
      "nav_profile": "प्रोफ़ाइल",
      "nav_help": "सहायता",
      "login": "लॉगिन / रजिस्टर",
      "logout": "लॉगआउट",

      // Auth Modal
      "modal_title": "फुटप्रिंट फाइटर से जुड़ें",
      "name": "पूरा नाम",
      "age": "आयु",
      "goal": "कमी का लक्ष्य (%)",
      "email": "ईमेल पता",
      "password": "पासवर्ड",
      "google_signin": "Google से साइन इन करें",
      "register": "रजिस्टर करें",
      "already_account": "पहले से खाता है? लॉगिन करें",
      "no_account": "खाता नहीं है? रजिस्टर करें",

      // Calculator
      "calculator_title": "अपना प्रभाव ट्रैक करें",
      "step_of": "चरण {{current}} / {{total}}",
      "travel_label": "साप्ताहिक गाड़ी/बाइक दूरी",
      "travel_unit": "किमी / सप्ताह",
      "travel_helper": "सभी व्यक्तिगत वाहन यात्राएं शामिल करें",
      "shopping_label": "इस महीने खरीदी गई वस्तुएं",
      "shopping_unit": "वस्तुएं / महीना",
      "shopping_helper": "कपड़े, इलेक्ट्रॉनिक्स, घरेलू सामान",
      "electricity_label": "मासिक बिजली उपयोग",
      "electricity_unit": "kWh / महीना",
      "electricity_helper": "यह संख्या अपने बिजली बिल से देखें",
      "electricity_tooltip": "भारत का बिजली ग्रिड प्रति kWh ~0.82 किग्रा CO₂ उत्सर्जित करता है",
      "waste_label": "साप्ताहिक कचरा उत्पादन",
      "waste_unit": "किग्रा / सप्ताह",
      "waste_helper": "रीसाइक्लिंग से पहले का घरेलू कचरा शामिल करें",
      "back": "← वापस",
      "next": "आगे →",
      "submit": "गणना करें 🌱",
      "calculating": "गणना हो रही है...",
      "result_title": "आपका कुल फुटप्रिंट",
      "result_unit": "किग्रा CO₂",
      "xp_gained": "+{{xp}} XP",
      "solutions_title": "व्यक्तिगत समाधान 🌱",
      "login_to_calculate": "कृपया पहले लॉगिन करें, फिर अपना फुटप्रिंट जानें!",

      // Dashboard
      "welcome": "स्वागत है, {{name}}",
      "share_profile": "प्रोफ़ाइल शेयर करें",
      "total_calculations": "कुल गणनाएं",
      "current_level": "वर्तमान स्तर",
      "latest_footprint": "नवीनतम फुटप्रिंट",
      "eco_warrior": "इको-योद्धा",
      "missions_title": "मिशन और बैज",
      "badge_earned": "बैज मिला",
      "mission_1": "पहली बार फुटप्रिंट की गणना करें",
      "mission_2": "किसी गणना में फुटप्रिंट 50 किग्रा से कम रखें",
      "mission_3": "स्तर 2 तक पहुंचें",
      "chart_title": "आपका फुटप्रिंट बनाम भारत का औसत",
      "your_footprint": "आपका फुटप्रिंट",
      "avg_human": "भारत का औसत",
      "share_insights": "शेयर इनसाइट्स (दैनिक)",
      "profile_shares": "प्रोफ़ाइल शेयर",
      "profile_views": "प्रोफ़ाइल व्यू",
      "registrations": "लिंक से रजिस्ट्रेशन",
      "login_to_dashboard": "डैशबोर्ड देखने के लिए कृपया लॉगिन करें।",
      "level": "स्तर",
      "xp": "XP",

      // Learn
      "learn_title": "कार्बन फुटप्रिंट को समझें",
      "learn_subtitle": "पृथ्वी पर आपके प्रभाव के बारे में सब कुछ जानें।",
      "history_title": "इतिहास और विवरण",
      "history_text": "'कार्बन फुटप्रिंट' की अवधारणा को BP ने 2005 में लोकप्रिय बनाया, लेकिन इसकी वैज्ञानिक नींव 1990 के दशक के 'इकोलॉजिकल फुटप्रिंट' अध्ययनों से है। यह किसी व्यक्ति, उत्पाद या संगठन द्वारा प्रत्यक्ष या अप्रत्यक्ष रूप से उत्पन्न कुल ग्रीनहाउस गैस उत्सर्जन को मापता है।",
      "causes_title": "कारण और प्रभाव",
      "causes_text": "मुख्य कारणों में बिजली, गर्मी और परिवहन के लिए जीवाश्म ईंधन जलाना शामिल है। वनों की कटाई और औद्योगिक प्रक्रियाएं भी योगदान देती हैं। प्रभावों में ग्लोबल वार्मिंग, अत्यधिक मौसम, समुद्र का बढ़ता स्तर और जैव विविधता की हानि शामिल हैं।",
      "reduce_title": "इसे कम करने के तरीके",
      "transport_card": "परिवहन",
      "transport_tip": "सार्वजनिक परिवहन, कारपूल, साइकिल या पैदल चलें। इलेक्ट्रिक वाहन पर विचार करें।",
      "energy_card": "ऊर्जा",
      "energy_tip": "नवीकरणीय ऊर्जा अपनाएं, ऊर्जा-कुशल उपकरण इस्तेमाल करें, अनावश्यक बत्ती बंद रखें।",
      "diet_card": "आहार",
      "diet_tip": "मांस और डेयरी कम खाएं। स्थानीय और जैविक खाद्य पदार्थों का समर्थन करें।",
      "waste_card": "कचरा",
      "waste_tip": "कम करें, पुनः उपयोग करें और रीसाइकिल करें। जैविक कचरे की खाद बनाएं।",
      "solutions_section_title": "हरित समाधान",
      "solution_1_title": "सार्वजनिक/सक्रिय परिवहन अपनाएं",
      "solution_1_save": "प्रति वर्ष 1,200 किग्रा CO₂ तक बचाएं",
      "solution_1_tip1": "दैनिक आवागमन के लिए मेट्रो, बस या कारपूल लें",
      "solution_1_tip2": "5 किमी से कम यात्रा के लिए साइकिल या पैदल चलें",
      "solution_2_title": "नवीकरणीय ऊर्जा अपनाएं",
      "solution_2_save": "प्रति वर्ष 800 किग्रा CO₂ तक बचाएं",
      "solution_2_tip1": "छत पर सोलर पैनल लगवाएं",
      "solution_2_tip2": "सभी बल्ब LED से बदलें",
      "solution_3_title": "अधिक पौधे-आधारित भोजन खाएं",
      "solution_3_save": "प्रति वर्ष 500 किग्रा CO₂ तक बचाएं",
      "solution_3_tip1": "सप्ताह में एक दिन बिना मांस के रहें",
      "solution_3_tip2": "स्थानीय और मौसमी सब्जियां चुनें",
      "solution_4_title": "कम खरीदें, बेहतर चुनें",
      "solution_4_save": "प्रति वर्ष 300 किग्रा CO₂ तक बचाएं",
      "solution_4_tip1": "पुराना या नवीनीकृत सामान खरीदें",
      "solution_4_tip2": "इलेक्ट्रॉनिक्स बदलने से पहले मरम्मत करें",
      "solution_5_title": "कचरा अलग करें और रीसाइकिल करें",
      "solution_5_save": "प्रति वर्ष 200 किग्रा CO₂ तक बचाएं",
      "solution_5_tip1": "रोज सूखा और गीला कचरा अलग करें",
      "solution_5_tip2": "रसोई के कचरे से खाद बनाएं",
      "solution_6_title": "कम उड़ें / फ्लाइट ऑफसेट करें",
      "solution_6_save": "प्रति वर्ष 1,500 किग्रा CO₂ तक बचाएं",
      "solution_6_tip1": "500 किमी से कम यात्रा के लिए ट्रेन लें",
      "solution_6_tip2": "जरूरी उड़ानों के लिए कार्बन ऑफसेट खरीदें",
      "difficulty_easy": "🟢 आसान",
      "difficulty_medium": "🟡 मध्यम",
      "difficulty_lifestyle": "🔴 जीवनशैली परिवर्तन",

      // Leaderboard
      "leaderboard_title": "वैश्विक लीडरबोर्ड",
      "leaderboard_subtitle": "अपना फुटप्रिंट घटाकर और XP कमाकर प्रतिस्पर्धा करें",
      "no_leaderboard": "अभी कोई लीडरबोर्ड डेटा उपलब्ध नहीं है।",
      "total_xp": "कुल XP",

      // Profile
      "profile_title": "मेरी प्रोफ़ाइल",
      "save_settings": "सेटिंग्स सेव करें",
      "notifications": "सूचनाएं सक्षम करें",
      "goal_label": "मासिक कमी लक्ष्य (%)",

      // Help
      "help_title": "सहायता और FAQ",
      "help_q1": "मेरा फुटप्रिंट कैसे गिना जाता है?",
      "help_a1": "हम मानक उत्सर्जन कारकों का उपयोग करते हैं: यात्रा × 0.12, बिजली × 0.85, खरीदारी × 5.0, कचरा × 0.5।",
      "help_q2": "XP क्या है?",
      "help_a2": "XP (अनुभव अंक) फुटप्रिंट की गणना करने पर मिलते हैं। कम फुटप्रिंट पर बोनस XP मिलता है।",
      "help_q3": "भाषा कैसे बदलें?",
      "help_a3": "हिंदी और अंग्रेज़ी के बीच स्विच करने के लिए नेवबार में EN / HI बटन दबाएं।",

      // Tips
      "tip_travel": "आपका यात्रा फुटप्रिंट अधिक है। कारपूल या सार्वजनिक परिवहन का उपयोग करें।",
      "tip_electricity": "LED बल्ब और सोलर अपनाकर बिजली का उपयोग कम करें।",
      "tip_shopping": "फास्ट फैशन से बहुत उत्सर्जन होता है। पुरानी खरीदारी आज़माएं।",
      "tip_waste": "लैंडफिल को कम करने के लिए खाद बनाना शुरू करें।",
      "tip_great": "बहुत अच्छा! आपका फुटप्रिंट कम है। ऐसे ही बनाए रखें!"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
