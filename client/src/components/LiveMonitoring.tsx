import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Calendar, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LiveMonitoring() {
  const { data: messages, isLoading: messagesLoading, refetch: refetchMessages } = trpc.monitoring.getRecentMessages.useQuery(
    undefined,
    {
      refetchInterval: 5000, // Poll every 5 seconds
    }
  );

  const { data: bookings, isLoading: bookingsLoading, refetch: refetchBookings } = trpc.monitoring.getRecentBookings.useQuery(
    undefined,
    {
      refetchInterval: 10000, // Poll every 10 seconds
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Monitoring</h2>
          <p className="text-sm text-muted-foreground">Real-time activity across all integrations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetchMessages()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Messages
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetchBookings()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Bookings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages ({messages?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <Calendar className="w-4 h-4 mr-2" />
            Bookings ({bookings?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          {messagesLoading ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Loading messages...
              </CardContent>
            </Card>
          ) : messages && messages.length > 0 ? (
            messages.map((msg) => (
              <Card key={msg.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={msg.direction === "inbound" ? "secondary" : "default"}>
                        {msg.direction === "inbound" ? "Received" : "Sent"}
                      </Badge>
                      <Badge variant="outline">{msg.platform}</Badge>
                      {msg.respondedBy && (
                        <Badge variant="outline" className="text-primary">
                          {msg.respondedBy}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{msg.content}</p>
                  {msg.responseTime && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Response time: {msg.responseTime}s
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No messages yet. Messages will appear here when WhatsApp bot receives them.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          {bookingsLoading ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Loading bookings...
              </CardContent>
            </Card>
          ) : bookings && bookings.length > 0 ? (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{booking.clientName || "Unknown Client"}</CardTitle>
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {booking.eventType} • {new Date(booking.eventDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {booking.clientEmail && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{booking.clientEmail}</span>
                      </div>
                    )}
                    {booking.budget && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Budget:</span>
                        <span>
                          {booking.budget} {booking.currency}
                        </span>
                      </div>
                    )}
                    {booking.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{booking.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Created: {new Date(booking.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No bookings yet. Bookings will appear here when created.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
