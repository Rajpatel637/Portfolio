import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaGithub, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import { trackProjectView, trackExternalLink } from '../../utils/analytics';
import './ProjectModal.css';

const ProjectModal = ({ project, isOpen, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      
      // Track project view
      if (project) {
        trackProjectView(project.title);
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, project]);

  if (!project) return null;

  const handleLinkClick = (url, type) => {
    trackExternalLink(url, `${project.title} - ${type}`);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="modal-wrapper">
            <motion.div
              className="project-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>

              {/* Modal Content */}
              <div className="modal-content">
                {/* Project Image */}
                <div className="modal-image-container">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="modal-image"
                  />
                  <div className="modal-image-overlay">
                    <span className="project-category-badge">
                      {project.category}
                    </span>
                    <span className={`project-status-badge ${project.status}`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="modal-body">
                  {/* Title and Links */}
                  <div className="modal-header">
                    <h2 className="modal-title">{project.title}</h2>
                    <div className="modal-links">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="modal-link"
                          title="View on GitHub"
                          onClick={() => handleLinkClick(project.githubUrl, 'GitHub')}
                          aria-label={`View ${project.title} on GitHub`}
                        >
                          <FaGithub aria-hidden="true" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="modal-link modal-link-primary"
                          title="View Live Demo"
                          onClick={() => handleLinkClick(project.liveUrl, 'Live Demo')}
                          aria-label={`View ${project.title} live demo`}
                        >
                          <FaExternalLinkAlt aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="modal-section">
                    <h3 className="modal-section-title">About</h3>
                    <p className="modal-description">
                      {project.longDescription || project.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div className="modal-section">
                    <h3 className="modal-section-title">Technologies</h3>
                    <div className="modal-tech-stack">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  {project.features && project.features.length > 0 && (
                    <div className="modal-section">
                      <h3 className="modal-section-title">Key Features</h3>
                      <ul className="modal-features-list">
                        {project.features.map((feature, index) => (
                          <li key={index} className="modal-feature-item">
                            <FaCheck className="feature-icon" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Challenges */}
                  {project.challenges && (
                    <div className="modal-section">
                      <h3 className="modal-section-title">Challenges & Solutions</h3>
                      <p className="modal-challenges">
                        {project.challenges}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="modal-actions">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-btn modal-btn-primary"
                      >
                        <FaExternalLinkAlt />
                        View Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-btn modal-btn-secondary"
                      >
                        <FaGithub />
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
