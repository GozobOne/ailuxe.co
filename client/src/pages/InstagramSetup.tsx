import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Instagram,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function InstagramSetup() {
  const { user, isAuthenticated, loading } = useAuth();
  const [verifyToken, setVerifyToken] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const webhookUrl = `${window.location.origin}/api/instagram/webhook`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const testWebhook = async () => {
    setIsTesting(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        toast.success("Webhook endpoint is accessible!");
      } else {
        toast.error("Webhook endpoint returned an error");
      }
    } catch (error) {
      toast.error("Failed to reach webhook endpoint");
    } finally {
      setIsTesting(false);
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
            <CardDescription>Please log in to configure Instagram</CardDescription>
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
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Instagram DM Integration</h1>
                <p className="text-xs text-muted-foreground">Connect your Instagram Business Account</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl space-y-6">
        {/* Status Card */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Connection Status
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Configuration Required
                  </Badge>
                </CardTitle>
                <CardDescription>Complete the steps below to activate Instagram DMs</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Webhook URL Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Step 1: Your Webhook URL
            </CardTitle>
            <CardDescription>Copy this URL - you'll need it for Meta configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(webhookUrl, "Webhook URL")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={testWebhook}
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Webhook Endpoint"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Meta App Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
              Create Meta App
            </CardTitle>
            <CardDescription>Set up your Instagram Business App on Meta for Developers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <div>
                  Go to{" "}
                  <a
                    href="https://developers.facebook.com/apps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Meta for Developers
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>Click <strong>"Create App"</strong> → Select <strong>"Business"</strong> type</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <span>Add <strong>"Instagram"</strong> product to your app</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <span>Go to <strong>Instagram → Basic Display</strong> settings</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">5.</span>
                <span>Connect your Instagram Business Account</span>
              </li>
            </ol>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> You must have an Instagram Business or Creator account. Personal accounts won't work.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">3</span>
              Configure Webhook
            </CardTitle>
            <CardDescription>Set up webhook in your Meta App</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <span>In your Meta App, go to <strong>Instagram → Configuration</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>Click <strong>"Edit"</strong> next to Webhooks</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <div className="flex-1 space-y-2">
                  <span>Enter your webhook URL:</span>
                  <div className="flex gap-2">
                    <Input
                      value={webhookUrl}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(webhookUrl, "Webhook URL")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <div className="flex-1 space-y-2">
                  <span>Enter verify token (you can use this default or create your own):</span>
                  <div className="flex gap-2">
                    <Input
                      value="ailuxe_instagram_verify_2025"
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard("ailuxe_instagram_verify_2025", "Verify Token")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">5.</span>
                <span>Subscribe to <strong>"messages"</strong> webhook field</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">6.</span>
                <span>Click <strong>"Verify and Save"</strong></span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Get Access Token */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">4</span>
              Get Page Access Token
            </CardTitle>
            <CardDescription>Generate a long-lived access token for your Instagram account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <span>In your Meta App, go to <strong>Tools → Graph API Explorer</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>Select your app and Instagram account</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <span>Add permissions: <strong>instagram_basic, instagram_manage_messages, pages_messaging</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <span>Click <strong>"Generate Access Token"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">5.</span>
                <div className="flex-1">
                  <span>Use the{" "}
                    <a
                      href="https://developers.facebook.com/tools/accesstoken"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Access Token Tool
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {" "}to extend it to a long-lived token (60 days)
                  </span>
                </div>
              </li>
            </ol>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Next Step:</strong> Once you have your Page Access Token, add it to your environment variables in the Settings panel:
                <br />
                <code className="text-xs bg-blue-100 px-2 py-1 rounded mt-2 inline-block">INSTAGRAM_PAGE_ACCESS_TOKEN=your_token_here</code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Test Configuration */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle2 className="w-5 h-5" />
              Test Your Integration
            </CardTitle>
            <CardDescription className="text-green-700">
              Send a test message to verify everything works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-green-900">
            <p>Once you've completed all steps above:</p>
            <ol className="space-y-2 ml-4 list-decimal">
              <li>Open Instagram on your phone</li>
              <li>Send a DM to your connected Instagram Business account</li>
              <li>Check the <Link href="/live" className="text-primary hover:underline font-semibold">Live Monitoring Dashboard</Link> to see the message appear</li>
              <li>You should receive an AI-powered response automatically!</li>
            </ol>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>Webhook verification fails:</strong>
              <p className="text-muted-foreground">Make sure your verify token matches exactly (case-sensitive)</p>
            </div>
            <div>
              <strong>Messages not appearing:</strong>
              <p className="text-muted-foreground">Check that you've subscribed to the "messages" webhook field and your access token has the correct permissions</p>
            </div>
            <div>
              <strong>Can't send replies:</strong>
              <p className="text-muted-foreground">Verify your Page Access Token is valid and has <code className="bg-muted px-1 py-0.5 rounded">pages_messaging</code> permission</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
