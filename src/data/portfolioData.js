// Portfolio data configuration
export const personalInfo = {
  name: "Raj Patel",
  title: "Full Stack Developer",
  bio: "Passionate full-stack developer with expertise in React, Node.js, and modern web technologies. I love creating intuitive and dynamic web applications that solve real-world problems.",
  email: "rajpatel63516@gmail.com",
  location: "India",
  resumeUrl: "/assets/documents/resume.pdf",
  profileImage: "/assets/images/2203031241012.jpg"
};

export const socialLinks = {
  github: "https://github.com/Rajpatel637",
  linkedin: "https://linkedin.com/in/rajpatel6373"
};

export const skills = {
  frontend: [
    { name: "React", level: 90, icon: "FaReact" },
    { name: "JavaScript", level: 85, icon: "FaJs" },
    { name: "TypeScript", level: 80, icon: "SiTypescript" },
    { name: "HTML5", level: 95, icon: "FaHtml5" },
    { name: "CSS3", level: 90, icon: "FaCss3Alt" }
  ],
  backend: [
    { name: "Node.js", level: 85, icon: "FaNode" },
    { name: "Express.js", level: 80, icon: "SiExpress" },
    { name: "Python", level: 75, icon: "FaPython" },
    { name: "REST APIs", level: 85, icon: "FaServer" }
  ],
  database: [
    { name: "MongoDB", level: 80, icon: "SiMongodb" },
    { name: "MySQL", level: 75, icon: "SiMysql" }
  ],
  tools: [
    { name: "Git", level: 90, icon: "FaGitAlt" },
    { name: "VS Code", level: 95, icon: "SiVscodium" }
  ]
};

export const projects = [
  {
    id: 1,
    title: "Movieplex",
    description: "A comprehensive movie discovery platform with advanced search, ratings, and personalized recommendations.",
    longDescription: "Movieplex is a full-featured movie application that allows users to discover, search, and track their favorite movies. Built with React and integrated with TMDB API, it features movie search, detailed information, ratings, and a clean, responsive interface for browsing popular, trending, and upcoming movies.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=500&fit=crop",
    technologies: ["React.js", "JavaScript", "TMDB API", "CSS3", "React Router", "Axios", "HTML5"],
    category: "frontend",
    features: [
      "Movie search with real-time results",
      "Browse popular, trending, and upcoming movies",
      "Detailed movie information and ratings",
      "Movie trailers and cast information",
      "Fully responsive design",
      "Genre-based filtering"
    ],
    challenges: "Implementing efficient API data fetching with error handling, managing application state, creating smooth transitions between views, and optimizing performance for large datasets.",
    liveUrl: "https://movieplex-one.vercel.app/",
    githubUrl: "https://github.com/Rajpatel637/Movieplex",
    status: "completed"
  },
  {
    id: 2,
    title: "UniEats",
    description: "A food delivery system designed specifically for university students with campus-wide delivery tracking.",
    longDescription: "UniEats is a comprehensive food delivery platform tailored for university campuses. It connects students with local restaurants and campus food courts, featuring real-time order tracking, modern UI/UX design, and campus-specific delivery zones. Currently in active development with exciting features being added.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop",
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "CSS3", "HTML5"],
    category: "fullstack",
    features: [
      "Modern and intuitive interface",
      "Restaurant menu browsing",
      "Order management system",
      "Campus delivery zones",
      "User authentication",
      "Responsive design"
    ],
    challenges: "Designing an intuitive user flow for food ordering, implementing efficient data management, creating a scalable backend architecture, and optimizing the application for mobile devices.",
    liveUrl: "",
    githubUrl: "",
    status: "in-progress"
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "A modern, interactive portfolio website showcasing my work and skills with smooth animations and dark mode.",
    longDescription: "This portfolio website is built with React and features a modern, interactive design with smooth animations powered by Framer Motion. It includes custom cursor effects, particle systems, theme switching, PWA capabilities, and is fully optimized for performance and SEO.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    technologies: ["React.js", "JavaScript", "Framer Motion", "EmailJS", "CSS3", "HTML5", "Service Workers", "PWA"],
    category: "frontend",
    features: [
      "Custom animated cursor",
      "Interactive particle system",
      "Dark/Light theme toggle",
      "Contact form with EmailJS integration",
      "Progressive Web App (PWA)",
      "Fully responsive design",
      "SEO optimized"
    ],
    challenges: "Creating smooth custom cursor animations, implementing efficient particle systems, optimizing performance for complex animations, and ensuring cross-browser compatibility.",
    liveUrl: "",
    githubUrl: "https://github.com/Rajpatel637/Portfolio",
    status: "completed"
  },
  {
    id: 4,
    title: "Todo List WebApp",
    description: "A clean and efficient todo application built with vanilla JavaScript for task management and organization.",
    longDescription: "A lightweight todo list application built with pure HTML, CSS, and JavaScript without any frameworks. Features local storage persistence, task management, and a clean user interface. Perfect example of vanilla JavaScript DOM manipulation and modern CSS techniques.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop",
    technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage API", "DOM Manipulation"],
    category: "frontend",
    features: [
      "Add, edit, and delete tasks",
      "Task completion tracking",
      "Local storage persistence",
      "Clean and minimal UI",
      "Responsive design",
      "Pure vanilla JavaScript implementation"
    ],
    challenges: "Implementing efficient DOM manipulation without frameworks, managing application state with vanilla JavaScript, creating smooth animations with CSS, and ensuring data persistence with localStorage.",
    liveUrl: "https://todo-list-webapp-ecru.vercel.app/",
    githubUrl: "https://github.com/Rajpatel637/todo-list-webapp",
    status: "completed"
  }
];

