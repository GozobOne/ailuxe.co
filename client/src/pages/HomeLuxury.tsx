import { useAuth } from "@/_core/hooks/useAuth";
import LuxuryNav from "@/components/LuxuryNav";
import LuxuryHero from "@/components/LuxuryHero";
import AnimatedMetrics from "@/components/AnimatedMetrics";
import LuxuryFeatureCards from "@/components/LuxuryFeatureCards";
import ClientSuccessStories from "@/components/ClientSuccessStories";
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import '@/styles/luxury-theme.css';

export default function HomeLuxury() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <LuxuryNav />

      {/* Hero Section */}
      <LuxuryHero />

      {/* Metrics Section */}
      <AnimatedMetrics />

      {/* Features Section */}
      <LuxuryFeatureCards />

      {/* Success Stories */}
      <section className="py-20 px-4 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">Client Success Stories</h2>
            <p className="text-xl text-gray-400">
              Real results from luxury event professionals who reclaimed their time
            </p>
          </motion.div>
          <ClientSuccessStories />
        </div>
      </section>

      {/* Market Insights Carousel */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">Market Insights</h2>
            <p className="text-xl text-gray-400">
              Data-driven results from the luxury events industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '2.3x', label: 'Average ROI', color: '#D4AF37' },
              { value: '$3.2K', label: 'Monthly Savings', color: '#10B981' },
              { value: '94%', label: 'Client Satisfaction', color: '#8B5CF6' },
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="luxury-card text-center"
              >
                <div
                  className="text-6xl font-bold mb-4"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </div>
                <div className="text-xl text-gray-300">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Reclaim Your Time?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join luxury agencies saving $3K+/month with AI concierge automation
            </p>

            {isAuthenticated ? (
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cta-amber px-12 py-4 text-xl"
                >
                  Go to Dashboard →
                </motion.button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cta-amber px-12 py-4 text-xl"
                >
                  Start Free Trial
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-[#D4AF37]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-[#D4AF37] font-bold text-lg mb-4">AI LUXE</h3>
              <p className="text-gray-400 text-sm">
                Time is the Real Luxury
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/features"><a className="hover:text-[#D4AF37] transition-colors">Features</a></Link></li>
                <li><Link href="/roi-guide"><a className="hover:text-[#D4AF37] transition-colors">ROI Guide</a></Link></li>
                <li><Link href="/success"><a className="hover:text-[#D4AF37] transition-colors">Success Stories</a></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/terms"><a className="hover:text-[#D4AF37] transition-colors">Terms of Service</a></Link></li>
                <li><Link href="/policy"><a className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="mailto:hello@ailuxe.co" className="hover:text-[#D4AF37] transition-colors">hello@ailuxe.co</a></li>
                <li><a href="https://linkedin.com" className="hover:text-[#D4AF37] transition-colors">LinkedIn</a></li>
                <li><a href="https://twitter.com" className="hover:text-[#D4AF37] transition-colors">X (Twitter)</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#2A2A2A] pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 AI LUXE. All rights reserved. Made with 💎 in Dubai.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
