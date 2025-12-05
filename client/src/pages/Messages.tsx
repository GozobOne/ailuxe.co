import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Send, Bot, User, MessageSquare, Instagram, Linkedin, Twitter } from "lucide-react";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";

interface Message {
  id: string;
  conversationId: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
  platform: "whatsapp" | "instagram" | "telegram" | "linkedin" | "twitter";
}

interface Conversation {
  id: string;
  clientName: string;
  clientAvatar?: string;
  platform: "whatsapp" | "instagram" | "telegram" | "linkedin" | "twitter";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: "active" | "pending" | "resolved";
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    clientName: "Sarah Al-Mansour",
    platform: "whatsapp",
    lastMessage: "Thank you! Looking forward to the event.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 0,
    status: "active",
  },
  {
    id: "2",
    clientName: "Mohammed Al-Rashid",
    platform: "instagram",
    lastMessage: "What's the pricing for 200 guests?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 2,
    status: "pending",
  },
  {
    id: "3",
    clientName: "Layla Hassan",
    platform: "telegram",
    lastMessage: "Perfect! I'll send the deposit today.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 0,
    status: "resolved",
  },
  {
    id: "4",
    clientName: "Khalid Al-Sabah",
    platform: "linkedin",
    lastMessage: "Can we schedule a call?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 45),
    unreadCount: 1,
    status: "pending",
  },
  {
    id: "5",
    clientName: "Fatima Al-Thani",
    platform: "twitter",
    lastMessage: "Interested in your luxury wedding packages",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
    unreadCount: 3,
    status: "pending",
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    conversationId: "1",
    sender: "user",
    content: "Hi! I'm interested in booking your venue for a corporate event in March.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    platform: "whatsapp",
  },
  {
    id: "2",
    conversationId: "1",
    sender: "bot",
    content: "Hello! Thank you for your interest. I'd be happy to help you with that. How many guests are you expecting?",
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    platform: "whatsapp",
  },
  {
    id: "3",
    conversationId: "1",
    sender: "user",
    content: "Around 150 people. Do you have availability on March 15th?",
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    platform: "whatsapp",
  },
  {
    id: "4",
    conversationId: "1",
    sender: "bot",
    content: "Yes! March 15th is available. For 150 guests, we have our Grand Ballroom which can accommodate up to 200 people. The package starts at $12,000 and includes venue, catering, and basic decor. Would you like to schedule a site visit?",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    platform: "whatsapp",
  },
  {
    id: "5",
    conversationId: "1",
    sender: "user",
    content: "That sounds perfect! Yes, I'd love to visit. What times are available this week?",
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    platform: "whatsapp",
  },
  {
    id: "6",
    conversationId: "1",
    sender: "bot",
    content: "Great! I have availability on Thursday at 2 PM or Friday at 11 AM. Which works better for you?",
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    platform: "whatsapp",
  },
  {
    id: "7",
    conversationId: "1",
    sender: "user",
    content: "Friday at 11 AM works perfectly!",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    platform: "whatsapp",
  },
  {
    id: "8",
    conversationId: "1",
    sender: "bot",
    content: "Excellent! I've booked you for Friday, March 8th at 11:00 AM. I'll send you a calendar invite and the venue address. Thank you! Looking forward to the event.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    platform: "whatsapp",
  },
];

const platformIcons = {
  whatsapp: FaWhatsapp,
  instagram: Instagram,
  telegram: FaTelegram,
  linkedin: Linkedin,
  twitter: Twitter,
};

const platformColors = {
  whatsapp: "text-green-500",
  instagram: "text-pink-500",
  telegram: "text-blue-500",
  linkedin: "text-blue-600",
  twitter: "text-sky-500",
};

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "resolved">("all");

  const filteredConversations = mockConversations.filter(conv => {
    const matchesSearch = conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || conv.status === filter;
    return matchesSearch && matchesFilter;
  });

  const currentMessages = selectedConversation
    ? mockMessages.filter(msg => msg.conversationId === selectedConversation)
    : [];

  const currentConversation = mockConversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // In production, this would send the message via API
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-8 w-8 text-luxury" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury to-yellow-400 bg-clip-text text-transparent">
            Message Hub
          </h1>
        </div>
        <p className="text-muted-foreground">
          Unified inbox for all platforms · AI-powered responses · Real-time sync
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-8rem)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 border-luxury/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <CardDescription>
              {mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} unread messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="resolved">Done</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Conversation List */}
            <ScrollArea className="h-[calc(100vh-28rem)]">
              <div className="space-y-2">
                {filteredConversations.map((conv) => {
                  const PlatformIcon = platformIcons[conv.platform];
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation === conv.id
                          ? "bg-luxury/10 border border-luxury/30"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{conv.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm truncate">{conv.clientName}</p>
                            <PlatformIcon className={`h-4 w-4 ${platformColors[conv.platform]}`} />
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">{formatTime(conv.lastMessageTime)}</span>
                            {conv.unreadCount > 0 && (
                              <Badge variant="default" className="bg-luxury text-black h-5 px-2">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2 border-luxury/20">
          {currentConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{currentConversation.clientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{currentConversation.clientName}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {React.createElement(platformIcons[currentConversation.platform], {
                          className: `h-3 w-3 ${platformColors[currentConversation.platform]}`,
                        })}
                        <span className="capitalize">{currentConversation.platform}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={currentConversation.status === "active" ? "default" : "secondary"}>
                    {currentConversation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <ScrollArea className="h-[calc(100vh-24rem)] p-4">
                  <div className="space-y-4">
                    {currentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === "bot" ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {msg.sender === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 ${msg.sender === "bot" ? "text-right" : ""}`}>
                          <div
                            className={`inline-block max-w-[80%] rounded-lg p-3 ${
                              msg.sender === "bot"
                                ? "bg-luxury text-black"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} className="bg-luxury hover:bg-luxury/90 text-black">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 AI is handling this conversation. You can take over anytime.
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
