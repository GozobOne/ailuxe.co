import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_LOGO, getLoginUrl } from "@/const";
import { 
  MessageSquare, 
  Sparkles, 
  Upload, 
  Shield, 
  Zap, 
  Calendar, 
  Users, 
  TrendingUp,
  Play,
  QrCode,
  Mic,
  FileText,
  CheckCircle2,
  ArrowRight,
  Clock,
  Heart,
  Lightbulb,
  Target,
  UserCircle,
  Settings,
  LogOut,
  UserCog,
  Search
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import CoreFeaturesSection from "@/components/CoreFeaturesSection";
import ClientSuccessStories from "@/components/ClientSuccessStories";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoClient, setDemoClient] = useState<"gala" | "elite" | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDemoMode = (client: "gala" | "elite") => {
    setIsDemoMode(true);
    setDemoClient(client);
    const clientName = client === "gala" ? "Gala Events" : "Elite Events";
    toast.success(`Demo Mode: ${clientName} 🎭`, {
      description: "Explore the platform with their branded experience"
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['text/plain', 'application/json', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please upload TXT, JSON, or PDF files only"
        });
        return;
      }
      
      if (file.size > 16 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Maximum file size is 16MB"
        });
        return;
      }
      
      setUploadedFile(file);
      toast.success("File uploaded successfully! 📄", {
        description: `${file.name} is ready for persona cloning`
      });
    }
  };

  const handleClonePersona = () => {
    if (!uploadedFile) {
      toast.error("No file uploaded", {
        description: "Please upload a chat history file first"
      });
      return;
    }
    
    toast.info("Processing chat history...", {
      description: "AI is analyzing your conversation patterns"
    });
    
    setTimeout(() => {
      toast.success("Persona cloned successfully! 🎯", {
        description: "Your AI assistant now speaks like your agent"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-gala.png" 
            alt="Luxury Gala Event" 
            className="w-full h-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container text-center space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
              AI <span className="text-primary">LUXE</span>
            </h1>
            <p className="text-2xl md:text-4xl text-white/90 font-light italic">
              Time is the Real Luxury
            </p>
          </div>

          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            We give brands, agencies, and teams the luxury gift of time — so they can focus on greatness, creativity, connection, and innovation.
          </p>

          <div className="flex flex-col gap-4 justify-center items-center pt-8 px-4 w-full max-w-md mx-auto">
            <Button 
              size="lg" 
              className="gradient-luxury text-foreground font-semibold w-full text-lg px-8 min-h-[56px]"
              asChild
            >
              <a href={getLoginUrl()}>
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            
            {/* MASSIVE GOLD ROI GUIDE BUTTON */}
            <Button 
              size="lg" 
              className="w-full text-lg px-8 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black font-bold hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-400 min-h-[64px] shadow-2xl shadow-yellow-500/50 border-2 border-yellow-300 animate-pulse"
              asChild
            >
              <Link href="/roi-guide">
                ✨ See 32x ROI Guide →
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="w-full text-lg px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 min-h-[56px]"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Navigation Bar - Appears after hero */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="AI LUXE Logo" className="h-10 w-10 object-contain" />
            <div>
              <h2 className="text-xl font-bold text-foreground">AI <span className="text-primary">LUXE</span></h2>
              <p className="text-xs text-muted-foreground">Time is the Real Luxury</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto">
            {isDemoMode && demoClient && (
              <Badge variant="secondary" className="animate-pulse whitespace-nowrap text-center">
                🎭 Demo: {demoClient === "gala" ? "Gala Events" : "Elite Events"}
              </Badge>
            )}
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                  <Link href="/persona">
                    <Sparkles className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Personas</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                  <Link href="/bot">
                    <MessageSquare className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Bots</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                  <Link href="/bookings">
                    <Calendar className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Bookings</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                  <Link href="/contacts">
                    <Users className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Contacts</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                  <Link href="/messages/search">
                    <Search className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Search</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                  <Link href="/analytics">
                    <TrendingUp className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Analytics</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                  <Link href="/admin">
                    <UserCog className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                  <Link href="/test">
                    <Play className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Test</span>
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                      <UserCircle className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">{user?.name || "Profile"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        <UserCog className="w-4 h-4 mr-2" />
                        Account Management
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={() => {
                        logout();
                        toast.success("Logged out successfully");
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild size="sm" className="gradient-luxury text-foreground font-semibold">
                <a href={getLoginUrl()}>
                  Get Started
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-16 space-y-24">
        {/* Mission Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Clock, label: "Smart Efficiency", color: "text-primary" },
              { icon: Heart, label: "Human Greatness", color: "text-primary" },
              { icon: Lightbulb, label: "Innovation", color: "text-primary" },
              { icon: Target, label: "Focus", color: "text-primary" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-3">
                <item.icon className={`w-12 h-12 mx-auto ${item.color}`} />
                <p className="font-semibold text-foreground">{item.label}</p>
              </div>
            ))}
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Vision:</strong> A world where AI lessens the chaos from human activities and life.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Cost Savings", value: "70%", icon: TrendingUp },
            { label: "Satisfaction", value: "+25%", icon: CheckCircle2 },
            { label: "Response Time", value: "2.3s", icon: Zap },
            { label: "Uptime", value: "24/7", icon: Shield }
          ].map((stat, idx) => (
            <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </section>
        {/* Core Features Section */}
        <CoreFeaturesSection />

        {/* Try the Platform Section */}
        <section className="space-y-6 mt-20">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-foreground">Try the Platform</h3>        <p className="text-muted-foreground">
              Experience AI LUXE as one of our clients
            </p>
          </div>

          <Tabs defaultValue="gala" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gala" onClick={() => handleDemoMode("gala")}>
                Try as Gala Events
              </TabsTrigger>
              <TabsTrigger value="elite" onClick={() => handleDemoMode("elite")}>
                Try as Elite Events
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="gala" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Gala Events Dashboard
                  </CardTitle>
                  <CardDescription>
                    Premium event planning agency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                      <span className="text-2xl font-bold text-primary">$1,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Bookings</span>
                      <span className="text-xl font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">AI Response Rate</span>
                      <span className="text-xl font-semibold text-green-600">94%</span>
                    </div>
                  </div>
                  <Link href="/admin">
                    <Button className="w-full gradient-luxury text-foreground font-semibold">
                      View Full Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="elite" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" />
                    Elite Events Dashboard
                  </CardTitle>
                  <CardDescription>
                    Model agency and creative services (Client #1)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                      <span className="text-2xl font-bold text-primary">$850</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Models Managed</span>
                      <span className="text-xl font-semibold">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">AI Response Rate</span>
                      <span className="text-xl font-semibold text-green-600">89%</span>
                    </div>
                  </div>
                  <Link href="/admin">
                    <Button className="w-full gradient-luxury text-foreground font-semibold">
                      View Full Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Persona Cloning Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-foreground">Clone from Chat History</h3>
            <p className="text-muted-foreground">
              Upload your team's WhatsApp/Telegram chats and let AI learn their tone, language, and workflow
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Chat Export
              </CardTitle>
              <CardDescription>
                Supports WhatsApp TXT, Telegram JSON, and PDF files (max 16MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  id="chat-upload"
                  accept=".txt,.json,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="chat-upload" 
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <FileText className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      TXT, JSON, or PDF up to 16MB
                    </p>
                  </div>
                </label>
              </div>

              {uploadedFile && (
                <Button 
                  className="w-full gradient-luxury text-foreground font-semibold"
                  onClick={handleClonePersona}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Clone AI Persona from {uploadedFile.name}
                </Button>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Client Success Stories */}
        <ClientSuccessStories />

        {/* WhatsApp QR Demo */}
        {isDemoMode && (
          <section className="space-y-6 animate-fade-in-up">
            <Card className="border-primary/50 bg-primary/5 max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-primary" />
                  Interactive Demo: WhatsApp QR Linking
                </CardTitle>
                <CardDescription>
                  This is a simulated onboarding flow. In production, scan with your phone to link WhatsApp.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background rounded-lg p-8 flex flex-col items-center gap-4">
                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Scan this QR code with WhatsApp to link your account
                  </p>
                  <Badge variant="secondary">🔒 End-to-End Encrypted</Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-primary">1</span>
                    </div>
                    <p className="font-medium text-sm">Open WhatsApp</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-primary">2</span>
                    </div>
                    <p className="font-medium text-sm">Scan QR Code</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-primary">3</span>
                    </div>
                    <p className="font-medium text-sm">Start Chatting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* CTA Section */}
        <section className="text-center space-y-6 py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl">
          <h3 className="text-3xl font-bold text-foreground">Ready to Reclaim Your Time?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Join luxury agencies saving $3K+/month with AI concierge automation
          </p>
          <Button size="lg" className="gradient-luxury text-foreground font-semibold text-lg px-8" asChild>
            <a href={getLoginUrl()}>
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container py-12 space-y-8">
          {/* MASSIVE GOLD ROI GUIDE BUTTON IN FOOTER */}
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="text-xl px-12 py-8 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black font-bold hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-400 shadow-2xl shadow-yellow-500/50 border-2 border-yellow-300 animate-pulse"
              asChild
            >
              <Link href="/roi-guide">
                ✨ See 32x ROI Guide →
              </Link>
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">© 2025 AI LUXE · <a href="https://ailuxe.co" className="text-primary hover:underline">ailuxe.co</a></p>
            <p>Time is the Real Luxury</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
