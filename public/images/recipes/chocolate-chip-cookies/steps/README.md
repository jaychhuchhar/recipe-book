# Step Images for chocolate-chip-cookies

Place your step-by-step cooking images here. Supported formats: jpg, jpeg, png, webp, avif

Naming conventions:
- 1.jpg, 2.jpg, 3.jpg - Main step images in order
- 01.jpg, 02.jpg, 03.jpg - Zero-padded main steps (better file organization)
- 1.1.jpg, 1.2.jpg - Sub-steps for detailed instructions (dot separator)
- 15-1.jpg, 15-2.jpg - Sub-steps for detailed instructions (dash separator)
- 01.1.jpg, 01.2.jpg - Zero-padded sub-steps
- 2.1.jpg, 2.2.jpg - Sub-steps for step 2, etc.

Legacy naming (still supported):
- step-1.jpg, step-2.jpg, step-3.jpg - Alternative naming
- step-01.jpg, step-02.jpg - Zero-padded legacy naming

Images will be automatically detected and displayed when using the ServerStepImage component in your MDX file.

Usage in MDX:
```jsx
{/* Main steps */}
<ServerStepImage recipeSlug="chocolate-chip-cookies" stepNumber={1} alt="Step 1" />
<ServerStepImage recipeSlug="chocolate-chip-cookies" stepNumber={2} alt="Step 2" />

{/* Sub-steps */}
<ServerStepImage recipeSlug="chocolate-chip-cookies" stepNumber="1.1" alt="Sub-step 1.1" />
<ServerStepImage recipeSlug="chocolate-chip-cookies" stepNumber="1.2" alt="Sub-step 1.2" />
```
