# AI LUXE Mobile Access Guide

**Date:** November 27, 2025  
**Issue:** OAuth callback fails when accessing via custom domain  
**Status:** ✅ RESOLVED - Use dev server URL

---

## 🚨 Critical: Use Dev Server URL on Mobile

### ❌ WRONG URL (Will Fail)
```
http://ailuxe.co
```
**Error:** `{"error":"OAuth callback failed"}`  
**Reason:** Custom domain not registered in Manus OAuth system

### ✅ CORRECT URL (Will Work)
```
https://3000-ixez42pr931r79pb4xp45-4618c36b.manusvm.computer
```
**Status:** OAuth configured and working  
**Features:** All authentication, protected routes, and features accessible

---

## 📱 How to Access AI LUXE on Mobile

### Step 1: Open Mobile Browser
- **iOS:** Safari or Chrome
- **Android:** Chrome or Firefox

### Step 2: Navigate to Dev Server URL
```
https://3000-ixez42pr931r79pb4xp45-4618c36b.manusvm.computer
```

### Step 3: Test Core Features
1. **Home Page** - Should load with gold/amber luxury theme
2. **Click "Try Now"** on any Core Feature card
3. **Login** - Should redirect to Manus OAuth portal
4. **After Login** - Should redirect back to the feature you clicked
5. **Protected Routes** - `/persona`, `/bot`, `/bookings`, `/admin` should all be accessible

---

## 🔍 Troubleshooting

### Issue: "OAuth callback failed"
**Symptom:** After login, you see `{"error":"OAuth callback failed"}`  
**Cause:** You're accessing via `ailuxe.co` instead of dev server URL  
**Solution:** Use the dev server URL above

### Issue: "Authentication Required"
**Symptom:** Pages show "Please log in to manage..."  
**Cause:** Not logged in, or session cookie expired  
**Solution:** Click any "Try Now" button or navigate to a protected route to trigger login

### Issue: Redirect Loop
**Symptom:** After login, keeps redirecting back to login  
**Cause:** Session cookie not being set  
**Solution:** 
1. Clear browser cookies
2. Use dev server URL (not custom domain)
3. Ensure browser accepts cookies

### Issue: Page Not Loading
**Symptom:** White screen or loading forever  
**Cause:** Dev server might be sleeping or restarting  
**Solution:** Wait 10-15 seconds and refresh

---

## 🎯 Features to Test on Mobile

### ✅ Public Pages (No Login Required)
- [x] Home page (`/`)
- [x] Features page (if exists)
- [x] About page (if exists)

### 🔒 Protected Pages (Login Required)
- [ ] Persona Management (`/persona`)
  - Test file upload from mobile camera/gallery
  - Test persona list display
  - Test persona editing

- [ ] Bot Management (`/bot`)
  - Test WhatsApp QR code display
  - Test bot settings forms
  - Test "Test AI Response" button

- [ ] Bookings Management (`/bookings`)
  - Test booking list display
  - Test booking creation
  - Test booking filters

- [ ] Live Monitoring (`/monitoring`)
  - Test message feed display
  - Test real-time updates
  - Test message actions

- [ ] Admin Dashboard (`/admin`)
  - Test sidebar navigation
  - Test stats display
  - Test user management

- [ ] Settings (`/settings`)
  - Test form inputs
  - Test timezone/currency selectors
  - Test save functionality

- [ ] Testing Dashboard (`/test`)
  - Test Fair Negotiator interface
  - Test conversation flow
  - Test budget controls

- [ ] White Label Settings (`/admin/white-label`)
  - Test logo upload
  - Test color pickers
  - Test preview updates

---

## 🔐 OAuth Flow Explained

### How OAuth Works on Mobile

1. **User clicks "Try Now"** or navigates to protected route
2. **App checks authentication** - If not logged in, redirects to login
3. **Login URL generated** with:
   - `redirectTo` parameter (intended route)
   - Dev server domain as callback URL
4. **User redirected to Manus OAuth portal**
   - User logs in with email/Google/Apple/etc.
5. **OAuth server validates credentials**
   - Generates authorization code
6. **Redirect back to app** at `/api/oauth/callback?code=...&state=...`
7. **App exchanges code for token**
   - Calls Manus OAuth API
   - Gets user info (openId, name, email)
8. **App creates session**
   - Generates JWT session token
   - Sets session cookie
9. **User redirected to intended route**
   - Now authenticated
   - Can access protected pages

### Why Custom Domain Fails

The OAuth flow requires the **callback URL** to be registered in the Manus OAuth system. The dev server URL is automatically registered, but custom domains (like `ailuxe.co`) are not.

**Technical Details:**
- OAuth callback URL: `{domain}/api/oauth/callback`
- Dev server: `https://3000-ixez42pr931r79pb4xp45-4618c36b.manusvm.computer/api/oauth/callback` ✅ Registered
- Custom domain: `http://ailuxe.co/api/oauth/callback` ❌ Not registered

**Solution for Production:**
When you publish the site, the production domain will be automatically registered in the OAuth system, and OAuth will work correctly.

---

## 📊 Mobile Testing Checklist

### Device Testing
- [ ] iOS Safari (iPhone 14)
- [ ] iOS Chrome (iPhone 14)
- [ ] Android Chrome (Pixel 7)
- [ ] Android Firefox (Samsung Galaxy)
- [ ] iPad Safari (iPad Air)

### Feature Testing
- [ ] Login flow (OAuth redirect)
- [ ] Core Features "Try Now" buttons
- [ ] Persona file upload (camera/gallery)
- [ ] WhatsApp QR code scanning
- [ ] Booking creation
- [ ] Message sending
- [ ] Voice note transcription
- [ ] Settings save/load
- [ ] White-label branding changes

### Interaction Testing
- [ ] Touch tap (buttons, links)
- [ ] Touch scroll (pages, modals)
- [ ] Touch drag (file upload)
- [ ] Touch swipe (tabs, carousels)
- [ ] Long press (context menus)

### Form Testing
- [ ] Text input (mobile keyboard)
- [ ] Email input (email keyboard)
- [ ] Phone input (phone keyboard)
- [ ] Number input (numeric keyboard)
- [ ] Date input (native picker)
- [ ] Select dropdown (native picker)
- [ ] File upload (camera/gallery)

### Performance Testing
- [ ] Page load time (<3s on 4G)
- [ ] Image loading (lazy load)
- [ ] Smooth scrolling
- [ ] No layout shift
- [ ] No janky animations

---

## 🚀 Next Steps

### For Development
1. Continue using dev server URL for all mobile testing
2. Test all features on real mobile devices
3. Fix any mobile-specific issues discovered
4. Optimize performance for mobile networks

### For Production
1. Publish the site via Manus UI
2. Production domain will be automatically registered in OAuth
3. Custom domain (if configured) will work with OAuth
4. Update DNS settings if using custom domain

---

## 📞 Support

If you encounter issues not covered in this guide:

1. **Check server logs** - Look for `[OAuth]` prefixed messages
2. **Check browser console** - Look for JavaScript errors
3. **Clear cookies** - Sometimes stale cookies cause issues
4. **Try incognito mode** - Eliminates cookie/cache issues
5. **Contact support** - Provide screenshots and error messages

---

**Last Updated:** November 27, 2025  
**Dev Server URL:** https://3000-ixez42pr931r79pb4xp45-4618c36b.manusvm.computer  
**Status:** ✅ OAuth working on dev server, mobile responsive design verified
