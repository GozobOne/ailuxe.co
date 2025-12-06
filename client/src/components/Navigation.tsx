import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Bot,
  Settings,
  MessageSquare,
  Calendar,
  BarChart3,
  Zap,
  Palette,
  FileText,
  HelpCircle,
  Menu,
  X,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils"; // Ensure utils exist or use standard class string

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Personas", path: "/personas" },
    { icon: Bot, label: "Bot Config", path: "/bot" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Calendar, label: "Bookings", path: "/bookings" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Zap, label: "Integrations", path: "/integrations" },
    { icon: Settings, label: "API Settings", path: "/api-settings" },
    { icon: Palette, label: "White Label", path: "/white-label" },
    { icon: FileText, label: "Templates", path: "/templates" },
    { icon: HelpCircle, label: "Help", path: "/help" },
  ];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  // Sidebar Component (Reusable)
  const SidebarContent = () => (
    <div className="h-full flex flex-col p-6 bg-black/40 backdrop-blur-xl border-r border-[#D4AF37]/30 text-white overflow-y-auto w-[280px]">
      {/* User Info */}
      <div className="mb-8 p-4 rounded-xl border border-[#D4AF37]/50 bg-[#D4AF37]/10 flex flex-col items-center text-center shadow-[0_0_15px_rgba(212,175,55,0.1)]">
        <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-black text-2xl font-bold mb-3 shadow-lg">
          {user?.name?.[0] || 'U'}
        </div>
        <div className="font-playfair text-lg font-bold text-[#D4AF37]">{user?.name || 'User'}</div>
        <div className="text-xs text-gray-400 mt-1">{user?.email}</div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
            <button
              key={index}
              onClick={() => {
                setLocation(item.path);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive
                  ? "bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                  : "hover:bg-white/5 hover:text-[#D4AF37] border border-transparent"
              )}
            >
              <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "text-[#D4AF37]")} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_5px_#D4AF37]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent my-6" />

      {/* Bottom Actions */}
      <div className="space-y-2">
        <button
          onClick={() => {
            setLocation("/profile");
            setIsOpen(false);
          }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/5 hover:text-[#D4AF37] group text-gray-300"
        >
          <User size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">Profile</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 group text-red-500/80 border border-transparent hover:border-red-500/30"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-[10px] text-gray-500 font-mono">
        <div className="mb-2 space-x-3">
          <a href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms</a>
          <a href="/policy" className="hover:text-[#D4AF37] transition-colors">Privacy</a>
        </div>
        <div>© 2025 AI LUXE</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button - Visible only on mobile/tablet */}
      <div className="lg:hidden fixed top-5 left-5 z-[50]">
        <div className="bg-black/50 backdrop-blur-md p-1 rounded-lg border border-[#D4AF37]/30">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-md transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[49]">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Persistent */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 z-40 bg-black">
        <SidebarContent />
      </div>
    </>
  );
}
