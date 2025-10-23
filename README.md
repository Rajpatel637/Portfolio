# 🚀 Modern Portfolio Website

A fully-featured, responsive portfolio website built with React. Features dark/light themes, 3D animations, contact form, PWA support, and optimized performance.

## 🚀 Quick Start

```powershell
# Install and run
npm install
npm start
```

Visit `http://localhost:3000` - Your portfolio is ready!

## ⚙️ Configuration (15 minutes)

### 1. EmailJS Setup (Contact Form)

1. Create free account at [EmailJS](https://dashboard.emailjs.com/)
2. Add email service and create template with variables: `{{from_name}}`, `{{from_email}}`, `{{message}}`
3. Update credentials in `src/components/Contact/Contact.js` (~line 80)

### 2. Add Your Content

Edit `src/data/portfolioData.js`:

- **Personal info**: name, title, email, phone, bio
- **Social links**: GitHub, LinkedIn, Twitter
- **Projects**: title, description, technologies, images, links
- **Skills**: frontend, backend, tools

### 3. Add Assets

- Resume: `public/assets/documents/resume.pdf`
- Project images: `public/assets/images/projectX.jpg`

## 📦 Commands

| Command           | Purpose                             |
| ----------------- | ----------------------------------- |
| `npm start`       | Development server (localhost:3000) |
| `npm run build`   | Production build                    |
| `npm test`        | Run tests                           |
| `npm run analyze` | Analyze bundle size                 |

## 🚢 Deploy (Choose One)

**Vercel** (Recommended)

```powershell
npm install -g vercel
vercel
```

**Netlify**

1. Push to GitHub
2. Connect at [Netlify](https://app.netlify.com/)
3. Build: `npm run build`, Publish: `build`

**GitHub Pages**

```powershell
npm install --save-dev gh-pages
# Add to package.json: "homepage": "https://yourusername.github.io/portfolio"
npm run deploy
```

## 🎨 Customization

**Theme Colors**: Edit `src/contexts/ThemeContext.js`

```javascript
const lightTheme = {
  background: "#ffffff",
  text: "#1a1a1a",
  primary: "#007bff",
};
const darkTheme = {
  background: "#0a0a0a",
  text: "#ffffff",
  primary: "#00d4ff",
};
```

**Analytics**: Add GA4 ID in `src/utils/analytics.js`

## 🔧 Tech Stack

React 19 • Three.js • Framer Motion • EmailJS • React Router • Styled Components • PWA • Jest

## 📁 Structure

```
src/
├── components/        # UI components (Hero, About, Projects, Contact, etc.)
├── contexts/          # ThemeContext, ToastContext
├── data/             # portfolioData.js (all content)
├── utils/            # Analytics, optimization utilities
└── App.js

public/
└── assets/
    ├── documents/    # resume.pdf
    └── images/       # project images
```

## 🐛 Troubleshooting

**Contact form not working?** Verify EmailJS credentials in `Contact.js`

**Build fails?** Clear cache: `rm -rf node_modules package-lock.json; npm install`

**Theme not saving?** Enable browser localStorage

**Images not loading?** Use paths like `/assets/images/project1.jpg`

---

**License**: MIT | **Made with** ❤️ | [GitHub](https://github.com/yourusername) • [LinkedIn](https://linkedin.com/in/yourusername)
