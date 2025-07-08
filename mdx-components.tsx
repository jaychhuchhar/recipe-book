import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import React from 'react';
import { RecipeStepImages } from '@/components/RecipeStepImages';
import { RecipeStepImage } from '@/components/RecipeStepImage';
import { AutoStepImage } from '@/components/AutoStepImage';
import { ServerStepImage } from '@/components/ServerStepImage';
import { RecipeInstructions, Section as RecipeInstructionsSection, Step as RecipeInstructionsStep } from '@/components/RecipeInstructions';
import { RecipeIngredients, IngredientCategory } from '@/components/RecipeIngredients';
import { RecipeNotes } from '@/components/RecipeNotes';
import { RecipeTags } from '@/components/RecipeTags';
import { RecipeMeta } from '@/components/RecipeMeta';
import { RecipeTitle, RecipeDescription } from '@/components/RecipeTitleDescription';
import { YouTube } from '@/components/YouTube';
import { 
  InstructionsContainer, 
  InstructionsSection, 
  InstructionStep 
} from '@/components/SimpleInstructions';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    RecipeStepImages,
    RecipeStepImage,
    AutoStepImage,
    ServerStepImage,
    RecipeInstructions,
    // Export sub-components with simpler names
    RecipeInstructionsSection,
    RecipeInstructionsStep,
    RecipeIngredients,
    IngredientCategory,
    RecipeNotes,
    RecipeTags,
    RecipeMeta,
    RecipeTitle,
    RecipeDescription,
    YouTube,
    InstructionsContainer,
    InstructionsSection,
    InstructionStep,
    ...components,
  };
}

// Enhanced version that injects recipe slug into components
export function getMDXComponentsWithRecipeSlug(
  recipeSlug: string, 
  components?: MDXComponents
): MDXComponents {
  // Create a wrapper for ServerStepImage that automatically includes the recipe slug
  const ServerStepImageWithSlug = (props: any) => (
    <ServerStepImage {...props} recipeSlug={recipeSlug} />
  );

  return {
    ...defaultMdxComponents,
    RecipeStepImages,
    RecipeStepImage,
    AutoStepImage,
    ServerStepImage: ServerStepImageWithSlug,
    RecipeInstructions,
    // Export sub-components with simpler names
    RecipeInstructionsSection,
    RecipeInstructionsStep,
    RecipeIngredients,
    IngredientCategory,
    RecipeNotes,
    RecipeTags,
    RecipeMeta,
    RecipeTitle,
    RecipeDescription,
    YouTube,
    InstructionsContainer,
    InstructionsSection,
    InstructionStep,
    ...components,
  };
}
