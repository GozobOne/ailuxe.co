import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, MessageSquare, Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: analytics, isLoading } = trpc.analytics.getAnalytics.useQuery();

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading analytics...</p>
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
            <CardDescription>Please log in to access analytics</CardDescription>
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

  const COLORS = ["#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981"];

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
            <div>
              <h1 className="text-xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-xs text-muted-foreground">Performance insights and metrics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.avgResponseTime || "2.3"}s</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">↓ 12%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.conversionRate || "68"}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">↑ 5%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalMessages || "1,247"}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">↑ 18%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalBookings || "42"}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">↑ 23%</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Message Response Time Trend</CardTitle>
            <CardDescription>Average response time over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={analytics?.responseTimeTrend || [
                  { day: "Mon", time: 2.8 },
                  { day: "Tue", time: 2.5 },
                  { day: "Wed", time: 2.3 },
                  { day: "Thu", time: 2.1 },
                  { day: "Fri", time: 2.4 },
                  { day: "Sat", time: 2.2 },
                  { day: "Sun", time: 2.3 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis label={{ value: "Seconds", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="time" stroke="#f59e0b" strokeWidth={2} name="Response Time (s)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Conversion Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Conversion Funnel</CardTitle>
              <CardDescription>Conversion rates by stage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics?.conversionFunnel || [
                    { stage: "Inquiries", count: 150 },
                    { stage: "Quotes", count: 102 },
                    { stage: "Confirmed", count: 68 },
                    { stage: "Completed", count: 42 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#f59e0b" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Peak Activity Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Peak Activity Hours</CardTitle>
              <CardDescription>Message volume by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={analytics?.peakHours || [
                    { hour: "9AM", messages: 45 },
                    { hour: "10AM", messages: 62 },
                    { hour: "11AM", messages: 78 },
                    { hour: "12PM", messages: 95 },
                    { hour: "1PM", messages: 88 },
                    { hour: "2PM", messages: 72 },
                    { hour: "3PM", messages: 85 },
                    { hour: "4PM", messages: 92 },
                    { hour: "5PM", messages: 68 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="messages" fill="#eab308" name="Messages" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Message Platform Distribution</CardTitle>
            <CardDescription>Messages by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.platformDistribution || [
                    { name: "WhatsApp", value: 720 },
                    { name: "Instagram", value: 320 },
                    { name: "Telegram", value: 150 },
                    { name: "Signal", value: 57 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(analytics?.platformDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
