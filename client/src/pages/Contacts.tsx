import { useState } from "react";

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");

  // Mock data - will be replaced with real Supabase data
  const contacts = [
    {
      id: 1,
      name: "Sarah Al-Mansour",
      platform: "WhatsApp",
      phone: "+971 50 123 4567",
      email: "sarah@eliteevents.ae",
      lastMessage: "2 hours ago",
      totalMessages: 247,
      status: "Active",
      tags: ["VIP", "Wedding Planner"]
    },
    {
      id: 2,
      name: "Mohammed Al-Rashid",
      platform: "Telegram",
      phone: "+971 55 987 6543",
      email: "mohammed@galaevents.com",
      lastMessage: "1 day ago",
      totalMessages: 156,
      status: "Active",
      tags: ["Corporate", "High Budget"]
    },
    {
      id: 3,
      name: "Layla Hassan",
      platform: "Instagram",
      phone: "+971 52 456 7890",
      email: "layla@luxuryweddings.ae",
      lastMessage: "3 days ago",
      totalMessages: 89,
      status: "Prospect",
      tags: ["Fashion", "Influencer"]
    },
    {
      id: 4,
      name: "Khalid Al-Sabah",
      platform: "WhatsApp",
      phone: "+971 56 234 5678",
      email: "khalid@fashionforward.ae",
      lastMessage: "1 week ago",
      totalMessages: 45,
      status: "Lead",
      tags: ["Fashion Week", "New Client"]
    }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phone.includes(searchQuery);
    const matchesPlatform = platformFilter === "all" || contact.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const platformColors = {
    WhatsApp: "#25D366",
    Telegram: "#0088cc",
    Instagram: "#E4405F",
    LinkedIn: "#0077B5"
  };

  const statusColors = {
    Active: "#10b981",
    Prospect: "#f59e0b",
    Lead: "#3b82f6",
    Past: "#6b7280"
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '10px'
        }}>
          <div style={{
            fontSize: '40px'
          }}>👥</div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontWeight: '700'
          }}>
            Contacts
          </h1>
        </div>
        <p style={{
          color: '#9CA3AF',
          fontSize: '16px',
          margin: 0
        }}>
          Manage all your contacts across WhatsApp, Telegram, Instagram, and more
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {[
          { label: 'Total Contacts', value: '247', icon: '👥', color: '#D4AF37' },
          { label: 'Active', value: '189', icon: '✅', color: '#10b981' },
          { label: 'Prospects', value: '34', icon: '🎯', color: '#f59e0b' },
          { label: 'This Month', value: '+23', icon: '📈', color: '#3b82f6' }
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{stat.icon}</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: stat.color,
              marginBottom: '5px'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#9CA3AF'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 30px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="🔍 Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: '1',
            minWidth: '250px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#FFFFFF',
            fontSize: '16px',
            outline: 'none'
          }}
        />
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#FFFFFF',
            fontSize: '16px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Platforms</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Telegram">Telegram</option>
          <option value="Instagram">Instagram</option>
          <option value="LinkedIn">LinkedIn</option>
        </select>
        <button style={{
          background: '#D4AF37',
          color: '#000000',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          ➕ Add Contact
        </button>
      </div>

      {/* Contacts Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filteredContacts.map(contact => (
          <div key={contact.id} style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#D4AF37';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            {/* Contact Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '15px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  margin: '0 0 5px 0'
                }}>
                  {contact.name}
                </h3>
                <div style={{
                  display: 'inline-block',
                  background: platformColors[contact.platform],
                  color: '#FFFFFF',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {contact.platform}
                </div>
              </div>
              <div style={{
                background: statusColors[contact.status],
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {contact.status}
              </div>
            </div>

            {/* Contact Info */}
            <div style={{
              marginBottom: '15px',
              fontSize: '14px',
              color: '#9CA3AF'
            }}>
              <div style={{ marginBottom: '8px' }}>📞 {contact.phone}</div>
              <div style={{ marginBottom: '8px' }}>📧 {contact.email}</div>
              <div>💬 {contact.totalMessages} messages • Last: {contact.lastMessage}</div>
            </div>

            {/* Tags */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '15px'
            }}>
              {contact.tags.map((tag, idx) => (
                <span key={idx} style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#D4AF37',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <button style={{
                flex: 1,
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#D4AF37',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                💬 Message
              </button>
              <button style={{
                flex: 1,
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: '#D4AF37',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div style={{
          maxWidth: '1400px',
          margin: '60px auto',
          textAlign: 'center',
          color: '#9CA3AF'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>No contacts found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
