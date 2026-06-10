'use client';

import { motion } from 'framer-motion';
import { Skill } from '@/types';

interface SkillItemProps {
  skill: Skill;
}

export default function SkillItem({ skill }: SkillItemProps) {
  return (
    <motion.div
      className="
        min-w-[44px] min-h-[44px]
        flex items-center justify-center
        px-4 py-2
        rounded-full
        bg-white/5
        border border-white/10
        text-sm font-medium text-white/90
        cursor-default
        select-none
      "
      whileHover={{
        scale: 1.1,
        borderColor: 'rgba(0, 212, 255, 0.5)',
      }}
      whileTap={{
        scale: 1.1,
        borderColor: 'rgba(0, 212, 255, 0.5)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.3 }}
    >
      {skill.name}
    </motion.div>
  );
}
