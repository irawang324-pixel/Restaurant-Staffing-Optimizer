# AuraOps Intelligence: FOH Staffing Optimizer

**AuraOps Intelligence** is a world-class strategic platform designed for General Managers (GMs) in the hospitality sector. It leverages historical data patterns and real-time AI grounding to solve the most critical challenge in restaurant operations.

---

## ⚡ Quick Start: Fix API Issues on GitHub Pages

If the Strategic Report is offline, follow these 3 steps:

1.  **Get Key**: Obtain a Gemini API Key from [Google AI Studio](https://aistudio.google.com/).
2.  **Add Secret**: 
    *   In GitHub: **Settings** > **Secrets and variables** > **Actions**.
    *   Create **New repository secret**.
    *   Name: `API_KEY`. Value: [Paste your key here].
3.  **Deploy**: Push any code change. The included `.github/workflows/deploy.yml` will automatically build the app and securely inject your key.

---

## ☁️ Google Cloud (GCP) Deployment Guide

For enterprise-grade security using GCP:

### Option A: Firebase Hosting + Cloud Build (Recommended)
1.  **Store the Secret:** Go to **GCP Secret Manager** and create a secret named `GEMINI_API_KEY`.
2.  **Configure Build:** In your `cloudbuild.yaml`, inject the secret using `gcloud secrets versions access`.

---

## 🚀 Core Features
1. **Predictive Staffing Engine:** Historical pattern analysis.
2. **AI Strategic Tactical Report:** Real-time web grounding via Gemini 3.0 Flash.

---
*Designed for elite hospitality management.* **AuraOps OS v3.1.2**