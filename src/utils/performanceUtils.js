/**
 * Performance Monitoring Utilities
 * Track and log performance metrics
 */

/**
 * Measure component render time
 * @param {string} componentName - Name of the component
 * @param {Function} callback - Function to measure
 */
export const measureComponentRender = (componentName, callback) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(`[Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
  } else {
    callback();
  }
};

/**
 * Log Web Vitals metrics
 * @param {Object} metric - Web Vitals metric object
 */
export const logWebVitals = (metric) => {
  const { name, value, id, delta } = metric;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: value.toFixed(2),
      id,
      delta: delta.toFixed(2)
    });
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Send to your analytics service
    if (window.gtag) {
      window.gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(name === 'CLS' ? delta * 1000 : delta),
        non_interaction: true,
      });
    }
  }
};

/**
 * Monitor bundle size
 * @returns {Object} Bundle size information
 */
export const getBundleSize = () => {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const resources = performance.getEntriesByType('resource');
  const jsResources = resources.filter(r => r.name.endsWith('.js'));
  const cssResources = resources.filter(r => r.name.endsWith('.css'));

  const totalJsSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  const totalCssSize = cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

  return {
    js: {
      count: jsResources.length,
      size: (totalJsSize / 1024).toFixed(2) + ' KB',
      sizeBytes: totalJsSize
    },
    css: {
      count: cssResources.length,
      size: (totalCssSize / 1024).toFixed(2) + ' KB',
      sizeBytes: totalCssSize
    },
    total: {
      size: ((totalJsSize + totalCssSize) / 1024).toFixed(2) + ' KB',
      sizeBytes: totalJsSize + totalCssSize
    }
  };
};

/**
 * Monitor memory usage
 * @returns {Object} Memory information
 */
export const getMemoryUsage = () => {
  if (typeof window === 'undefined' || !performance.memory) {
    return null;
  }

  return {
    used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
  };
};

/**
 * Get page load time
 * @returns {Object} Load time information
 */
export const getPageLoadTime = () => {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const timing = performance.timing;
  
  return {
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,
    processing: timing.domComplete - timing.domLoading,
    load: timing.loadEventEnd - timing.loadEventStart,
    total: timing.loadEventEnd - timing.navigationStart
  };
};

/**
 * Monitor First Contentful Paint (FCP)
 */
export const monitorFCP = () => {
  if (typeof window === 'undefined' || !PerformanceObserver) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log(`[Performance] FCP: ${entry.startTime.toFixed(2)}ms`);
        }
      }
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    // PerformanceObserver not supported
    console.warn('PerformanceObserver not supported');
  }
};

/**
 * Monitor Largest Contentful Paint (LCP)
 */
export const monitorLCP = () => {
  if (typeof window === 'undefined' || !PerformanceObserver) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`[Performance] LCP: ${lastEntry.startTime.toFixed(2)}ms`);
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP observation not supported');
  }
};

/**
 * Monitor First Input Delay (FID)
 */
export const monitorFID = () => {
  if (typeof window === 'undefined' || !PerformanceObserver) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const delay = entry.processingStart - entry.startTime;
        console.log(`[Performance] FID: ${delay.toFixed(2)}ms`);
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID observation not supported');
  }
};

/**
 * Monitor Cumulative Layout Shift (CLS)
 */
export const monitorCLS = () => {
  if (typeof window === 'undefined' || !PerformanceObserver) {
    return;
  }

  let clsValue = 0;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log(`[Performance] CLS: ${clsValue.toFixed(3)}`);
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    console.warn('CLS observation not supported');
  }
};

/**
 * Initialize all performance monitors
 */
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    // Monitor core web vitals
    monitorFCP();
    monitorLCP();
    monitorFID();
    monitorCLS();

    // Log bundle size after load
    window.addEventListener('load', () => {
      setTimeout(() => {
        console.log('[Performance] Bundle Size:', getBundleSize());
        console.log('[Performance] Memory Usage:', getMemoryUsage());
        console.log('[Performance] Page Load Time:', getPageLoadTime());
      }, 1000);
    });
  }
};

/**
 * Performance budget checker
 * @param {Object} budgets - Performance budgets
 * @returns {Object} Budget check results
 */
export const checkPerformanceBudgets = (budgets = {}) => {
  const defaults = {
    maxBundleSize: 500, // KB
    maxFCP: 1800, // ms
    maxLCP: 2500, // ms
    maxFID: 100, // ms
    maxCLS: 0.1 // score
  };

  const config = { ...defaults, ...budgets };
  const bundleSize = getBundleSize();
  
  return {
    bundleSize: {
      passed: !bundleSize || bundleSize.total.sizeBytes / 1024 <= config.maxBundleSize,
      current: bundleSize?.total.size || 'N/A',
      budget: `${config.maxBundleSize} KB`
    }
  };
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const performanceUtilsExports = {
  measureComponentRender,
  logWebVitals,
  getBundleSize,
  getMemoryUsage,
  getPageLoadTime,
  monitorFCP,
  monitorLCP,
  monitorFID,
  monitorCLS,
  initPerformanceMonitoring,
  checkPerformanceBudgets,
  debounce,
  throttle
};

export default performanceUtilsExports;
