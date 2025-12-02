import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Bot, 
  Search,
  Download,
  Upload,
  Phone,
  Mail,
  Zap,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function UserGuide() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI LUXE User Guide</h1>
              <p className="text-muted-foreground">
                Complete guide for tenants and administrators
              </p>
            </div>
          </div>
        </div>

        <Alert className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <CheckCircle2 className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-amber-900 dark:text-amber-100">
            This guide is only accessible to administrators. Tenants will not see this page.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="getting-started" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to AI LUXE</CardTitle>
                <CardDescription>
                  Your AI-powered concierge platform for luxury event management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">What is AI LUXE?</h3>
                  <p className="text-muted-foreground mb-4">
                    AI LUXE is a comprehensive multi-tenant SaaS platform that gives brands, agencies, and teams 
                    the luxury gift of time — so they can focus on greatness, creativity, connection, and innovation. 
                    Our AI-powered concierge handles client communications, bookings, and administrative tasks 24/7.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-amber-600" />
                        <h4 className="font-semibold">32x ROI</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Average return on investment for agencies
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold">70% Cost Savings</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Reduce operational costs significantly
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Quick Start Guide</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 font-semibold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Set Up API Credentials</h4>
                        <p className="text-sm text-muted-foreground">
                          Navigate to Admin → API Settings and configure your WhatsApp, Google Calendar, 
                          and notification credentials.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 font-semibold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Clone Your Persona</h4>
                        <p className="text-sm text-muted-foreground">
                          Upload your chat history to Personas page. AI will analyze your tone and create 
                          a personalized AI assistant that responds like you.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 font-semibold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Connect WhatsApp</h4>
                        <p className="text-sm text-muted-foreground">
                          Go to Bot Management → WhatsApp tab and scan the QR code with your phone. 
                          Your AI concierge is now live!
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 font-semibold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Import Contacts</h4>
                        <p className="text-sm text-muted-foreground">
                          Visit Contacts page and click "Import CSV" to bulk upload your client database. 
                          Or let the system auto-add contacts from incoming messages.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Navigation Overview</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg border">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Personas</p>
                        <p className="text-xs text-muted-foreground">Clone AI tone</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg border">
                      <Bot className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Bots</p>
                        <p className="text-xs text-muted-foreground">WhatsApp/Telegram</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg border">
                      <Users className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">Contacts</p>
                        <p className="text-xs text-muted-foreground">CRM management</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg border">
                      <Search className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-sm">Search</p>
                        <p className="text-xs text-muted-foreground">Message search</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg border">
                      <BarChart3 className="w-5 h-5 text-cyan-600" />
                      <div>
                        <p className="font-medium text-sm">Analytics</p>
                        <p className="text-xs text-muted-foreground">Performance metrics</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg border">
                      <Calendar className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-sm">Bookings</p>
                        <p className="text-xs text-muted-foreground">Event management</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            {/* Persona Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <CardTitle>Persona Management</CardTitle>
                </div>
                <CardDescription>Clone your communication style with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How It Works</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload your chat history (WhatsApp exports, email threads, etc.) and our AI will analyze 
                    your tone, language, and response style. The system creates a personalized AI model that 
                    responds to clients exactly like you would.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Supported Formats</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>TXT files (plain text chat exports)</li>
                    <li>JSON files (structured chat data)</li>
                    <li>PDF files (email threads, documents)</li>
                    <li>Maximum file size: 16MB</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What Gets Analyzed</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded border text-center">
                      <p className="text-xs font-medium">Tone</p>
                      <p className="text-xs text-muted-foreground">Formal/Casual</p>
                    </div>
                    <div className="p-2 rounded border text-center">
                      <p className="text-xs font-medium">Language</p>
                      <p className="text-xs text-muted-foreground">English/Arabic</p>
                    </div>
                    <div className="p-2 rounded border text-center">
                      <p className="text-xs font-medium">Style</p>
                      <p className="text-xs text-muted-foreground">Brief/Detailed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <CardTitle>Contact Management</CardTitle>
                </div>
                <CardDescription>Comprehensive CRM for client relationships</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    CSV Import
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Bulk upload contacts from spreadsheets. Supported columns:
                  </p>
                  <code className="text-xs bg-muted p-2 rounded block">
                    name, phone, email, title, role, company, tags
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    CSV Export
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Download your entire contact database as CSV for backup or migration.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Auto-Add Contacts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    When someone messages your WhatsApp bot for the first time, they're automatically 
                    added to your contacts with "Auto-added" tag. No manual data entry needed!
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contact Fields</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Profile image upload (5MB max)</li>
                    <li>Title/Role (CEO, CTO, Manager, Director, etc.)</li>
                    <li>Multiple phone numbers</li>
                    <li>Multiple email addresses</li>
                    <li>Website URL</li>
                    <li>Company name</li>
                    <li>Tags with autocomplete</li>
                    <li>Status (Active/Past/Prospect/Lead)</li>
                    <li>Platform badges (WhatsApp/Telegram/Signal)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Dashboard */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-600" />
                  <CardTitle>Analytics Dashboard</CardTitle>
                </div>
                <CardDescription>Track performance and optimize operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Avg Response Time</p>
                      <p className="text-lg font-bold">2.3s</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
                      <p className="text-lg font-bold">5%</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Total Messages</p>
                      <p className="text-lg font-bold">1,234</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Total Bookings</p>
                      <p className="text-lg font-bold">62</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Available Charts</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Response Time Trend (7-day line chart)</li>
                    <li>Message Volume by Platform (bar chart)</li>
                    <li>Peak Activity Hours (bar chart)</li>
                    <li>Message Type Distribution (pie chart)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    CSV Export
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Export comprehensive analytics data including all metrics, trends, peak hours, 
                    and message types. Perfect for reporting and analysis.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Automated Reminders */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <CardTitle>Automated Booking Reminders</CardTitle>
                </div>
                <CardDescription>Never miss an event with smart reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How It Works</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    The system automatically sends WhatsApp reminders to clients before their events. 
                    Reminders are sent at 48 hours, 24 hours, and 1 hour before the event time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Reminder Schedule</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded border">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold">
                        48h
                      </div>
                      <p className="text-sm">Initial reminder 2 days before event</p>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded border">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-xs font-bold">
                        24h
                      </div>
                      <p className="text-sm">Follow-up reminder 1 day before</p>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded border">
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-xs font-bold">
                        1h
                      </div>
                      <p className="text-sm">Final reminder 1 hour before event</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Automatic scheduling (runs every hour)</li>
                    <li>Duplicate prevention (won't send same reminder twice)</li>
                    <li>Database tracking (all reminders logged)</li>
                    <li>WhatsApp delivery (instant notification)</li>
                    <li>Event details included (date, time, location)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            {/* WhatsApp */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <CardTitle>WhatsApp Integration</CardTitle>
                </div>
                <CardDescription>Connect your WhatsApp Business account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Setup Methods</h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border">
                      <h5 className="font-semibold text-sm mb-1">Option 1: Baileys (Bring Your Own)</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Scan QR code with your personal WhatsApp. No API credentials needed. 
                        Perfect for testing and small-scale operations.
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        Navigate to: Bot Management → WhatsApp tab → Scan QR
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <h5 className="font-semibold text-sm mb-1">Option 2: WhatsApp Business Cloud API</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Official Meta API for production use. Requires Phone Number ID and Access Token 
                        from Meta Business Suite.
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        Navigate to: Admin → API Settings → WhatsApp tab
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>End-to-end encryption (E2EE)</li>
                    <li>Two-factor authentication (2FA)</li>
                    <li>Auto-reply with AI persona</li>
                    <li>Voice note transcription</li>
                    <li>Image and document support</li>
                    <li>Message logging to database</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Google Calendar */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <CardTitle>Google Calendar Integration</CardTitle>
                </div>
                <CardDescription>Sync bookings with Google Calendar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Setup Steps</h4>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Go to Admin → API Settings → Google tab</li>
                    <li>Enter your Google Client ID and Client Secret</li>
                    <li>Click "Authorize Google Calendar"</li>
                    <li>Sign in with your Google account</li>
                    <li>Grant calendar permissions</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Automatic event creation from bookings</li>
                    <li>Conflict detection and availability checks</li>
                    <li>Two-way sync (read and write)</li>
                    <li>Event updates and cancellations</li>
                    <li>Multiple calendar support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Twilio SMS */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <CardTitle>Twilio SMS Notifications</CardTitle>
                </div>
                <CardDescription>Send booking reminders via SMS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Setup Steps</h4>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Create a Twilio account at twilio.com</li>
                    <li>Get your Account SID and Auth Token</li>
                    <li>Purchase a Twilio phone number</li>
                    <li>Go to Admin → API Settings → Notifications tab</li>
                    <li>Enter your Twilio credentials</li>
                    <li>Click "Save Twilio Credentials"</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Use Cases</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Booking confirmation messages</li>
                    <li>Event reminders (48h/24h/1h)</li>
                    <li>Payment notifications</li>
                    <li>Contract status updates</li>
                    <li>Emergency alerts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* SendGrid Email */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyan-600" />
                  <CardTitle>SendGrid Email Notifications</CardTitle>
                </div>
                <CardDescription>Send professional emails to clients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Setup Steps</h4>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Create a SendGrid account at sendgrid.com</li>
                    <li>Verify your sender email address</li>
                    <li>Generate an API key</li>
                    <li>Go to Admin → API Settings → Notifications tab</li>
                    <li>Enter your SendGrid API Key and sender details</li>
                    <li>Click "Save SendGrid Credentials"</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Email Templates</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Booking confirmations with event details</li>
                    <li>Contract notifications with PDF attachments</li>
                    <li>Analytics reports (weekly/monthly)</li>
                    <li>Payment receipts and invoices</li>
                    <li>Welcome emails for new clients</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Beautiful HTML templates</li>
                    <li>Responsive design (mobile-friendly)</li>
                    <li>Attachment support (PDFs, images)</li>
                    <li>Delivery tracking</li>
                    <li>Bounce and spam protection</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Troubleshooting Tab */}
          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues & Solutions</CardTitle>
                <CardDescription>Quick fixes for frequent problems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">WhatsApp QR Code Not Showing</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Problem:</strong> QR code doesn't appear in Bot Management page.
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Solution:</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Refresh the page (Ctrl+R or Cmd+R)</li>
                    <li>Check browser console for errors (F12)</li>
                    <li>Try a different browser (Chrome recommended)</li>
                    <li>Clear browser cache and cookies</li>
                    <li>Contact support if issue persists</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">CSV Import Failing</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Problem:</strong> CSV file upload shows error or imports 0 contacts.
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Solution:</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Ensure CSV has header row: name, phone, email, title, role, company, tags</li>
                    <li>Check file size is under 5MB</li>
                    <li>Use UTF-8 encoding for special characters</li>
                    <li>Remove empty rows and columns</li>
                    <li>Test with a small sample file first (5-10 contacts)</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">AI Not Responding to Messages</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Problem:</strong> WhatsApp messages received but AI doesn't reply.
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Solution:</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Check WhatsApp connection status in Bot Management</li>
                    <li>Verify persona is cloned (Personas page should show "Cloned" status)</li>
                    <li>Test AI response manually using "Test AI Response" button</li>
                    <li>Check Live Monitoring page for message logs</li>
                    <li>Reconnect WhatsApp by scanning QR code again</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Analytics Dashboard Shows No Data</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Problem:</strong> Charts are empty or show "No data available".
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Solution:</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Ensure you have received and sent messages (check Live Monitoring)</li>
                    <li>Wait 24 hours for data to accumulate</li>
                    <li>Try different date ranges (7/30/90 days)</li>
                    <li>Refresh the page to reload data</li>
                    <li>Check database connection in Service Status page</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Booking Reminders Not Sending</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Problem:</strong> Automated reminders not reaching clients.
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Solution:</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Verify booking has valid event date in future</li>
                    <li>Check client has valid phone number in Contacts</li>
                    <li>Ensure WhatsApp is connected in Bot Management</li>
                    <li>Check reminder status in Bookings page</li>
                    <li>Verify scheduler is running (check server logs)</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Mobile App Not Loading</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Problem:</strong> Platform doesn't load on mobile device.
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Solution:</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Use dev server URL (not custom domain during development)</li>
                    <li>Enable JavaScript in mobile browser</li>
                    <li>Clear mobile browser cache</li>
                    <li>Try different mobile browser (Chrome/Safari)</li>
                    <li>Check internet connection</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Getting Help</CardTitle>
                <CardDescription>When you need additional support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Support Channels</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-1">Documentation</p>
                      <p className="text-sm text-muted-foreground">
                        Check the complete Navigation Guide in <code>/docs/NAVIGATION_GUIDE.md</code>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-1">Submit Ticket</p>
                      <p className="text-sm text-muted-foreground">
                        Visit <a href="https://help.manus.im" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                          https://help.manus.im
                        </a> to submit a support request
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="font-semibold text-sm mb-1">Include in Your Request</p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Screenshot of the issue</li>
                        <li>Steps to reproduce</li>
                        <li>Browser and device information</li>
                        <li>Error messages (if any)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
