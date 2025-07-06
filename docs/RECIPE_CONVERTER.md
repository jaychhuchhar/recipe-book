# Recipe Converter Tool

This tool converts simple text files into the full recipe format with all custom components needed for the recipe book.

## 🚀 Quick Start

```bash
# Convert a simple text file to recipe format
npm run convert-recipe examples/simple-pancakes.txt

# Specify category manually
npm run convert-recipe my-recipe.txt --category dinner

# Convert with custom output location
npm run convert-recipe input.txt output.mdx
```

## 📝 Input Format

Create a simple text file with the following structure:

### Basic Example:
```
Title: Recipe Name
Description: Brief description
Category: Breakfast/Lunch/Dinner/Snacks/Desserts/Beverages
Servings: 4
Prep Time: 15 Minutes
Cook Time: 20 Minutes

Ingredients:
- 2 cups flour
- 1 cup milk
- 2 eggs

Instructions:
1. Mix dry ingredients
2. Add wet ingredients
3. Cook until done

Notes:
- Tip 1
- Tip 2
```

## 🏷️ Supported Metadata Fields

| Field | Example | Required |
|-------|---------|----------|
| `Title` | "Chocolate Chip Cookies" | ✅ |
| `Description` | "Soft and chewy cookies" | ✅ |
| `Category` | "Desserts" | Recommended |
| `Cuisine` | "American" | Optional |
| `Difficulty` | "Easy/Medium/Hard" | Optional |
| `Servings` | "4" or "2-3" | Optional |
| `Prep Time` | "15 Minutes" | Optional |
| `Cook Time` | "20 Minutes" | Optional |
| `Total Time` | "35 Minutes" | Auto-calculated |
| `Calories` | "250" | Optional |
| `Dietary` | "Vegetarian" | Optional |
| `Allergens` | "Eggs, Dairy" | Optional |
| `Cost` | "$5" | Optional |

## 📋 Section Formats

### Ingredients
Supports multiple list formats:
```
Ingredients:
- 2 cups flour
* 1 cup sugar  
1. 3 eggs
2 tablespoons vanilla
```

### Instructions
Can include sub-sections and optional step images:
```
## Instructions

### Prepare Dough
1. Mix dry ingredients
   Alt: Dry ingredients in bowl (optional - only if using --images)
2. Add wet ingredients

### Bake
3. Preheat oven to 350°F
4. Bake for 20 minutes
   Alt: Golden brown bread in oven
```

### Notes & Tags
```
Notes:
- Storage tip
- Substitution ideas
- Serving suggestions

Tags:
- Quick
- Family-friendly
- Make-ahead
```

## ✨ Smart Features

### 🔍 **Automatic Ingredient Highlighting**
The converter automatically wraps ingredient names in `<strong>` tags within instructions:
- "Add **flour** and **sugar**" → Highlights key ingredients

### 📁 **Auto-categorization**  
- Automatically places files in correct category folders
- Creates directory structure if needed

### 🖼️ **Optional Step Images**
- Add `Alt: description` lines after instructions when using `--images` flag
- Automatically generates `<ServerStepImage>` components
- Images should be named step1.jpg, step2.jpg, etc.

### ⏱️ **Time Calculation**
- Auto-calculates total time from prep + cook time
- Smart parsing of time formats

### 📄 **Flexible Input**
- Supports various list formats (-, *, numbers)
- Handles both formal and casual writing styles
- Parses frontmatter-style or natural language metadata

## 🎯 Examples

### Convert and auto-place:
```bash
npm run convert-recipe examples/simple-pancakes.txt
# Output: content/docs/breakfast/simple-pancakes.mdx
```

### Convert with step images:
```bash
npm run convert-recipe examples/pancakes-with-images.txt --images
# Output: content/docs/breakfast/pancakes-with-step-images.mdx (with ServerStepImage components)
```

### Force specific category:
```bash
npm run convert-recipe examples/homemade-bread.txt --category dinner
# Output: content/docs/dinner/homemade-bread.mdx
```

### Custom output location:
```bash
npm run convert-recipe recipe.txt my-custom-recipe.mdx
# Output: my-custom-recipe.mdx (current directory)
```

## 📦 Output Structure

The converter generates complete MDX files with:

- ✅ Full frontmatter with all metadata
- ✅ `<RecipeIngredients>` components
- ✅ `<InstructionsContainer>` with sections and steps
- ✅ `<RecipeNotes>` components
- ✅ `<RecipeTags>` components
- ✅ Proper ingredient highlighting in instructions
- ✅ Structured step numbering

## 🛠️ Development

The converter is built as an ES module and can be imported:

```javascript
import { RecipeConverter } from './scripts/recipe-converter.js';

const converter = new RecipeConverter();
converter.parseInput(textContent);
const mdxOutput = converter.convert();
```

## 📁 File Organization

```
examples/                    # Sample input files
├── recipe-template.txt      # Template with all options
├── simple-pancakes.txt      # Basic recipe example
├── pancakes-with-images.txt # Recipe with step images
├── homemade-bread.txt       # Another example
└── quick-tomato-pasta.txt   # Dinner recipe example

scripts/
└── recipe-converter.js      # Main converter tool

content/docs/                # Generated output location
├── breakfast/
├── lunch/
├── dinner/
└── ...
```
