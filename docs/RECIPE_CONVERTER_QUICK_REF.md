# Recipe Converter - Quick Reference

## 🚀 Convert Any Text File to Recipe Format

```bash
# Basic conversion (auto-detects category)
npm run convert-recipe examples/simple-pancakes.txt

# With step images
npm run convert-recipe examples/pancakes-with-images.txt --images

# Force specific category 
npm run convert-recipe recipe.txt --category dinner

# Custom output location
npm run convert-recipe input.txt custom-name.mdx
```

## 📝 Simple Input Format

```
Title: Recipe Name
Description: Brief description  
Category: Breakfast/Lunch/Dinner/Snacks/Desserts/Beverages
Servings: 4
Prep Time: 15 Minutes
Cook Time: 20 Minutes

## Ingredients
- 2 cups flour
- 1 cup milk
- 2 eggs

## Instructions
1. Mix ingredients
   Alt: Mixed ingredients in bowl (optional - for step images)
2. Cook until done
   Alt: Cooking in pan

## Notes
- Serving tips
- Storage info
```

## ✨ What You Get

✅ **Complete MDX file** with all custom components  
✅ **Auto-categorization** into correct folders  
✅ **Ingredient highlighting** in instructions  
✅ **Optional step images** with `--images` flag
✅ **Structured metadata** with defaults  
✅ **Ready to build** - no manual editing needed

## 📁 Output Location

Files are automatically saved to:
- `content/docs/breakfast/recipe-name.mdx`
- `content/docs/dinner/recipe-name.mdx`
- etc.

See `/docs/RECIPE_CONVERTER.md` for full documentation.
See `/docs/RECIPE_STEP_IMAGES.md` for image guide.
