# Vercel Deployment Guide

## Quick Deploy Steps

### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4. Add Environment Variable

**Critical Step!**

In Vercel dashboard → Your Project → Settings → Environment Variables:

```
Name:  VITE_GEMINI_API_KEY
Value: [paste your actual API key]
Environment: Production, Preview, Development
```

### 5. Deploy
Click **"Deploy"** - Vercel will build and deploy automatically!

---

## Alternative: CLI Deploy

```bash
# Login
vercel login

# Deploy
vercel

# Add environment variable
vercel env add VITE_GEMINI_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development (all)

# Rebuild to include env var
vercel --prod
```

---

## Post-Deploy Checklist

- [ ] Visit your deployed URL
- [ ] Check browser console for errors
- [ ] Type a test sentence
- [ ] Verify AI generation works
- [ ] Test audio feedback
- [ ] Confirm word validation

---

## Troubleshooting

**Sentences not generating?**
- Verify `VITE_GEMINI_API_KEY` is set correctly
- Check browser console for API errors
- App should fallback to static wordlist

**Build fails?**
- Check build logs in Vercel
- Verify `package.json` scripts are correct
- Ensure all dependencies are listed

**Need to update API key?**
Settings → Environment Variables → Edit → Redeploy

---

## Your Deployment URL
After deployment: `https://your-project.vercel.app`
