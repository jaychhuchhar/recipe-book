# Recipe Book - Professional Recipe Management System

A modern, feature-rich recipe management application built with Next.js and Fumadocs, featuring advanced image management, theme-aware step numbering, and a beautiful user interface.

## 🌟 Key Features

- **📚 Organized Recipe Collection**: 13+ standardized recipes across multiple categories
- **🖼️ Advanced Image Management**: Intelligent image detection with step-by-step visuals
- **🎨 Theme-Aware Design**: Seamless light/dark mode with professional step numbering
- **📱 Responsive Layout**: Optimized for all devices and screen sizes
- **🔍 Full-Text Search**: Powerful search across all recipes and content
- **⚡ Fast Performance**: Built with Next.js 15 and optimized for speed

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# http://localhost:3000
```

## 📋 Project Structure

```
recipe-book/
├── components/              # React components
│   ├── SimpleInstructions.tsx    # Step numbering system
│   ├── ServerStepImage.tsx       # Image management
│   └── KeenSliderImageCarousel.tsx # Image carousels
├── content/docs/           # Recipe content (MDX)
│   ├── breakfast/
│   ├── lunch/
│   ├── dinner/
│   └── snacks/
├── public/images/recipes/  # Recipe images
└── docs/                   # Comprehensive documentation
```

## 🎯 Usage Example

```tsx
<InstructionsContainer>
  <InstructionsSection title="Preparation">
    <InstructionStep stepNumber={1}>
      Heat olive oil in a large skillet over medium-high heat.
    </InstructionStep>
    <ServerStepImage recipeSlug="breakfast/avocado-toast-egg" stepNumber={1} />
    
    <InstructionStep stepNumber={2}>
      Toast bread until golden brown and crispy.
    </InstructionStep>
    <ServerStepImage recipeSlug="breakfast/avocado-toast-egg" stepNumber={2} />
  </InstructionsSection>
</InstructionsContainer>
```

## ✨ Enhanced Features

### Perfect Step Numbering
- **Theme-aware colors**: Subtle gray backgrounds with high contrast text
- **Perfect alignment**: Center-aligned with instruction text baseline
- **Professional design**: 28px circular indicators with optimized typography

### Intelligent Image System
- **Auto-detection**: Automatically finds and displays step images
- **Multiple formats**: Supports JPG, PNG, WebP, and AVIF
- **Flexible naming**: Both modern (`1.jpg`, `1.1.jpg`) and legacy (`step-1.jpg`) support
- **Responsive sizing**: Small, medium, and large size options

### Advanced Components
- **`InstructionsContainer`**: Main wrapper for recipe instructions
- **`InstructionsSection`**: Grouped steps with section titles
- **`InstructionStep`**: Individual steps with automatic numbering
- **`ServerStepImage`**: Optimized server-side image detection

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Complete Documentation Index](./docs/README.md)** - Start here for full overview
- **[Step Images Guide](./docs/STEP_IMAGES.md)** - How to add step-by-step images
- **[Image Management](./docs/IMAGE_MANAGEMENT.md)** - Complete image system guide
- **[Step Numbering](./docs/STEP_NUMBERING_ENHANCEMENT.md)** - Enhanced numbering system
- **[Project Summary](./docs/PROJECT_COMPLETION_SUMMARY.md)** - Complete feature overview

## 🛠️ Development

### Recipe Creation
1. Create new MDX file in appropriate category folder
2. Use the automated setup script: `node scripts/setup-recipe-images.js`
3. Add step images to the generated directories
4. Implement using the standardized component pattern

### Image Management
- **Overview images**: `/public/images/recipes/[category]/[recipe]/overview/`
- **Step images**: `/public/images/recipes/[category]/[recipe]/steps/`
- **Naming**: `1.jpg`, `2.jpg` for main steps; `1.1.jpg`, `1.2.jpg` for sub-steps

### Theme System
The application features a sophisticated theme system with:
- CSS custom properties for consistent theming
- Automatic color adaptation for components
- High contrast ratios for accessibility
- Smooth transitions between light/dark modes

## 🎨 Design Highlights

- **Professional Typography**: Optimized font weights and sizes
- **Subtle Color Palette**: Carefully selected theme-aware colors
- **Perfect Spacing**: Mathematically precise gaps and margins
- **Accessible Design**: WCAG compliant contrast ratios
- **Modern UI**: Clean, minimalist interface focused on content

## 📊 Project Statistics

- **Version**: 3.0 - Perfect Alignment & Professional Design
- **Components**: 6 major UI components
- **Recipes**: 13+ standardized recipes
- **Documentation**: 9 comprehensive guides
- **Image Support**: Multi-format with auto-detection
- **Theme Support**: Full light/dark mode integration

## 🚀 Production Ready

This application is production-ready with:
- ✅ Comprehensive error handling
- ✅ Performance optimizations
- ✅ Responsive design
- ✅ SEO optimization
- ✅ Accessibility compliance
- ✅ Complete documentation

## 🤝 Technologies

Built with modern technologies:
- **[Next.js 15](https://nextjs.org/)** - React framework with app directory
- **[Fumadocs](https://fumadocs.vercel.app/)** - Documentation framework
- **[MDX](https://mdxjs.com/)** - Markdown with JSX components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Keen Slider](https://keen-slider.io/)** - Touch-friendly image carousels
