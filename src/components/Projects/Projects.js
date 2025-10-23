import React, { useState, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode, FaLaptop, FaServer, FaDatabase } from 'react-icons/fa';
import { projects } from '../../data/portfolioData';
import ProjectModal from '../ProjectModal/ProjectModal';
import './Projects.css';

// Memoized ProjectCard component for better performance
const ProjectCard = React.memo(({ project, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(project);
  }, [project, onClick]);

  const handleGitHubClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleDemoClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }), []);

  return (
    <motion.div
      className="project-card-simple"
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label={`View details for ${project.title}`}
    >
      <div 
        className="project-image-simple"
        style={{
          backgroundImage: `url(${project.image})`
        }}
        role="img"
        aria-label={`${project.title} screenshot`}
      >
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'var(--primary-500)',
          color: 'white',
          padding: '0.25rem 0.625rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: '500',
          zIndex: 2,
          textTransform: 'capitalize'
        }}>
          {project.category}
        </div>
      </div>
      
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          color: 'var(--text-primary)',
          lineHeight: '1.3'
        }}>
          {project.title}
        </h3>
        
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '0.75rem',
          lineHeight: '1.5',
          fontSize: '0.875rem',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {project.description}
        </p>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.375rem',
          marginBottom: '0.75rem'
        }}>
          {project.technologies?.slice(0, 3).map((tech, index) => (
            <span key={`${project.id}-${tech}-${index}`} style={{
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              padding: '0.25rem 0.625rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              {tech}
            </span>
          ))}
          {project.technologies?.length > 3 && (
            <span style={{
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              padding: '0.25rem 0.625rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleGitHubClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.8125rem',
                fontWeight: '500'
              }}
              whileHover={{ color: 'var(--primary-500)' }}
              aria-label={`View ${project.title} source code on GitHub`}
            >
              <FaGithub aria-hidden="true" /> Code
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDemoClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.8125rem',
                fontWeight: '500'
              }}
              whileHover={{ color: 'var(--primary-500)' }}
              aria-label={`View ${project.title} live demo`}
            >
              <FaExternalLinkAlt aria-hidden="true" /> Demo
            </motion.a>
          )}
          {project.status === 'in-progress' && (
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              color: 'var(--accent-color)',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-color)',
                animation: 'pulse 2s infinite'
              }} />
              In Progress
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string.isRequired,
    githubUrl: PropTypes.string,
    liveUrl: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

ProjectCard.displayName = 'ProjectCard';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const filters = useMemo(() => [
    { id: 'all', label: 'All Projects', icon: <FaCode aria-hidden="true" /> },
    { id: 'fullstack', label: 'Full Stack', icon: <FaServer aria-hidden="true" /> },
    { id: 'frontend', label: 'Frontend', icon: <FaLaptop aria-hidden="true" /> },
    { id: 'backend', label: 'Backend', icon: <FaDatabase aria-hidden="true" /> }
  ], []);

  const filteredProjects = useMemo(() => {
    return activeFilter === 'all' 
      ? projects 
      : projects.filter(project => project.category === activeFilter);
  }, [activeFilter]);

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  }, []);

  const handleFilterChange = useCallback((filterId) => {
    setActiveFilter(filterId);
  }, []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }), []);

  return (
    <section id="projects" className="projects-section" ref={ref}>
      <div className="container">
        <motion.div
          className="projects-container"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title gradient-text">Featured Projects</h2>
            <p className="section-subtitle">
              A showcase of my recent work and personal projects
            </p>
          </motion.div>

          {/* Filter Navigation */}
          <motion.div 
            className="filter-nav"
            variants={itemVariants}
            role="tablist"
            aria-label="Project filter"
          >
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                role="tab"
                aria-selected={activeFilter === filter.id}
                aria-controls="projects-grid"
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.icon}
                {filter.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            id="projects-grid"
            role="tabpanel"
            className="projects-grid-simple"
            variants={containerVariants}
          >
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={handleProjectClick}
              />
            ))}
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div 
              variants={itemVariants}
              style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}
            >
              <p>No projects found for this category.</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Projects;
