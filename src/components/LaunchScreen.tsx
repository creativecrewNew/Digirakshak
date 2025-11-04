import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Smartphone } from 'lucide-react';
import logoImage from 'figma:asset/e4726761c23fe4fce5b484ce628ad7c43462d06b.png';

interface LaunchScreenProps {
  onComplete: () => void;
}

export function LaunchScreen({ onComplete }: LaunchScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading with progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-8 px-6">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <img 
              src={logoImage} 
              alt="DigiRakshak Logo" 
              className="w-32 h-32 object-contain drop-shadow-2xl"
            />
          </motion.div>
          
          {/* Pulsing Shield Icon */}
          <motion.div
            className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 hsl(var(--primary) / 0.7)",
                "0 0 0 10px hsl(var(--primary) / 0)",
                "0 0 0 0 hsl(var(--primary) / 0)"
              ]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Shield className="w-6 h-6" />
          </motion.div>
        </motion.div>

        {/* App Name with Gradient */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl mb-2">
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              DigiRakshak
            </span>
          </h1>
          <p className="text-muted-foreground">
            आपका अपना सुरक्षा कवच
          </p>
        </motion.div>

        {/* Loading Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "200px", opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-[200px]"
        >
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Smartphone className="w-4 h-4 animate-pulse" />
          <span>Initializing fraud detection...</span>
        </motion.div>
      </div>
    </div>
  );
}
