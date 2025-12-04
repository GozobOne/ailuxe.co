import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { APP_LOGO } from '@/const';
import { useAuth } from '@/_core/hooks/useAuth';
import { UserButton } from '@clerk/clerk-react';

export default function LuxuryNav() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="luxury-nav py-4 px-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img src={APP_LOGO} alt="AI LUXE" className="h-10" />
            <span className="text-xl font-bold text-[#D4AF37]">AI LUXE</span>
          </motion.div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/success">Success Stories</NavLink>
          <NavLink href="/market">Market Insights</NavLink>
          <NavLink href="/roi-guide">ROI Guide</NavLink>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          ) : isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="luxury-btn-secondary px-6 py-2"
                >
                  Dashboard
                </motion.button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="luxury-btn-secondary px-6 py-2"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cta-amber px-6 py-2"
                >
                  Start Free Trial
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.a
        whileHover={{ scale: 1.05 }}
        className="text-gray-300 hover:text-[#D4AF37] font-medium transition-colors cursor-pointer"
      >
        {children}
      </motion.a>
    </Link>
  );
}
