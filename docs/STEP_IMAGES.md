# Step-by-Step Image Usage Guide

## 🎯 New Feature: Individual Step Images

Now you can display images **after each cooking step** instead of in a carousel. Each instruction step can have its own centered image with an optional caption.

## ✨ Automatic Recipe Detection

**NEW**: The `recipeSlug` prop is no longer needed! The system automatically detects which recipe you're in based on the filename, so you can simply use:

```jsx
<ServerStepImage stepNumber={1} alt="Description" caption="Optional caption" />
```

Instead of the old way:
```jsx
<!-- OLD WAY - No longer needed -->
<ServerStepImage recipeSlug="recipe-name" stepNumber={1} alt="Description" />
```

## 🛠️ Available Components

### 1. `ServerStepImage` (Recommended)
Automatically finds and displays step images at build time.

```jsx
<ServerStepImage 
  
  stepNumber={1} 
  alt="Toasting bread and mashing avocado" 
  caption="Toast the bread and mash the avocado with a fork"
  size="medium"
/>
```

### 2. `RecipeStepImage` (Manual)
Display a specific image with manual URL.

```jsx
<RecipeStepImage 
  src="/images/recipes/breakfast/avocado-toast-egg/steps/step-1.jpg"
  alt="Toasting bread"
  caption="Toast until golden brown"
  size="medium"
/>
```

### 3. `AutoStepImage` (Client-side)
Automatically finds images on the client side (slower but more flexible).

```jsx
<AutoStepImage 
  
  stepNumber={1} 
  alt="Step 1"
/>
```

## 📝 Usage in Recipe MDX Files

### Basic Pattern
```jsx
<InstructionsContainer>
  <InstructionsSection title="Prepare Toast">
    <InstructionStep stepNumber={1}>
      Toast <strong>Bread</strong>. Mash <strong>Avocado</strong> on top.
    </InstructionStep>
    
    <ServerStepImage 
      
      stepNumber={1} 
      alt="Mashing avocado on toast" 
      caption="Mash the avocado directly on the toasted bread"
    />
    
    <InstructionStep stepNumber={2}>
      Cook <strong>Egg</strong> as desired and place on toast.
    </InstructionStep>
    
    <ServerStepImage 
      
      stepNumber={2} 
      alt="Adding cooked egg" 
      caption="Gently place the cooked egg on top"
    />
  </InstructionsSection>
</InstructionsContainer>
```

### With Sub-steps
```jsx
<InstructionsContainer>
  <InstructionsSection title="Detailed Preparation">
    <InstructionStep stepNumber={1}>
      Prepare the avocado in multiple stages:
    </InstructionStep>
    
    {/* Sub-step 1.1 */}
    <ServerStepImage 
      
      stepNumber="1.1" 
      alt="Cutting avocado" 
      caption="First, cut the avocado in half"
    />
    
    {/* Sub-step 1.2 */}
    <ServerStepImage 
      
      stepNumber="1.2" 
      alt="Mashing avocado" 
      caption="Then mash it with a fork until smooth"
    />
    
    <InstructionStep stepNumber={2}>
      Toast the bread to golden brown.
    </InstructionStep>
    
    <ServerStepImage 
      
      stepNumber={2} 
      alt="Toasted bread" 
      caption="Toast until evenly golden"
    />
  </InstructionsSection>
</InstructionsContainer>
```

## 🖼️ Image Naming for Steps

Place images in `/public/images/recipes/[recipe-slug]/steps/`:

### Primary Patterns (Recommended)
- `1.jpg` → Step 1
- `2.jpg` → Step 2  
- `3.jpg` → Step 3

### Sub-step Patterns (New!)
- `1.1.jpg` → Step 1, sub-step 1
- `1.2.jpg` → Step 1, sub-step 2
- `2.1.jpg` → Step 2, sub-step 1
- `2.2.jpg` → Step 2, sub-step 2

### Alternative Patterns (Legacy)
- `step-1.jpg` → Step 1 (still supported)
- `step-2.jpg` → Step 2 (still supported)

## 🎨 Size Options

- `size="small"` → Max 300px width
- `size="medium"` → Max 450px width (default)
- `size="large"` → Max 600px width

## 📱 Responsive Design

All step images are:
- **Centered** on the page
- **Responsive** (scale with screen size)
- **Optimized** for both mobile and desktop
- **Accessible** with proper alt text

## ✨ Complete Example

```jsx
---
title: "Perfect Scrambled Eggs"
description: "Creamy, fluffy scrambled eggs"
---

import { RecipeIngredients } from '@/components/RecipeIngredients';

<RecipeIngredients>
  <>Eggs (3 pieces)</>
  <>Butter (1 tbsp)</>
  <>Salt and Pepper</>
</RecipeIngredients>

## Instructions

<InstructionsContainer>
  <InstructionsSection title="Cooking">
    <InstructionStep stepNumber={1}>
      Crack eggs into a bowl and whisk thoroughly.
    </InstructionStep>
    
    <ServerStepImage 
      
      stepNumber={1} 
      alt="Whisked eggs in bowl" 
      caption="Whisk until completely smooth with no streaks"
      size="medium"
    />
    
    <InstructionStep stepNumber={2}>
      Heat butter in a non-stick pan over low heat.
    </InstructionStep>
    
    <ServerStepImage 
      
      stepNumber={2} 
      alt="Melting butter in pan" 
      caption="Keep heat low to prevent burning"
    />
    
    <InstructionStep stepNumber={3}>
      Pour eggs into pan and stir constantly with a spatula.
    </InstructionStep>
    
    <ServerStepImage 
      
      stepNumber={3} 
      alt="Stirring eggs in pan" 
      caption="Keep stirring to create small, fluffy curds"
    />
    
    <InstructionStep stepNumber={4}>
      Remove from heat when still slightly wet. Season and serve.
    </InstructionStep>
    
    <ServerStepImage 
      
      stepNumber={4} 
      alt="Finished scrambled eggs" 
      caption="Creamy, perfectly cooked scrambled eggs"
    />
  </InstructionsSection>
</InstructionsContainer>
```

## 🔄 Migration from Carousel

### Before (Carousel)
```jsx
<RecipeStepImages alt="All steps" />
```

### After (Individual Steps)
```jsx
<InstructionsContainer>
  <InstructionsSection title="Cooking">
    <InstructionStep stepNumber={1}>Step instruction here</InstructionStep>
    <ServerStepImage stepNumber={1} />
    
    <InstructionStep stepNumber={2}>Next step instruction</InstructionStep>
    <ServerStepImage stepNumber={2} />
  </InstructionsSection>
</InstructionsContainer>
```

## 💡 Pro Tips

1. **Use descriptive captions** to explain what's happening in the image
2. **Choose appropriate sizes** - medium works well for most recipes
3. **Number your images** consistently (step-1.jpg, step-2.jpg, etc.)
4. **Add alt text** for accessibility
5. **Test on mobile** to ensure images look good on small screens

---

**Now your recipes will have beautiful step-by-step visual guidance! 📸🍳**
