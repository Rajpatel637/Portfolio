import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for animating numbers from 0 to target value
 * @param {number} end - The target number to count to
 * @param {number} duration - Duration of animation in milliseconds
 * @param {boolean} isInView - Whether the element is in viewport
 * @returns {number} - The current animated value
 */
export const useCountUp = (end, duration = 2000, isInView = false) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;

    hasAnimated.current = true;
    const startTime = Date.now();
    const startValue = 0;
    const endValue = parseFloat(end);

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic function for smooth deceleration
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOutCubic;

      countRef.current = currentValue;
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return count;
};

export default useCountUp;
