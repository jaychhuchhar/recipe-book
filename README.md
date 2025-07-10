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

# Run development server (automatically sets up images and converts recipes)
npm run dev

# Build for production (automatically sets up images and converts recipes)
npm run build

# Open in browser
# http://localhost:3000
```

## 📝 Recipe Management

This project features a fully automated recipe and image management system:

### 🔄 Automated Workflow
- **Text Sources**: Write recipes in simple text format in the `recipes/` folder with category subfolders
- **Automatic Conversion**: Text files are automatically converted to MDX during dev and build
- **Image Management**: Recipe image directories are automatically created and cleaned up
- **Batch Processing**: Convert all recipes at once with automatic cleanup of orphaned files
- **Flexible Categories**: Use any folder name in `recipes/` as a category, or place uncategorized recipes in the root
- **Step Images**: Auto-detected from `Alt:` lines in recipe instructions
- **YouTube Support**: Embed external videos with auto-generated titles

### 🛠️ Manual Commands
- **Convert Recipes**: `npm run convert` (batch) or `npm run convert-recipe file.txt` (single)
- **Setup Images**: `npm run setup-images` (creates directories, cleans up unused ones)
- **Optimize Images**: `npm run convert-images` (optimize all source images for web)
- **Generate WebP**: `npm run convert-images-webp` (create WebP versions for modern browsers)
- **Analyze Images**: `npm run analyze-images` (analyze source images and identify large files)
- **No Setup Required**: Development and build scripts handle everything automatically

## 📋 Project Structure

```
recipe-book/
├── recipes/                # Source materials
│   ├── breakfast/          # Recipe text files by category
│   ├── lunch/
│   ├── dinner/
│   ├── snacks/
│   ├── images/             # Original high-quality images (source)
│   │   ├── [recipe-name]/
│   │   │   ├── overview/   # Hero and overview images
│   │   │   └── steps/      # Step-by-step images
│   │   └── README.md       # Image workflow documentation
│   └── _templates/         # Recipe templates
├── content/docs/           # Generated MDX files (organized by category)
│   ├── breakfast/
│   ├── lunch/
│   ├── dinner/
│   └── snacks/
├── public/images/recipes/  # Optimized images for web (auto-generated)
│   ├── [recipe-name]/
│   │   ├── overview/       # Optimized overview images + WebP
│   │   └── steps/          # Optimized step images + WebP
├── scripts/                # Automation scripts
│   ├── recipe-converter.js      # Text to MDX conversion
│   ├── setup-recipe-images.js   # Image directory management
│   ├── optimize-images.js       # Image analysis and reporting
│   └── convert-images.js        # Image optimization (source → web)
├── components/             # React components
│   ├── SimpleInstructions.tsx   # Step numbering system
│   ├── ServerStepImage.tsx      # Image management
│   └── KeenSliderImageCarousel.tsx # Image carousels
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

- **[Recipe Converter](./docs/RECIPE_CONVERTER.md)** - Automated text to MDX conversion
- **[Image Management](./docs/IMAGE_MANAGEMENT.md)** - Complete image system guide
- **[Step Numbering](./docs/STEP_NUMBERING_ENHANCEMENT.md)** - Enhanced numbering system
- **[Project Summary](./docs/PROJECT_COMPLETION_SUMMARY.md)** - Complete feature overview

## 🛠️ Development

### Recipe Creation
1. Create new text file in appropriate category folder in `recipes/`
2. Use the template from `recipes/_templates/recipe-template.txt`
3. Include `Alt:` lines after instruction steps for step images
4. Add YouTube links as external sources (auto-title generated)
5. Run `npm run dev` or `npm run convert` to generate MDX

### Automated Workflow
- **Development**: `npm run dev` automatically converts recipes and sets up images
- **Build**: `npm run build` automatically converts recipes and sets up images  
- **Manual Conversion**: `npm run convert` (batch) or `npm run convert-recipe file.txt` (single)
- **Manual Image Setup**: `npm run setup-images` (with cleanup) or `npm run setup-images -- --no-cleanup`

### Image Management
- **Source Images**: Store original high-quality images in `recipes/images/[recipe-name]/`
- **Optimized Images**: Automatically generated in `public/images/recipes/[recipe-name]/`
- **Image Optimization**: 90%+ file size reduction with quality preservation
- **Multiple Formats**: JPEG optimization + WebP generation for modern browsers
- **Flexible Naming**: Supports `1.jpg`, `01.jpg`, `step-1.jpg`, `15-1.jpg` (multi-image steps)
- **Auto-cleanup**: Unused directories and empty folders are automatically removed
- **Performance**: Dramatically reduced load times and bandwidth usage

### Theme System
The application features a sophisticated theme system with:
- CSS custom properties for consistent theming
- Automatic color adaptation for components
- High contrast ratios for accessibility
- Smooth transitions between light/dark modes

## 🌐 WebP Support and Automatic Optimization

The recipe book now includes automatic WebP generation and intelligent format serving:

### Automatic Format Selection
- **Modern Browsers**: Automatically serve WebP format (20-40% smaller files)
- **Legacy Browsers**: Fallback to optimized JPEG/PNG
- **No Configuration**: Browser automatically selects the best format available

### How It Works
1. **Source Images**: Store original high-quality images in `recipes/images/`
2. **Optimization**: Build process generates both optimized JPEG and WebP versions
3. **Smart Serving**: Browser receives the optimal format automatically using HTML `<picture>` elements
4. **Fallback Support**: Ensures compatibility with all browsers

### Performance Benefits
- **WebP**: 20-40% smaller than equivalent JPEG with same quality
- **Automatic Detection**: No manual browser detection needed
- **Progressive Enhancement**: Enhanced performance for modern browsers, full compatibility for older ones
- **Bandwidth Savings**: Significant reduction in data transfer

### Implementation
The system uses HTML `<picture>` elements with multiple `<source>` tags:

```html
<picture>
  <source srcSet="/images/recipes/recipe/image.webp" type="image/webp" />
  <img src="/images/recipes/recipe/image.jpg" alt="Recipe image" />
</picture>
```

This ensures the browser automatically selects the best format it supports.

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