export const experience = [
  {
    id: 1,
    title: "Junior Full Stack Developer",
    company: "Tech Company",
    location: "City, Country",
    duration: "2023 - Present",
    type: "work",
    description: "Developing and maintaining web applications using React, Node.js, and MongoDB. Collaborated with cross-functional teams to deliver high-quality software solutions.",
    achievements: [
      "Improved application performance by 40%",
      "Led development of 3 major features",
      "Mentored 2 junior developers"
    ]
  },
  {
    id: 2,
    title: "Frontend Developer Intern",
    company: "Startup Inc",
    location: "City, Country",
    duration: "2022 - 2023",
    type: "work",
    description: "Focused on frontend development using React and modern JavaScript. Contributed to the company's main product redesign and optimization.",
    achievements: [
      "Redesigned user interface increasing user engagement by 25%",
      "Implemented responsive design across all platforms",
      "Reduced bundle size by 30% through optimization"
    ]
  },
  {
    id: 3,
    title: "Computer Science Degree",
    company: "University Name",
    location: "City, Country",
    duration: "2020 - 2024",
    type: "education",
    description: "Bachelor of Science in Computer Science with focus on web development and software engineering.",
    achievements: [
      "Graduated with honors (GPA: 3.8/4.0)",
      "Completed capstone project on web application security",
      "Active member of Computer Science Society"
    ]
  },
  {
    id: 4,
    title: "Started Learning Web Development",
    company: "Self-taught",
    location: "Home",
    duration: "2020",
    type: "milestone",
    description: "Began my journey in web development, starting with HTML, CSS, and JavaScript basics.",
    achievements: [
      "Completed first personal website",
      "Built 5+ practice projects",
      "Joined developer communities and forums"
    ]
  }
];

export const testimonials = [
  {
    id: 1,
    name: "John Doe",
    position: "Senior Developer at Tech Corp",
    message: "An exceptional developer with great attention to detail and problem-solving skills. Always delivers high-quality work on time.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    rating: 5
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Project Manager at Digital Agency",
    message: "Working with them was a pleasure. Their technical expertise and communication skills made our project a huge success.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    rating: 5
  }
];