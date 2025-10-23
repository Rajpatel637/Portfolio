// Analytics tracking utilities
// This file provides functions to track user interactions

/**
 * Track generic events
 * @param {string} category - Event category (e.g., 'Button', 'Link', 'Form')
 * @param {string} action - Event action (e.g., 'Click', 'Submit', 'Download')
 * @param {string} label - Event label (optional)
 */
export const trackEvent = (category, action, label = '') => {
  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Event Tracked:', { category, action, label });
  }
  
  // Google Analytics 4 tracking (if available)
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
  
  // Facebook Pixel tracking (if available)
  if (window.fbq) {
    window.fbq('trackCustom', action, {
      category,
      label,
    });
  }
};

/**
 * Track page views
 * @param {string} pagePath - Page path
 * @param {string} pageTitle - Page title
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📄 Page View:', { pagePath, pageTitle });
  }
  
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

/**
 * Track resume downloads
 */
export const trackResumeDownload = () => {
  trackEvent('Resume', 'Download', 'CV Downloaded');
  
  // Additional tracking for conversions
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
    });
  }
};

/**
 * Track external link clicks
 * @param {string} url - External URL
 * @param {string} linkName - Name of the link
 */
export const trackExternalLink = (url, linkName) => {
  trackEvent('External Link', 'Click', `${linkName} - ${url}`);
};

/**
 * Track project views
 * @param {string} projectName - Name of the project
 */
export const trackProjectView = (projectName) => {
  trackEvent('Project', 'View', projectName);
};

/**
 * Track contact form submissions
 * @param {boolean} success - Whether submission was successful
 */
export const trackContactSubmission = (success) => {
  trackEvent('Contact Form', success ? 'Submit Success' : 'Submit Error', '');
};

/**
 * Track theme changes
 * @param {string} theme - Theme name ('dark' or 'light')
 */
export const trackThemeChange = (theme) => {
  trackEvent('Theme', 'Toggle', theme);
};

/**
 * Track scroll depth
 * @param {number} percentage - Scroll percentage
 */
export const trackScrollDepth = (percentage) => {
  trackEvent('Scroll', `Depth ${percentage}%`, '');
};

/**
 * Track time on site
 * @param {number} seconds - Time in seconds
 */
export const trackTimeOnSite = (seconds) => {
  trackEvent('Engagement', 'Time on Site', `${seconds} seconds`);
};

const analyticsExports = {
  trackEvent,
  trackPageView,
  trackResumeDownload,
  trackExternalLink,
  trackProjectView,
  trackContactSubmission,
  trackThemeChange,
  trackScrollDepth,
  trackTimeOnSite,
};

export default analyticsExports;
