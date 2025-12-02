import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  BookOpen,
  MessageSquare,
  Instagram,
  Calendar,
  Bell,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function SetupGuide() {
  const { user, isAuthenticated, loading } = useAuth();

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
            <CardDescription>Please log in to view setup guide</CardDescription>
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Setup Guide</h1>
                <p className="text-xs text-muted-foreground">Complete documentation for AI LUXE platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-5xl">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to AI LUXE</CardTitle>
                <CardDescription>Your AI-powered luxury event concierge platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  AI LUXE is a complete event management platform that automates client communication, booking management, and calendar coordination. This guide will help you set up all integrations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        WhatsApp Integration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p className="text-muted-foreground">Connect your WhatsApp number to handle client messages with AI responses.</p>
                      <Link href="/bot">
                        <Button variant="outline" size="sm" className="w-full">
                          Setup WhatsApp
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-purple-600" />
                        Instagram DMs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p className="text-muted-foreground">Automate Instagram Direct Message responses for your business account.</p>
                      <Link href="/instagram-setup">
                        <Button variant="outline" size="sm" className="w-full">
                          Setup Instagram
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        Google Calendar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p className="text-muted-foreground">Sync bookings with Google Calendar for seamless scheduling.</p>
                      <Link href="/settings">
                        <Button variant="outline" size="sm" className="w-full">
                          Setup Calendar
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600" />
                        Auto Reminders
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p className="text-muted-foreground">Automated booking reminders sent 48h, 24h, and 1h before events.</p>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/services">
                  <Button variant="outline" className="w-full">Service Status</Button>
                </Link>
                <Link href="/live">
                  <Button variant="outline" className="w-full">Live Monitor</Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full">Analytics</Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" className="w-full">Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  WhatsApp Setup (Baileys)
                </CardTitle>
                <CardDescription>Connect your personal or business WhatsApp number</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Step 1: Navigate to Bot Management</h4>
                    <p className="text-muted-foreground">Go to <Link href="/bot" className="text-primary hover:underline">Bot Management</Link> page</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Step 2: Generate QR Code</h4>
                    <p className="text-muted-foreground">Click "Generate QR Code" button to start the connection process</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Step 3: Scan with WhatsApp</h4>
                    <ol className="list-decimal ml-5 space-y-1 text-muted-foreground">
                      <li>Open WhatsApp on your phone</li>
                      <li>Go to Settings → Linked Devices</li>
                      <li>Tap "Link a Device"</li>
                      <li>Scan the QR code displayed on screen</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Step 4: Confirm Connection</h4>
                    <p className="text-muted-foreground">Once scanned, the status will change to "Connected" and your bot is ready!</p>
                  </div>
                </div>

                <Link href="/bot">
                  <Button className="w-full">
                    Go to Bot Management
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instagram Tab */}
          <TabsContent value="instagram" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-purple-600" />
                  Instagram DM Integration
                </CardTitle>
                <CardDescription>Connect Instagram Business Account via Meta Graph API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                      <li>Instagram Business or Creator account</li>
                      <li>Facebook Page linked to Instagram</li>
                      <li>Meta for Developers account</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Setup Process</h4>
                    <ol className="list-decimal ml-5 space-y-1 text-muted-foreground">
                      <li>Create Meta App at developers.facebook.com</li>
                      <li>Add Instagram product to your app</li>
                      <li>Configure webhook with your URL</li>
                      <li>Generate Page Access Token</li>
                      <li>Add token to environment variables</li>
                    </ol>
                  </div>
                </div>

                <Link href="/instagram-setup">
                  <Button className="w-full">
                    View Detailed Instagram Setup Guide
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Google Calendar Integration
                </CardTitle>
                <CardDescription>Sync bookings with Google Calendar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Features</h4>
                    <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                      <li>Automatic event creation for confirmed bookings</li>
                      <li>Availability checking before booking</li>
                      <li>Two-way sync with your Google Calendar</li>
                      <li>Event updates and cancellations</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Setup</h4>
                    <ol className="list-decimal ml-5 space-y-1 text-muted-foreground">
                      <li>Go to API Settings page</li>
                      <li>Find Google Calendar section</li>
                      <li>Click "Authorize Google Calendar"</li>
                      <li>Sign in with your Google account</li>
                      <li>Grant calendar permissions</li>
                    </ol>
                  </div>
                </div>

                <Link href="/settings">
                  <Button className="w-full">
                    Go to API Settings
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  Automated Booking Reminders
                </CardTitle>
                <CardDescription>WhatsApp reminders sent automatically before events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">How It Works</h4>
                    <p className="text-muted-foreground">
                      The system automatically checks for upcoming bookings every hour and sends WhatsApp reminders at:
                    </p>
                    <ul className="list-disc ml-5 mt-2 space-y-1 text-muted-foreground">
                      <li><strong>48 hours before</strong> - Initial reminder</li>
                      <li><strong>24 hours before</strong> - Day-before reminder</li>
                      <li><strong>1 hour before</strong> - Final reminder</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                      <li>WhatsApp must be connected (see WhatsApp tab)</li>
                      <li>Bookings must have status "confirmed"</li>
                      <li>Client phone number must be provided</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Status</h4>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Running Automatically
                    </Badge>
                  </div>
                </div>

                <Link href="/services">
                  <Button className="w-full" variant="outline">
                    View Service Status
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
