# 🚀 Deploy AI LUXE to ailuxe.co - Quick Start

## Immediate Deployment Steps

### Method 1: Deploy via Manus (Recommended - Fastest)

Since this project is already in Manus, you can deploy directly:

1. **Go to your Manus project:**
   - URL: https://manus.im/app/vFoaSxdWNISVbHYcIkODnl

2. **Click "Publish" button** (top right corner)

3. **Configure deployment:**
   - Environment: **Production**
   - Domain: **ailuxe.co**
   - Auto-deploy: **Enabled**

4. **Click "Deploy"** and wait 2-3 minutes

5. **Done!** Your site will be live at https://ailuxe.co

---

### Method 2: Deploy via GitHub (For Version Control)

If you want to use GitHub for continuous deployment:

1. **Create GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI LUXE platform"
   git remote add origin https://github.com/YOUR_USERNAME/ailuxe-co.git
   git push -u origin main
   ```

2. **Connect to Manus:**
   - Go to Manus project settings
   - Click "Connect GitHub"
   - Select your repository
   - Enable auto-deployment

3. **Configure custom domain:**
   - In Manus settings → Domains
   - Add: **ailuxe.co**
   - Follow DNS instructions

4. **Push to deploy:**
   ```bash
   git push origin main
   ```

---

## Post-Deployment Checklist

After deployment, verify these work:

### ✅ Core Features
- [ ] Homepage loads at https://ailuxe.co
- [ ] Login/OAuth works
- [ ] Dashboard accessible
- [ ] Persona cloning works
- [ ] Contract generation works
- [ ] Mobile responsive

### ⚙️ Configure Integrations (Optional)

**WhatsApp Business API:**
1. Get credentials from Meta Business Manager
2. Add to Manus environment variables:
   ```
   WHATSAPP_BUSINESS_PHONE_NUMBER_ID=your_id
   WHATSAPP_BUSINESS_ACCESS_TOKEN=your_token
   ```
3. Set webhook: `https://ailuxe.co/api/whatsapp/webhook`

**Google Calendar:**
1. Create OAuth app in Google Cloud Console
2. Add credentials to environment variables
3. Test connection in Settings → Integrations

**Stripe Payments:**
1. Get API keys from Stripe Dashboard
2. Add to environment variables
3. Test payment flow

---

## DNS Configuration (If Using Custom Domain)

Add these DNS records at your domain registrar:

```
Type    Name    Value                           TTL
CNAME   @       [your-manus-deployment-url]     3600
CNAME   www     [your-manus-deployment-url]     3600
```

**Note:** Manus will provide the deployment URL after you publish.

---

## Environment Variables

These are automatically set by Manus:
- ✅ `DATABASE_URL` - MySQL connection
- ✅ `AWS_S3_BUCKET` - File storage
- ✅ `OPENAI_API_KEY` - AI responses

You only need to add optional integrations:
- WhatsApp Business API (optional)
- Google Calendar (optional)
- Stripe (optional)

---

## Troubleshooting

**Site not loading?**
- Check DNS propagation (can take 5-30 minutes)
- Verify deployment status in Manus dashboard
- Check browser console for errors

**Login not working?**
- Verify OAuth is configured in Manus
- Check redirect URI is whitelisted
- Clear browser cookies and try again

**Database errors?**
- Run migrations: `pnpm db:push` (Manus does this automatically)
- Check DATABASE_URL is set in environment

**Need help?**
- Manus Support: https://help.manus.im
- Project docs: See `DEPLOYMENT_GUIDE.md` for detailed instructions

---

## What's Included in This Deployment

✅ **Features Ready:**
- AI-powered persona cloning
- Multi-platform messaging (WhatsApp, Telegram, Signal)
- Smart booking management
- Contract generation (English & Arabic)
- Voice transcription
- Fair price negotiator
- Analytics dashboard
- Mobile-responsive design

✅ **Branding:**
- All "Manus" references removed
- AI LUXE branding throughout
- Custom domain ready: ailuxe.co

✅ **Infrastructure:**
- Production build optimized
- Database schema ready
- S3 storage configured
- OAuth authentication
- SSL/HTTPS automatic

---

## Next Steps After Deployment

1. **Test the platform** - Create test booking, generate contract
2. **Configure integrations** - WhatsApp, Google Calendar, Stripe
3. **Invite users** - Set up admin accounts
4. **Monitor performance** - Check analytics daily

---

## Support

For deployment issues or questions:
- Technical: https://help.manus.im
- Business: contact@ailuxe.co

**Your AI LUXE platform is ready to launch! 🎉**
