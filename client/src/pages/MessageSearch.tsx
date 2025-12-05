import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MessageSquare, Calendar, ArrowDown, ArrowUp, FileText, Mic, Image as ImageIcon, FileIcon, Loader2, Download, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function MessageSearch() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [platform, setPlatform] = useState<"whatsapp" | "telegram" | "signal" | undefined>();
  const [messageType, setMessageType] = useState<"text" | "voice" | "image" | "document" | undefined>();
  const [direction, setDirection] = useState<"inbound" | "outbound" | undefined>();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleExportCSV = () => {
    if (!searchResults || searchResults.length === 0) {
      toast.error("No messages to export");
      return;
    }

    // Create CSV content
    let csv = "Date,Platform,Direction,Type,Content,From,To,Response Time\n";
    searchResults.forEach((msg: any) => {
      const content = msg.content ? msg.content.replace(/\n/g, ' ').replace(/,/g, ';') : `${msg.messageType} message`;
      csv += `"${new Date(msg.createdAt).toLocaleString()}","${msg.platform}","${msg.direction}","${msg.messageType}","${content}","${msg.fromNumber || ''}","${msg.toNumber || ''}","${msg.responseTime ? Math.round(msg.responseTime / 60) + 'm' : 'N/A'}"\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `message-search-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Messages exported successfully");
  };

  // Search messages
  const { data: searchResults, isLoading, refetch } = trpc.messageSearch.search.useQuery(
    {
      query: searchQuery || undefined,
      platform,
      messageType,
      direction,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    },
    { enabled: isAuthenticated }
  );

  // Get message stats
  const { data: stats } = trpc.messageSearch.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleSearch = () => {
    refetch();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPlatform(undefined);
    setMessageType(undefined);
    setDirection(undefined);
    setDateFrom("");
    setDateTo("");
  };

  const getPlatformBadge = (platform: string) => {
    const colors = {
      whatsapp: "bg-green-500",
      telegram: "bg-blue-500",
      signal: "bg-primary",
    };
    return (
      <Badge className={`${colors[platform as keyof typeof colors]} text-white`}>
        {platform}
      </Badge>
    );
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="w-4 h-4" />;
      case "voice":
        return <Mic className="w-4 h-4" />;
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "document":
        return <FileIcon className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to search messages</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Search className="w-8 h-8" />
              Message Search
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Search across all your messages with advanced filters
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.totalMessages}</div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {stats.avgResponseTime ? `${Math.round(stats.avgResponseTime / 60)}m` : "N/A"}
                </div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {stats.byPlatform?.find((p: any) => p.platform === "whatsapp")?.count || 0}
                </div>
                <p className="text-sm text-muted-foreground">WhatsApp Messages</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {stats.byType?.find((t: any) => t.messageType === "voice")?.count || 0}
                </div>
                <p className="text-sm text-muted-foreground">Voice Messages</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Search
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">Platform</label>
                  <select
                    value={platform || ""}
                    onChange={(e) => setPlatform(e.target.value as any || undefined)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">All Platforms</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telegram">Telegram</option>
                    <option value="signal">Signal</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message Type</label>
                  <select
                    value={messageType || ""}
                    onChange={(e) => setMessageType(e.target.value as any || undefined)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">All Types</option>
                    <option value="text">Text</option>
                    <option value="voice">Voice</option>
                    <option value="image">Image</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Direction</label>
                  <select
                    value={direction || ""}
                    onChange={(e) => setDirection(e.target.value as any || undefined)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">All Directions</option>
                    <option value="inbound">Inbound</option>
                    <option value="outbound">Outbound</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Date To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        <Card>
          <CardHeader>
            <CardTitle>
              Search Results
              {searchResults && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({searchResults.length} messages)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults && searchResults.length > 0 ? (
                searchResults.map((message: any) => (
                  <div key={message.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getPlatformBadge(message.platform)}
                        <Badge variant={message.direction === "inbound" ? "secondary" : "outline"}>
                          {message.direction === "inbound" ? (
                            <ArrowDown className="w-3 h-3 mr-1" />
                          ) : (
                            <ArrowUp className="w-3 h-3 mr-1" />
                          )}
                          {message.direction}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getMessageTypeIcon(message.messageType)}
                          {message.messageType}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      {message.content ? (
                        <p>{highlightMatch(message.content, searchQuery)}</p>
                      ) : message.transcription ? (
                        <p className="text-muted-foreground italic">
                          {highlightMatch(message.transcription, searchQuery)}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          {message.messageType} message (no text content)
                        </p>
                      )}
                    </div>
                    {message.mediaUrl && (
                      <div className="mt-2">
                        <a
                          href={message.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          View Media
                        </a>
                      </div>
                    )}
                    {message.respondedBy && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Responded by: {message.respondedBy}
                        {message.responseTime && ` (${Math.round(message.responseTime / 60)}m)`}
                      </div>
                    )}
                  </div>
                ))
              ) : isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Searching messages...</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg font-medium">No messages found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search query or filters
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
