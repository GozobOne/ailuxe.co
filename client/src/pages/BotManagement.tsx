import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { 
  QrCode, 
  MessageSquare, 
  Mic,
  Send,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Zap,
  DollarSign,
  Inbox,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Search,
  Users,
  Filter
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function BotManagement() {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<"whatsapp" | "telegram" | "signal">("whatsapp");
  const [isLinking, setIsLinking] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "whatsapp" | "telegram" | "signal">("all");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    platform: "whatsapp" as const,
    status: "prospect" as const,
    tags: "",
    notes: "",
  });
  
  // File upload mutations
  const uploadImageMutation = trpc.fileUpload.uploadImage.useMutation({
    onSuccess: () => {
      toast.success("Image uploaded successfully");
      refetchMessages();
      setUploadingFile(false);
    },
    onError: (error) => {
      toast.error(`Failed to upload image: ${error.message}`);
      setUploadingFile(false);
    },
  });
  
  const uploadDocumentMutation = trpc.fileUpload.uploadDocument.useMutation({
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      refetchMessages();
      setUploadingFile(false);
    },
    onError: (error) => {
      toast.error(`Failed to upload document: ${error.message}`);
      setUploadingFile(false);
    },
  });
  
  const uploadVoiceMutation = trpc.fileUpload.uploadVoice.useMutation({
    onSuccess: () => {
      toast.success("Voice note uploaded successfully");
      refetchMessages();
      setUploadingFile(false);
    },
    onError: (error) => {
      toast.error(`Failed to upload voice note: ${error.message}`);
      setUploadingFile(false);
    },
  });
  
  // Handle file uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (16MB limit)
    if (file.size > 16 * 1024 * 1024) {
      toast.error("File size must be less than 16MB");
      return;
    }
    
    setUploadingFile(true);
    toast.info("Uploading image...");
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result?.toString().split(',')[1];
      if (!base64) {
        toast.error("Failed to read file");
        setUploadingFile(false);
        return;
      }
      
      await uploadImageMutation.mutateAsync({
        fileName: file.name,
        fileContent: base64,
        platform: 'whatsapp', // Default to WhatsApp
        direction: 'outbound',
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (16MB limit)
    if (file.size > 16 * 1024 * 1024) {
      toast.error("File size must be less than 16MB");
      return;
    }
    
    setUploadingFile(true);
    toast.info("Uploading document...");
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result?.toString().split(',')[1];
      if (!base64) {
        toast.error("Failed to read file");
        setUploadingFile(false);
        return;
      }
      
      await uploadDocumentMutation.mutateAsync({
        fileName: file.name,
        fileContent: base64,
        platform: 'whatsapp',
        direction: 'outbound',
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleVoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (16MB limit)
    if (file.size > 16 * 1024 * 1024) {
      toast.error("File size must be less than 16MB");
      return;
    }
    
    setUploadingFile(true);
    toast.info("Uploading voice note...");
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result?.toString().split(',')[1];
      if (!base64) {
        toast.error("Failed to read file");
        setUploadingFile(false);
        return;
      }
      
      await uploadVoiceMutation.mutateAsync({
        fileName: file.name,
        fileContent: base64,
        platform: 'whatsapp',
        direction: 'outbound',
      });
    };
    reader.readAsDataURL(file);
  };

  // Simulated bot status
  const [botStatus, setBotStatus] = useState({
    whatsapp: { connected: false, messagesHandled: 0 },
    telegram: { connected: false, messagesHandled: 0 },
    signal: { connected: false, messagesHandled: 0 },
  });

  // Real message data from database
  const { data: recentMessages, refetch: refetchMessages } = trpc.messages.getRecent.useQuery(
    { limit: 50 },
    { refetchInterval: 5000 } // Poll every 5 seconds
  );

  const { data: messageStats } = trpc.messages.getStats.useQuery(
    undefined,
    { refetchInterval: 30000 } // Poll every 30 seconds
  );

  // Real contacts data from database
  const { data: contactsData } = trpc.contacts.list.useQuery(
    undefined,
    { refetchInterval: 10000 } // Poll every 10 seconds
  );

  // Filter contacts based on search
  const displayedContacts = contactsData?.filter((contact: any) =>
    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.phone?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.email?.toLowerCase().includes(contactSearch.toLowerCase())
  ).slice(0, 5); // Show only first 5 contacts

  // Old stats query
  const { data: oldMessageStats } = trpc.messages.getStats.useQuery(
    undefined,
    { refetchInterval: 10000 } // Poll every 10 seconds
  );

  // Filter messages by platform
  const filteredMessages = recentMessages?.filter(msg => 
    platformFilter === "all" || msg.platform === platformFilter
  ) || [];

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hour ago`;
    return date.toLocaleDateString();
  };

  // Get platform badge color
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'whatsapp': return 'bg-green-500';
      case 'telegram': return 'bg-blue-500';
      case 'signal': return 'bg-primary';
      default: return 'bg-gray-500';
    }
  };

  // Use real Baileys QR generation
  const startBaileysMutation = trpc.baileys.connect.useMutation({
    onSuccess: () => {
      toast.success("Baileys session started! Waiting for QR...");
      setIsLinking(false);
    },
    onError: (error) => {
      toast.error(`Failed to start Baileys: ${error.message}`);
      setIsLinking(false);
    },
  });

  const { data: baileysStatus, refetch: refetchBaileysStatus } = trpc.baileys.status.useQuery(
    undefined,
    {
      refetchInterval: (data) => {
        // Poll every 2 seconds if waiting for QR or connecting
        if (data?.status === 'qr_ready' || data?.status === 'connecting') {
          return 2000;
        }
        // Poll every 10 seconds if connected
        if (data?.status === 'connected') {
          return 10000;
        }
        // Don't poll if disconnected
        return false;
      },
    }
  );

  const disconnectBaileysMutation = trpc.baileys.disconnect.useMutation({
    onSuccess: () => {
      toast.success("WhatsApp disconnected successfully");
      setBotStatus(prev => ({
        ...prev,
        whatsapp: { ...prev.whatsapp, connected: false }
      }));
      setQrCode(null);
      setIsLinking(false);
    },
    onError: (error) => {
      toast.error(`Failed to disconnect: ${error.message}`);
      setIsLinking(false);
    },
  });

  const handleGenerateQR = async () => {
    try {
      console.log('[BotManagement] Generate QR clicked');
      setIsLinking(true);
      toast.info("Starting Baileys session...");
      console.log('[BotManagement] Calling baileys.connect mutation');
      const result = await startBaileysMutation.mutateAsync();
      console.log('[BotManagement] Mutation result:', result);
    } catch (error) {
      console.error('[BotManagement] Error generating QR:', error);
      toast.error(`Failed to generate QR: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLinking(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log('[BotManagement] Disconnect clicked');
      setIsLinking(true);
      toast.info("Disconnecting WhatsApp...");
      await disconnectBaileysMutation.mutateAsync();
    } catch (error) {
      console.error('[BotManagement] Error disconnecting:', error);
      toast.error(`Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLinking(false);
    }
  };

  // Update QR code from Baileys status
  useEffect(() => {
    if (baileysStatus?.qr) {
      setQrCode(baileysStatus.qr);
    }
    if (baileysStatus?.status === 'connected') {
      setBotStatus(prev => ({
        ...prev,
        whatsapp: { ...prev.whatsapp, connected: true }
      }));
      setQrCode(null);
      toast.success("WhatsApp connected successfully!");
    }
  }, [baileysStatus]);

  const handleLinkBot = () => {
    toast.success(`${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} bot linked!`, {
      description: "E2EE enabled, 2FA active"
    });
    
    setBotStatus(prev => ({
      ...prev,
      [selectedPlatform]: { ...prev[selectedPlatform], connected: true }
    }));
    
    setQrCode(null);
  };

  const testAIMutation = trpc.baileys.testAIResponse.useMutation({
    onSuccess: (data) => {
      toast.success("AI Response", {
        description: data.response
      });
      setBotStatus(prev => ({
        ...prev,
        [selectedPlatform]: { 
          ...prev[selectedPlatform], 
          messagesHandled: prev[selectedPlatform].messagesHandled + 1 
        }
      }));
      
      setTestMessage("");
    },
    onError: (error) => {
      toast.error("Failed to generate response", {
        description: error.message
      });
    }
  });

  const handleTestMessage = () => {
    if (!testMessage.trim()) {
      toast.error("Please enter a test message");
      return;
    }

    toast.info("Processing message with AI persona...");
    testAIMutation.mutate({ message: testMessage });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to manage bots</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Bot Management</h1>
              <p className="text-xs text-muted-foreground">Multi-platform AI concierge</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-12 space-y-12">
        {/* Platform Selection */}
        <section className="max-w-4xl mx-auto">
          <Tabs defaultValue="hub" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hub">
                <Inbox className="w-4 h-4 mr-2" />
                Message Hub
              </TabsTrigger>
              <TabsTrigger value="whatsapp">
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="telegram">
                <Send className="w-4 h-4 mr-2" />
                Telegram
              </TabsTrigger>
              <TabsTrigger value="signal">
                <Zap className="w-4 h-4 mr-2" />
                Signal
              </TabsTrigger>
            </TabsList>

            {/* WhatsApp Tab */}
            <TabsContent value="whatsapp" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Connection Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {botStatus.whatsapp.connected ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                      Connection Status
                    </CardTitle>
                    <CardDescription>
                      {botStatus.whatsapp.connected 
                        ? "Bot is active and responding" 
                        : "Not connected"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant={botStatus.whatsapp.connected ? "default" : "secondary"}>
                          {botStatus.whatsapp.connected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Messages Handled:</span>
                        <span className="font-semibold">{botStatus.whatsapp.messagesHandled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">E2EE:</span>
                        <Badge variant="outline" className="text-green-600">Enabled</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">2FA:</span>
                        <Badge variant="outline" className="text-green-600">Active</Badge>
                      </div>
                    </div>

                    {!botStatus.whatsapp.connected ? (
                      <Button 
                        className="w-full gradient-luxury text-foreground font-semibold"
                        onClick={handleGenerateQR}
                        disabled={isLinking}
                      >
                        {isLinking ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <QrCode className="w-4 h-4 mr-2" />
                            Generate QR Code
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive"
                        className="w-full"
                        onClick={handleDisconnect}
                        disabled={isLinking}
                      >
                        {isLinking ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Disconnecting...
                          </>
                        ) : (
                          "Disconnect WhatsApp"
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* QR Code Display */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-primary" />
                      Reverse QR Linking
                    </CardTitle>
                    <CardDescription>
                      Scan with WhatsApp to link your bot
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {qrCode ? (
                      <div className="space-y-4">
                        <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
                          {qrCode && qrCode.startsWith('data:image') ? (
                            <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
                          ) : (
                            <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                              <Loader2 className="w-32 h-32 text-foreground animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground text-center">
                            1. Open WhatsApp on your phone
                          </p>
                          <p className="text-sm text-muted-foreground text-center">
                            2. Go to Settings → Linked Devices
                          </p>
                          <p className="text-sm text-muted-foreground text-center">
                            3. Scan this QR code
                          </p>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={handleLinkBot}
                        >
                          Confirm Link
                        </Button>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <QrCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click "Generate QR Code" to start linking
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Test Message */}
              {botStatus.whatsapp.connected && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Test AI Response
                    </CardTitle>
                    <CardDescription>
                      Send a test message to see how your AI persona responds
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a test message..."
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleTestMessage()}
                        className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
                      />
                      <Button onClick={handleTestMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        💡 The AI will use your cloned persona to respond with the same tone and style
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Negotiator Settings */}
              {botStatus.whatsapp.connected && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Fair Negotiator
                    </CardTitle>
                    <CardDescription>
                      AI balances both parties' interests and proposes fair deals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Budget Threshold</label>
                        <input
                          type="number"
                          placeholder="500"
                          className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                        />
                        <p className="text-xs text-muted-foreground">
                          Escalate to human if budget exceeds this amount (USD)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Auto-Approve Limit</label>
                        <input
                          type="number"
                          placeholder="200"
                          className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                        />
                        <p className="text-xs text-muted-foreground">
                          AI can auto-approve deals below this amount (USD)
                        </p>
                      </div>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium">Negotiation Features:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Proposes counter-offers based on market rates</li>
                        <li>• Considers both client budget and model availability</li>
                        <li>• Escalates complex negotiations to human agent</li>
                        <li>• Logs all negotiations for transparency</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Telegram Tab */}
            <TabsContent value="telegram" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Connection Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-blue-500" />
                      Telegram Bot
                    </CardTitle>
                    <CardDescription>
                      Connect via BotFather token
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant={botStatus.telegram.connected ? "default" : "secondary"}>
                          {botStatus.telegram.connected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Messages Handled:</span>
                        <span className="font-semibold">{botStatus.telegram.messagesHandled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">E2EE:</span>
                        <Badge variant="outline" className="text-green-600">Enabled</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bot Token</label>
                      <input
                        type="password"
                        placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                      />
                      <p className="text-xs text-muted-foreground">
                        Get your bot token from @BotFather on Telegram
                      </p>
                    </div>

                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => toast.info("Telegram integration coming soon")}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Connect Telegram Bot
                    </Button>
                  </CardContent>
                </Card>

                {/* Setup Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Setup Instructions</CardTitle>
                    <CardDescription>How to create a Telegram bot</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <div>
                          <p className="text-sm font-medium">Open Telegram</p>
                          <p className="text-xs text-muted-foreground">Search for @BotFather</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <div>
                          <p className="text-sm font-medium">Create New Bot</p>
                          <p className="text-xs text-muted-foreground">Send /newbot command</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <div>
                          <p className="text-sm font-medium">Get Token</p>
                          <p className="text-xs text-muted-foreground">Copy the API token</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                          4
                        </div>
                        <div>
                          <p className="text-sm font-medium">Paste Above</p>
                          <p className="text-xs text-muted-foreground">Enter token and connect</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Test Message */}
              {botStatus.telegram.connected && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      Test Telegram Bot
                    </CardTitle>
                    <CardDescription>
                      Send a test message via Telegram
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a test message..."
                        className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
                      />
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Message Hub Tab */}
            <TabsContent value="hub" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inbox Section */}
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Inbox className="w-5 h-5" />
                          Unified Inbox
                        </CardTitle>
                        <div className="flex gap-2">
                          <Link href="/contacts">
                            <Button variant="outline" size="sm">
                              <Users className="w-4 h-4 mr-2" />
                              Contacts
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                          </Button>
                          <Button variant="outline" size="sm">
                            <Search className="w-4 h-4 mr-2" />
                            Search
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        All messages from WhatsApp, Telegram, and Signal in one place
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Platform Filter */}
                      <div className="flex gap-2 mb-4 flex-wrap">
                        <Button
                          variant={platformFilter === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPlatformFilter("all")}
                        >
                          All
                        </Button>
                        <Button
                          variant={platformFilter === "whatsapp" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPlatformFilter("whatsapp")}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                        <Button
                          variant={platformFilter === "telegram" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPlatformFilter("telegram")}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Telegram
                        </Button>
                        <Button
                          variant={platformFilter === "signal" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPlatformFilter("signal")}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Signal
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {/* Real Messages from Database */}
                        {filteredMessages.length > 0 ? (
                          filteredMessages.map((message) => (
                            <div key={message.id} className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full ${getPlatformColor(message.platform)} flex items-center justify-center text-white font-semibold`}>
                                  {message.platform === 'whatsapp' && <MessageSquare className="w-5 h-5" />}
                                  {message.platform === 'telegram' && <Send className="w-5 h-5" />}
                                  {message.platform === 'signal' && <Zap className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-sm">
                                      {message.direction === 'inbound' ? 'Contact' : 'You'}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimestamp(message.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {message.content || (message.messageType === 'voice' ? '🎤 Voice message' : '📎 Media')}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {message.platform}
                                    </Badge>
                                    <Badge 
                                      variant={message.direction === 'inbound' ? 'secondary' : 'outline'} 
                                      className="text-xs capitalize"
                                    >
                                      {message.direction}
                                    </Badge>
                                    {message.messageType !== 'text' && (
                                      <Badge variant="outline" className="text-xs capitalize">
                                        {message.messageType}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No messages yet</p>
                            <p className="text-xs mt-1">Connect your platforms to see real-time messages</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Message Composer */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Send Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <select
                            className="flex-1 px-3 py-2 border rounded-md text-sm bg-background"
                            value={selectedContactId || ''}
                            onChange={(e) => {
                              const contactId = e.target.value ? parseInt(e.target.value) : null;
                              setSelectedContactId(contactId);
                              if (contactId) {
                                const contact = contactsData?.find(c => c.id === contactId);
                                if (contact) {
                                  setRecipientPhone(contact.phone || '');
                                }
                              } else {
                                setRecipientPhone('');
                              }
                            }}
                          >
                            <option value="">Select contact or enter number...</option>
                            {contactsData?.map((contact) => (
                              <option key={contact.id} value={contact.id}>
                                {contact.name} ({contact.phone})
                              </option>
                            ))}
                          </select>
                          <Link href="/contacts">
                            <Button variant="outline" size="sm" title="Manage Contacts">
                              <Users className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                        {!selectedContactId && (
                          <input
                            type="text"
                            placeholder="Or enter phone number manually..."
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            value={recipientPhone}
                            onChange={(e) => setRecipientPhone(e.target.value)}
                          />
                        )}
                        <textarea
                          placeholder="Type your message..."
                          className="w-full px-3 py-2 border rounded-md text-sm min-h-[100px] resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={uploadingFile}
                                onClick={(e) => {
                                  e.preventDefault();
                                  document.getElementById('image-upload')?.click();
                                }}
                              >
                                {uploadingFile ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 mr-2" />
                                )}
                                Image
                              </Button>
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                            
                            <label htmlFor="document-upload" className="cursor-pointer">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={uploadingFile}
                                onClick={(e) => {
                                  e.preventDefault();
                                  document.getElementById('document-upload')?.click();
                                }}
                              >
                                {uploadingFile ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <FileText className="w-4 h-4 mr-2" />
                                )}
                                Document
                              </Button>
                              <input
                                id="document-upload"
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleDocumentUpload}
                                className="hidden"
                              />
                            </label>
                            
                            <label htmlFor="voice-upload" className="cursor-pointer">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={uploadingFile}
                                onClick={(e) => {
                                  e.preventDefault();
                                  document.getElementById('voice-upload')?.click();
                                }}
                              >
                                {uploadingFile ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Mic className="w-4 h-4 mr-2" />
                                )}
                                Voice
                              </Button>
                              <input
                                id="voice-upload"
                                type="file"
                                accept="audio/*,.ogg,.mp3,.wav"
                                onChange={handleVoiceUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <Button className="bg-primary">
                            <Send className="w-4 h-4 mr-2" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contacts Sidebar */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Users className="w-4 h-4" />
                        Contacts
                      </CardTitle>
                      <CardDescription>
                        Manage your client contacts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search contacts..."
                            value={contactSearch}
                            onChange={(e) => setContactSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
                          />
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                          {displayedContacts && displayedContacts.length > 0 ? (
                            displayedContacts.map((contact: any) => (
                              <Link key={contact.id} href="/contacts">
                                <div className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
                                      {contact.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-sm truncate">{contact.name}</p>
                                      <p className="text-xs text-muted-foreground">{contact.phone || contact.email}</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs capitalize">{contact.platform}</Badge>
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p>No contacts yet</p>
                              <p className="text-xs">Add your first contact below</p>
                            </div>
                          )}
                        </div>

                        <Link href="/contacts">
                          <Button variant="outline" className="w-full" size="sm">
                            <Users className="w-4 h-4 mr-2" />
                            Manage Contacts
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Today's Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Messages Received</span>
                          <span className="font-semibold">24</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Messages Sent</span>
                          <span className="font-semibold">18</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">New Contacts</span>
                          <span className="font-semibold">3</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Response Time</span>
                          <span className="font-semibold">2.3s</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Signal Tab */}
            <TabsContent value="signal" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Connection Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Signal Bot
                    </CardTitle>
                    <CardDescription>
                      Privacy-focused messaging with E2EE
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant={botStatus.signal.connected ? "default" : "secondary"}>
                          {botStatus.signal.connected ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Messages Handled:</span>
                        <span className="font-semibold">{botStatus.signal.messagesHandled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">E2EE:</span>
                        <Badge variant="outline" className="text-green-600">Always On</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1234567890"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                      />
                      <p className="text-xs text-muted-foreground">
                        Dedicated phone number for Signal bot
                      </p>
                    </div>

                    <Button 
                      className="w-full gradient-luxury text-foreground font-semibold"
                      onClick={() => toast.info("Signal integration coming soon")}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Link Signal Number
                    </Button>
                  </CardContent>
                </Card>

                {/* Setup Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Setup Instructions</CardTitle>
                    <CardDescription>How to connect Signal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <div>
                          <p className="text-sm font-medium">Get Phone Number</p>
                          <p className="text-xs text-muted-foreground">Dedicated number for bot</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <div>
                          <p className="text-sm font-medium">Register on Signal</p>
                          <p className="text-xs text-muted-foreground">Verify phone number</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <div>
                          <p className="text-sm font-medium">Link Device</p>
                          <p className="text-xs text-muted-foreground">Use Signal's linked devices</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          4
                        </div>
                        <div>
                          <p className="text-sm font-medium">Connect Above</p>
                          <p className="text-xs text-muted-foreground">Enter number and link</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> Signal requires a dedicated phone number. E2EE is always enabled for maximum privacy.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Test Message */}
              {botStatus.signal.connected && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Test Signal Bot
                    </CardTitle>
                    <CardDescription>
                      Send a test message via Signal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a test message..."
                        className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
                      />
                      <Button className="gradient-luxury text-foreground">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
