import { useState } from 'react';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock search results - will be replaced with real Supabase search
  const mockResults = {
    contacts: [
      { id: 1, name: 'Sarah Al-Mansour', type: 'contact', email: 'sarah@example.com', match: 'Name match' },
      { id: 2, name: 'Mohammed Al-Rashid', type: 'contact', email: 'mohammed@example.com', match: 'Name match' }
    ],
    messages: [
      { id: 1, from: 'Sarah Al-Mansour', content: 'Can you help with the event booking?', platform: 'whatsapp', date: '2 hours ago' },
      { id: 2, from: 'Layla Hassan', content: 'Thank you for the quick response!', platform: 'telegram', date: '1 day ago' }
    ],
    bookings: [
      { id: 1, event: 'Fashion Shoot', client: 'Sarah Al-Mutawa', date: 'Nov 30, 2025', status: 'confirmed' },
      { id: 2, event: 'Corporate Gala', client: 'Al-Rashid Holdings', date: 'Dec 15, 2025', status: 'pending' }
    ],
    personas: [
      { id: 1, name: 'Elite Events Manager', messages: 342, tone: 'Professional' },
      { id: 2, name: 'Luxury Concierge', messages: 156, tone: 'Friendly' }
    ]
  };

  const filteredResults = query.length > 2 ? mockResults : { contacts: [], messages: [], bookings: [], personas: [] };
  const totalResults = Object.values(filteredResults).reduce((sum, arr) => sum + arr.length, 0);

  const tabs = [
    { id: 'all', label: 'All', count: totalResults },
    { id: 'contacts', label: 'Contacts', count: filteredResults.contacts.length },
    { id: 'messages', label: 'Messages', count: filteredResults.messages.length },
    { id: 'bookings', label: 'Bookings', count: filteredResults.bookings.length },
    { id: 'personas', label: 'Personas', count: filteredResults.personas.length }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '80px 20px 40px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            🔍 Global Search
          </h1>
          <p style={{ color: '#888888', fontSize: '18px' }}>
            Search across contacts, messages, bookings, and more
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '20px 30px',
              background: '#1a1a1a',
              border: '2px solid #333',
              borderRadius: '16px',
              color: '#FFFFFF',
              fontSize: '20px',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#D4AF37'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
          />
          {query.length > 0 && query.length < 3 && (
            <p style={{ color: '#666', fontSize: '14px', marginTop: '10px', textAlign: 'center' }}>
              Type at least 3 characters to search
            </p>
          )}
        </div>

        {/* Tabs */}
        {query.length >= 3 && (
          <>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '30px',
              borderBottom: '1px solid #333',
              overflowX: 'auto',
              paddingBottom: '10px'
            }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 20px',
                    background: activeTab === tab.id ? '#D4AF37' : 'transparent',
                    color: activeTab === tab.id ? '#000000' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tab.label} {tab.count > 0 && `(${tab.count})`}
                </button>
              ))}
            </div>

            {/* Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Contacts */}
              {(activeTab === 'all' || activeTab === 'contacts') && filteredResults.contacts.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '24px', color: '#D4AF37', marginBottom: '15px' }}>
                    👥 Contacts
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredResults.contacts.map(contact => (
                      <div
                        key={contact.id}
                        style={{
                          background: '#1a1a1a',
                          padding: '20px',
                          borderRadius: '12px',
                          border: '1px solid #333',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#D4AF37';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#333';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                          {contact.name}
                        </div>
                        <div style={{ color: '#888888', fontSize: '14px' }}>
                          {contact.email}
                        </div>
                        <div style={{ color: '#D4AF37', fontSize: '12px', marginTop: '5px' }}>
                          {contact.match}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {(activeTab === 'all' || activeTab === 'messages') && filteredResults.messages.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '24px', color: '#D4AF37', marginBottom: '15px' }}>
                    💬 Messages
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredResults.messages.map(message => (
                      <div
                        key={message.id}
                        style={{
                          background: '#1a1a1a',
                          padding: '20px',
                          borderRadius: '12px',
                          border: '1px solid #333',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#25D366';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#333';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontWeight: '600' }}>{message.from}</span>
                          <span style={{ color: '#666', fontSize: '12px' }}>{message.date}</span>
                        </div>
                        <div style={{ color: '#CCCCCC', fontSize: '14px', marginBottom: '8px' }}>
                          {message.content}
                        </div>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          background: '#25D366' + '20',
                          color: '#25D366',
                          borderRadius: '6px',
                          fontSize: '12px',
                          textTransform: 'capitalize'
                        }}>
                          {message.platform}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bookings */}
              {(activeTab === 'all' || activeTab === 'bookings') && filteredResults.bookings.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '24px', color: '#D4AF37', marginBottom: '15px' }}>
                    📅 Bookings
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredResults.bookings.map(booking => (
                      <div
                        key={booking.id}
                        style={{
                          background: '#1a1a1a',
                          padding: '20px',
                          borderRadius: '12px',
                          border: '1px solid #333',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#0088cc';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#333';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                          {booking.event}
                        </div>
                        <div style={{ color: '#888888', fontSize: '14px', marginBottom: '8px' }}>
                          Client: {booking.client}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#666', fontSize: '14px' }}>{booking.date}</span>
                          <span style={{
                            padding: '4px 12px',
                            background: booking.status === 'confirmed' ? '#25D366' + '20' : '#FFA500' + '20',
                            color: booking.status === 'confirmed' ? '#25D366' : '#FFA500',
                            borderRadius: '6px',
                            fontSize: '12px',
                            textTransform: 'capitalize'
                          }}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personas */}
              {(activeTab === 'all' || activeTab === 'personas') && filteredResults.personas.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '24px', color: '#D4AF37', marginBottom: '15px' }}>
                    🎭 Personas
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredResults.personas.map(persona => (
                      <div
                        key={persona.id}
                        style={{
                          background: '#1a1a1a',
                          padding: '20px',
                          borderRadius: '12px',
                          border: '1px solid #333',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#E4405F';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#333';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                          {persona.name}
                        </div>
                        <div style={{ display: 'flex', gap: '20px', color: '#888888', fontSize: '14px' }}>
                          <span>{persona.messages} messages</span>
                          <span>Tone: {persona.tone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {totalResults === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#666'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                  <p style={{ fontSize: '18px' }}>No results found for "{query}"</p>
                  <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    Try different keywords or check your spelling
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {query.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
            <p style={{ fontSize: '20px', marginBottom: '10px' }}>Start typing to search</p>
            <p style={{ fontSize: '14px' }}>
              Search across contacts, messages, bookings, personas, and more
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
