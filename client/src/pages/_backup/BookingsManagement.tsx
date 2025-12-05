import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  FileText, 
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Plus,
  Download,
  Send,
  DollarSign,
  Bell
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function BookingsManagement() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"bookings" | "contracts">("bookings");

  // Simulated bookings data
  const bookings = [
    {
      id: 1,
      clientName: "Sarah Al-Mutawa",
      eventType: "Fashion Shoot",
      eventDate: "2025-11-20T10:00:00",
      location: "Downtown Studio",
      budget: 300,
      status: "confirmed",
      contractStatus: "signed",
      remindersSent: ["48h", "24h"],
    },
    {
      id: 2,
      clientName: "Mohammed Al-Sabah",
      eventType: "Corporate Event",
      eventDate: "2025-11-22T14:00:00",
      location: "Sheraton Hotel",
      budget: 850,
      status: "pending",
      contractStatus: "sent",
      remindersSent: [],
    },
    {
      id: 3,
      clientName: "Layla Hassan",
      eventType: "Wedding Photography",
      eventDate: "2025-11-25T18:00:00",
      location: "Four Seasons",
      budget: 1200,
      status: "confirmed",
      contractStatus: "signed",
      remindersSent: ["48h"],
    },
  ];

  // Simulated contracts data
  const contracts = [
    {
      id: 1,
      bookingId: 1,
      type: "service",
      language: "english",
      status: "signed",
      createdAt: "2025-11-10",
      signedAt: "2025-11-11",
    },
    {
      id: 2,
      bookingId: 2,
      type: "nda",
      language: "arabic",
      status: "sent",
      createdAt: "2025-11-12",
      signedAt: null,
    },
    {
      id: 3,
      bookingId: 3,
      type: "service",
      language: "english",
      status: "signed",
      createdAt: "2025-11-13",
      signedAt: "2025-11-14",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any }> = {
      confirmed: { variant: "default", icon: CheckCircle2 },
      pending: { variant: "secondary", icon: Clock },
      cancelled: { variant: "destructive", icon: XCircle },
      completed: { variant: "outline", icon: CheckCircle2 },
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleCreateBooking = () => {
    toast.info("Create Booking", {
      description: "This will open a form to create a new booking with calendar sync"
    });
  };

  const handleSendReminder = (bookingId: number) => {
    toast.success("Reminder sent!", {
      description: `Manual reminder sent for booking #${bookingId}`
    });
  };

  const handleGenerateContract = (bookingId: number, type: string) => {
    toast.info("Generating contract...", {
      description: `Creating ${type} contract in Arabic and English`
    });
    
    setTimeout(() => {
      toast.success("Contract generated!", {
        description: "PDF sent to client for e-signature"
      });
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to manage bookings</CardDescription>
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
              <h1 className="text-xl font-bold text-foreground">Bookings & Contracts</h1>
              <p className="text-xs text-muted-foreground">Manage events and legal documents</p>
            </div>
          </div>
          <Button className="gradient-luxury text-foreground font-semibold" onClick={handleCreateBooking}>
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </header>

      <main className="container py-12 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "text-primary" },
            { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, icon: CheckCircle2, color: "text-green-600" },
            { label: "Contracts Signed", value: contracts.filter(c => c.status === "signed").length, icon: FileText, color: "text-blue-600" },
            { label: "Revenue (USD)", value: bookings.reduce((sum, b) => sum + b.budget, 0), icon: DollarSign, color: "text-primary" },
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

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="bookings">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="contracts">
              <FileText className="w-4 h-4 mr-2" />
              Contracts
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4 mt-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{booking.clientName}</CardTitle>
                      <CardDescription>{booking.eventType} • {booking.location}</CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Event Date</p>
                      <p className="font-medium">
                        {new Date(booking.eventDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium text-primary">${booking.budget}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Contract</p>
                      <Badge variant={booking.contractStatus === "signed" ? "default" : "secondary"}>
                        {booking.contractStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Auto-Reminders</p>
                    <div className="flex gap-2">
                      {["48h", "24h", "1h"].map((time) => (
                        <Badge 
                          key={time}
                          variant={booking.remindersSent.includes(time) ? "default" : "outline"}
                        >
                          {booking.remindersSent.includes(time) ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => handleSendReminder(booking.id)}>
                      <Bell className="w-4 h-4 mr-2" />
                      Send Reminder
                    </Button>
                    {booking.contractStatus !== "signed" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleGenerateContract(booking.id, "service")}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Contract
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      View in Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-4 mt-6">
            {contracts.map((contract) => {
              const booking = bookings.find(b => b.id === contract.bookingId);
              return (
                <Card key={contract.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          {contract.type.toUpperCase()} Contract
                        </CardTitle>
                        <CardDescription>
                          {booking?.clientName} • {contract.language === "arabic" ? "العربية" : "English"}
                        </CardDescription>
                      </div>
                      <Badge variant={contract.status === "signed" ? "default" : "secondary"}>
                        {contract.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">{new Date(contract.createdAt).toLocaleDateString()}</p>
                      </div>
                      {contract.signedAt && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Signed</p>
                          <p className="font-medium text-green-600">{new Date(contract.signedAt).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium capitalize">{contract.type}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      {contract.status !== "signed" && (
                        <Button size="sm" variant="outline">
                          <Send className="w-4 h-4 mr-2" />
                          Resend for Signature
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Contract Templates Info */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Available Contract Templates</CardTitle>
            <CardDescription>Professional legal documents in multiple languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { type: "Service Agreement", desc: "Standard service terms and payment conditions" },
                { type: "NDA (Non-Disclosure)", desc: "Confidentiality and data protection" },
                { type: "Non-Compete", desc: "Exclusivity and competition restrictions" },
              ].map((template, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <p className="font-medium">{template.type}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
