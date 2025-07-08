# Recipes Source Files

This folder contains the source text files for all recipes. These simple text files are automatically converted to full MDX format during the build process.

## 🚀 Automated Conversion

- **During Development**: Recipes and images are automatically set up when running `npm run dev`
- **During Build**: Recipes and images are automatically set up when running `npm run build`
- **Manual**: Run `npm run convert` to convert recipes manually
- **Manual Images**: Run `npm run setup-images` to set up image directories manually

## 📁 Folder Structure

```
recipes/
├── breakfast/           # Breakfast recipes
├── lunch/              # Lunch recipes  
├── dinner/             # Dinner recipes
├── snacks/             # Snack recipes
├── desserts/           # Dessert recipes
├── beverages/          # Beverage recipes
└── _templates/         # Recipe templates and examples
```

## 🚀 Workflow

### 1. **Create New Recipe**
Add a new `.txt` file in the appropriate category folder using this format:

```
Title: Recipe Name
Description: Brief description
Category: Breakfast
Cuisine: American
Difficulty: Easy
Servings: 4
Prep Time: 10 Minutes
Cook Time: 15 Minutes

## Ingredients
- 2 cups flour
- 1 cup milk

## Instructions
1. Mix ingredients
2. Cook until done

## Notes
- Serving tips
- Storage info
```

### 2. **Convert to MDX**
Use the converter tool to generate the full MDX recipe:

```bash
# Basic conversion (auto-detects category from file location)
npm run convert-recipe recipes/breakfast/my-recipe.txt

# Step images are auto-detected from Alt: lines in instructions

# Force specific category
npm run convert-recipe recipes/breakfast/my-recipe.txt --category breakfast

# Batch convert all recipes
npm run convert
```

### 3. **Commit Both Files**
- Commit the source `.txt` file to version control
- The generated `.mdx` file goes into `content/docs/[category]/`

## 📝 Templates

See `_templates/recipe-template.txt` for the complete format including:
- ✅ All supported metadata fields
- ✅ Step image format with `Alt:` lines
- ✅ Best practices and examples

## 🔄 Benefits

- **Simple editing**: Write recipes in plain text
- **Version control**: Track changes in human-readable format
- **Automation**: Generate complex MDX with custom components
- **Consistency**: All recipes follow the same structure
- **Reusability**: Source files can be used for other formats (PDF, etc.)

## Ingredient Organization

#### Simple Ingredients (recommended for most recipes)
For recipes with 10 or fewer ingredients, use the simple format:

```
## Ingredients
- 2 cups flour
- 1 cup milk
- 1 tsp salt
```

#### Categorized Ingredients (for complex recipes)
For complex recipes with many ingredients (15+), you can organize them into categories:

```
## Ingredients

### Main Ingredients
- 2 cups basmati rice
- 1 kg chicken

### Spices & Seasonings
- 1 tsp turmeric
- 2 bay leaves
- Salt to taste

### For Garnish
- Fresh cilantro
- Lemon wedges
```

**When to use categories:**
- Recipes with 15+ ingredients
- Multi-course or complex preparations
- When ingredients serve distinct purposes
- Traditional recipes with natural groupings (like biryani, complex baking)

**When to keep it simple:**
- Quick recipes
- 10 or fewer ingredients
- Single-purpose preparations
- Everyday cooking
