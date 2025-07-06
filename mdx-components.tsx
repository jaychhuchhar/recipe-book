import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import React from 'react';
import { RecipeStepImages } from '@/components/RecipeStepImages';
import { RecipeStepImage } from '@/components/RecipeStepImage';
import { AutoStepImage } from '@/components/AutoStepImage';
import { ServerStepImage } from '@/components/ServerStepImage';
import { RecipeInstructions, Section as RecipeInstructionsSection, Step as RecipeInstructionsStep } from '@/components/RecipeInstructions';
import { RecipeIngredients } from '@/components/RecipeIngredients';
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
