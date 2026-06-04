# Deployment Guide: Feastly on Render.com

## Prerequisites
- GitHub account with both `frontend` and `backend` folders pushed
- MongoDB Atlas account (for MONGO_URI)
- Render.com account (free tier available)

---

## **BACKEND DEPLOYMENT**

### Step 1: Create a Web Service on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** and select **"Web Service"**
3. Connect your GitHub repository (select the repo where your backend code is)
4. Fill in the following details:
   - **Name:** `feastly-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

### Step 2: Add Environment Variables

In the Render dashboard for your backend service, go to **Environment** and add all variables from your `.env` file:

```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
EMAIL_DEV_MODE=false
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
EMAIL_FROM="Your Name <your_email@domain.com>"
NODE_DNS_SERVER_1=8.8.8.8
NODE_DNS_SERVER_2=1.1.1.1
```

> ⚠️ **Get these values from your local `.env` file** - never commit secrets to GitHub!

### Step 3: Set Root Directory (Important!)

1. In Render dashboard, go to **Settings**
2. Scroll to **Build Settings**
3. Set **Root Directory:** `backend`
4. Save

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete. You'll get a URL like:
```
https://feastly-backend.onrender.com
```
**Save this URL** - you'll need it for the frontend!

---

## **FRONTEND DEPLOYMENT**

### Step 1: Update Backend URL in Frontend

Before deploying frontend, update the API URL in your frontend files:

**In `frontend/.env.production`:**
```
VITE_API_URL=https://feastly-backend.onrender.com
```
(Replace with your actual backend URL from the previous step)

### Step 2: Create a Web Service for Frontend

1. Click **"New +"** → **"Web Service"**
2. Connect the same GitHub repository
3. Fill in:
   - **Name:** `feastly-frontend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`
   - **Plan:** Free

### Step 3: Set Root Directory

1. Go to **Settings** → **Build Settings**
2. Set **Root Directory:** `frontend`
3. Save

### Step 4: Add Environment Variables

In the frontend service, go to **Environment** and add:
```
VITE_API_URL=https://feastly-backend.onrender.com
```
(Use your actual backend URL)

### Step 5: Deploy

Click **"Deploy"** and wait. Your frontend will be live at a URL like:
```
https://feastly-frontend.onrender.com
```

---

## **POST-DEPLOYMENT SETUP**

### 1. Update CORS on Backend

The backend CORS is already configured to accept `.onrender.com` domains, so no changes needed!

### 2. Update Frontend API Calls

Make sure all API calls in your frontend use the `VITE_API_URL` environment variable. Example:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
axios.post(`${apiUrl}/api/users/register`, data);
```

### 3. Test the Deployment

1. Open your frontend URL
2. Try logging in, placing an order, or any feature that calls the backend
3. Check browser console for any CORS or connection errors

---

## **TROUBLESHOOTING**

| Issue | Solution |
|-------|----------|
| `CORS Error` | Check CORS is updated in backend/server.js and includes `.onrender.com` |
| `Cannot connect to MongoDB` | Verify `MONGO_URI` is set correctly in Render environment variables |
| `Build fails` | Check logs in Render dashboard. Make sure `package.json` and root directory are correct |
| `500 Server Error` | Check backend logs in Render dashboard for specific errors |
| `Frontend shows 404` | Make sure `npm run build` runs successfully and `dist` folder is created |
| `Variables not loading` | Redeploy after adding environment variables (Render needs redeploy to pick them up) |

---

## **AUTOMATIC REDEPLOYMENT**

Both services are set to redeploy automatically when you push to your GitHub repository's main branch. Simply push your code changes and they'll be live!

---

## **IMPORTANT NOTES**

⚠️ **Free Tier Limitations:**
- Services spin down after 15 min of inactivity (will take ~30 sec to wake up on next request)
- Limited resources - good for testing but may slow with heavy traffic
- 750 free hours per month

🔒 **Security:**
- Never commit `.env` files to GitHub
- Use `.gitignore` to exclude them
- Always use environment variables in Render dashboard, not in code

---

## **NEXT STEPS (Optional)**

1. **Use Paid Plans** for 24/7 uptime
2. **Add Custom Domain** in Render settings
3. **Set up Email Notifications** for deployment failures
4. **Enable Auto-scaling** for handle traffic spikes
