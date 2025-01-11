'use client'

import { motion } from 'framer-motion'

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
};

const AnimatedSection: React.FC<AnimatedSectionProps>  = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedSection

