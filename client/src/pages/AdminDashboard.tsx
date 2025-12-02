import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  DollarSign, 
  TrendingUp,
  Building2,
  ArrowLeft,
  Plus,
  Upload,
  Settings,
  BarChart3,
  Palette,
  Globe,
  Instagram,
  Activity,
  BookOpen,
  LineChart,
  Eye
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import TrialDashboardWidget from "@/components/TrialDashboardWidget";
import GlobalSearch from "@/components/GlobalSearch";
import LogoUploadDialog from "@/components/LogoUploadDialog";
import BrandingCustomizationDialog from "@/components/BrandingCustomizationDialog";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"overview" | "clients" | "settings">("overview");
  const [showAddClient, setShowAddClient] = useState(false);
  const [logoUploadClient, setLogoUploadClient] = useState<{ id: number; name: string } | null>(null);
  const [brandingClient, setBrandingClient] = useState<{ id: number; name: string } | null>(null);

  // Simulated clients data
  const clients = [
    { id: 1, name: "Elite Events", subdomain: "elite", mrr: 3200, status: "active", logo: null },
    { id: 2, name: "Gala Events", subdomain: "gala", mrr: 2800, status: "active", logo: null },
    { id: 3, name: "Luxury Weddings", subdomain: "luxuryweddings", mrr: 1900, status: "active", logo: null },
    { id: 4, name: "Fashion Forward", subdomain: "fashionforward", mrr: 1500, status: "active", logo: null },
    { id: 5, name: "Elite Models Agency", subdomain: "elitemodels", mrr: 1200, status: "trial", logo: null },
    { id: 6, name: "Corporate Events Pro", subdomain: "corporateevents", mrr: 800, status: "active", logo: null },
  ];

  const totalMRR = clients.reduce((sum, c) => sum + c.mrr, 0);
  const activeClients = clients.filter(c => c.status === "active").length;
  const trialClients = clients.filter(c => c.status === "trial").length;

  const handleAddClient = () => {
    setShowAddClient(true);
    toast.info("Add Client Form", {
      description: "This will open a form to add a new white-label client"
    });
  };

  const handleUploadLogo = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setLogoUploadClient({ id: client.id, name: client.name });
    }
  };

  const handleCustomizeBranding = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setBrandingClient({ id: client.id, name: client.name });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access admin panel</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check if user is admin (in real app, check user.role === 'admin')
  const isAdmin = true; // Simulated for now

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access the admin panel</CardDescription>
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
              <h1 className="text-xl font-bold text-foreground">AI LUXE Admin</h1>
              <p className="text-xs text-muted-foreground">White-label multi-tenant management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GlobalSearch />
            <Button className="gradient-luxury text-foreground font-semibold" onClick={handleAddClient}>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total MRR", value: `$${totalMRR.toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
            { label: "Active Clients", value: activeClients, icon: Users, color: "text-primary" },
            { label: "Trial Clients", value: trialClients, icon: TrendingUp, color: "text-blue-600" },
            { label: "Avg Revenue", value: `$${Math.round(totalMRR / clients.length)}`, icon: BarChart3, color: "text-primary" },
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <stat.icon className={`w-8 h-8 mb-2 ${stat.color}`} />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trial Dashboard Widget */}
        <TrialDashboardWidget />

        {/* Quick Access Services */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Access platform services and monitoring tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <Link href="/instagram-setup">
                <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                  <Instagram className="w-6 h-6 text-purple-600" />
                  <span className="text-xs">Instagram Setup</span>
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                  <Activity className="w-6 h-6 text-green-600" />
                  <span className="text-xs">Service Status</span>
                </Button>
              </Link>
              <Link href="/setup-guide">
                <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                  <span className="text-xs">Setup Guide</span>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                  <LineChart className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </Link>
              <Link href="/admin/user-guide">
                <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                  <BookOpen className="w-6 h-6 text-cyan-600" />
                  <span className="text-xs">User Guide</span>
                </Button>
              </Link>
              <Link href="/live">
                <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                  <Eye className="w-6 h-6 text-orange-600" />
                  <span className="text-xs">Live Monitor</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Forecast Graph Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Revenue Forecast
            </CardTitle>
            <CardDescription>Projected MRR growth over next 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Revenue forecast chart</p>
                <p className="text-sm text-muted-foreground">Projected: $18,500 MRR by Q2 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Users className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
                <CardDescription>AI LUXE white-label performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Clients</span>
                      <span className="font-bold text-lg">{clients.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Monthly Recurring Revenue</span>
                      <span className="font-bold text-lg text-green-600">${totalMRR.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Client Value</span>
                      <span className="font-bold text-lg">${Math.round(totalMRR / clients.length)}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Subscriptions</span>
                      <Badge variant="default">{activeClients} active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Trial Accounts</span>
                      <Badge variant="secondary">{trialClients} trial</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Churn Rate</span>
                      <span className="font-bold text-lg text-green-600">2.1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-4 mt-6">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        {client.name}
                      </CardTitle>
                      <CardDescription>
                        <Globe className="w-3 h-3 inline mr-1" />
                        {client.subdomain}.ailuxe.co
                      </CardDescription>
                    </div>
                    <Badge variant={client.status === "active" ? "default" : "secondary"}>
                      {client.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      <p className="font-bold text-lg text-green-600">${client.mrr.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Subdomain</p>
                      <p className="font-medium">{client.subdomain}.ailuxe.co</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Logo</p>
                      <p className="text-sm">{client.logo ? "✓ Uploaded" : "Not set"}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleUploadLogo(client.id)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCustomizeBranding(client.id)}>
                      <Palette className="w-4 h-4 mr-2" />
                      Customize Branding
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`https://${client.subdomain}.ailuxe.co`} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Visit Site
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-6">
            {/* Admin Navigation Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/admin/api-settings">
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      API Settings
                    </CardTitle>
                    <CardDescription>Configure WhatsApp, Google, and OpenRouter credentials</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/admin/billing">
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Billing Management
                    </CardTitle>
                    <CardDescription>Manage plans, coupons, and subscriptions</CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/admin/white-label">
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Palette className="w-5 h-5 text-primary" />
                      White-Label Settings
                    </CardTitle>
                    <CardDescription>Customize branding, currency, and localization</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI LUXE Platform Settings</CardTitle>
                <CardDescription>Configure main platform branding and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Platform Logo</label>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload AI LUXE Logo
                      </Button>
                      <p className="text-sm text-muted-foreground self-center">Current: Default AI LUXE logo</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Primary Brand Color</label>
                    <div className="flex gap-2 items-center">
                      <div className="w-12 h-12 rounded-lg bg-[#D4AF37] border-2 border-border"></div>
                      <input
                        type="text"
                        value="#D4AF37"
                        readOnly
                        className="px-4 py-2 rounded-lg border border-border bg-background"
                      />
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Secondary Brand Color</label>
                    <div className="flex gap-2 items-center">
                      <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] border-2 border-border"></div>
                      <input
                        type="text"
                        value="#1A1A1A"
                        readOnly
                        className="px-4 py-2 rounded-lg border border-border bg-background"
                      />
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="gradient-luxury text-foreground font-semibold">
                      Save Platform Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">White-Label Features</CardTitle>
                <CardDescription>Available customization options for clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Custom subdomain (client.ailuxe.co)",
                    "Logo upload and branding",
                    "Primary and secondary color customization",
                    "Persona cloning from chat history",
                    "WhatsApp bot integration",
                    "Booking and contract management",
                    "Revenue tracking and analytics",
                    "Multi-currency support (coming soon)",
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <p className="text-sm">{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      {logoUploadClient && (
        <LogoUploadDialog
          open={!!logoUploadClient}
          onOpenChange={(open) => !open && setLogoUploadClient(null)}
          clientId={logoUploadClient.id}
          clientName={logoUploadClient.name}
          onUploadComplete={() => {
            toast.success("Logo uploaded successfully!");
            setLogoUploadClient(null);
          }}
        />
      )}

      {brandingClient && (
        <BrandingCustomizationDialog
          open={!!brandingClient}
          onOpenChange={(open) => !open && setBrandingClient(null)}
          clientId={brandingClient.id}
          clientName={brandingClient.name}
          onSaveComplete={() => {
            toast.success("Branding updated!");
            setBrandingClient(null);
          }}
        />
      )}
    </div>
  );
}
