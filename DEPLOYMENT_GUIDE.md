# AI LUXE Deployment Guide

## 🚀 Deploying to ailuxe.co

This guide covers deploying the AI LUXE platform to production at **ailuxe.co**.

---

## Prerequisites

### Required Services
1. **Manus Account** - For OAuth authentication and runtime
2. **Domain** - ailuxe.co (configured and verified)
3. **Database** - MySQL/TiDB (provided by Manus)
4. **S3 Storage** - For file uploads (provided by Manus)

### Optional Services (for full functionality)
- **WhatsApp Business API** - For WhatsApp bot integration
- **Google Calendar API** - For calendar sync
- **Stripe** - For payment processing
- **SendGrid** - For email notifications
- **DocuSign/HelloSign** - For e-signature

---

## Deployment Steps

### 1. Prepare the Project

The project is already configured with:
- ✅ AI LUXE branding (no Manus references)
- ✅ Contract generation system
- ✅ Multi-language support (English/Arabic)
- ✅ Mobile-responsive design
- ✅ WhatsApp bot integration
- ✅ Persona cloning system
- ✅ Booking management
- ✅ Analytics dashboard

### 2. Deploy to Manus

Since this project was built with Manus infrastructure:

**Option A: Via Manus Web Interface**
1. Go to https://manus.im/app/vFoaSxdWNISVbHYcIkODnl
2. Click "Publish" or "Deploy"
3. Select "Production" environment
4. Set domain to: **ailuxe.co**
5. Click "Deploy"

**Option B: Via GitHub (Recommended)**
1. Push code to GitHub repository
2. Connect repository to Manus
3. Enable auto-deployment
4. Configure custom domain: ailuxe.co

### 3. Configure Environment Variables

In Manus deployment settings, add:

```bash
# Required
VITE_APP_TITLE=AI LUXE - Time is the Real Luxury
VITE_OAUTH_PORTAL_URL=https://manus.im
VITE_APP_ID=ailuxe-concierge
OAUTH_SERVER_URL=https://manus.im
NODE_ENV=production

# Optional (for full features)
WHATSAPP_BUSINESS_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCESS_TOKEN=your_access_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
```

### 4. Run Database Migrations

The contracts table needs to be created:

```bash
pnpm db:push
```

This will create:
- `contracts` table for contract generation
- All other existing tables

### 5. Configure Custom Domain

**DNS Configuration:**
1. Add CNAME record: `ailuxe.co` → `[manus-deployment-url]`
2. Add CNAME record: `www.ailuxe.co` → `[manus-deployment-url]`
3. Wait for DNS propagation (5-30 minutes)

**SSL Certificate:**
- Manus automatically provisions SSL via Let's Encrypt
- HTTPS will be enabled automatically

### 6. Verify Deployment

Check these URLs:
- ✅ https://ailuxe.co - Homepage loads
- ✅ https://ailuxe.co/api/health - API health check
- ✅ Login flow works
- ✅ Dashboard accessible
- ✅ WhatsApp QR code generation
- ✅ Contract generation

---

## Post-Deployment Configuration

### WhatsApp Business API Setup

1. **Get API Credentials:**
   - Go to Facebook Business Manager
   - Create WhatsApp Business App
   - Get Phone Number ID and Access Token

2. **Configure Webhook:**
   - Webhook URL: `https://ailuxe.co/api/whatsapp/webhook`
   - Verify Token: (set in environment variables)
   - Subscribe to: `messages`, `message_status`

3. **Test Integration:**
   - Send test message to your WhatsApp number
   - Check Live Monitoring dashboard
   - Verify AI response

### Google Calendar Integration

1. **Create Google Cloud Project:**
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://ailuxe.co/api/oauth/google/callback`

2. **Configure in App:**
   - Go to Settings → Integrations
   - Click "Connect Google Calendar"
   - Authorize access

### Stripe Payment Setup

1. **Get Stripe Keys:**
   - Go to Stripe Dashboard
   - Get Secret Key and Publishable Key
   - Create webhook endpoint: `https://ailuxe.co/api/stripe/webhook`

2. **Configure in App:**
   - Add keys to environment variables
   - Test payment flow in sandbox mode
   - Switch to live mode when ready

---

## Features Checklist

