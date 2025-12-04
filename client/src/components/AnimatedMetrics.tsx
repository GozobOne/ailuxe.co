import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Metric {
  value: string;
  label: string;
  color: string;
  suffix?: string;
}

export default function AnimatedMetrics() {
  const metrics: Metric[] = [
    { value: '70', label: 'Cost Savings', color: '#F59E0B', suffix: '%' },
    { value: '25', label: 'Satisfaction', color: '#10B981', suffix: '+%' },
    { value: '2.3', label: 'Response Time', color: '#D4AF37', suffix: 's' },
    { value: '24/7', label: 'Uptime', color: '#DC2626', suffix: '' },
  ];

  return (
    <section className="py-20 px-4 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#D4AF37]">Vision:</span>{' '}
            <span className="text-white">A world where AI lessens the chaos from human activities and life.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const targetValue = parseFloat(metric.value);
    if (isNaN(targetValue)) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetValue / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCount(Math.min(increment * currentStep, targetValue));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, metric.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onViewportEnter={() => setIsVisible(true)}
      className="luxury-card text-center metric-burst"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.2,
        }}
        className="mb-4"
      >
        <div
          className="text-6xl font-bold mb-2"
          style={{ color: metric.color }}
        >
          {metric.value === '24/7' ? (
            metric.value
          ) : (
            <>
              {count.toFixed(metric.value.includes('.') ? 1 : 0)}
              {metric.suffix}
            </>
          )}
        </div>
      </motion.div>

      <div className="text-xl text-gray-300 font-medium">{metric.label}</div>

      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
        className="h-1 mt-4 rounded-full"
        style={{ background: metric.color }}
      />

      {/* Burst effect */}
      {index === 0 && (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${metric.color}20 0%, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}
