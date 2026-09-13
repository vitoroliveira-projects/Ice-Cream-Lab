export interface PhotoPreset {
  id: string;
  name: string;
  category: 'All' | 'Classic' | 'Gelato' | 'Sorbet' | 'Mix-Ins';
  url: string;
}

export const PHOTO_PRESETS: PhotoPreset[] = [
  {
    id: 'choc-hazelnut',
    name: 'Chocolate & Hazelnut Cone',
    category: 'Classic',
    url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'vanilla-caramel',
    name: 'Vanilla Caramel Swirl Cone',
    category: 'Classic',
    url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'espresso-shards',
    name: 'Espresso & Dark Shards',
    category: 'Mix-Ins',
    url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pistachio-gelato',
    name: 'Bronte Pistachio Gelato',
    category: 'Gelato',
    url: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'strawberry-cream',
    name: 'Fresh Strawberry & Cream',
    category: 'Classic',
    url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mango-sorbet',
    name: 'Mango & Passionfruit Sorbet',
    category: 'Sorbet',
    url: 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'wild-berry-sorbet',
    name: 'Wild Blackberry Sorbet',
    category: 'Sorbet',
    url: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'matcha-gelato',
    name: 'Kyoto Matcha Gelato',
    category: 'Gelato',
    url: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mint-choc-chip',
    name: 'Mint Chocolate Chip',
    category: 'Classic',
    url: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cookies-cream',
    name: 'Cookies & Cream Pint',
    category: 'Mix-Ins',
    url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'caramel-pretzel',
    name: 'Salted Caramel Pretzel Crunch',
    category: 'Mix-Ins',
    url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lemon-basil-sorbet',
    name: 'Meyer Lemon & Basil Italian Ice',
    category: 'Sorbet',
    url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'peanut-butter',
    name: 'Peanut Butter Fudge Swirl',
    category: 'Mix-Ins',
    url: 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'acai-bowl',
    name: 'Acai & Coconut Pint',
    category: 'Sorbet',
    url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'blueberry-yogurt',
    name: 'Blueberry Greek Yogurt',
    category: 'Classic',
    url: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'toasted-coconut',
    name: 'Toasted Coconut & Macadamia',
    category: 'Gelato',
    url: 'https://images.unsplash.com/photo-1568651318494-0b1a134c4f9a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'crisp-waffle-cone',
    name: 'Double Waffle Cone Vanilla',
    category: 'Classic',
    url: 'https://images.unsplash.com/photo-1517093709149-a201f8e833f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dark-fudge-ribbon',
    name: 'Dark Chocolate Fudge Ribbon',
    category: 'Gelato',
    url: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=800&q=80',
  },
];
