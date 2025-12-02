# AI LUXE Navigation Guide

**Quick Reference for https://ailuxe.co**

---

## 🏠 Public Pages

### Homepage
**URL:** https://ailuxe.co/  
**Description:** Main landing page with AI LUXE branding, hero section, and platform overview

### ROI Guide & Sales Assets
**URL:** https://ailuxe.co/roi-guide  
**Description:** Download ROI PDF, Loom scripts, LinkedIn pitch, and agency export package

---

## 🔐 User Pages (After Login)

### Personas Management
**URL:** https://ailuxe.co/personas  
**Description:** Clone AI personas from chat history, manage tone and workflow

### Bot Management
**URL:** https://ailuxe.co/bot  
**Description:** Configure WhatsApp bot, fair negotiator, and escalation rules

### Bookings Management
**URL:** https://ailuxe.co/bookings  
**Description:** View bookings, generate contracts, sync with Google Calendar

### Settings
**URL:** https://ailuxe.co/settings  
**Description:** User settings with 4 tabs (Notifications, Security, Appearance, Preferences)

### Account Management
**URL:** https://ailuxe.co/account  
**Description:** Profile, account status, billing, and danger zone

---

## 👑 Admin Pages (Admin Role Required)

### Admin Dashboard
**URL:** https://ailuxe.co/admin  
**Description:** White-label multi-tenant management, MRR tracking, client overview

### API Settings ⭐ NEW
**URL:** https://ailuxe.co/admin/api-settings  
**Description:** Configure API credentials for WhatsApp, Google, and OpenRouter  
**Fields:**
- WhatsApp Phone Number ID
- WhatsApp Access Token
- Google Client ID
- Google Client Secret
- OpenRouter API Key

### Billing Management ⭐ NEW
**URL:** https://ailuxe.co/admin/billing  
**Description:** Full CRUD for plans, coupons, and subscriptions  
**Features:**
- Create/edit/delete billing plans
- Manage discount coupons
- View active subscriptions
- Set pricing tiers

### White-Label Settings ⭐ NEW
**URL:** https://ailuxe.co/admin/white-label  
**Description:** Per-tenant customization settings  
**Tabs:**
- Branding (logo, colors)
- Localization (language, RTL, date/time formats)
- Currency & Tax (currency, tax rate, tax label)
- Voice Settings (model, language)
- Legal & Contracts (terms URL, privacy URL, contract templates)

---

## 🔧 Integration Pages

### Baileys QR Connect (BYO WhatsApp)
**URL:** https://ailuxe.co/baileys-connect  
**Description:** Connect your own WhatsApp number via QR code (no API keys needed)  
**Status:** ✅ Live and working for demos

### Testing Dashboard
**URL:** https://ailuxe.co/test  
**Description:** Test 5 core flows (voice notes, chat clone, bookings, mobile, negotiation)

---

## 📋 Navigation Flow

**For New Users:**
1. Visit https://ailuxe.co
2. Click "Get Started" or "Sign Up"
3. Sign up with email or Google (via Manus Auth)
4. Access Personas, Bots, Bookings

**For Admins:**
1. Log in to https://ailuxe.co
2. Click "Admin" in top navigation
3. Go to Settings tab
4. Click one of three cards:
   - **API Settings** → Configure credentials
   - **Billing Management** → Manage plans/coupons
   - **White-Label Settings** → Customize branding

---

## 🚀 Phase 2 Activation

**To activate live integrations:**

1. Go to https://ailuxe.co/admin/api-settings
2. Paste your credentials:
   - WhatsApp Phone ID: `868272956371771`
   - WhatsApp Token: `EAA1F6r048ZCQBPxnsuzlCUqZBZCYuqhAxQd5iRIZBXcclJFdGWxUZB9nOzucAjKhNHaY6s7nVf6ZAPCiyLy4XrgMW98ZA7jAC0Ez2tQ4aVZC5EeZBJVomfWD2eARBWYi6t7TbEQVXglQc0yS0MHDNUZAvAZCOPICQp6TZBMwM2H9VZBctUDLnZCYrYoeMIPPrB4qnZCrUAlcAvAza9iebjUcdp1HYUVbgALaJ2PuQrfs0M7NTZC4fWXNJ8x0UdNxBNxNoXVg2lF0ccmaxIs7mxMIxa5uIszYYgZDZD`
   - Google Client ID: `1025849112528-pkfi04vikjnkha3at4i7vfpt10prvd5o.apps.googleusercontent.com`
   - Google Client Secret: `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`
   - OpenRouter Key: `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`
3. Click "Save All Settings"
4. Everything goes live immediately

---

## ✅ Phase 1 Complete Features

- ✅ WhatsApp webhook with Meta verification (`/api/whatsapp/webhook`)
- ✅ Baileys QR system (live at `/baileys-connect`)
- ✅ Google OAuth + Calendar integration (`/api/auth/google/callback`)
- ✅ OpenRouter DeepSeek Whisper voice transcription
- ✅ Full billing admin (plans, coupons, subscriptions)
- ✅ White-label settings (branding, localization, currency, voice, legal)
- ✅ 23 vitest tests passing
- ✅ Sales assets published at `/roi-guide`

---

**Last Updated:** November 20, 2025  
**Version:** Phase 1 Complete (1ecd392d)
