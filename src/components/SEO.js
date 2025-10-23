import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { personalInfo, socialLinks } from '../data/portfolioData';

const SEO = ({ 
  title, 
  description, 
  type = 'website', 
  image,
  article = false 
}) => {
  const siteUrl = window.location.origin;
  const currentUrl = window.location.href;
  
  const defaultTitle = `${personalInfo.name} | ${personalInfo.title}`;
  const defaultDescription = personalInfo.bio;
  const defaultImage = `${siteUrl}${personalInfo.profileImage || '/assets/images/og-image.jpg'}`;
  
  const seoTitle = title ? `${title} | ${personalInfo.name}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image ? `${siteUrl}${image}` : defaultImage;

  // Structured data for Person
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personalInfo.name,
    jobTitle: personalInfo.title,
    description: personalInfo.bio,
    email: personalInfo.email,
    telephone: personalInfo.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: personalInfo.location
    },
    url: siteUrl,
    sameAs: [
      socialLinks.linkedin,
      socialLinks.github,
      socialLinks.portfolio
    ].filter(Boolean),
    image: seoImage
  };

  // Structured data for Website
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${personalInfo.name} Portfolio`,
    description: seoDescription,
    url: siteUrl,
    author: {
      '@type': 'Person',
      name: personalInfo.name
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="author" content={personalInfo.name} />
      <meta name="keywords" content="portfolio, developer, react, web development, full stack, software engineer" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={`${personalInfo.name} Portfolio`} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:author" content={personalInfo.name} />
          <meta property="article:published_time" content={new Date().toISOString()} />
        </>
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      {/* Theme Color */}
      <meta name="theme-color" content="#6366f1" />
      
      {/* Robots */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool,
};

SEO.defaultProps = {
  title: '',
  description: '',
  type: 'website',
  image: '',
  article: false,
};

export default SEO;
