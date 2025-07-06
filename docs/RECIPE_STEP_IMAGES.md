# Recipe Step Images Guide

## 📸 Adding Step Images to Your Recipes

The recipe converter now supports step images! Here's how to use them effectively.

## 🚀 Quick Start

### 1. **In Your Text File**
Add alt text lines after instruction steps:

```
## Instructions

### Prepare Dough
1. Mix flour and salt in a large bowl
Alt: Dry ingredients mixed in large bowl
2. Add water gradually while stirring
Alt: Adding water to flour mixture
3. Knead until smooth
Alt: Smooth dough after kneading

### Bake
4. Shape into loaves
Alt: Shaped bread loaves ready for baking
5. Bake at 350°F for 30 minutes
Alt: Golden brown bread in the oven
```

### 2. **Convert with Images**
```bash
npm run convert-recipe examples/pancakes-with-images.txt --images
```

### 3. **Add Image Files**
Place your images in the correct directory structure:
```
public/images/recipes/pancakes-with-step-images/steps/
├── step1.jpg
├── step2.jpg
├── step3.jpg
├── step4.jpg
├── step5.jpg
├── step6.jpg
└── step7.jpg
```

## 📁 Image Organization

### **Automatic Directory Structure**
The converter creates recipes in folders like:
- `content/docs/breakfast/pancakes.mdx`

Your images should go in:
- `public/images/recipes/pancakes/steps/`

### **File Naming Convention**
- **Step Images**: `step1.jpg`, `step2.jpg`, etc.
- **Overview Images**: Place in `public/images/recipes/recipe-name/overview/`
- **Supported Formats**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`

## 🎯 Step Image Syntax

### **Basic Format**
```
1. Mix ingredients together
Alt: Basic alt text for the step
```

### **With Detailed Description**  
```
1. Mix flour and salt in large bowl
Alt: Dry ingredients mixed in large stainless steel bowl
```

### **Multiple Images per Step**
*Not currently supported - use separate instruction steps for multiple images*

## ✨ Generated Output

**Input:**
```
1. Mix flour and salt
Alt: Dry ingredients mixed in bowl
```

**Generated MDX:**
```jsx
<InstructionStep stepNumber={1}>
  Mix <strong>flour</strong> and <strong>salt</strong>
</InstructionStep>

<ServerStepImage stepNumber={1} alt="Dry ingredients mixed" caption="Dry ingredients mixed" />
```

## 🛠️ Image Management Commands

### **Setup Image Directories**
```bash
npm run setup-images recipe-name
```

### **Convert with Images**
```bash
npm run convert-recipe recipe.txt --images --category dinner
```

### **Check Image Structure**
```bash
# List all recipe image directories
ls public/images/recipes/

# Check specific recipe images
ls public/images/recipes/pancakes/steps/
```

## 📝 Best Practices

### **Image Quality**
- ✅ Use high-quality images (at least 800px wide)
- ✅ Good lighting and clear focus
- ✅ Consistent style across steps
- ✅ Optimize file sizes (compress images)

### **Step Selection**
- ✅ Focus on key technique moments
- ✅ Show before/after transformations
- ✅ Include critical visual cues
- ❌ Don't image every single step

### **Descriptions**
- ✅ Brief, descriptive alt text
- ✅ Explain what the image shows
- ✅ Help users understand the visual
- ❌ Don't just repeat the instruction

## 🎨 Image Sizing & Display

The `ServerStepImage` component supports different sizes:

```jsx
<ServerStepImage 
  stepNumber={1} 
  alt="Description" 
  caption="Caption"
  size="small"    // small, medium, large
/>
```

**Default**: `medium` (auto-responsive)

## 🔄 Workflow Example

### **1. Write Recipe with Image Placeholders**
```
Title: Chocolate Chip Cookies

## Instructions
1. Cream butter and sugar
   Alt: Creamed butter mixture
2. Add eggs and vanilla
   Alt: Adding wet ingredients
3. Mix in flour mixture
   Alt: Cookie dough consistency
4. Bake for 12 minutes
   Alt: Golden brown cookies
```

### **2. Convert Recipe**
```bash
npm run convert-recipe examples/cookies.txt --images --category desserts
```

### **3. Add Images**
```bash
mkdir -p public/images/recipes/chocolate-chip-cookies/steps
# Copy your step1.jpg, step2.jpg, etc. to this folder
```

### **4. Build & Test**
```bash
npm run build
npm run dev
# Visit: http://localhost:3000/recipes/view/desserts/chocolate-chip-cookies
```

## 🎯 Pro Tips

### **Batch Image Processing**
Use tools like ImageOptim or online compressors to optimize multiple images at once.

### **Consistent Naming**
Stick to the `stepX.jpg` pattern for automatic detection.

### **Fallback Strategy**
Images are optional - recipes work perfectly without them.

### **Mobile Optimization**
Images automatically responsive - no need for multiple sizes.

---

**Need Help?** Check `/docs/STEP_IMAGES.md` for component details or `/docs/RECIPE_CONVERTER.md` for full converter documentation.
