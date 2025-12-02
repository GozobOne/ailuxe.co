# AI LUXE Platform - Complete Navigation Guide

**Platform URL:** https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer  
**Production URL (after publish):** https://ailuxe.co

---

## 🏠 PUBLIC PAGES (No Login Required)

### Homepage
- **Route:** `/`
- **Features:**
  - Hero section with "Time is the Real Luxury" tagline
  - Get Started button → Login
  - See 32x ROI Guide button → `/roi-guide`
  - Learn More button → Scroll to features
  - Core Features section with 6 cards
  - Client Success Stories section
  - Footer with branding

### ROI Guide
- **Route:** `/roi-guide`
- **Features:**
  - ROI Calculator (32x return)
  - Loom Video Script download
  - LinkedIn Pitch download
  - Agency Export Package download
  - All downloadable assets

### Features Page
- **Route:** `/features`
- **Features:**
  - 8 feature categories
  - 30+ detailed features
  - Comprehensive platform overview

---

## 🔐 AUTHENTICATED PAGES (Login Required)

### 1. PERSONA MANAGEMENT
- **Route:** `/persona`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/persona`
- **Features:**
  - Upload chat history (TXT/JSON/PDF, 16MB max)
  - Drag-drop file upload
  - AI persona cloning with DeepSeek
  - Persona list with status badges
  - Tone configuration display (tone, language, style)
  - Model ID tracking
- **Navigation:** Header → Personas button (icon: User)

### 2. BOT MANAGEMENT
- **Route:** `/bot`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/bot`
- **Features:**
  - **Platform Tabs:** WhatsApp, Telegram, Signal
  - **WhatsApp QR Connection:** Baileys reverse QR linking
  - **Connection Status:** Messages handled, E2EE, 2FA status
  - **Send Message Tab:**
    - Contact picker dropdown (real database contacts)
    - Phone number input (manual or auto-populate)
    - Message composer
    - Send button
  - **Test AI Response:** Test persona-based replies
  - **Disconnect Button:** Disconnect WhatsApp session
- **Navigation:** Header → Bots button (icon: Bot)

### 3. CONTACT MANAGEMENT
- **Route:** `/contacts`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/contacts`
- **Features:**
  - **Import CSV:** Bulk upload contacts (name, phone, email, title, role, company, tags)
  - **Export CSV:** Download all contacts
  - **Add Contact:** Full form with:
    - Profile image upload (5MB limit)
    - Title/Role dropdown (CEO, CTO, Manager, Director, etc.)
    - Multiple phone numbers (add/remove)
    - Multiple email addresses (add/remove)
    - Website field
    - Company field
    - Tags with autocomplete (frequency-based sorting)
    - Status (Active/Past/Prospect/Lead)
    - Platform badges (WhatsApp/Telegram/Signal)
  - **Edit Contact:** Update all fields
  - **Delete Contact:** Remove with confirmation
  - **Search:** Filter by name, phone, email, tags
  - **Platform Filter:** All, WhatsApp, Telegram, Signal, Multiple
  - **Status Filter:** All, Active, Past, Prospect, Lead
- **Navigation:** Header → Contacts button (icon: Users)

### 4. MESSAGE SEARCH
- **Route:** `/messages/search`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/messages/search`
- **Features:**
  - Full-text search across messages
  - Date range filters (start/end date)
  - Platform filter (WhatsApp/Telegram/Signal)
  - Message type filter (Text/Voice/Image/Document)
  - Direction filter (Inbound/Outbound)
  - Search results with highlighting
  - Message statistics dashboard
  - Export search results to CSV
- **Navigation:** Header → Search button (icon: Search)

