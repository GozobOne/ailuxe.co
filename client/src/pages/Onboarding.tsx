import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { APP_LOGO } from '@/const';
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to AI LUXE',
      subtitle: 'Time is the Real Luxury',
      content: <WelcomeStep userName={user?.firstName || 'there'} />,
    },
    {
      title: 'Your ROI Potential',
      subtitle: 'See what you can achieve',
      content: <ROIStep />,
    },
    {
      title: 'Quick Setup',
      subtitle: 'Get started in 3 minutes',
      content: <SetupStep />,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLocation('/dashboard');
    }
  };

  const handleSkip = () => {
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 gold-embossed">
      <div className="emerald-grid" />
      
      <div className="relative z-10 max-w-4xl w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <img src={APP_LOGO} alt="AI LUXE" className="h-16 mx-auto mb-4" />
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full mx-1 transition-all ${
                  index <= currentStep ? 'bg-[#D4AF37]' : 'bg-[#2A2A2A]'
                }`}
              />
            ))}
          </div>
          <div className="text-center text-gray-400 text-sm">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="luxury-card mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            {steps[currentStep].title}
          </h1>
          <p className="text-xl text-[#D4AF37] mb-8">
            {steps[currentStep].subtitle}
          </p>
          
          {steps[currentStep].content}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Skip for now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="cta-amber px-8 py-3 flex items-center gap-2"
          >
            {currentStep < steps.length - 1 ? 'Continue' : 'Go to Dashboard'}
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function WelcomeStep({ userName }: { userName: string }) {
  const benefits = [
    { icon: Clock, text: '70% time saved on routine tasks', color: '#F59E0B' },
    { icon: DollarSign, text: '$3,000+ monthly cost savings', color: '#10B981' },
    { icon: TrendingUp, text: '25% increase in client satisfaction', color: '#D4AF37' },
    { icon: Zap, text: '2.3s average response time', color: '#8B5CF6' },
  ];

  return (
    <div>
      <p className="text-xl text-gray-300 mb-8">
        Welcome, <span className="text-[#D4AF37] font-semibold">{userName}</span>! 
        You're about to transform how you manage luxury events. Here's what you can expect:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-lg"
            style={{ background: `${benefit.color}10`, border: `1px solid ${benefit.color}40` }}
          >
            <div
              className="p-3 rounded-lg"
              style={{ background: `${benefit.color}20` }}
            >
              <benefit.icon size={24} style={{ color: benefit.color }} />
            </div>
            <p className="text-gray-300 flex-1">{benefit.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ROIStep() {
  const metrics = [
    { label: 'Monthly Time Saved', value: '120', unit: 'hours', color: '#F59E0B' },
    { label: 'Cost Reduction', value: '$3,200', unit: '/month', color: '#10B981' },
    { label: 'Revenue Increase', value: '32', unit: 'x ROI', color: '#D4AF37' },
    { label: 'Client Satisfaction', value: '94', unit: '%', color: '#8B5CF6' },
  ];

  return (
    <div>
      <p className="text-xl text-gray-300 mb-8">
        Based on data from similar luxury event agencies, here's your potential ROI:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-6 rounded-lg"
            style={{ background: `${metric.color}10`, border: `2px solid ${metric.color}` }}
          >
            <div
              className="text-5xl font-bold mb-2"
              style={{ color: metric.color }}
            >
              {metric.value}
            </div>
            <div className="text-gray-400 text-sm">{metric.unit}</div>
            <div className="text-white font-medium mt-2">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#D4AF37]">
        <div className="flex items-start gap-4">
          <CheckCircle2 size={24} className="text-[#10B981] flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-semibold mb-2">14-Day Free Trial</h3>
            <p className="text-gray-400">
              No credit card required. Cancel anytime. Experience the full power of AI LUXE risk-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SetupStep() {
  const steps = [
    {
      icon: Users,
      title: 'Connect Your Platforms',
      description: 'Link WhatsApp, Instagram, and Telegram in one click',
      time: '30 seconds',
    },
    {
      icon: Zap,
      title: 'Clone Your Persona',
      description: 'Upload chat history to train your AI assistant',
      time: '2 minutes',
    },
    {
      icon: CheckCircle2,
      title: 'Start Automating',
      description: 'Let AI handle inquiries while you focus on high-value work',
      time: 'Immediate',
    },
  ];

  return (
    <div>
      <p className="text-xl text-gray-300 mb-8">
        Get up and running in just 3 minutes with our guided setup:
      </p>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#D4AF37] transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37] text-black font-bold text-xl flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <step.icon size={20} className="text-[#D4AF37]" />
                <h3 className="text-white font-semibold">{step.title}</h3>
                <span className="ml-auto text-sm text-gray-500">{step.time}</span>
              </div>
              <p className="text-gray-400">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 rounded-lg bg-gradient-to-r from-[#D4AF37]20 to-[#10B981]20 border border-[#D4AF37]"
      >
        <p className="text-white text-center">
          <span className="font-semibold">💎 Pro Tip:</span> Complete setup now to unlock your 
          <span className="text-[#D4AF37] font-bold"> exclusive ROI guide PDF</span>
        </p>
      </motion.div>
    </div>
  );
}
