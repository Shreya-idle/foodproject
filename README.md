# NourishAI 🌱 — Smart Nutrition Coach

**NourishAI** is an AI-powered nutrition coaching web app that learns your eating habits and helps you build healthier food patterns. It does **not** sell food — it helps you make *better food choices* through data-driven insights.

> **Novelty Feature: Mood-Food Correlation Engine** — NourishAI tracks how you feel after each meal and discovers hidden patterns between your food choices and your energy/mood states. This insight is not available in any mainstream food app.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📷 **Barcode Scanner** | Scan any product to get instant nutritional data (via QuaggaJS + OpenFoodFacts) |
| ⚠️ **Chemical Risk Radar** | Detects harmful additives (Aspartame, MSG, etc.) in ingredients lists |
| 🩸 **Health Shield** | Tailors warnings for Diabetes, Hypertension, and Heart Health conditions |
| 🌤️ **Climate Sync** | Suggests hydration & food choices based on real-time local weather API |
| 🧠 **Mood-Food Correlation** | Tracks mood after meals and builds personalized psychological eating patterns |
| 🔄 **Smart Swap Engine** | Suggests healthier alternatives to junk food before you log it |

## 🏗️ Architecture

```
Feature-Based Architecture + React Context (Observer Pattern)

src/
├── components/          # Shared UI (Layout, ProtectedRoute)
├── features/            # Feature modules
│   ├── auth/            # Login / Signup
│   ├── dashboard/       # Home + Insights (Mood-Food Correlation)
│   ├── discover/        # Food discovery + Smart Swap
│   ├── meallog/         # Meal logging + Mood tracking
│   └── profile/         # Profile + Goal setting
├── context/             # AuthContext, UserDataContext (Observer)
├── hooks/               # useLocalStorage (persistence)
├── utils/               # Recommendation engine (Strategy Pattern)
└── data/                # Food database + constants
```

**Design Patterns Used:**
- **Observer Pattern** — React Context API for cross-feature state sharing
- **Strategy Pattern** — Recommendation engine adapts scoring strategy based on user history
- **Feature-Based Module Architecture** — Each feature is self-contained

## 🛠️ Technology Stack
- **Framework**: React 19 + Vite
- **Backend**: Supabase (Auth + PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Database Logic**: Supabase Client + localStorage fallback
- **Deployment**: Vercel / Docker

## 🏁 Quick Start
```bash
git clone <repo-url>
cd foodapp
npm install
npm run dev
```

## 🌐 Deployment

### Option A: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Option B: Google Cloud Run
```bash
docker build -t nourish-ai .
gcloud builds submit --tag gcr.io/[PROJECT-ID]/nourish-ai
gcloud run deploy nourish-ai --image gcr.io/[PROJECT-ID]/nourish-ai --platform managed --allow-unauthenticated
```

## 📊 How It Learns
1. **Meal Logging** → Builds category preferences and nutritional baselines
2. **Mood Tracking** → Correlates foods with emotional/energy states
3. **Nutritional Gap Analysis** → If your day is low on protein, it boosts protein-rich suggestions
4. **Vitality Nudging** → Gradually recommends foods with higher V-Scores over time
5. **Smart Swap Memory** → Tracks swap acceptance to refine alternatives

> Data is securely synced to Supabase with real-time Auth, allowing multi-device persistence while maintaining strict privacy.

---

*Built with ❤️ for the future of personalized nutrition.*
