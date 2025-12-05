import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, Eye, EyeOff, Check, AlertCircle, Key, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { GoogleCalendarStatus } from "@/components/GoogleCalendarStatus";

export default function ApiSettings() {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [credentials, setCredentials] = useState<Record<string, string>>({
    whatsappPhoneId: "",
    whatsappAccessToken: "",
    googleClientId: "",
    googleClientSecret: "",
    openrouterApiKey: "",
    stripeSecretKey: "",
    stripePublishableKey: "",
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    sendgridApiKey: "",
    sendgridFromEmail: "",
    sendgridFromName: "",
  });

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  // WhatsApp mutations
  const saveWhatsAppMutation = trpc.whatsapp.saveCredentials.useMutation({
    onSuccess: () => {
      toast.success("WhatsApp credentials saved securely");
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const testWhatsAppMutation = trpc.whatsapp.testConnection.useMutation({
    onSuccess: () => {
      toast.success("✅ WhatsApp connection successful!", {
        description: "Phone Number ID and Access Token are valid"
      });
    },
    onError: (error) => {
      toast.error(`❌ WhatsApp connection failed`, {
        description: error.message
      });
    },
  });

  const handleSaveWhatsApp = async () => {
    if (!credentials.whatsappPhoneId || !credentials.whatsappAccessToken) {
      toast.error("Please enter both Phone Number ID and Access Token");
      return;
    }
    await saveWhatsAppMutation.mutateAsync({
      phoneNumberId: credentials.whatsappPhoneId,
      accessToken: credentials.whatsappAccessToken,
    });
  };

  const handleTestWhatsApp = async () => {
    await testWhatsAppMutation.mutateAsync();
  };

  // Test Google Calendar connection
  const { refetch: testGoogleCalendar } = trpc.googleCalendar.getUpcomingEvents.useQuery(
    { maxResults: 5 },
    { enabled: false }
  );

  const handleTestGoogleCalendar = async () => {
    try {
      toast.info("Testing Google Calendar connection...");
      const result = await testGoogleCalendar();
      
      if (result.data && result.data.length >= 0) {
        toast.success(`Google Calendar connected! Found ${result.data.length} upcoming events`);
      }
    } catch (error: any) {
      console.error('[ApiSettings] Google Calendar test error:', error);
      
      // Check if it's an auth error
      if (error.message?.includes('auth') || error.message?.includes('token') || error.message?.includes('credentials')) {
        toast.error("Google Calendar not authorized", {
          description: "Please connect your Google Calendar in settings first"
        });
      } else {
        toast.error(`Google Calendar test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleTestVoice = async () => {
    toast.info("Voice transcription test coming soon");
  };

  const handleTestPayment = async () => {
    toast.info("Payment gateway test coming soon");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">← Back to Admin</Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <Key className="w-6 h-6 text-primary" />
                API Settings
              </h1>
              <p className="text-sm text-neutral-600">Secure credential storage for integrations</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Alert className="mb-6">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            All credentials are encrypted at rest and never exposed in client-side code. 
            Only paste real API keys when you're ready to activate integrations.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="whatsapp" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="voice">AI / Voice</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="baileys">Baileys (BYO)</TabsTrigger>
          </TabsList>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Business Cloud API</CardTitle>
                <CardDescription>
                  Connect your Meta WhatsApp Business account to send and receive messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="whatsappPhoneId">
                    Phone Number ID <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Find this in your Meta App Dashboard → WhatsApp → API Setup
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="whatsappPhoneId"
                        type={showSecrets.whatsappPhoneId ? "text" : "password"}
                        placeholder="Enter your Phone Number ID"
                        value={credentials.whatsappPhoneId}
                        onChange={(e) => handleCredentialChange("whatsappPhoneId", e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret("whatsappPhoneId")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                      >
                        {showSecrets.whatsappPhoneId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Example: 868272956371771
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappAccessToken">
                    Access Token <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Temporary or permanent access token from Meta App Dashboard
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="whatsappAccessToken"
                        type={showSecrets.whatsappAccessToken ? "text" : "password"}
                        placeholder="Enter your Access Token"
                        value={credentials.whatsappAccessToken}
                        onChange={(e) => handleCredentialChange("whatsappAccessToken", e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret("whatsappAccessToken")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                      >
                        {showSecrets.whatsappAccessToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Example: EAATFr048ZCQ1a2b3c4d5e6f7g8h9i0j...
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveWhatsApp}
                    disabled={saveWhatsAppMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {saveWhatsAppMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Credentials
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Google Calendar Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle>Google Calendar Status</CardTitle>
                <CardDescription>Current connection status for Google Calendar integration</CardDescription>
              </CardHeader>
              <CardContent>
                <GoogleCalendarStatus />
              </CardContent>
            </Card>

            {/* Test Integrations */}
            <Card>
              <CardHeader>
                <CardTitle>Test Integrations</CardTitle>
                <CardDescription>Verify your API credentials are working correctly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleTestWhatsApp}
                    disabled={testWhatsAppMutation.isPending}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {testWhatsAppMutation.isPending ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test WhatsApp"
                    )}
                  </Button>
                  <Button
                    onClick={handleTestGoogleCalendar}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Test Calendar
                  </Button>
                  <Button
                    onClick={handleTestVoice}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Test Voice
                  </Button>
                  <Button
                    onClick={handleTestPayment}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Test Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Google Tab */}
          <TabsContent value="google" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Google Calendar & OAuth</CardTitle>
                <CardDescription>
                  Connect Google services for calendar sync and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="googleClientId">
                    Client ID <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Find this in Google Cloud Console → APIs & Services → Credentials
                  </p>
                  <div className="relative">
                    <Input
                      id="googleClientId"
                      type={showSecrets.googleClientId ? "text" : "password"}
                      placeholder="Enter your Google Client ID"
                      value={credentials.googleClientId}
                      onChange={(e) => handleCredentialChange("googleClientId", e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("googleClientId")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showSecrets.googleClientId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Example: 1025849112528-abc123xyz789.apps.googleusercontent.com
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleClientSecret">
                    Client Secret <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    OAuth 2.0 client secret from Google Cloud Console
                  </p>
                  <div className="relative">
                    <Input
                      id="googleClientSecret"
                      type={showSecrets.googleClientSecret ? "text" : "password"}
                      placeholder="Enter your Google Client Secret"
                      value={credentials.googleClientSecret}
                      onChange={(e) => handleCredentialChange("googleClientSecret", e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("googleClientSecret")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showSecrets.googleClientSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Example: 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o5p6
                  </p>
                </div>
                <Button className="bg-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Google Credentials
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI / Voice Tab */}
          <TabsContent value="voice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>OpenRouter (DeepSeek Whisper)</CardTitle>
                <CardDescription>
                  Voice transcription and AI model access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="openrouterApiKey">
                    OpenRouter API Key <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Get your API key from openrouter.ai/keys
                  </p>
                  <div className="relative">
                    <Input
                      id="openrouterApiKey"
                      type={showSecrets.openrouterApiKey ? "text" : "password"}
                      placeholder="Enter your OpenRouter API Key"
                      value={credentials.openrouterApiKey}
                      onChange={(e) => handleCredentialChange("openrouterApiKey", e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("openrouterApiKey")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showSecrets.openrouterApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Example: sk-or-v1-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
                  </p>
                </div>
                <Button className="bg-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save OpenRouter Key
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Payment Gateway</CardTitle>
                <CardDescription>
                  Accept payments and manage subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="stripeSecretKey">
                    Secret Key <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Find this in Stripe Dashboard → Developers → API keys
                  </p>
                  <div className="relative">
                    <Input
                      id="stripeSecretKey"
                      type={showSecrets.stripeSecretKey ? "text" : "password"}
                      placeholder="Enter your Stripe Secret Key"
                      value={credentials.stripeSecretKey}
                      onChange={(e) => handleCredentialChange("stripeSecretKey", e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("stripeSecretKey")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showSecrets.stripeSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Example: Your Stripe secret key starts with sk_live_ or sk_test_
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripePublishableKey">
                    Publishable Key <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Public key for client-side Stripe integration
                  </p>
                  <div className="relative">
                    <Input
                      id="stripePublishableKey"
                      type={showSecrets.stripePublishableKey ? "text" : "password"}
                      placeholder="Enter your Stripe Publishable Key"
                      value={credentials.stripePublishableKey}
                      onChange={(e) => handleCredentialChange("stripePublishableKey", e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("stripePublishableKey")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showSecrets.stripePublishableKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Example: Your Stripe publishable key starts with pk_live_ or pk_test_
                  </p>
                </div>
                <Button className="bg-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Stripe Keys
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            {/* Twilio SMS */}
            <Card>
              <CardHeader>
                <CardTitle>Twilio SMS Notifications</CardTitle>
                <CardDescription>
                  Send booking reminders and alerts via SMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="twilioAccountSid">
                    Account SID <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Find this in Twilio Console → Account Info
                  </p>
                  <div className="relative">
                    <Input
                      id="twilioAccountSid"
                      type={showSecrets.twilioAccountSid ? "text" : "password"}
                      placeholder="Enter your Twilio Account SID"
                      value={credentials.twilioAccountSid}
                      onChange={(e) => handleCredentialChange("twilioAccountSid", e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("twilioAccountSid")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showSecrets.twilioAccountSid ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Example: Your Twilio Account SID starts with AC
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilioAuthToken">
                    Auth Token <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Authentication token from Twilio Console
                  </p>
                  <div className="relative">
                    <Input
                      id="twilioAuthToken"
                      type={showSecrets.twilioAuthToken ? "text" : "password"}
                      placeholder="Enter your Twilio Auth Token"
                      value={credentials.twilioAuthToken}
                      onChange={(e) => handleCredentialChange("twilioAuthToken", e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("twilioAuthToken")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showSecrets.twilioAuthToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Example: 1234567890abcdef1234567890abcdef
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilioPhoneNumber">
                    Twilio Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Your Twilio phone number (E.164 format)
                  </p>
                  <Input
                    id="twilioPhoneNumber"
                    type="text"
                    placeholder="+1234567890"
                    value={credentials.twilioPhoneNumber}
                    onChange={(e) => handleCredentialChange("twilioPhoneNumber", e.target.value)}
                  />
                  <p className="text-xs text-neutral-500 italic">
                    Example: +15551234567
                  </p>
                </div>

                <Button className="bg-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Twilio Credentials
                </Button>
              </CardContent>
            </Card>

            {/* SendGrid Email */}
            <Card>
              <CardHeader>
                <CardTitle>SendGrid Email Notifications</CardTitle>
                <CardDescription>
                  Send booking confirmations, contracts, and reports via email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sendgridApiKey">
                    API Key <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Find this in SendGrid Dashboard → Settings → API Keys
                  </p>
                  <div className="relative">
                    <Input
                      id="sendgridApiKey"
                      type={showSecrets.sendgridApiKey ? "text" : "password"}
                      placeholder="Enter your SendGrid API Key"
                      value={credentials.sendgridApiKey}
                      onChange={(e) => handleCredentialChange("sendgridApiKey", e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret("sendgridApiKey")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showSecrets.sendgridApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Example: SG.1234567890abcdefghijklmnopqrstuvwxyz.ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqr
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sendgridFromEmail">
                    From Email Address <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Verified sender email in SendGrid
                  </p>
                  <Input
                    id="sendgridFromEmail"
                    type="email"
                    placeholder="noreply@ailuxe.co"
                    value={credentials.sendgridFromEmail}
                    onChange={(e) => handleCredentialChange("sendgridFromEmail", e.target.value)}
                  />
                  <p className="text-xs text-neutral-500 italic">
                    Example: notifications@yourdomain.com
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sendgridFromName">
                    From Name
                  </Label>
                  <p className="text-sm text-neutral-600">
                    Display name for outgoing emails
                  </p>
                  <Input
                    id="sendgridFromName"
                    type="text"
                    placeholder="AI LUXE Concierge"
                    value={credentials.sendgridFromName}
                    onChange={(e) => handleCredentialChange("sendgridFromName", e.target.value)}
                  />
                  <p className="text-xs text-neutral-500 italic">
                    Example: Your Company Name
                  </p>
                </div>

                <Button className="bg-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save SendGrid Credentials
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Baileys Tab */}
          <TabsContent value="baileys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Baileys (Bring Your Own WhatsApp)</CardTitle>
                <CardDescription>
                  Connect personal WhatsApp numbers via QR code (no official API required)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    Baileys uses WhatsApp Web protocol. No credentials needed – users scan QR code to connect their own numbers. 
                    This is configured per-client in the Bot Management interface.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label htmlFor="baileysSessionPath">Session Storage Path</Label>
                  <Input
                    id="baileysSessionPath"
                    defaultValue="/var/lib/ailuxe/baileys-sessions"
                    placeholder="/var/lib/ailuxe/baileys-sessions"
                  />
                  <p className="text-sm text-neutral-600">
                    Server directory for storing Baileys session files (must be writable)
                  </p>
                </div>
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
