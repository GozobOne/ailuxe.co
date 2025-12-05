import { useState } from "react";

export default function ApiSettings() {
  const [showTokens, setShowTokens] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '1600px', margin: '0 auto 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <div style={{ fontSize: '40px' }}>🔌</div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontWeight: '700'
          }}>
            API Settings
          </h1>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '16px', margin: 0 }}>
          Secure credential storage for integrations · WhatsApp Business + DeepSeek Whisper live
        </p>
      </div>

      {/* WhatsApp Business Cloud API */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto 30px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        padding: '30px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          📱 WhatsApp Business Cloud API
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '24px' }}>
          Official WhatsApp Business API credentials from Meta
        </p>

        <div style={{ display: 'grid', gap: '20px', maxWidth: '800px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>
              Phone Number ID *
            </label>
            <input
              type="text"
              value="86827295631771"
              readOnly
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                padding: '14px 16px',
                color: '#FFFFFF',
                fontSize: '14px'
              }}
            />
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>
              Found in Meta Business Suite → WhatsApp → API Setup
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>
              Access Token *
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type={showTokens ? "text" : "password"}
                value="EAAIf6rO482CQBPXnsuzICQu..."
                readOnly
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: '#FFFFFF',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={() => setShowTokens(!showTokens)}
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  padding: '0 20px',
                  color: '#D4AF37',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {showTokens ? 'Hide' : 'Show'}
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>
              Permanent access token from Meta Business Suite
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>
              Webhook Verify Token *
            </label>
            <input
              type="text"
              value="ailuxe_webhook_verify_2025"
              readOnly
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                padding: '14px 16px',
                color: '#FFFFFF',
                fontSize: '14px'
              }}
            />
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>
              Custom token you create for webhook verification (any random string)
            </p>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px', display: 'block' }}>
              Webhook URL (for Meta configuration):
            </label>
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #D4AF37',
              borderRadius: '8px',
              padding: '14px 16px',
              fontFamily: 'monospace',
              color: '#D4AF37',
              fontSize: '14px'
            }}>
              https://ailuxe.co/api/whatsapp/webhook
            </div>
          </div>

          <button style={{
            background: '#D4AF37',
            color: '#000000',
            padding: '14px 32px',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%'
          }}>
            Save Configuration & Test Connection
          </button>
        </div>
      </div>

      {/* AI / Voice Settings */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        padding: '30px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          🎙️ AI / Voice Settings
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '24px' }}>
          Configure voice transcription preferences
        </p>

        <div style={{ maxWidth: '600px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>
            Voice Model
          </label>
          <select style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '14px 16px',
            color: '#FFFFFF',
            fontSize: '16px'
          }}>
            <option>DeepSeek Whisper</option>
            <option>OpenAI Whisper</option>
          </select>

          <button style={{
            marginTop: '24px',
            background: '#D4AF37',
            color: '#000000',
            padding: '14px 32px',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%'
          }}>
            Test Voice Transcription
          </button>
        </div>
      </div>
    </div>
  );
}
