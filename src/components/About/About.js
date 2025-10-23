import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaUser, FaGraduationCap, FaCode, FaHeart } from 'react-icons/fa';
import { personalInfo } from '../../data/portfolioData';
import CounterNumber from './CounterNumber';
import './About.css';

const About = () => {
  const [activeTab, setActiveTab] = useState('bio');

  const tabs = [
    { id: 'bio', label: 'Bio', icon: <FaUser /> },
    { id: 'journey', label: 'My Journey', icon: <FaGraduationCap /> },
    { id: 'passion', label: 'What I Love', icon: <FaHeart /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const tabContent = {
    bio: {
      title: "Hello, I'm a Full Stack Developer",
      content: [
        "With a passion for creating innovative web applications, I specialize in React, Node.js, and modern web technologies. My journey in web development started with curiosity and has evolved into a deep love for solving complex problems through code.",
        "I believe in writing clean, maintainable code and staying updated with the latest industry trends. My experience spans from frontend interfaces to backend architectures, allowing me to build complete solutions that users love.",
        "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community."
      ]
    },
    journey: {
      title: "My Development Journey",
      content: [
        "🎯 Started with HTML, CSS, and JavaScript fundamentals",
        "⚛️ Mastered React and modern frontend development",
        "🔧 Expanded into Node.js and backend technologies",
        "🚀 Built full-stack applications and deployed to production",
        "📚 Continuously learning and adapting to new technologies",
        "👥 Collaborated with teams on real-world projects"
      ]
    },
    passion: {
      title: "What Drives Me",
      content: [
        "💡 Problem-solving and turning ideas into reality",
        "🎨 Creating beautiful, intuitive user experiences",
        "⚡ Performance optimization and clean architecture",
        "🌐 Building applications that make a difference",
        "📖 Sharing knowledge and mentoring others",
        "🔄 Continuous learning and self-improvement"
      ]
    }
  };

  const stats = [
    { number: 4, label: 'Projects Completed', icon: <FaCode /> },
    { number: 100, label: 'Client Satisfaction', icon: <FaHeart />, suffix: '%' }
  ];

  return (
    <section id="about" className="about-section">
      <div className="container">
        <motion.div
          className="about-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title gradient-text">About Me</h2>
            <p className="section-subtitle">
              Get to know more about my background, skills, and passion for development
            </p>
          </motion.div>

          <div className="about-content">
            {/* Profile Image */}
            <motion.div 
              className="about-image-container"
              variants={imageVariants}
            >
              <div className="image-wrapper">
                <img 
                  src={personalInfo.profileImage} 
                  alt={personalInfo.name}
                  className="profile-image"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop';
                  }}
                />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <h3>{personalInfo.name}</h3>
                    <p>{personalInfo.title}</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="floating-elements">
                <motion.div 
                  className="floating-element element-1"
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: 'easeInOut' 
                  }}
                />
                <motion.div 
                  className="floating-element element-2"
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: 'easeInOut' 
                  }}
                />
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div 
              className="about-text-container"
              variants={itemVariants}
            >
              {/* Tab Navigation */}
              <div className="tab-navigation">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.icon}
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <motion.div 
                className="tab-content"
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="content-title">{tabContent[activeTab].title}</h3>
                <div className="content-text">
                  {tabContent[activeTab].content.map((item, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={activeTab === 'journey' || activeTab === 'passion' ? 'list-item' : ''}
                    >
                      {item}
                    </motion.p>
                  ))}
                </div>
              </motion.div>

              {/* Download Resume Button */}
              <motion.div 
                className="resume-section"
                variants={itemVariants}
              >
                <motion.a
                  href={personalInfo.resumeUrl}
                  className="btn btn-primary resume-btn"
                  download
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaDownload />
                  Download Resume
                </motion.a>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div 
            className="stats-container"
            variants={itemVariants}
          >
            {stats.map((stat, index) => (
              <CounterNumber
                key={index}
                end={stat.number}
                suffix={stat.suffix || ''}
                duration={2000}
                icon={stat.icon}
                label={stat.label}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;