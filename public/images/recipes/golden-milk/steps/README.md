# Step Images for golden-milk

Place your step-by-step cooking images here. Supported formats: jpg, jpeg, png, webp, avif

Naming conventions:
- 1.jpg, 2.jpg, 3.jpg - Main step images in order
- 1.1.jpg, 1.2.jpg - Sub-steps for detailed instructions
- 2.1.jpg, 2.2.jpg - Sub-steps for step 2, etc.

Legacy naming (still supported):
- step-1.jpg, step-2.jpg, step-3.jpg - Alternative naming

Images will be automatically detected and displayed when using the ServerStepImage component in your MDX file.

Usage in MDX:
```jsx
{/* Main steps */}
<ServerStepImage recipeSlug="golden-milk" stepNumber={1} alt="Step 1" />
<ServerStepImage recipeSlug="golden-milk" stepNumber={2} alt="Step 2" />

{/* Sub-steps */}
<ServerStepImage recipeSlug="golden-milk" stepNumber="1.1" alt="Sub-step 1.1" />
<ServerStepImage recipeSlug="golden-milk" stepNumber="1.2" alt="Sub-step 1.2" />
```
