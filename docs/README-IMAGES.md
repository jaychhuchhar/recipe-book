# Quick Start Guide: Recipe Image Management

## ✨ What's New

Your recipe book now has a **structured image management system** that automatically detects and displays local images with fallbacks to external URLs.

## 🚀 Quick Setup

1. **Create image directories** (one-time setup):
   ```bash
   npm run setup-images
   ```

2. **Add your images** to the created directories:
   ```
   public/images/recipes/[recipe-slug]/
   ├── overview/    # Recipe hero/overview images  
   └── steps/       # Step-by-step cooking images
   ```

3. **Use in recipes** (optional for step images):
   ```jsx
   <RecipeStepImages recipeSlug="breakfast/avocado-toast-egg" alt="Cooking steps" />
   ```

## 📁 Directory Structure Example

```
public/images/recipes/
├── breakfast/
│   └── avocado-toast-egg/
│       ├── overview/
│       │   ├── main.jpg      ← Main recipe photo
│       │   ├── 1.jpg         ← Additional angles
│       │   └── final.jpg     ← Plated result
│       └── steps/
│           ├── step-1.jpg    ← Mashing avocado
│           ├── step-2.jpg    ← Toasting bread
│           └── step-3.jpg    ← Final assembly
├── dinner/
│   └── chicken-tikka-masala/
│       ├── overview/
│       └── steps/
└── ... (all other recipes)
```

## 🖼️ Image Naming Conventions

### Overview Images (Auto-displayed on recipe pages)
- `main.jpg` - Primary recipe image ⭐ **Recommended**
- `1.jpg`, `2.jpg`, `3.jpg` - Additional overview photos
- `hero.jpg` - Hero/banner image  
- `final.jpg` - Final plated result

### Step Images (Use with RecipeStepImages component)
- `1.jpg`, `2.jpg`, `3.jpg` - Main cooking steps ⭐ **New Default**
- `1.1.jpg`, `1.2.jpg` - Sub-steps for detailed instructions ✨ **New!**
- `2.1.jpg`, `2.2.jpg` - Sub-steps for step 2, etc. ✨ **New!**
- `step-1.jpg`, `step-2.jpg` - Legacy naming (still supported)

## 🔧 Supported Formats
- `.jpg` / `.jpeg`
- `.png` 
- `.webp`
- `.avif`

## 📝 Usage in MDX Files

### Basic Step Images
```jsx
<ServerStepImage recipeSlug="breakfast/avocado-toast-egg" stepNumber={1} alt="Main step" />
```

### Sub-step Images (New!)
```jsx
<ServerStepImage recipeSlug="breakfast/avocado-toast-egg" stepNumber="1.1" alt="Sub-step" />
<ServerStepImage recipeSlug="breakfast/avocado-toast-egg" stepNumber="1.2" alt="Another sub-step" />
```

### Manual Step Images (fallback)
```jsx
<RecipeStepImages 
  stepImages={[
    "https://example.com/step1.jpg",
    "https://example.com/step2.jpg"
  ]} 
  alt="Cooking steps" 
/>
```

## 🎯 Priority System

1. **Local images** (in `/public/images/recipes/`) - **Highest priority**
2. **Frontmatter images** (in recipe MDX `images:` field) - **Fallback**
3. **Logo.png** - **Final fallback**

## ✅ Benefits

- **Automatic detection** - No manual configuration needed
- **Performance** - Optimized local images load faster
- **Fallbacks** - Graceful degradation to external URLs
- **Responsive** - All images work perfectly on mobile/desktop
- **SEO friendly** - Proper alt tags and optimized loading

## 🎮 Try It Now

1. The system is already set up with directories for all your recipes
2. Add an image to `public/images/recipes/breakfast/avocado-toast-egg/overview/main.jpg`
3. Visit the avocado toast recipe page to see it automatically appear!

## 📚 Full Documentation

See `docs/IMAGE_MANAGEMENT.md` for complete technical details.

---

**Happy cooking! 🍳**
