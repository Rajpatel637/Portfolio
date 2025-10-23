import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useCountUp } from '../../hooks/useCountUp';

const CounterNumber = ({ end, suffix = '', prefix = '', duration = 2000, icon, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Extract numeric value from the end prop
  const numericValue = parseFloat(String(end).replace(/[^0-9.]/g, ''));
  const count = useCountUp(numericValue, duration, isInView);
  
  // Format the display value
  const formatValue = (value) => {
    // If the end value has a % symbol
    if (String(end).includes('%')) {
      return `${Math.round(value)}%`;
    }
    // If it's a regular number
    return Math.round(value);
  };

  return (
    <motion.div
      ref={ref}
      className="stat-card"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)"
      }}
    >
      <motion.div 
        className="stat-icon"
        animate={isInView ? {
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {icon}
      </motion.div>
      <motion.div 
        className="stat-number"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {prefix}{formatValue(count)}{suffix}
      </motion.div>
      <motion.div 
        className="stat-label"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
};

CounterNumber.propTypes = {
  end: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
  duration: PropTypes.number,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

CounterNumber.defaultProps = {
  suffix: '',
  prefix: '',
  duration: 2000,
};

export default CounterNumber;
