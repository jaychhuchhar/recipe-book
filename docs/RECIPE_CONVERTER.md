# Recipe Converter Tool

This tool converts simple text files into the full recipe format with all custom components needed for the recipe book.

## 🚀 Quick Start

```bash
# Convert a single text file to recipe format
npm run convert-recipe examples/simple-pancakes.txt

# Convert all recipes in recipes/ folder (batch mode)
npm run convert

# Development server (automatically runs setup-images and convert)
npm run dev

# Build (automatically runs setup-images and convert)
npm run build

# Specify category manually (single file only)
npm run convert-recipe my-recipe.txt --category dinner

# Convert with custom output location
npm run convert-recipe input.txt output.mdx

# Batch conversion without cleanup
node scripts/recipe-converter.js --all --no-cleanup
```

## 🔄 Batch Conversion

The converter supports batch processing of all recipes in the `recipes/` folder:

- **Preserves folder structure**: Each category subfolder in `recipes/` maps to the corresponding category in `content/docs/`
- **Automatic cleanup**: Removes orphaned MDX files (those without corresponding txt files) and empty category folders
- **Skips templates**: Automatically ignores template and README files
- **Step images**: Automatically includes step images when `Alt:` lines are present in instructions

```bash
npm run convert
```

## 🚀 Automated Build Integration

The recipe converter is fully integrated into the development and build process:

- **`npm run dev`**: Automatically sets up images, converts recipes, and starts development server
- **`npm run build`**: Automatically sets up images, converts recipes, and builds for production
- **`npm run convert`**: Standalone recipe conversion
- **`npm run setup-images`**: Standalone image directory setup

This ensures that your latest recipe text files and image directories are always up to date during development and deployment.

## 📝 Input Format

Create a simple text file with the following structure:

### Basic Example:
```
Title: Recipe Name
Description: Brief description
Category: Any category name (creates folder) or leave empty for root
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

YouTube: dQw4w9WgXcQ
```

## 🏷️ Supported Metadata Fields

| Field | Example | Required |
|-------|---------|----------|
| `Title` | "Chocolate Chip Cookies" | ✅ |
| `Description` | "Soft and chewy cookies" | ✅ |
| `Category` | "Desserts" or "Baking" or any name | Optional |
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
| `YouTube` | "dQw4w9WgXcQ" or full URL | Optional |

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
   Alt: Dry ingredients in bowl
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

### External Resources
```
# YouTube video can be specified as:
YouTube: dQw4w9WgXcQ                                    # Video ID only
YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ    # Full URL
YouTube: https://youtu.be/dQw4w9WgXcQ                   # Short URL
```

## ✨ Smart Features

### 🔍 **Automatic Ingredient Highlighting**
The converter automatically wraps ingredient names in `<strong>` tags within instructions:
- "Add **flour** and **sugar**" → Highlights key ingredients

### 📁 **Auto-categorization**  
- Automatically places files in correct category folders based on the Category field
- Creates directory structure if needed
- Recipes without a category are placed in the root content/docs/ folder

### 🧹 **Automatic Cleanup** (Batch mode only)
- Removes orphaned MDX files (those without corresponding txt files)
- Deletes empty category folders after cleanup
- Keeps the content structure clean and organized
- Use `--no-cleanup` flag to disable if needed

### 🖼️ **Automatic Step Images**
- Add `Alt: description` lines after instructions to include step images
- Automatically generates `<ServerStepImage>` components
- Images should be named step1.jpg, step2.jpg, etc.
- No CLI flag needed - triggered by presence of Alt: lines

### 📺 **YouTube Video Integration**
- Add `YouTube: [video-id-or-url]` to metadata to embed recipe videos
- Supports YouTube video IDs (e.g., `dQw4w9WgXcQ`) or full URLs
- Automatically generates `<YouTube>` component with embedded player
- Video title automatically uses the recipe title
- Video appears in an "External Sources" section at the end of the recipe

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
npm run convert-recipe examples/pancakes-with-images.txt
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

### Recipe with YouTube video:
```bash
# Recipe file includes: YouTube: dQw4w9WgXcQ
npm run convert-recipe examples/video-recipe.txt
# Output: Includes embedded YouTube video player
```

## 📦 Output Structure

The converter generates complete MDX files with:

- ✅ Full frontmatter with all metadata
- ✅ `<RecipeIngredients>` components
- ✅ `<InstructionsContainer>` with sections and steps
- ✅ `<YouTube>` component (when video URL provided)
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
├── recipe-without-category.mdx  # Root level for uncategorized
├── baking/
├── desserts/
├── any-category-name/
└── ...
```
