# Dev Club Website - Quick Start Guide

## 🚀 Easy Setup (Recommended)

Run the automated setup script:

```bash
cd /Users/geetanshgoyal/Desktop/website/devforge-template
./setup.sh
```

This will:
1. Copy the template to `/Users/geetanshgoyal/Desktop/devforge`
2. Install all dependencies
3. Set up the project ready to run

## 📖 Manual Setup

If you prefer to set up manually:

### Step 1: Move the Template

```bash
cp -r /Users/geetanshgoyal/Desktop/website/devforge-template /Users/geetanshgoyal/Desktop/devforge
cd /Users/geetanshgoyal/Desktop/devforge
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run Development Server

```bash
npm run dev
```

### Step 4: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 What's Included

- ✅ **Modern Design**: Dark theme with orange accents
- ✅ **Glassmorphism Effects**: Beautiful glass-panel UI components
- ✅ **Smooth Animations**: Framer Motion powered animations
- ✅ **Fully Responsive**: Mobile, tablet, and desktop optimized
- ✅ **SEO Ready**: Proper metadata and semantic HTML
- ✅ **6 Sections**: Hero, About, Events, Projects, Team, Join + Footer

## 📁 Project Structure

```
devforge/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx             # Main landing page
│   └── globals.css          # Global styles
├── components/
│   ├── hero.tsx             # Hero section
│   ├── about.tsx            # About section
│   ├── events.tsx           # Events section
│   ├── projects.tsx         # Projects showcase
│   ├── team.tsx             # Team members
│   ├── join.tsx             # Join/Contact CTA
│   └── footer.tsx           # Footer
├── public/
│   └── logo.png             # Dev Club logo
└── package.json             # Dependencies
```

## ✏️ Customization

### Update Content

Edit component files in `/components` to change:
- Text content
- Images
- Links
- Team members
- Projects
- Events

### Update Colors

Edit `app/globals.css` and change the CSS variables:
```css
--accent: #f97316;          /* Primary orange */
--accent-strong: #ea580c;   /* Darker orange */
```

### Update Branding

- Replace `/public/logo.png` with your logo
- Update metadata in `app/layout.tsx`

## 🚢 Build for Production

```bash
npm run build
npm start
```

## 💡 Need Help?

Check the full README.md in the project root for detailed documentation.

---

**Built with ❤️ for Dev Club at NST x SVYASA**
