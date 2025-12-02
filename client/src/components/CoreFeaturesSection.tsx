import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, Mic, Calendar, Scale, Link2 } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

const CORE_FEATURES: Array<{
  icon: any;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  route: string;
}> = [
  {
    icon: Bot,
    title: "Persona Cloning",
    description: "Upload chat history and let AI learn your unique communication style, tone, and personality in minutes.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    route: "/persona",
  },
  {
    icon: MessageSquare,
    title: "Multi-Platform Support",
    description: "Connect WhatsApp, Instagram DMs, and Telegram. Manage all conversations from one unified inbox.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    route: "/bot",
  },
  {
    icon: Mic,
    title: "Voice Notes",
    description: "AI transcribes voice messages instantly and responds in text or voice, matching your persona perfectly.",
    color: "text-green-600",
    bgColor: "bg-green-50",
    route: "/bot",
  },
  {
    icon: Calendar,
    title: "Smart Bookings",
    description: "Automatic calendar sync, conflict detection, and contract generation. Book events seamlessly via chat.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    route: "/bookings",
  },
  {
    icon: Scale,
    title: "Fair Negotiator",
    description: "AI handles price negotiations intelligently, escalating to you only when budgets exceed your thresholds.",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    route: "/test",
  },
  {
    icon: Link2,
    title: "Secure Linking",
    description: "End-to-end encrypted connections with 2FA. Your data stays private with OAuth 2.0 and token rotation.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    route: "/admin/api-settings",
  },
];

export default function CoreFeaturesSection() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleTryNow = (route: string) => {
    if (isAuthenticated) {
      setLocation(route);
    } else {
      // Pass intended route to login, so user is redirected there after auth
      window.location.href = getLoginUrl(route);
    }
  };
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Core <span className="text-luxury">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to reclaim your time and scale your luxury business with AI
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CORE_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-luxury/50"
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    className="w-full gradient-luxury-border hover:gradient-luxury text-foreground font-semibold group-hover:shadow-md transition-all"
                    onClick={() => handleTryNow(feature.route)}
                  >
                    Try Now →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="gradient-luxury text-foreground font-bold text-lg px-8 py-6 hover:shadow-2xl transition-all"
            onClick={() => window.location.href = getLoginUrl()}
          >
            Get Started - Free Trial →
          </Button>
        </div>
      </div>
    </section>
  );
}
