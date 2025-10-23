import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaPaperPlane } from 'react-icons/fa';
import { personalInfo, socialLinks } from '../../data/portfolioData';
import { useToast } from '../../contexts/ToastContext';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const formRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const { success, error: showError } = useToast();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      showError('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // EmailJS Configuration - Using environment variables for security
      const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'rajpatel_63516';
      const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_n26zuov';
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'UMiEVubRVk5QCR8im';
      
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: personalInfo.name,
      };

      await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        publicKey
      );
      
      setSubmitStatus('success');
      success('Message sent successfully! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('EmailJS Error:', err);
      }
      setSubmitStatus('error');
      showError('Failed to send message. Please try again or contact me directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ref = sectionRef;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`
    },
    {
      icon: <FaPhone />,
      label: 'Phone',
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone}`
    },
    {
      icon: <FaMapMarkerAlt />,
      label: 'Location',
      value: personalInfo.location,
      href: null
    }
  ];

  const socialData = [
    {
      icon: <FaGithub />,
      label: 'GitHub',
      href: socialLinks.github
    },
    {
      icon: <FaLinkedin />,
      label: 'LinkedIn',
      href: socialLinks.linkedin
    }
  ];

  return (
    <section id="contact" className="contact-section" ref={ref}>
      <div className="container">
        <motion.div
          className="contact-container"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title gradient-text">Get In Touch</h2>
            <p className="section-subtitle">
              Looking for a Full Stack Developer? Let's discuss your project and build something extraordinary together!
            </p>
          </motion.div>

          {/* Contact Content */}
          <div className="contact-content">
            {/* Contact Information */}
            <motion.div className="contact-info" variants={itemVariants}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '2rem'
              }}>
                Contact Information
              </h3>

              <div style={{ marginBottom: '3rem' }}>
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem'
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '50px',
                      height: '50px',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-600)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '1.2rem'
                    }}>
                      {info.icon}
                    </div>
                    <div>
                      <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        marginBottom: '0.25rem'
                      }}>
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          style={{
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            fontWeight: '500'
                          }}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <span style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500'
                        }}>
                          {info.value}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem'
                }}>
                  Follow Me
                </h4>
                <div style={{
                  display: 'flex',
                  gap: '1rem'
                }}>
                  {socialData.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '45px',
                        height: '45px',
                        background: 'var(--bg-elevated)',
                        color: 'var(--text-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        textDecoration: 'none',
                        fontSize: '1.2rem',
                        transition: 'all 0.3s ease'
                      }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: 'var(--primary-500)',
                        color: 'white'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              className="contact-form"
              variants={itemVariants}
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--bg-elevated)',
                    border: `1px solid ${errors.name ? '#ef4444' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
                {errors.name && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--bg-elevated)',
                    border: `1px solid ${errors.email ? '#ef4444' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
                {errors.email && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject *"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--bg-elevated)',
                    border: `1px solid ${errors.subject ? '#ef4444' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
                {errors.subject && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {errors.subject}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <textarea
                  name="message"
                  placeholder="Your Message *"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--bg-elevated)',
                    border: `1px solid ${errors.message ? '#ef4444' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
                {errors.message && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {errors.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '1rem 2rem',
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </motion.button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'var(--success-100)',
                    color: 'var(--success-700)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center'
                  }}
                >
                  Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'var(--error-100)',
                    color: 'var(--error-700)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center'
                  }}
                >
                  Something went wrong. Please try again.
                </motion.div>
              )}
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;