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

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: '#D4AF37',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isOpen ? <X size={24} color="#000" /> : <Menu size={24} color="#000" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 998
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-100%',
          width: 'min(320px, 80vw)',
          height: '100vh',
          background: '#000000',
          borderLeft: '2px solid #D4AF37',
          zIndex: 999,
          transition: 'right 0.3s ease',
          overflowY: 'auto',
          padding: '80px 20px 20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* User Info */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '2px solid #D4AF37',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#D4AF37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#000'
          }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '5px'
          }}>
            {user?.name || 'User'}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#999999'
          }}>
            {user?.email}
          </div>
        </div>

        {/* Menu Items */}
        <nav>
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
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px 20px',
                  marginBottom: '8px',
                  background: isActive ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                  border: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                  borderRadius: '8px',
                  color: isActive ? '#D4AF37' : '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{
          height: '2px',
          background: 'rgba(255, 255, 255, 0.1)',
          margin: '30px 0'
        }} />

        {/* Bottom Actions */}
        <div>
          <button
            onClick={() => {
              setLocation("/profile");
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px 20px',
              marginBottom: '8px',
              background: 'transparent',
              border: '2px solid transparent',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <User size={20} />
            Profile
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px 20px',
              background: 'transparent',
              border: '2px solid #EF4444',
              borderRadius: '8px',
              color: '#EF4444',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#666666'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <a href="/terms" style={{ color: '#999999', textDecoration: 'none', marginRight: '15px' }}>
              Terms
            </a>
            <a href="/policy" style={{ color: '#999999', textDecoration: 'none' }}>
              Privacy
            </a>
          </div>
          <div>
            © 2025 AI LUXE. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}
