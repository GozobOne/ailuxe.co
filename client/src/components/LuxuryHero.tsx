import { motion } from 'framer-motion';
import { Clock, Heart, Lightbulb, Target, Zap } from 'lucide-react';
import { APP_LOGO } from '@/const';

export default function LuxuryHero() {
  const visionIcons = [
    { Icon: Zap, label: 'Efficiency Lightning', color: '#F59E0B', delay: 0 },
    { Icon: Heart, label: 'Human Greatness', color: '#DC2626', delay: 0.2 },
    { Icon: Lightbulb, label: 'Innovation', color: '#D4AF37', delay: 0.4 },
    { Icon: Target, label: 'Focus', color: '#10B981', delay: 0.6 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gold-embossed">
      {/* Animated Background Grid */}
      <div className="emerald-grid" />
      
      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Logo with Pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 rsvp-pulse"
        >
          <img 
            src={APP_LOGO} 
            alt="AI LUXE" 
            className="h-24 mx-auto"
          />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold mb-6"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4B4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Time is the Real Luxury
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          We give brands, agencies, and teams the luxury gift of time — so they can focus on{' '}
          <span className="text-[#D4AF37] font-semibold">greatness</span>,{' '}
          <span className="text-[#D4AF37] font-semibold">creativity</span>,{' '}
          <span className="text-[#D4AF37] font-semibold">connection</span>, and{' '}
          <span className="text-[#D4AF37] font-semibold">innovation</span>.
        </motion.p>

        {/* Vision Icons */}
        <div className="flex justify-center gap-8 mb-12 flex-wrap">
          {visionIcons.map(({ Icon, label, color, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + delay }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: delay,
                }}
                className="p-4 rounded-full"
                style={{
                  background: `${color}20`,
                  border: `2px solid ${color}`,
                }}
              >
                <Icon size={32} style={{ color }} />
              </motion.div>
              <span className="text-sm text-gray-400">{label}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cta-amber px-8 py-4 text-lg font-bold rounded-lg shadow-lg"
          >
            Start Free Trial →
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="luxury-btn-secondary px-8 py-4 text-lg"
          >
            ✨ See 32x ROI Guide
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block"
          >
            <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#D4AF37] rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </section>
  );
}
