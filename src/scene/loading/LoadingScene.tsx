"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/src/stores/useI18nStore";

export default function LoadingScene() {
  const { progress, active } = useProgress();
  const { t, tArray } = useTranslation();
  
  const tooltips = tArray('loading.tooltips');
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!active || !tooltips || !tooltips.length) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tooltips.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [active, tooltips]);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // If progress completes, delay fade-out to let user see 100% and avoid flashing
    if (progress === 100 && !active) {
      const timeout = setTimeout(() => setIsVisible(false), 1200); 
      return () => clearTimeout(timeout);
    }
  }, [progress, active]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // smooth ease out
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d1012] text-zinc-100 overflow-hidden"
        >
          {/* Decorative background topography or grid emulation */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          {/* Subtle gradient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 w-full max-w-md px-8 flex flex-col items-center">
            {/* Spinning Indicator */}
            <div className="relative mb-10 group">
              <div className="w-16 h-16 border border-zinc-800 rounded-full flex items-center justify-center text-[11px] font-bold tracking-wider text-zinc-400 bg-zinc-950/50 backdrop-blur-sm">
                {Math.round(progress)}%
              </div>
              <svg className="absolute inset-0 w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="text-blue-500/80 transition-all duration-300 ease-out" 
                  strokeDasharray={`${progress * 3.01} 301`} 
                />
              </svg>
            </div>

            <h1 className="text-lg font-bold tracking-tight mb-2 text-white">{t('loading.title')}</h1>
            <p className="text-[13px] text-zinc-400 mb-12 text-center max-w-[80%]">{t('loading.subtitle')}</p>

            {/* Tracking Progress Bar */}
            <div className="w-full h-0.5 bg-zinc-800/80 overflow-hidden mb-10">
              <motion.div 
                className="h-full bg-blue-500/80 shadow-[0_0_10px_rgb(59,130,246,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
              />
            </div>

            {/* Changing Tooltips */}
            <div className="h-10 relative w-full flex justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.4 }}
                  className="absolute text-center text-xs text-zinc-500 font-medium tracking-wide max-w-[85%] leading-relaxed"
                >
                  {tooltips && tooltips[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
