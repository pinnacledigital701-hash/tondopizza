export interface MenuItem {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  price: number;
  badge?: string;
  badgeType?: 'red' | 'green' | 'black' | 'yellow' | 'brown';
  category: 'rosse' | 'bianche' | 'sides' | 'dolci' | 'burgers' | string;
  image?: string;
  ingredients?: string[];
  isSignature?: boolean;
}

export type BurgerItem = MenuItem;

export const ALL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'margherita',
    name: 'MARGHERITA',
    tagline: 'San Marzano drop, fresh fior di latte, sweet basil blister',
    badge: 'THE CLASSIC',
    badgeType: 'red',
    description: 'San Marzano, fior di latte, fresh basil, a thread of EVOO. The one we judge ourselves by.',
    price: 16,
    category: 'rosse',
    image: '/margherita_pizza.png',
    ingredients: ['San Marzano Tomatoes', 'Fior di Latte', 'Sweet Genovese Basil', 'Sicilian EVOO'],
    isSignature: true,
  },
  {
    id: 'verde',
    name: 'VERDE',
    tagline: 'Basil pesto base, burrata, charred broccolini, lemon zest',
    badge: 'GARDEN',
    badgeType: 'green',
    description: 'Basil pesto base, burrata, charred broccolini, lemon zest, toasted pine nuts.',
    price: 18,
    category: 'bianche',
    image: '/verde.png',
    ingredients: ['House Basil Pesto', 'Pugliese Burrata', 'Charred Broccolini', 'Lemon Zest', 'Toasted Pine Nuts'],
    isSignature: true,
  },
  {
    id: 'diavola',
    name: 'DIAVOLA',
    tagline: 'Spicy nduja matrices over lava mozzarella and hot honey',
    badge: 'BRING HEAT',
    badgeType: 'yellow',
    description: "Spicy 'nduja, soppressata, chili honey, smoked mozzarella. For people who mean it.",
    price: 19,
    category: 'rosse',
    image: '/diavola.png',
    ingredients: ["Spicy 'Nduja", 'Crisp Soppressata', 'Wildflower Chili Honey', 'Smoked Fior di Latte'],
    isSignature: true,
  },
  {
    id: 'bbq-meatball',
    name: 'BBQ MEATBALL MONSTER',
    tagline: 'Juicy smashed garlic meatballs, smoky bacon strips, sweet bourbon BBQ swirl',
    badge: 'THE MONSTER',
    badgeType: 'red',
    description: 'Built for intense hunger. Crispy brick-oven sourdough crust piled high with seasoned house-made juicy beef meatballs.',
    price: 20,
    category: 'burgers',
    image: '/bbq-meatball.png',
    ingredients: ['Smashed Beef Meatballs', 'Applewood Bacon Ribbons', 'Melted Smoked Gouda', 'Bourbon BBQ Glaze'],
    isSignature: true,
  },
];

export const SIGNATURE_BURGERS: BurgerItem[] = ALL_MENU_ITEMS.filter((item) => item.category === 'burgers');

export const SIGNATURE_PIZZAS: MenuItem[] = ALL_MENU_ITEMS.filter((item) => item.isSignature);


