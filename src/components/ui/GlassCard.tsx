'use client';

import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative rounded-xl p-6
        backdrop-blur-[12px]
        bg-white/10
        border border-white/15
        ${className}
      `}
      whileHover={{
        scale: 1.03,
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
