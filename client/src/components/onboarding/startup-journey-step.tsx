import React from 'react';
import { motion } from 'framer-motion';

interface StartupJourneyStepProps {
  step: number;
  content: string;
  icon: React.ReactNode;
}

export default function StartupJourneyStep({ step, content, icon }: StartupJourneyStepProps) {
  return (
    <motion.div 
      className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-foreground">{content || ""}</p>
      </div>
    </motion.div>
  );
}