export const MENU_CATEGORIES = [
  {
    id: 'rosse',
    title: 'PIZZE ROSSE',
    items: [
      {
        id: 'marinara',
        name: 'Marinara',
        description: 'Tomato, garlic, oregano, EVOO. No cheese, all soul.',
        price: 13,
      },
      {
        id: 'margherita-full',
        name: 'Margherita',
        description: 'Fior di latte, basil, San Marzano.',
        price: 16,
      },
      {
        id: 'diavola-full',
        name: 'Diavola',
        description: "'Nduja, soppressata, chili honey.",
        price: 19,
      },
      {
        id: 'salsiccia',
        name: 'Salsiccia',
        description: 'Fennel sausage, friarielli, smoked scamorza.',
        price: 20,
      },
    ],
  },
  {
    id: 'bianche',
    title: 'PIZZE BIANCHE',
    items: [
      {
        id: 'verde-full',
        name: 'Verde',
        description: 'Pesto, burrata, broccolini, lemon.',
        price: 18,
      },
      {
        id: 'quattro-formaggi',
        name: 'Quattro Formaggi',
        description: 'Mozzarella, gorgonzola, fontina, pecorino.',
        price: 19,
      },
      {
        id: 'patate',
        name: 'Patate',
        description: 'Thin potato, rosemary, taleggio, black pepper.',
        price: 18,
      },
      {
        id: 'funghi',
        name: 'Funghi',
        description: 'Wild mushroom, garlic cream, thyme, truffle.',
        price: 21,
      },
    ],
  },
  {
    id: 'sides',
    title: 'SIDES',
    items: [
      {
        id: 'garlic-knots',
        name: 'Garlic dough knots',
        description: 'Six, with whipped ricotta dip.',
        price: 8,
      },
      {
        id: 'fennel-salad',
        name: 'Shaved fennel salad',
        description: 'Orange, olive, chili, mint.',
        price: 11,
      },
      {
        id: 'polpette',
        name: 'Polpette',
        description: 'Three meatballs, sugo, pecorino.',
        price: 12,
      },
    ],
  },
  {
    id: 'dolci',
    title: 'DOLCI & DRINKS',
    items: [
      {
        id: 'nutella-ring',
        name: 'Nutella ring pizza',
        description: 'Wood-fired, mascarpone, sea salt.',
        price: 12,
      },
      {
        id: 'affogato',
        name: 'Affogato',
        description: 'Espresso over fior di latte gelato.',
        price: 9,
      },
      {
        id: 'negroni',
        name: 'House Negroni',
        description: 'Barrel-rested, orange oil.',
        price: 14,
      },
    ],
  },
];

export const INGREDIENTS = [
  {
    name: 'SAN MARZANO',
    description: 'Crushed by hand at dawn',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'FIOR DI LATTE',
    description: 'Pulled fresh daily',
    image: 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'BASIL',
    description: 'From our rooftop pots',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: '00 FLOUR',
    description: 'Custom-milled blend',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'EVOO',
    description: 'Single-estate, cold-pressed',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=400&auto=format&fit=crop',
  },
];

export const PROCESS_STEPS = [
  {
    number: '01',
    numberColor: 'text-[#EAB308]',
    title: 'MIX & REST',
    description:
      'A four-ingredient dough, cold-proofed for 48 hours so it ferments slow and digests easy. Patience does most of the work.',
  },
  {
    number: '02',
    numberColor: 'text-[#F97316]',
    title: 'HAND-STRETCH',
    description:
      'No rolling pins, ever. Each ball is opened by hand into a thin centre and a pillowy, blistered cornicione.',
  },
  {
    number: '03',
    numberColor: 'text-[#22C55E]',
    title: '90 SECONDS, 450°C',
    description:
      'Into the wood oven, turned once, and out in a minute and a half — leopard-spotted, smoky, and ready right now.',
  },
];

export const REVIEWS = [
  {
    stars: 5,
    quote: 'Genuinely the best Margherita I’ve had outside Naples. The crust is alive.',
    author: 'Ava R.',
    role: 'Regular since day one',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    stars: 5,
    quote: 'One menu, zero misses. I dream about the Diavola. The chili honey is illegal.',
    author: 'Jordan M.',
    role: 'Self-described pizza snob',
    avatar: 'https://plus.unsplash.com/premium_photo-1727942418676-56c4c4614b00?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    stars: 5,
    quote: 'Tiny room, huge energy, perfect pies. Get there early or wait — it is worth it.',
    author: 'Sofia L.',
    role: 'Local food writer',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export const TICKER_ITEMS = [
  'FRESH DOUGH DAILY',
  'WOOD-FIRED',
  'SAN MARZANO TOMATOES',
  'FIOR DI LATTE',
  'HAND-STRETCHED',
  'OPEN TILL LATE',
  '48-HOUR FERMENTATION',
  '450°C VOLCANIC OVEN',
  'ZERO SHORTCUTS',
];
