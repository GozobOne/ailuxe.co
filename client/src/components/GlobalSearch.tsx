import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, User, Calendar, MessageSquare, FileText, Settings } from "lucide-react";
import { useLocation } from "wouter";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: "personas" | "bookings" | "messages" | "clients" | "settings";
  url: string;
  icon: typeof User;
}

const SEARCH_CATEGORIES = {
  personas: { icon: User, label: "Personas", color: "text-purple-600" },
  bookings: { icon: Calendar, label: "Bookings", color: "text-blue-600" },
  messages: { icon: MessageSquare, label: "Messages", color: "text-green-600" },
  clients: { icon: User, label: "Clients", color: "text-amber-600" },
  settings: { icon: Settings, label: "Settings", color: "text-gray-600" },
};

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [, setLocation] = useLocation();

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      
      // ESC to close
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mock search function (replace with real tRPC query)
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Mock results - replace with real data
    const mockResults: SearchResult[] = [
      {
        id: "1",
        title: "Luxury Event Persona",
        description: "High-end event planning persona with formal tone",
        category: "personas",
        url: "/persona",
        icon: User,
      },
      {
        id: "2",
        title: "Upcoming Wedding Booking",
        description: "December 15, 2025 - Grand Ballroom",
        category: "bookings",
        url: "/bookings",
        icon: Calendar,
      },
      {
        id: "3",
        title: "Recent WhatsApp Messages",
        description: "5 new messages from clients",
        category: "messages",
        url: "/live",
        icon: MessageSquare,
      },
      {
        id: "4",
        title: "API Settings",
        description: "Configure WhatsApp, Google Calendar, and more",
        category: "settings",
        url: "/api-settings",
        icon: Settings,
      },
    ];

    // Filter results based on query
    const filtered = mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, performSearch]);

  const handleSelect = (result: SearchResult) => {
    setLocation(result.url);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm text-muted-foreground"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-muted rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-4 pt-4 pb-0">
            <DialogTitle className="sr-only">Global Search</DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center gap-2 px-4 pb-4 border-b">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search personas, bookings, messages, clients..."
              className="border-0 focus-visible:ring-0 text-lg"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {results.length === 0 && query ? (
              <div className="text-center py-8 text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Type to search across personas, bookings, messages, and more...
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((result) => {
                  const CategoryIcon = SEARCH_CATEGORIES[result.category].icon;
                  const categoryColor = SEARCH_CATEGORIES[result.category].color;
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0`}>
                        <CategoryIcon className={`w-5 h-5 ${categoryColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{result.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {result.description}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {SEARCH_CATEGORIES[result.category].label}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t bg-muted/50 text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border">Enter</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded border">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
