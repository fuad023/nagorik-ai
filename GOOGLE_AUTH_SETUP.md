# Google OAuth Integration Setup Guide

## Overview

This guide explains how to set up and use Google OAuth 2.0 authentication in the Nagorik-AI application. The implementation uses:
- **Frontend**: `@react-oauth/google` library for sign-in button
- **Backend**: Google API Client PHP library to validate tokens
- **Flow**: OAuth 2.0 Authorization Code Flow with Sanctum tokens

## Step 1: Get Google Credentials

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a Project" and create a new project named "Nagorik-AI"
3. Wait for the project to be created

### 1.2 Enable Google+ API
1. Navigate to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" as user type
   - Fill in required fields (app name, user support email, developer contact)
   - In "Scopes", add: `email` and `profile`

4. After consent screen setup, create credentials:
   - Application type: "Web application"
   - Name: "Nagorik-AI Web"
   - **Authorized JavaScript origins:**
     - `http://localhost:5173` (dev frontend)
     - `http://localhost:8000` (dev backend)
     - `https://yourdomain.com` (production)
   
   - **Authorized redirect URIs:**
     - `http://localhost:8000/api/auth/google/callback` (dev)
     - `https://yourdomain.com/api/auth/google/callback` (production)

5. Copy the **Client ID** and **Client Secret**

---

## Step 2: Configure Environment Variables

### Frontend (`.env` or `.env.local`)
```env
VITE_BACKEND_ENDPOINT=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Backend (`.env`)
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

---

## Step 3: Install Dependencies

### Frontend
After adding `VITE_GOOGLE_CLIENT_ID` to `.env`, run:
```bash
cd client
npm install
npm run dev
```

### Backend
After adding Google credentials to `.env`, run:
```bash
cd server
composer update
php artisan migrate  # if needed to add google_id column
```

---

## Step 4: Database Changes (Already Implemented)

The following changes have been made automatically:

1. **Users Table**: Added `google_id` column
   ```sql
   ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL UNIQUE;
   ```

2. **User Model**: Updated to include `google_id` in fillable fields

---

## Step 5: API Endpoints

### Get Google Authorization URL (Frontend)
```
GET /api/auth/google/url
Response: { "auth_url": "https://accounts.google.com/..." }
```

### Google OAuth Callback (Frontend → Backend)
```
POST /api/auth/google/callback
Body: { "code": "authorization_code_from_google" }
Response: { 
  "user": { id, name, email, ... },
  "token": "sanctum_token",
  "message": "Successfully authenticated with Google"
}
```

---

## Step 6: Frontend Implementation Details

### Login Component Changes
- Added `GoogleLogin` component from `@react-oauth/google`
- Displays when `VITE_GOOGLE_CLIENT_ID` is configured
- Sends credential to backend for verification
- Automatically redirects to dashboard on success

### App.tsx Changes
- Wrapped entire app with `GoogleOAuthProvider`
- Passes `clientId` from environment variables

### API Client Updates
- Added `googleAuth()` method to handle authentication
- Stores token in localStorage on successful login
- Handles errors with toast notifications

---

## Step 7: Backend Implementation Details

### New Files Created
1. **GoogleAuthController** (`app/Http/Controllers/Auth/GoogleAuthController.php`)
   - `callback()`: Exchanges auth code for user data
   - `getAuthUrl()`: Returns Google OAuth URL

2. **Config** (`config/google.php`)
   - Loads Google credentials from environment

### Updated Files
1. **Auth Routes** (`routes/auth.php`)
   - Added Google OAuth endpoints

2. **User Model** (`app/Models/User.php`)
   - Added `google_id` to fillable

---

## Step 8: How It Works

### User Flow:
1. User clicks "Sign in with Google" button
2. Google Sign-In dialog appears
3. User authenticates with Google
4. Frontend receives credential/ID token
5. Frontend sends to backend `/api/auth/google/callback`
6. Backend verifies token with Google API
7. Backend finds or creates user with `google_id`
8. Backend returns Sanctum token
9. Frontend stores token and redirects to dashboard

### Account Linking:
- If Google email exists in your app, Google ID is linked to that account
- If Google email is new, new user is created
- Users can later link Google to existing accounts

---

## Step 9: Troubleshooting

### "Google Sign-In not showing"
- Verify `VITE_GOOGLE_CLIENT_ID` is set in frontend `.env`
- Check browser console for errors
- Ensure GoogleOAuthProvider wraps the app

### "CORS Error"
- Add your backend URL to "Authorized JavaScript origins" in Google Console
- Ensure backend is running on correct port

### "Invalid Client ID"
- Verify Client ID matches exactly in `.env`
- Check for extra spaces or quotes

### "Redirect URI mismatch"
- Ensure callback URL in `.env` matches exactly what's in Google Console
- Protocol, domain, and path must be identical

### "Token validation fails"
- Verify `GOOGLE_CLIENT_SECRET` is correct
- Check Client ID and Secret match your Google Console credentials
- Ensure backend can reach Google API (firewall/proxy issues)

---

## Step 10: Testing

### Local Testing
1. Navigate to login page
2. "Sign in with Google" button should appear
3. Click and authenticate with a Google account
4. Should be redirected to dashboard
5. Token should be stored in localStorage

### Checking localStorage
```javascript
// In browser console:
localStorage.getItem('auth_token')    // Should show token
localStorage.getItem('user')          // Should show user data
```

---

## Security Notes

✅ **Implemented:**
- Server-side token validation
- HTTPS recommended for production
- Sanctum token for API authentication
- Google credentials stored securely in `.env`

⚠️ **Best Practices:**
- Never commit `.env` files with real credentials
- Use strong, unique `GOOGLE_CLIENT_SECRET`
- Rotate credentials periodically
- Validate all requests on backend
- Use HTTPS in production

---

## Environment-Specific Setup

### Development
```env
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### Staging
```env
GOOGLE_REDIRECT_URI=https://staging.yourdomain.com/api/auth/google/callback
```

### Production
```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

---

## Next Steps

After setup:
1. ✅ Test Google login on login page
2. ✅ Verify token works for protected endpoints
3. ✅ Test account linking with existing emails
4. ✅ Set up analytics for login tracking
5. Consider adding social profile features

---

## Support

For issues or questions:
1. Check browser console for JavaScript errors
2. Check backend logs for API errors
3. Verify all environment variables are set
4. Test endpoints manually with curl/Postman
5. Review Google Cloud Console security settings

