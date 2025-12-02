import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, QrCode, CheckCircle2, XCircle, Smartphone } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

export default function BaileysConnect() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Query connection status
  const statusQuery = trpc.baileys.status.useQuery(undefined, {
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Connect mutation
  const connectMutation = trpc.baileys.connect.useMutation({
    onSuccess: (data) => {
      if (data.qr) {
        setQrCode(data.qr);
        toast.success("QR code generated! Scan with WhatsApp.");
      } else if (data.status === "already_connected") {
        toast.info("Already connected to WhatsApp");
      }
      setConnecting(false);
    },
    onError: (error) => {
      toast.error(`Connection failed: ${error.message}`);
      setConnecting(false);
    },
  });

  // Disconnect mutation
  const disconnectMutation = trpc.baileys.disconnect.useMutation({
    onSuccess: () => {
      setQrCode(null);
      toast.success("Disconnected from WhatsApp");
      statusQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Disconnect failed: ${error.message}`);
    },
  });

  // Update QR code when status changes
  useEffect(() => {
    if (statusQuery.data?.qr) {
      setQrCode(statusQuery.data.qr);
    } else if (statusQuery.data?.connected) {
      setQrCode(null);
    }
  }, [statusQuery.data]);

  const handleConnect = () => {
    setConnecting(true);
    connectMutation.mutate();
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate();
  };

  const status = statusQuery.data?.status || "disconnected";
  const connected = statusQuery.data?.connected || false;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/bot">
              <Button variant="ghost" size="sm">← Back to Bot Management</Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-primary" />
                Connect Your WhatsApp
              </h1>
              <p className="text-sm text-neutral-600">Bring your own WhatsApp number (no official API required)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert className="mb-6">
          <AlertDescription>
            <strong>Baileys WhatsApp Web Connection:</strong> This uses the WhatsApp Web protocol to connect your personal or business WhatsApp number.
            No official API credentials needed - just scan the QR code with your phone.
          </AlertDescription>
        </Alert>

        {/* Connection Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {connected ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Connected
                </>
              ) : status === "connecting" || status === "qr_ready" ? (
                <>
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-neutral-400" />
                  Disconnected
                </>
              )}
            </CardTitle>
            <CardDescription>
              {connected
                ? "Your WhatsApp is connected and ready to receive messages"
                : status === "qr_ready"
                ? "Scan the QR code below with your WhatsApp app"
                : status === "connecting"
                ? "Generating QR code..."
                : "Click 'Connect WhatsApp' to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {!connected && (
                <Button
                  onClick={handleConnect}
                  disabled={connecting || status === "connecting" || status === "qr_ready"}
                  className="min-w-[200px]"
                >
                  {connecting || status === "connecting" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Connect WhatsApp
                    </>
                  )}
                </Button>
              )}
              {connected && (
                <Button
                  onClick={handleDisconnect}
                  variant="destructive"
                  disabled={disconnectMutation.isPending}
                  className="min-w-[200px]"
                >
                  {disconnectMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    "Disconnect WhatsApp"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        {qrCode && !connected && (
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>
                Open WhatsApp on your phone → Settings → Linked Devices → Link a Device → Scan this QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="bg-white p-6 rounded-lg border-2 border-primary">
                <img
                  src={qrCode}
                  alt="WhatsApp QR Code"
                  className="w-[300px] h-[300px]"
                />
              </div>
              <div className="text-center text-sm text-neutral-600 max-w-md">
                <p className="mb-2">
                  <strong>Important:</strong> Keep this page open until the connection is established.
                </p>
                <p>
                  Once connected, your WhatsApp will stay linked even if you close this page.
                  You can disconnect anytime from this page.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connected Status */}
        {connected && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">✓ WhatsApp Connected</CardTitle>
              <CardDescription>
                Your WhatsApp is now linked and ready to receive messages. The AI will automatically respond to incoming messages using your persona.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">What happens now?</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Incoming messages will be processed by your AI persona</li>
                  <li>• Responses will be sent automatically in your tone</li>
                  <li>• You can monitor conversations in the Bot Management dashboard</li>
                  <li>• The connection stays active even when you close this page</li>
                </ul>
              </div>
              <div className="flex gap-4">
                <Link href="/bot">
                  <Button variant="outline">
                    Go to Bot Management
                  </Button>
                </Link>
                <Link href="/persona">
                  <Button variant="outline">
                    Configure Persona
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Generate QR Code</h3>
                <p className="text-sm text-neutral-600">
                  Click "Connect WhatsApp" to generate a unique QR code
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Scan with Phone</h3>
                <p className="text-sm text-neutral-600">
                  Open WhatsApp and scan the QR code to link your number
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">AI Takes Over</h3>
                <p className="text-sm text-neutral-600">
                  Your AI persona automatically handles incoming messages
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
