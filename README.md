# PostCraft AI — Gen-Z Social Media Content Studio

PostCraft AI is an AI-powered social media content studio built for Instagram posts, reels, and video content. It features a playful scrapbook and sticker-book aesthetic, AI brief analysis, template generation, phone mockups, interactive stickers, and an always-on AI studio assistant.

---

## 🌟 Key Features

- **7-Step Crafting Studio Flow**:
  1. **Onboarding**: Personalized greeting, name & age group tailoring.
  2. **Choose Post Type & Format**: Professional, Travel, Fashion, Food, Fitness, Product, Memes, and more.
  3. **Photo Studio**: Drag & drop polaroid board with preset sample aesthetic photos.
  4. **Notebook Brief**: AI brief prompt analysis powered by Gemini AI with mood chips.
  5. **Template Suggestions**: Horizontally scrollable carousel with palette dots and layout previews.
  6. **Phone Mockup Preview**: Rendered post output with animated slideshow reel player, caption, hashtags, and music mood.
  7. **Finalize & Add-Ons**: Interactive sticker tray, filter strip, headline overlay editor, and instant download/export.

- **Always-On AI Chat Assistant**:
  - Context-aware styling, outfit, lighting, angle, and caption tips.
  - Adapts tone dynamically to age group (<18, 18–30, 30+) and post category (Professional vs. Casual).

---

## ⚙️ Prerequisites & Environment Setup

### 1. Enable Required Google Cloud APIs

Ensure the following GCP APIs are enabled in your project:
- Cloud Run API
- Secret Manager API
- Cloud Build API
- Generative Language API (Gemini API)

```bash
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  generativelanguage.googleapis.com
```

### 2. Secret Manager Setup (`GEMINI_API_KEY`)

Create and populate the `GEMINI_API_KEY` secret in Secret Manager:

```bash
# Create the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"

# Inject your Gemini API key value
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant the default Cloud Run service account access to read the secret
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 🔒 Security Rules Configuration (`firestore.rules`)

If enabling Firestore persistence for user projects, deploy owner-bound security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🚀 Cloud Run Deployment

Deploy the containerized full-stack application to Cloud Run with Secret Manager environment injection:

```bash
gcloud run deploy postcraft-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --update-labels=dev-tutorial=cloud-run-ai-challenge
```

### Campaign Labeling Verification
To bind the service for challenge verification, ensure the `dev-tutorial=cloud-run-ai-challenge` label is set:

```bash
gcloud run services update postcraft-ai \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

---

## 🧪 Local Development

```bash
# Install dependencies
npm install

# Start local full-stack development server
npm run dev
```

Visit `http://localhost:3000` in your browser.
