import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Mic, 
  Calendar, 
  DollarSign, 
  Shield, 
  Users,
  Sparkles,
  Zap
} from 'lucide-react';

interface Feature {
  icon: any;
  title: string;
  description: string;
  animation: 'bubbles' | 'waveform' | 'flip' | 'slider' | 'vault' | 'grid';
  color: string;
}

export default function LuxuryFeatureCards() {
  const features: Feature[] = [
    {
      icon: Sparkles,
      title: 'Persona Cloning',
      description: 'Upload chat history and let AI learn your unique communication style, tone, and personality in minutes.',
      animation: 'bubbles',
      color: '#D4AF37',
    },
    {
      icon: MessageSquare,
      title: 'Multi-Platform Support',
      description: 'Connect WhatsApp, Instagram DMs, and Telegram. Manage all conversations from one unified inbox.',
      animation: 'grid',
      color: '#10B981',
    },
    {
      icon: Mic,
      title: 'Voice Notes',
      description: 'AI transcribes voice messages instantly and responds in text or voice, matching your persona perfectly.',
      animation: 'waveform',
      color: '#F59E0B',
    },
    {
      icon: Calendar,
      title: 'Smart Bookings',
      description: 'Automatic calendar sync, conflict detection, and contract generation. Book events seamlessly via chat.',
      animation: 'flip',
      color: '#8B5CF6',
    },
    {
      icon: DollarSign,
      title: 'Fair Negotiator',
      description: 'AI handles price negotiations intelligently, escalating to you only when budgets exceed your thresholds.',
      animation: 'slider',
      color: '#DC2626',
    },
    {
      icon: Shield,
      title: 'Secure Linking',
      description: 'End-to-end encrypted connections with 2FA. Your data stays private with OAuth 2.0 and token rotation.',
      animation: 'vault',
      color: '#06B6D4',
    },
  ];

  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">Core Features</h2>
          <p className="text-xl text-gray-400">
            Everything you need to reclaim your time and scale your luxury business with AI
          </p>
        </motion.div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="feature-card group"
    >
      {/* Icon with Animation */}
      <div className="mb-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="inline-block p-4 rounded-xl"
          style={{
            background: `${feature.color}20`,
            border: `2px solid ${feature.color}`,
          }}
        >
          <Icon size={32} style={{ color: feature.color }} />
        </motion.div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>

      {/* Description */}
      <p className="text-gray-400 mb-6">{feature.description}</p>

      {/* Animation Demo */}
      <div className="mt-6">
        {feature.animation === 'bubbles' && <PersonaBubbles color={feature.color} />}
        {feature.animation === 'waveform' && <VoiceWaveform color={feature.color} />}
        {feature.animation === 'flip' && <CalendarFlip color={feature.color} />}
        {feature.animation === 'slider' && <NegotiatorSlider color={feature.color} />}
        {feature.animation === 'vault' && <QRVault color={feature.color} />}
        {feature.animation === 'grid' && <EmeraldGrid color={feature.color} />}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-6 py-2 rounded-lg font-semibold transition-all"
        style={{
          background: `${feature.color}20`,
          color: feature.color,
          border: `2px solid ${feature.color}`,
        }}
      >
        Try Now →
      </motion.button>
    </motion.div>
  );
}

function PersonaBubbles({ color }: { color: string }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="w-12 h-12 rounded-full"
          style={{
            background: `${color}30`,
            border: `2px solid ${color}`,
          }}
        />
      ))}
    </div>
  );
}

function VoiceWaveform({ color }: { color: string }) {
  return (
    <div className="voice-waveform">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: ['10px', '40px', '10px'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className="voice-bar"
          style={{ background: color }}
        />
      ))}
    </div>
  );
}

function CalendarFlip({ color }: { color: string }) {
  return (
    <motion.div
      whileHover={{ rotateY: 180 }}
      transition={{ duration: 0.6 }}
      className="w-full h-24 rounded-lg flex items-center justify-center"
      style={{
        background: `${color}20`,
        border: `2px solid ${color}`,
        transformStyle: 'preserve-3d',
      }}
    >
      <Calendar size={48} style={{ color }} />
    </motion.div>
  );
}

function NegotiatorSlider({ color }: { color: string }) {
  return (
    <div className="negotiator-slider">
      <motion.div
        animate={{
          width: ['0%', '70%', '0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="negotiator-fill"
        style={{ background: color }}
      />
    </div>
  );
}

function QRVault({ color }: { color: string }) {
  return (
    <div className="qr-vault" style={{ borderColor: color }}>
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            className="w-4 h-4 rounded-sm"
            style={{ background: color }}
          />
        ))}
      </div>
    </div>
  );
}

function EmeraldGrid({ color }: { color: string }) {
  return (
    <div className="relative h-24 rounded-lg overflow-hidden" style={{ background: `${color}10` }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${color} 1px, transparent 1px),
            linear-gradient(90deg, ${color} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.3,
        }}
      />
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        }}
      />
    </div>
  );
}