### Core Features (Ready)
- ✅ **Persona Cloning** - Upload chat history, AI learns tone
- ✅ **Multi-Platform Support** - WhatsApp, Telegram, Signal
- ✅ **Voice Transcription** - AI transcribes voice notes
- ✅ **Smart Bookings** - Calendar sync, conflict detection
- ✅ **Fair Negotiator** - AI handles price negotiations
- ✅ **Contract Generation** - PDF contracts in EN/AR
- ✅ **Analytics Dashboard** - Real-time metrics
- ✅ **Mobile Responsive** - iOS and Android optimized

### Integration Status
- ✅ **WhatsApp** - Ready (needs API credentials)
- ⏳ **Telegram** - Placeholder (future)
- ⏳ **Signal** - Placeholder (future)
- ✅ **Google Calendar** - Ready (needs OAuth setup)
- ✅ **Stripe** - Ready (needs API keys)
- ⏳ **E-Signature** - Placeholder (DocuSign integration ready)

### Contract Generation
- ✅ **Service Agreement** - EN/AR templates
- ✅ **NDA** - EN/AR templates
- ✅ **Auto-fill from bookings** - Client data, event details
- ✅ **Status tracking** - Draft → Sent → Signed → Paid
- ⏳ **PDF generation** - Ready for weasyprint integration
- ⏳ **E-signature** - Ready for DocuSign/HelloSign

---

## Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Test connection
pnpm db:push
```

### OAuth Login Fails
- Verify `VITE_OAUTH_PORTAL_URL` is set to `https://manus.im`
- Check `VITE_APP_ID` matches Manus app ID
- Ensure redirect URI is whitelisted in Manus

### WhatsApp Not Receiving Messages
- Verify webhook URL is accessible: `https://ailuxe.co/api/whatsapp/webhook`
- Check webhook verify token matches
- Ensure phone number is verified in Meta Business

### Contracts Not Generating
- Run database migration: `pnpm db:push`
- Check contracts table exists
- Verify booking data is complete

---

## Monitoring & Maintenance

### Health Checks
- API: `https://ailuxe.co/api/health`
- Database: Check Manus dashboard
- S3 Storage: Check upload logs

### Logs
- Server logs: Manus dashboard → Logs
- Error tracking: Check browser console
- WhatsApp webhook: Meta Business Manager → Webhooks

### Backups
- Database: Automatic daily backups (Manus)
- S3 files: Versioning enabled
- Code: GitHub repository

---

## Support & Resources

### Documentation
- Project TODO: `todo.md`
- Status Report: `GLOBAL_WHITE_LABEL_STATUS.md`
- Mobile Guide: `MOBILE_ACCESS_GUIDE.md`

### API Documentation
- WhatsApp: https://developers.facebook.com/docs/whatsapp
- Google Calendar: https://developers.google.com/calendar
- Stripe: https://stripe.com/docs/api

### Contact
- Technical Issues: Submit at https://help.manus.im
- Business Inquiries: contact@ailuxe.co

---

## Security Checklist

Before going live:
- [ ] All API keys stored in environment variables (not code)
- [ ] HTTPS enabled (automatic with Manus)
- [ ] CORS configured for ailuxe.co only
- [ ] Rate limiting enabled on API endpoints
- [ ] Database backups configured
- [ ] Error logging enabled
- [ ] OAuth tokens encrypted at rest
- [ ] Webhook signatures verified
- [ ] Input validation on all forms
- [ ] SQL injection protection (Drizzle ORM)

---

## Performance Optimization

### Recommended Settings
- Enable CDN for static assets
- Configure browser caching
- Optimize images (WebP format)
- Enable gzip compression
- Use database connection pooling

### Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure error alerts (Sentry)
- Track performance metrics (Google Analytics)

---

## Next Steps After Deployment

1. **Test All Features:**
   - Create test booking
   - Generate contract
   - Send WhatsApp message
   - Check analytics

2. **Configure Integrations:**
   - WhatsApp Business API
   - Google Calendar
   - Stripe payments

3. **Invite Users:**
   - Create admin accounts
   - Set up client agencies
   - Configure white-label settings

4. **Monitor Performance:**
   - Check error logs daily
   - Review analytics weekly
   - Update dependencies monthly

---

## Deployment Complete! 🎉

Your AI LUXE platform is now live at **https://ailuxe.co**

For ongoing support and updates, refer to the project documentation and Manus help center.
