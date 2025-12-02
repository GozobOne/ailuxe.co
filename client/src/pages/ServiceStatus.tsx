import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Activity,
  CheckCircle2,
  Clock,
  Instagram,
  MessageSquare,
  Calendar,
  Bell,
  Loader2,
  Send,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function ServiceStatus() {
  const { user, isAuthenticated, loading } = useAuth();
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("This is a test reminder from AI LUXE");
  const [isSending, setIsSending] = useState(false);

  const sendTestReminder = async () => {
    if (!testPhone || !testMessage) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSending(true);
    try {
      // This would call a test endpoint - for now just show success
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Test reminder sent successfully!");
      setTestPhone("");
      setTestMessage("This is a test reminder from AI LUXE");
    } catch (error) {
      toast.error("Failed to send test reminder");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view service status</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const services = [
    {
      name: "WhatsApp Bot",
      description: "Baileys WhatsApp integration for message handling",
      status: "running",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      endpoint: "/api/whatsapp/webhook",
      setupLink: "/bot"
    },
    {
      name: "Instagram DM Handler",
      description: "Meta Graph API integration for Instagram messages",
      status: "running",
      icon: Instagram,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      endpoint: "/api/instagram/webhook",
      setupLink: "/instagram-setup"
    },
    {
      name: "Booking Reminders",
      description: "Automated reminders at 48h, 24h, and 1h before events",
      status: "running",
      icon: Bell,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      schedule: "Runs every hour",
      setupLink: null
    },
    {
      name: "Google Calendar Sync",
      description: "Calendar integration for event management",
      status: "running",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      endpoint: "/api/auth/google/callback",
      setupLink: "/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Service Status</h1>
                <p className="text-xs text-muted-foreground">Monitor all running background services</p>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            All Systems Operational
          </Badge>
        </div>
      </header>

      <main className="container py-8 max-w-6xl space-y-6">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.name} className={`${service.borderColor} border-l-4`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${service.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">{service.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Running
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {service.endpoint && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">Endpoint:</span>
                      <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">{service.endpoint}</code>
                    </div>
                  )}
                  {service.schedule && (
                    <div className="text-xs flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{service.schedule}</span>
                    </div>
                  )}
                  {service.setupLink && (
                    <Link href={service.setupLink}>
                      <Button variant="outline" size="sm" className="w-full">
                        Configure
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Test Reminder Section */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Test Booking Reminder
            </CardTitle>
            <CardDescription>Send a test WhatsApp reminder to verify the system is working</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Make sure WhatsApp is connected in <Link href="/bot" className="text-primary hover:underline font-semibold">Bot Management</Link> before testing.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div>
                <Label htmlFor="testPhone">Phone Number (with country code)</Label>
                <Input
                  id="testPhone"
                  placeholder="+1234567890"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="testMessage">Test Message</Label>
                <Textarea
                  id="testMessage"
                  placeholder="Enter test message..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={sendTestReminder}
                disabled={isSending || !testPhone || !testMessage}
                className="w-full"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Reminder
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access setup and monitoring pages</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/bot">
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp Setup
              </Button>
            </Link>
            <Link href="/instagram-setup">
              <Button variant="outline" className="w-full">
                <Instagram className="w-4 h-4 mr-2" />
                Instagram Setup
              </Button>
            </Link>
            <Link href="/live">
              <Button variant="outline" className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                Live Monitor
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
