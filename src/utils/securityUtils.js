/**
 * Security Utilities for Portfolio
 * Input sanitization, XSS prevention, and security best practices
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  if (typeof window === 'undefined') return html;
  
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Sanitize user input (email, name, message)
 * @param {string} input - User input string
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
export const isValidURL = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Sanitize URL to prevent malicious protocols
 * @param {string} url - URL to sanitize
 * @returns {string} Safe URL
 */
export const sanitizeURL = (url) => {
  if (!url) return '';
  
  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase().trim();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '#';
    }
  }
  
  // Ensure http or https
  if (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
};

/**
 * Create secure window.open with proper security flags
 * @param {string} url - URL to open
 * @param {string} target - Target window
 * @returns {Window|null} Opened window
 */
export const secureWindowOpen = (url, target = '_blank') => {
  if (!isValidURL(url)) {
    console.error('Invalid URL provided to secureWindowOpen');
    return null;
  }
  
  const sanitizedUrl = sanitizeURL(url);
  return window.open(sanitizedUrl, target, 'noopener,noreferrer');
};

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} { isValid, errors }
 */
export const validateFormData = (formData) => {
  const errors = {};
  
  // Name validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (formData.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }
  
  // Email validation
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Message validation
  if (!formData.message || formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (formData.message.length > 5000) {
    errors.message = 'Message must be less than 5000 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Rate limiting utility
 * Prevents spam submissions
 */
export class RateLimiter {
  constructor(maxAttempts = 3, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Record this attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }

  reset(key) {
    this.attempts.delete(key);
  }

  clear() {
    this.attempts.clear();
  }
}

/**
 * Content Security Policy helper
 * @returns {Object} CSP directives
 */
export const getCSPDirectives = () => {
  return {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for React
      "'unsafe-eval'", // Required for dev
      'https://cdn.emailjs.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components
      'https://fonts.googleapis.com'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:'
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:',
      'blob:'
    ],
    'connect-src': [
      "'self'",
      'https://api.emailjs.com',
      'https://www.google-analytics.com'
    ],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  };
};

/**
 * Generate CSP header string
 * @returns {string} CSP header value
 */
export const generateCSPHeader = () => {
  const directives = getCSPDirectives();
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
};

/**
 * Prevent clickjacking by checking if site is in iframe
 * @returns {boolean} Is in iframe
 */
export const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

/**
 * Detect and prevent clickjacking
 */
export const preventClickjacking = () => {
  if (isInIframe()) {
    console.warn('Detected iframe embedding - potential clickjacking attempt');
    // Optionally: window.top.location = window.self.location;
  }
};

/**
 * Local storage with encryption (basic)
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const secureLocalStorage = {
  set: (key, value) => {
    try {
      const serialized = JSON.stringify(value);
      // Basic obfuscation (not real encryption, but better than plain text)
      const encoded = btoa(serialized);
      localStorage.setItem(key, encoded);
    } catch (error) {
      console.error('Failed to store data:', error);
    }
  },

  get: (key) => {
    try {
      const encoded = localStorage.getItem(key);
      if (!encoded) return null;
      const decoded = atob(encoded);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove data:', error);
    }
  }
};

/**
 * CSRF token generation (for form submissions)
 * @returns {string} CSRF token
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Session ID generation
 * @returns {string} Session ID
 */
export const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default {
  sanitizeHTML,
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  isValidURL,
  sanitizeURL,
  secureWindowOpen,
  validateFormData,
  RateLimiter,
  getCSPDirectives,
  generateCSPHeader,
  isInIframe,
  preventClickjacking,
  secureLocalStorage,
  generateCSRFToken,
  generateSessionId
};
