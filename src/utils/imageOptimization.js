import { useState, useEffect } from 'react';

/**
 * Progressive Image Loading Hook
 * Loads a low-quality placeholder first, then the full image
 * 
 * @param {string} lowQualitySrc - Low quality placeholder image
 * @param {string} highQualitySrc - Full quality image
 * @returns {Object} { src, blur } - Current src and blur state
 */
export const useProgressiveImage = (lowQualitySrc, highQualitySrc) => {
  const [src, setSrc] = useState(lowQualitySrc);

  useEffect(() => {
    setSrc(lowQualitySrc);

    const img = new Image();
    img.src = highQualitySrc;

    img.onload = () => {
      setSrc(highQualitySrc);
    };
  }, [lowQualitySrc, highQualitySrc]);

  return {
    src,
    blur: src === lowQualitySrc
  };
};

/**
 * Lazy Load Image Hook
 * Only loads image when it enters viewport
 * 
 * @param {string} src - Image source
 * @param {string} placeholder - Placeholder image
 * @returns {Object} { imageSrc, isLoaded } - Current image src and loaded state
 */
export const useLazyLoadImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
            };
          }
        });
      },
      {
        rootMargin: '50px'
      }
    );

    const element = document.getElementById(`lazy-image-${src}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [src, isLoaded]);

  return { imageSrc, isLoaded };
};

/**
 * Optimize image src for different screen sizes
 * 
 * @param {string} src - Original image source
 * @param {number} width - Desired width
 * @returns {string} Optimized image URL
 */
export const optimizeImageSrc = (src, width) => {
  // If using a CDN service, modify the URL to request optimized size
  // Example for Cloudinary: https://res.cloudinary.com/demo/image/upload/w_400/sample.jpg
  
  // For local images, you might want to prepare multiple sizes
  // and return the appropriate one based on width
  
  if (typeof window !== 'undefined' && window.devicePixelRatio > 1) {
    width = width * 2; // Retina display support
  }

  // Return original src for now, but you can implement CDN logic here
  return src;
};

/**
 * Get responsive image srcset
 * 
 * @param {string} baseSrc - Base image path without extension
 * @param {string} ext - File extension
 * @returns {string} srcset string
 */
export const getResponsiveSrcSet = (baseSrc, ext = 'jpg') => {
  const sizes = [320, 640, 1024, 1920];
  return sizes
    .map((size) => `${baseSrc}-${size}w.${ext} ${size}w`)
    .join(', ');
};

/**
 * Preload critical images
 * 
 * @param {string[]} images - Array of image URLs to preload
 */
export const preloadImages = (images) => {
  if (typeof window === 'undefined') return;

  images.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

/**
 * Convert image to WebP format (client-side check)
 * 
 * @param {string} src - Image source
 * @returns {string} WebP version if supported, original otherwise
 */
export const getWebPVersion = (src) => {
  // Check WebP support
  const supportsWebP = () => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };

  if (typeof window !== 'undefined' && supportsWebP()) {
    // Replace extension with .webp
    return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  return src;
};

/**
 * Image loading state management
 */
export class ImageLoader {
  constructor() {
    this.cache = new Set();
  }

  load(src) {
    return new Promise((resolve, reject) => {
      if (this.cache.has(src)) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.cache.add(src);
        resolve(src);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  preload(sources) {
    return Promise.all(sources.map(src => this.load(src)));
  }

  isCached(src) {
    return this.cache.has(src);
  }

  clearCache() {
    this.cache.clear();
  }
}

// Singleton instance
export const imageLoader = new ImageLoader();

export default {
  useProgressiveImage,
  useLazyLoadImage,
  optimizeImageSrc,
  getResponsiveSrcSet,
  preloadImages,
  getWebPVersion,
  imageLoader
};
