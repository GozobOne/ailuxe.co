import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, MessageSquare, Mic, Calendar, Scale, Link2, 
  Upload, Zap, Shield, Globe, TrendingUp, Users,
  FileText, Clock, DollarSign, BarChart3, Bell, Settings,
  Lock, Eye, Building2, Palette, CheckCircle2
} from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import GlobalSearch from "@/components/GlobalSearch";

const FEATURE_CATEGORIES = [
  {
    title: "AI & Automation",
    icon: Bot,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    features: [
      {
        name: "Persona Cloning",
        description: "Upload chat history (WhatsApp, Telegram, Instagram) and AI learns your unique communication style, tone, and personality in minutes.",
        icon: Bot,
        benefits: ["50-100 message samples needed", "Learns tone, style, vocabulary", "Maintains consistency across platforms"],
      },
      {
        name: "AI Response Generation",
        description: "Contextual responses based on your cloned persona, handling inquiries, negotiations, and bookings automatically.",
        icon: MessageSquare,
        benefits: ["2.3s average response time", "Handles 95% of routine inquiries", "Escalates complex cases to you"],
      },
      {
        name: "Fair Negotiator",
        description: "AI handles price negotiations intelligently within your defined thresholds, escalating only when needed.",
        icon: Scale,
        benefits: ["Set budget thresholds", "Auto-escalation rules", "Maintains profitability"],
      },
    ],
  },
  {
    title: "Multi-Platform Support",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    features: [
      {
        name: "WhatsApp Integration",
        description: "Connect via QR code or official Business API. End-to-end encrypted, supports text, voice, media.",
        icon: MessageSquare,
        benefits: ["E2E encryption", "Voice note support", "Media handling", "Status updates"],
      },
      {
        name: "Instagram DM",
        description: "Manage Instagram Direct Messages from unified inbox with automatic responses.",
        icon: Upload,
        benefits: ["Unified inbox", "Auto-responses", "Media support"],
      },
      {
        name: "Telegram Support",
        description: "Connect Telegram channels and groups for customer communication.",
        icon: MessageSquare,
        benefits: ["Bot integration", "Group management", "File sharing"],
      },
    ],
  },
  {
    title: "Voice & Transcription",
    icon: Mic,
    color: "text-green-600",
    bgColor: "bg-green-50",
    features: [
      {
        name: "Voice Note Transcription",
        description: "AI transcribes voice messages instantly using Whisper API with 95%+ accuracy.",
        icon: Mic,
        benefits: ["Supports 20+ languages", "Real-time transcription", "Speaker identification"],
      },
      {
        name: "Voice Response",
        description: "AI can respond in voice matching your persona's tone and style.",
        icon: Mic,
        benefits: ["Natural voice synthesis", "Persona-matched tone", "Multi-language support"],
      },
    ],
  },
  {
    title: "Smart Bookings & Calendar",
    icon: Calendar,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    features: [
      {
        name: "Google Calendar Sync",
        description: "Automatic calendar integration with conflict detection and availability checks.",
        icon: Calendar,
        benefits: ["Real-time sync", "Conflict detection", "Multi-calendar support"],
      },
      {
        name: "Automated Reminders",
        description: "Send WhatsApp reminders 48h, 24h, and 1h before events automatically.",
        icon: Bell,
        benefits: ["Reduces no-shows by 40%", "Customizable timing", "Multi-platform delivery"],
      },
      {
        name: "Contract Generation",
        description: "Auto-generate contracts in multiple languages (Arabic + English) with e-signature support.",
        icon: FileText,
        benefits: ["Multi-language templates", "E-signature integration", "PDF/DOCX export"],
      },
    ],
  },
  {
    title: "Security & Privacy",
    icon: Shield,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    features: [
      {
        name: "End-to-End Encryption",
        description: "All messages encrypted in transit and at rest. OAuth 2.0 with token rotation.",
        icon: Shield,
        benefits: ["E2E encryption", "OAuth 2.0", "Token rotation", "2FA support"],
      },
      {
        name: "Secure Credential Storage",
        description: "API keys and tokens stored encrypted in database with role-based access control.",
        icon: Lock,
        benefits: ["Encrypted storage", "RBAC", "Audit logs"],
      },
    ],
  },
  {
    title: "Analytics & Insights",
    icon: BarChart3,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    features: [
      {
        name: "Response Time Analytics",
        description: "Track AI response times, conversion rates, and peak activity hours.",
        icon: Clock,
        benefits: ["Real-time dashboards", "Trend analysis", "Performance metrics"],
      },
      {
        name: "Booking Conversion Tracking",
        description: "Monitor inquiry-to-booking conversion rates and revenue forecasts.",
        icon: TrendingUp,
        benefits: ["Conversion funnel", "Revenue tracking", "ROI calculator"],
      },
      {
        name: "Live Monitoring Dashboard",
        description: "Real-time view of incoming messages, AI responses, and booking activity.",
        icon: Eye,
        benefits: ["Real-time updates", "Message history", "Status tracking"],
      },
    ],
  },
  {
    title: "White-Label & Multi-Tenant",
    icon: Building2,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    features: [
      {
        name: "Custom Branding",
        description: "Upload logo, set colors, customize domain for each client.",
        icon: Palette,
        benefits: ["Logo upload", "Color customization", "Custom domains"],
      },
      {
        name: "Multi-Currency Support",
        description: "Support 150+ global currencies (USD, EUR, GBP, JPY, AED, SAR, etc.) with automatic formatting and real-time conversion.",
        icon: DollarSign,
        benefits: ["150+ currencies", "Auto-formatting", "Real-time conversion"],
      },
      {
        name: "Multi-Language Support",
        description: "20+ languages including Arabic (RTL), English, French, Spanish, and more.",
        icon: Globe,
        benefits: ["20+ languages", "RTL support", "Auto-translation"],
      },
    ],
  },
  {
    title: "Subscription & Billing",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
    features: [
      {
        name: "Trial Management",
        description: "Automatic trial tracking with expiry reminders and conversion to paid.",
        icon: Clock,
        benefits: ["Trial tracking", "Auto-reminders", "Conversion automation"],
      },
      {
        name: "Flexible Pricing",
        description: "Create custom plans, coupons, and pricing tiers per client.",
        icon: DollarSign,
        benefits: ["Custom plans", "Coupon codes", "Tiered pricing"],
      },
      {
        name: "MRR Tracking",
        description: "Monitor monthly recurring revenue across all clients.",
        icon: TrendingUp,
        benefits: ["Revenue dashboard", "Client breakdown", "Forecast charts"],
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">
              AI <span className="text-luxury">LUXE</span>
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <GlobalSearch />
            <Button 
              className="gradient-luxury text-foreground font-semibold"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container text-center">
          <Badge className="mb-4 gradient-luxury text-foreground">All Features</Badge>
          <h1 className="text-5xl font-bold mb-6">
            Everything You Need to <span className="text-luxury">Reclaim Your Time</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            AI LUXE provides a complete suite of tools to automate your luxury business operations,
            from AI-powered conversations to smart bookings and analytics.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="gradient-luxury text-foreground font-bold"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Start Free Trial →
            </Button>
            <Link href="/roi-guide">
              <Button size="lg" variant="outline">
                See 32x ROI Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container space-y-20">
          {FEATURE_CATEGORIES.map((category, catIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div key={catIndex}>
                <div className="flex items-center gap-3 mb-8">
                  <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                    <CategoryIcon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h2 className="text-3xl font-bold">{category.title}</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.features.map((feature, featureIndex) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <Card 
                        key={featureIndex}
                        className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-luxury/50"
                      >
                        <CardHeader>
                          <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <FeatureIcon className={`w-6 h-6 ${category.color}`} />
                          </div>
                          <CardTitle className="text-xl">{feature.name}</CardTitle>
                          <CardDescription className="text-base">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-muted-foreground">Key Benefits:</p>
                            <ul className="space-y-1">
                              {feature.benefits.map((benefit, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-luxury flex-shrink-0 mt-0.5" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience <span className="text-luxury">AI LUXE</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join luxury agencies saving $3K+/month with AI concierge automation.
            Start your free trial today.
          </p>
          <Button 
            size="lg" 
            className="gradient-luxury text-foreground font-bold text-lg px-8 py-6"
            onClick={() => window.location.href = getLoginUrl()}
          >
            Start Free Trial - No Credit Card Required →
          </Button>
        </div>
      </section>
    </div>
  );
}
