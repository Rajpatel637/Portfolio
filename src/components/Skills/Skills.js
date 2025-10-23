import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FaReact, FaJs, FaHtml5, FaCss3Alt, FaSass, FaNode, FaPython, 
  FaPhp, FaGitAlt, FaDocker, FaAws, FaFigma, FaVuejs, FaServer
} from 'react-icons/fa';
import { 
  SiTypescript, SiThreedotjs, SiExpress, SiGraphql, SiMongodb, 
  SiMysql, SiPostgresql, SiFirebase, SiVscodium
} from 'react-icons/si';
import { skills } from '../../data/portfolioData';
import './Skills.css';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const iconMap = {
    FaReact, FaJs, FaHtml5, FaCss3Alt, FaSass, FaNode, FaPython,
    FaPhp, FaGitAlt, FaDocker, FaAws, FaFigma, FaVuejs, FaServer,
    SiTypescript, SiThreedotjs, SiExpress, SiGraphql, SiMongodb,
    SiMysql, SiPostgresql, SiFirebase, SiVscodium
  };

  const categories = [
    { id: 'frontend', label: 'Frontend', icon: <FaReact /> },
    { id: 'backend', label: 'Backend', icon: <FaNode /> },
    { id: 'database', label: 'Database', icon: <SiMongodb /> },
    { id: 'tools', label: 'Tools', icon: <FaGitAlt /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <section id="skills" className="skills-section" ref={ref}>
      <div className="container">
        <motion.div
          className="skills-container"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title gradient-text">Technical Skills</h2>
            <p className="section-subtitle">
              Technologies and tools I use to bring ideas to life
            </p>
          </motion.div>

          {/* Category Navigation */}
          <motion.div className="category-nav" variants={itemVariants}>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
                {category.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Skills Grid - Simplified */}
          <motion.div 
            className="skills-grid-simple"
            variants={containerVariants}
            key={activeCategory}
          >
            {skills[activeCategory]?.map((skill, _index) => {
              const IconComponent = iconMap[skill.icon];
              return (
                <motion.div
                  key={skill.name}
                  className="skill-card-simple"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="skill-icon">
                    {IconComponent && <IconComponent />}
                  </div>
                  <h4 className="skill-name">{skill.name}</h4>
                  <div className="skill-level">
                    <div 
                      className="skill-bar"
                      style={{ width: `${skill.level}%` }}
                    />
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;