export interface CommonIngredientItem {
  id: string;
  name: string;
  defaultAmount: string;
  category: 'Dairy & Liquids' | 'Sweeteners' | 'Stabilizers & Flavors' | 'Fruits & Mixes';
}

export const COMMON_INGREDIENTS: CommonIngredientItem[] = [
  // Dairy & Liquids
  { id: 'whole-milk', name: 'Whole milk', defaultAmount: '1 cup', category: 'Dairy & Liquids' },
  { id: 'heavy-cream', name: 'Heavy cream', defaultAmount: '3/4 cup', category: 'Dairy & Liquids' },
  { id: 'cream-cheese', name: 'Cream cheese', defaultAmount: '1 tbsp', category: 'Dairy & Liquids' },
  { id: 'half-and-half', name: 'Half-and-half', defaultAmount: '1/2 cup', category: 'Dairy & Liquids' },
  { id: 'fairlife-milk', name: 'Fairlife milk', defaultAmount: '1.5 cups', category: 'Dairy & Liquids' },
  { id: 'greek-yogurt', name: 'Greek yogurt', defaultAmount: '1/2 cup', category: 'Dairy & Liquids' },
  { id: 'coconut-cream', name: 'Coconut cream', defaultAmount: '1 cup', category: 'Dairy & Liquids' },
  { id: 'oat-milk', name: 'Oat milk', defaultAmount: '3/4 cup', category: 'Dairy & Liquids' },
  { id: 'almond-milk', name: 'Almond milk', defaultAmount: '3/4 cup', category: 'Dairy & Liquids' },
  { id: 'cottage-cheese', name: 'Cottage cheese', defaultAmount: '1/2 cup', category: 'Dairy & Liquids' },
  { id: 'protein-shake', name: 'Protein shake', defaultAmount: '1 bottle', category: 'Dairy & Liquids' },

  // Sweeteners
  { id: 'granulated-sugar', name: 'Granulated sugar', defaultAmount: '1/3 cup', category: 'Sweeteners' },
  { id: 'condensed-milk', name: 'Sweetened condensed milk', defaultAmount: '1/3 cup', category: 'Sweeteners' },
  { id: 'brown-sugar', name: 'Brown sugar', defaultAmount: '2 tbsp', category: 'Sweeteners' },
  { id: 'maple-syrup', name: 'Maple syrup', defaultAmount: '2 tbsp', category: 'Sweeteners' },
  { id: 'honey', name: 'Honey', defaultAmount: '2 tbsp', category: 'Sweeteners' },
  { id: 'agave-nectar', name: 'Agave nectar', defaultAmount: '2 tbsp', category: 'Sweeteners' },
  { id: 'allulose-stevia', name: 'Allulose / Stevia', defaultAmount: '2 tbsp', category: 'Sweeteners' },

  // Stabilizers & Flavors
  { id: 'vanilla-extract', name: 'Vanilla extract', defaultAmount: '1 tsp', category: 'Stabilizers & Flavors' },
  { id: 'cocoa-powder', name: 'Unsweetened cocoa powder', defaultAmount: '2 tbsp', category: 'Stabilizers & Flavors' },
  { id: 'pudding-mix', name: 'Instant pudding mix', defaultAmount: '1 tbsp', category: 'Stabilizers & Flavors' },
  { id: 'protein-powder', name: 'Protein powder', defaultAmount: '1 scoop', category: 'Stabilizers & Flavors' },
  { id: 'xanthan-gum', name: 'Xanthan gum', defaultAmount: '1/4 tsp', category: 'Stabilizers & Flavors' },
  { id: 'sea-salt', name: 'Sea salt', defaultAmount: '1 pinch', category: 'Stabilizers & Flavors' },
  { id: 'lemon-juice', name: 'Fresh lemon juice', defaultAmount: '1 tbsp', category: 'Stabilizers & Flavors' },

  // Fruits & Mixes
  { id: 'canned-fruit', name: 'Canned fruit in juice', defaultAmount: '2 cups', category: 'Fruits & Mixes' },
  { id: 'fresh-berries', name: 'Fresh berries', defaultAmount: '1 cup', category: 'Fruits & Mixes' },
  { id: 'banana', name: 'Ripe banana', defaultAmount: '1 whole', category: 'Fruits & Mixes' },
];
