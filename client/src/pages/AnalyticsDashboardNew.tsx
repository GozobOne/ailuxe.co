import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  BarChart3, 
  Download,
  Loader2,
  DollarSign,
  TrendingDown,
  Activity,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
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
  Cell
} from "recharts";
import { useState } from "react";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsDashboardNew() {
  const { user, isAuthenticated } = useAuth();
  const [days, setDays] = useState(30);

  // Get analytics data
  const { data: analyticsData, isLoading } = trpc.analytics.data.useQuery(
    { days },
    { enabled: isAuthenticated }
  );

  // Get revenue forecast
  const { data: revenueForecast } = trpc.analytics.revenueForecast.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const handleExportCSV = () => {
    if (!analyticsData) {
      toast.error("No analytics data to export");
      return;
    }
    
    try {
      // Create CSV content
      let csv = "AI LUXE Analytics Export\n";
      csv += `Generated: ${new Date().toLocaleString()}\n`;
      csv += `Period: Last ${days} days\n\n`;
      
      // Key Metrics Summary
      csv += "Key Metrics\n";
      csv += "Metric,Value\n";
      csv += `Average Response Time,${analyticsData.avgResponseTime?.toFixed(2) || 0} seconds\n`;
      csv += `Total Messages,${analyticsData.totalMessages || 0}\n`;
      csv += `Total Bookings,${analyticsData.totalBookings || 0}\n`;
      csv += `Conversion Rate,${analyticsData.conversionRate?.toFixed(2) || 0}%\n\n`;
      
      // Response Time Trend
      csv += "Response Time Trend\n";
      csv += "Date,Avg Response Time (seconds),Message Count\n";
      analyticsData.responseTimeTrend?.forEach((item: any) => {
        csv += `${item.date},${item.avgResponseTime || 0},${item.count}\n`;
      });
      
      // Volume by Platform
      csv += "\nMessage Volume by Platform\n";
      csv += "Platform,Total Messages,Inbound,Outbound\n";
      analyticsData.volumeByPlatform?.forEach((item: any) => {
        csv += `${item.platform},${item.count},${item.inbound},${item.outbound}\n`;
      });
      
      // Peak Hours
      csv += "\nPeak Activity Hours\n";
      csv += "Hour,Message Count\n";
      analyticsData.peakHours?.forEach((item: any) => {
        csv += `${item.hour}:00,${item.count}\n`;
      });
      
      // Message Types
      csv += "\nMessage Type Distribution\n";
      csv += "Type,Count\n";
      analyticsData.messageTypes?.forEach((item: any) => {
        csv += `${item.type},${item.count}\n`;
      });
      
      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ailuxe-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Analytics exported successfully");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export analytics");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view analytics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="w-8 h-8" />
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into your messaging performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="response">Response Time</TabsTrigger>
              <TabsTrigger value="volume">Message Volume</TabsTrigger>
              <TabsTrigger value="activity">Peak Hours</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Forecast</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Messages</p>
                        <div className="text-2xl font-bold">
                          {analyticsData?.volumeByPlatform?.reduce((acc: number, p: any) => acc + p.count, 0) || 0}
                        </div>
                      </div>
                      <MessageSquare className="w-8 h-8 text-primary opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Response</p>
                        <div className="text-2xl font-bold">
                          {analyticsData?.responseTimeTrend?.[0]?.avgResponseTime 
                            ? `${Math.round(analyticsData.responseTimeTrend[0].avgResponseTime / 60)}m`
                            : 'N/A'}
                        </div>
                      </div>
                      <Clock className="w-8 h-8 text-blue-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Peak Hour</p>
                        <div className="text-2xl font-bold">
                          {analyticsData?.peakHours?.reduce((max: any, curr: any) => 
                            curr.count > (max?.count || 0) ? curr : max, null)?.hour || 'N/A'}:00
                        </div>
                      </div>
                      <Activity className="w-8 h-8 text-green-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Platforms</p>
                        <div className="text-2xl font-bold">
                          {analyticsData?.volumeByPlatform?.length || 0}
                        </div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Message Volume by Platform</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analyticsData?.volumeByPlatform && analyticsData.volumeByPlatform.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analyticsData.volumeByPlatform}
                            dataKey="count"
                            nameKey="platform"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {analyticsData.volumeByPlatform.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-lg font-medium">No platform data available</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Data will appear here once messages are recorded
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Message Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analyticsData?.typeDistribution && analyticsData.typeDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.typeDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="messageType" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12">
                        <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-lg font-medium">No message type data available</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Data will appear here once messages are recorded
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Response Time Tab */}
            <TabsContent value="response" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Time Trend</CardTitle>
                  <CardDescription>Average response time over the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData?.responseTimeTrend && analyticsData.responseTimeTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={[...analyticsData.responseTimeTrend].reverse()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="avgResponseTime" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Avg Response Time (s)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-lg font-medium">No response time data available</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Data will appear here once messages are recorded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Volume Tab */}
            <TabsContent value="volume" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Message Volume by Platform</CardTitle>
                  <CardDescription>Inbound vs Outbound messages across platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData?.volumeByPlatform && analyticsData.volumeByPlatform.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={analyticsData.volumeByPlatform}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="platform" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="inbound" fill="#10b981" name="Inbound" />
                        <Bar dataKey="outbound" fill="#3b82f6" name="Outbound" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12">
                      <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-lg font-medium">No volume data available</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Data will appear here once messages are recorded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Peak Hours Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Peak Activity Hours</CardTitle>
                  <CardDescription>Message distribution throughout the day (24-hour format)</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData?.peakHours && analyticsData.peakHours.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={analyticsData.peakHours}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="hour" 
                          label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis label={{ value: 'Messages', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8b5cf6" name="Message Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-lg font-medium">No peak hours data available</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Data will appear here once messages are recorded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revenue Forecast Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecast</CardTitle>
                  <CardDescription>AI-powered revenue predictions based on historical data</CardDescription>
                </CardHeader>
                <CardContent>
                  {revenueForecast?.actualRevenue && revenueForecast.actualRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={revenueForecast.actualRevenue.reverse()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Actual Revenue"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12">
                      <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-lg font-medium">No revenue data available</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Revenue data will appear here once transactions are recorded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Forecast Cards */}
              {revenueForecast?.forecasts && revenueForecast.forecasts.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4">
                  {revenueForecast.forecasts.slice(0, 3).map((forecast: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(forecast.forecastMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </p>
                          {forecast.confidence > 0.7 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-2xl font-bold mb-1">
                          ${forecast.forecastedAmount?.toLocaleString() || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Confidence: {Math.round((forecast.confidence || 0) * 100)}%
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