### 5. ANALYTICS DASHBOARD
- **Route:** `/analytics`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/analytics`
- **Features:**
  - **KPI Cards:**
    - Average Response Time
    - Conversion Rate
    - Total Messages
    - Total Bookings
  - **Charts:**
    - Response Time Trend (line chart, 7-day)
    - Message Volume by Platform (bar chart)
    - Peak Activity Hours (bar chart)
    - Message Type Distribution (pie chart)
  - **Export CSV:** Comprehensive analytics data
    - Key metrics summary
    - Response time trend
    - Volume by platform
    - Peak hours
    - Message types
  - **Date Range Filter:** 7/30/90 days
  - **Empty State Placeholders:** Professional messaging when no data
- **Navigation:** Header → Analytics button (icon: TrendingUp) OR Home page → Analytics button

### 6. BOOKINGS MANAGEMENT
- **Route:** `/bookings`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/bookings`
- **Features:**
  - **Tabs:** Bookings, Contracts
  - **Bookings Tab:**
    - Stats overview (total, confirmed, contracts signed, revenue)
    - Booking cards with client details
    - Event date/time display
    - Budget tracking (KWD default)
    - Contract status badges
    - Auto-reminder badges (48h/24h/1h)
    - Actions: Send reminder, Generate contract, View in calendar
  - **Contracts Tab:**
    - Contract cards with type (Service/NDA/Non-Compete)
    - Language badges (Arabic/English)
    - Status tracking (Draft/Sent/Signed/Expired)
    - Creation/signing dates
    - Actions: Download PDF, Resend for signature
  - **Contract Templates:**
    - Service Agreement
    - NDA (Non-Disclosure Agreement)
    - Non-Compete Agreement
- **Navigation:** Header → Bookings button (icon: Calendar)

### 7. LIVE MONITORING
- **Route:** `/live`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/live`
- **Features:**
  - **Real-time Message Feed:**
    - Auto-refresh every 5 seconds
    - Platform badges (WhatsApp/Telegram/Signal)
    - Direction badges (Inbound/Outbound)
    - Message content display
    - Timestamp
    - Manual refresh button
  - **Booking Flow Tracking:**
    - Auto-refresh every 10 seconds
    - Recent bookings list
    - Status visualization
    - Manual refresh button
- **Navigation:** Admin Dashboard → Quick Access → Live Monitor

### 8. TESTING DASHBOARD
- **Route:** `/test`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/test`
- **Features:**
  - **5 Test Flows:**
    1. Arabic Voice Note (transcription + AI response)
    2. English Chat Clone (persona extraction + test reply)
    3. Model Booking (calendar check + contract + reminders)
    4. Mobile Responsive (iPhone/Pixel validation)
    5. Negotiation (Fair Negotiator AI logic)
  - **Test Summary:** Passed/Failed/Pending counts
  - **Status Icons:** Idle/Running/Success/Failed
  - **Test Results:** Detailed output for each test
- **Navigation:** Header → Test button (icon: FlaskConical)

---

## 👑 ADMIN PAGES (Admin Role Required)

### 9. ADMIN DASHBOARD
- **Route:** `/admin`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/admin`
- **Features:**
  - **Tabs:** Overview, Clients, Settings
  - **Overview Tab:**
    - Total MRR ($11,400)
    - Active Clients (5)
    - Trial Clients (1)
    - Average Revenue ($1,900)
    - Revenue forecast graph
    - Churn rate (2.1%)
  - **Clients Tab:**
    - Client cards with subdomain, revenue, status
    - Actions: Upload Logo, Customize Branding, Visit Site
    - Simulated clients: Elite Events Kuwait, Gala Events, etc.
  - **Settings Tab:**
    - Cards linking to:
      - API Settings
      - Billing Management
      - White-Label Settings
  - **Quick Access Section:**
    - Instagram Setup (purple icon)
    - Service Status (green icon)
    - Setup Guide (amber icon)
    - Analytics (blue icon)
    - Live Monitor (orange icon)
- **Navigation:** Header → Admin button (icon: Settings)

### 10. API SETTINGS
- **Route:** `/admin/api-settings`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/admin/api-settings`
- **Features:**
  - **6 Tabs:** WhatsApp, Google, AI/Voice, Payments, **Notifications**, Baileys
  
  - **WhatsApp Tab:**
    - Phone Number ID input (with eye icon)
    - Access Token input (with eye icon)
    - Helper text examples
    - Save button
  
  - **Google Tab:**
    - Client ID input
    - Client Secret input
    - Google Calendar OAuth status
    - Connection status component
    - Authorize button
  
  - **AI/Voice Tab:**
    - OpenRouter API Key input (with eye icon)
    - Helper text examples
    - Save button
  
  - **Payments Tab:**
    - Stripe Secret Key input (with eye icon)
    - Stripe Publishable Key input (with eye icon)
    - Helper text examples
    - Save button
  
  - **Notifications Tab:** ⭐ NEW
    - **Twilio SMS Section:**
      - Account SID input (with eye icon)
      - Auth Token input (with eye icon)
      - Twilio Phone Number input
      - Helper text: "Example: AC1234567890abcdef..."
      - Save Twilio Credentials button
    - **SendGrid Email Section:**
      - API Key input (with eye icon)
      - From Email Address input
      - From Name input
      - Helper text: "Example: SG.1234567890..."
      - Save SendGrid Credentials button
  
  - **Baileys Tab:**
    - Session Storage Path input
    - Configuration info
    - Save button
  
  - **Test Integrations Card:** ⭐ OPTIMIZED
    - Test WhatsApp button (size="sm")
    - Test Calendar button (size="sm")
    - Test Voice button (size="sm")
    - Test Payment button (size="sm")
    - 2-column grid layout
    - Compact spacing (gap-3)
    - Loading states with spinners

