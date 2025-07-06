export interface Recipe {
  title: string;
  description: string;
  images?: string[];
  rating?: number;
  author?: string;
  date?: string;
  category?: string;
  cuisine?: string;
  difficulty?: string;
  servings?: number;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  calories?: number;
  dietary?: string[];
  allergens?: string[];
  cost?: string;
  tags?: string[];
  source?: string;
  previewImage?: string; // Added for server-side preview image
  // Add more fields as needed
}