- **Navigation:** Admin Dashboard → Settings tab → API Settings card

### 11. BILLING MANAGEMENT
- **Route:** `/admin/billing`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/admin/billing`
- **Features:**
  - **Tabs:** Plans, Coupons, Subscriptions
  - **Plans Tab:**
    - Create/Edit subscription plans
    - Trial period configuration
    - Trial price setting
    - Plan list with features
  - **Coupons Tab:**
    - Create/Edit discount coupons
    - Coupon code generation
    - Discount percentage/amount
    - Expiration dates
  - **Subscriptions Tab:**
    - Active subscriptions list
    - Subscription status tracking
    - Trial management
- **Navigation:** Admin Dashboard → Settings tab → Billing Management card

### 12. WHITE-LABEL SETTINGS
- **Route:** `/admin/white-label`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/admin/white-label`
- **Features:**
  - **Tabs:** Branding, Localization, Features
  - **Branding Tab:**
    - Platform logo upload
    - Primary color picker (#D4AF37 gold)
    - Secondary color picker (#1A1A1A charcoal)
    - Brand name input
  - **Localization Tab:**
    - Currency selector (20 currencies: USD, EUR, GBP, KWD, etc.)
    - Language selector (20 languages with RTL support)
    - Timezone selector
  - **Features Tab:**
    - White-label features list
    - Feature toggles
- **Navigation:** Admin Dashboard → Settings tab → White-Label Settings card

### 13. INSTAGRAM SETUP
- **Route:** `/instagram-setup`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/instagram-setup`
- **Features:**
  - Instagram DM webhook setup guide
  - Step-by-step instructions
  - Configuration examples
- **Navigation:** Admin Dashboard → Quick Access → Instagram Setup

### 14. SERVICE STATUS
- **Route:** `/services`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/services`
- **Features:**
  - Service health dashboard
  - Status indicators for all services
  - Test interface
- **Navigation:** Admin Dashboard → Quick Access → Service Status

### 15. SETUP GUIDE
- **Route:** `/setup-guide`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/setup-guide`
- **Features:**
  - Comprehensive setup documentation
  - Integration guides
  - Best practices
- **Navigation:** Admin Dashboard → Quick Access → Setup Guide

---

## 👤 USER PROFILE MENU

### Settings Page
- **Route:** `/settings`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/settings`
- **Features:**
  - **4 Tabs:** Notifications, Security, Appearance, Preferences
  - **Notifications Tab:**
    - Email notification toggle
    - SMS notification toggle
  - **Security Tab:**
    - Change password form
  - **Appearance Tab:**
    - Dark mode toggle
  - **Preferences Tab:**
    - Language selector
    - Timezone selector
- **Navigation:** Header → User Profile Menu → Settings

### Account Management
- **Route:** `/account`
- **Direct Link:** `https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer/account`
- **Features:**
  - **Profile Information:**
    - Name editing
    - Email editing
  - **Account Status:**
    - Account type (Premium)
    - Member since date
    - Login method
  - **Billing Information:**
    - Payment methods
    - Billing history
  - **Danger Zone:**
    - Account deletion with warning
- **Navigation:** Header → User Profile Menu → Account Management

### Logout
- **Action:** Logout with confirmation toast
- **Navigation:** Header → User Profile Menu → Logout

---

## 🔧 BACKEND FEATURES (No UI)

### Auto-Add Unknown Contacts
- **Location:** `server/baileys-manager.ts`
- **Function:** `autoAddUnknownContact()`
- **Trigger:** Incoming WhatsApp message from unknown number
- **Behavior:**
  - Extracts phone from remoteJid (format: 1234567890@s.whatsapp.net)
  - Checks if contact exists in database
  - Creates new contact with:
    - Name: Phone number (editable later)
    - Phones: [extracted phone]
    - Tags: ["Auto-added", "whatsapp"]
    - Status: "lead"
    - Platform: "whatsapp"
  - Silent operation (logs to console, no toast)
  - Contact immediately available in Contacts page

### Automated Booking Reminders
- **Location:** `server/booking-reminder-scheduler.ts`
- **Schedule:** Runs every hour
- **Behavior:**
  - Checks bookings with upcoming event dates
  - Sends reminders at:
    - 48 hours before event
    - 24 hours before event
    - 1 hour before event
  - Uses WhatsApp for message delivery
  - Tracks sent reminders in database
  - Prevents duplicate reminders
  - Auto-starts with server

### Message Processing Pipeline
- **Location:** `server/baileys-manager.ts`
- **Function:** `handleIncomingMessage()`
- **Flow:**
  1. Receive WhatsApp message
  2. Auto-add unknown contact (if new)
  3. Log incoming message to database
  4. Fetch user's persona configuration
  5. Generate AI response using persona tone
  6. Send response via Baileys
  7. Log outbound message to database

---

## 📱 MOBILE ACCESS

**Current Dev Server URL (for mobile testing):**
```
https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer
```

**Mobile Responsiveness:**
- All pages optimized for mobile (iPhone 14 Pro, Pixel 7)
- 48px minimum touch targets throughout
- Icon-only navigation on mobile, full labels on desktop
- Responsive grids and layouts
- Mobile-first design patterns
- Tested on iOS Safari, iOS Chrome, Android Chrome

**Mobile Navigation:**
- Hamburger menu in DashboardLayout
- Horizontal scrolling for tabs
- Touch-friendly buttons and inputs
- Mobile-optimized forms
- Camera/gallery access for file uploads

---

## 🔑 AUTHENTICATION

**Login Flow:**
1. Click "Get Started" on homepage
2. Redirect to Manus OAuth portal
3. Login with Manus account
4. Redirect back to intended route
5. Session cookie stored (sameSite: "lax")

**Session Management:**
- JWT-based authentication
- Session cookie: `manus_session`
- Auto-refresh on activity
- Logout clears cookie

**Role-Based Access:**
- **User Role:** Access to Personas, Bots, Contacts, Messages, Analytics, Bookings, Live, Test
- **Admin Role:** All user features + Admin Dashboard, API Settings, Billing, White-Label

---

## 📊 KEY METRICS & STATS

**Platform Statistics (Simulated):**
- Total MRR: $11,400
- Active Clients: 5
- Trial Clients: 1
- Average Revenue: $1,900/client
- Churn Rate: 2.1%

**ROI Calculator:**
- 32x return on investment
- $9,500 monthly benefit
- 70% cost savings
- +25% customer satisfaction
- 2.3s average response time
- 24/7 uptime

**Predictive Service Stats:**
- 40% engagement boost
- 5% chat-to-booking conversion
- 300% upsell increase

---

## 🎨 DESIGN SYSTEM

**Color Palette:**
- Primary: Warm Gold (#D4AF37)
- Secondary: Charcoal (#1A1A1A)
- Background: Light (#FAFAFA)
- Text: Dark (#1A1A1A)

**Typography:**
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)

**Components:**
- shadcn/ui component library
- Tailwind CSS utility classes
- Recharts for data visualization
- Lucide React icons

---

## 🚀 DEPLOYMENT

**Current Status:** Development
**Dev Server:** https://3000-ijsd45ee813yoaflwack0-8774f74b.manusvm.computer
**Production Domain:** ailuxe.co (after publish)

**To Publish:**
1. Click "Publish" button in Manus Management UI
2. DNS configured on Hostinger
3. Custom domain OAuth will work after publish

---

## 📞 SUPPORT

**For Issues or Questions:**
- Submit request at https://help.manus.im
- Include screenshot and description
- Reference this navigation guide

---

**Last Updated:** January 29, 2025  
**Version:** f088688a  
**Platform:** AI LUXE - Time is the Real Luxury
