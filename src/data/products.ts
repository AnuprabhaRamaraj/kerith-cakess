export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  weight: string;
  availableWeights: string[];
  offerPrice: number;
  originalPrice: number;
  weightPrices?: { [weight: string]: { offerPrice: number; originalPrice: number } };
  description: string;
  image: string;
  isBestseller?: boolean;
  isOffer?: boolean;
  isLive?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export function getProductPriceForWeight(
  product: Product,
  targetWeight?: string
): { offerPrice: number; originalPrice: number } {
  if (!targetWeight || targetWeight === product.weight) {
    if (product.weightPrices && product.weightPrices[product.weight]) {
      return product.weightPrices[product.weight];
    }
    return { offerPrice: product.offerPrice, originalPrice: product.originalPrice };
  }

  // Check if explicit price is configured for this weight
  if (product.weightPrices && product.weightPrices[targetWeight]) {
    return product.weightPrices[targetWeight];
  }

  // Parse numeric weight values (e.g. "1.5 kg" -> 1.5, "500 g" -> 0.5)
  const parseKg = (wStr: string): number => {
    const clean = wStr.toLowerCase().trim();
    if (clean.includes("kg")) {
      return parseFloat(clean.replace("kg", "").trim()) || 1;
    }
    if (clean.includes("g") || clean.includes("gm") || clean.includes("gram")) {
      return (parseFloat(clean.replace(/[^0-9.]/g, "").trim()) || 500) / 1000;
    }
    return parseFloat(clean) || 1;
  };

  const baseKg = parseKg(product.weight) || 1;
  const targetKg = parseKg(targetWeight) || 1;
  const ratio = targetKg / baseKg;

  // Calculate proportional prices rounded to nearest 10
  const offerPrice = Math.round((product.offerPrice * ratio) / 10) * 10;
  const originalPrice = Math.round((product.originalPrice * ratio) / 10) * 10;

  return { offerPrice, originalPrice };
}

export interface Category {
  id: string;
  name: string;
  iconName?: string;
  image: string;
  description?: string;
}

// Explore Cake Categories (The 5 separate showcase cards on home page)
export const EXPLORE_CATEGORIES: Category[] = [
  {
    id: "birthday",
    name: "Birthday Cakes",
    iconName: "Gift",
    image: "/images/cakes/custom_model.jpg",
    description: "Celebratory fresh cream cakes designed to make every birthday unforgettable.",
  },
  {
    id: "anniversary",
    name: "Anniversary Cakes",
    iconName: "Heart",
    image: "/images/cakes/red_velvet.jpg",
    description: "Romantic & elegant cakes crafted for love milestones.",
  },
  {
    id: "fresh-cream",
    name: "Fresh Cream Cakes",
    iconName: "Sparkles",
    image: "/images/cakes/white_forest.jpg",
    description: "Light, fluffy, and freshly whipped cream cakes for light sweetness.",
  },
  {
    id: "custom",
    name: "Custom Cake Models",
    iconName: "Palette",
    image: "/images/cakes/custom_model.jpg",
    description: "Personalized theme cakes built according to your custom vision.",
  },
  {
    id: "wedding",
    name: "Wedding Cakes",
    iconName: "PartyPopper",
    image: "/images/cakes/wedding_cake.jpg",
    description: "Grand multi-tiered cakes designed for royal marriage celebrations.",
  },
];

export const CATEGORIES = EXPLORE_CATEGORIES;

// Synchronized Filter Categories for "Featured Cake Selection"
export const FEATURED_CATEGORIES: { id: string; name: string }[] = [
  { id: "all", name: "All Cakes" },
  { id: "black-forest", name: "Black Forest" },
  { id: "red-velvet", name: "Red Velvet" },
  { id: "chocolate", name: "Chocolate" },
  { id: "truffle", name: "Truffle" },
  { id: "brownies", name: "Brownies" },
  { id: "butterscotch", name: "Butterscotch" },
  { id: "cassata", name: "Cassata" },
  { id: "caramel", name: "Caramel" },
  { id: "fruit-flavours", name: "Fruit Flavours" },
  { id: "rasmalai", name: "Rasmalai" },
  { id: "spanish-delight", name: "Spanish Delight" },
  { id: "plum-christmas", name: "Plum & Christmas" },
  { id: "doll-theme", name: "Doll & Theme Cakes" },
  { id: "photo-cakes", name: "Photo Cakes" },
  { id: "wedding-tier", name: "Wedding & Tier Cakes" },
  { id: "custom-cakes", name: "Custom Cakes" },
];

export const PRODUCTS: Product[] = [
  // 1. Black Forest
  {
    id: "classic-black-forest",
    name: "Classic Black Forest",
    category: "Black Forest",
    categoryId: "black-forest",
    weight: "1.5 kg",
    availableWeights: ["1 kg", "1.5 kg", "2 kg", "3 kg"],
    offerPrice: 1000,
    originalPrice: 1500,
    description: "Layers of moist chocolate sponge infused with fresh cherry syrup, layered with fresh whipped cream and generous dark chocolate curls.",
    image: "/images/cakes/black_forest.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 5.0,
    reviewsCount: 215,
  },
  {
    id: "black-forest-double-layer",
    name: "Black Forest Double Layer",
    category: "Black Forest",
    categoryId: "black-forest",
    weight: "1.5 kg",
    availableWeights: ["1 kg", "1.5 kg", "2 kg", "2.5 kg"],
    offerPrice: 1200,
    originalPrice: 1800,
    description: "Double height chocolate sponge layered with extra fresh cream, juicy dark cherries, and hand-shaved chocolate shavings.",
    image: "/images/cakes/black_forest.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 4.9,
    reviewsCount: 162,
  },
  {
    id: "black-forest-classic",
    name: "Black Forest",
    category: "Black Forest",
    categoryId: "black-forest",
    weight: "1 kg",
    availableWeights: ["0.5 kg", "1 kg", "1.5 kg"],
    offerPrice: 599,
    originalPrice: 900,
    description: "Traditional Black Forest fresh cream cake prepared fresh daily for fast celebrations.",
    image: "/images/cakes/black_forest.jpg",
    isOffer: true,
    rating: 4.8,
    reviewsCount: 140,
  },
  {
    id: "white-forest",
    name: "White Forest",
    category: "Black Forest",
    categoryId: "black-forest",
    weight: "1 kg",
    availableWeights: ["0.5 kg", "1 kg", "1.5 kg", "2 kg"],
    offerPrice: 699,
    originalPrice: 1100,
    description: "Soft vanilla sponge layered with pure white chocolate flakes, whipped cream, and glossy red cherries.",
    image: "/images/cakes/white_forest.jpg",
    isOffer: true,
    rating: 4.7,
    reviewsCount: 86,
  },

  // 2. Red Velvet
  {
    id: "classic-red-velvet",
    name: "Classic Red Velvet",
    category: "Red Velvet",
    categoryId: "red-velvet",
    weight: "1 kg",
    availableWeights: ["0.5 kg", "1 kg", "1.5 kg", "2 kg"],
    offerPrice: 1000,
    originalPrice: 1500,
    description: "Signature red velvet sponge layered with silky smooth cream cheese frosting, topped with red velvet crumbs and gold leaf flakes.",
    image: "/images/cakes/red_velvet.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 4.9,
    reviewsCount: 128,
  },
  {
    id: "red-velvet-special",
    name: "Red Velvet",
    category: "Red Velvet",
    categoryId: "red-velvet",
    weight: "1 kg",
    availableWeights: ["0.5 kg", "1 kg", "2 kg"],
    offerPrice: 900,
    originalPrice: 1200,
    description: "Moist red velvet cake with fresh vanilla whipped cream frosting, perfectly balanced and appetizing.",
    image: "/images/cakes/red_velvet.jpg",
    isOffer: true,
    rating: 4.8,
    reviewsCount: 94,
  },
  {
    id: "anniversary-heart-delight",
    name: "Red Velvet Heart Delight",
    category: "Red Velvet",
    categoryId: "red-velvet",
    weight: "1 kg",
    availableWeights: ["1 kg", "1.5 kg", "2 kg"],
    offerPrice: 1100,
    originalPrice: 1600,
    description: "Heart-shaped fresh cream cake with red velvet sponge and gold pearls for couples celebrating special milestones.",
    image: "/images/cakes/red_velvet.jpg",
    isOffer: true,
    rating: 4.9,
    reviewsCount: 110,
  },

  // 3. Chocolate
  {
    id: "dark-chocolate-fantasy",
    name: "Dark Chocolate Fantasy",
    category: "Chocolate",
    categoryId: "chocolate",
    weight: "1 kg",
    availableWeights: ["0.5 kg", "1 kg", "1.5 kg", "2 kg"],
    offerPrice: 950,
    originalPrice: 1400,
    description: "Deep dark cocoa sponge with luscious chocolate ganache drip and handmade chocolate curls.",
    image: "/images/cakes/black_forest.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 4.9,
    reviewsCount: 130,
  },

  // 4. Truffle
  {
    id: "dutch-chocolate-truffle",
    name: "Dutch Chocolate Truffle",
    category: "Truffle",
    categoryId: "truffle",
    weight: "1 kg",
    availableWeights: ["0.5 kg", "1 kg", "1.5 kg", "2 kg"],
    offerPrice: 1100,
    originalPrice: 1600,
    description: "Dense dark chocolate truffle layers filled with rich Belgian ganache and velvety chocolate glaze.",
    image: "/images/cakes/choco_caramel.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 5.0,
    reviewsCount: 145,
  },

  // 5. Brownies
  {
    id: "fudge-brownie-cake",
    name: "Fudge Chocolate Brownie Cake",
    category: "Brownies",
    categoryId: "brownies",
    weight: "1 kg",
    availableWeights: ["1 kg", "1.5 kg"],
    offerPrice: 850,
    originalPrice: 1200,
    description: "Gooey chocolate fudge brownie base layered with whipped chocolate cream and roasted walnuts.",
    image: "/images/cakes/black_forest.jpg",
    isOffer: true,
    rating: 4.8,
    reviewsCount: 78,
  },

  // 6. Butterscotch
  {
    id: "butterscotch-crunch",
    name: "Classic Butterscotch Crunch",
    category: "Butterscotch",
    categoryId: "butterscotch",
    weight: "1 kg",
    availableWeights: ["0.5 kg", "1 kg", "1.5 kg", "2 kg"],
    offerPrice: 750,
    originalPrice: 1100,
    description: "Soft vanilla sponge soaked in butterscotch syrup with caramel pralines and crunchy cashew nougat.",
    image: "/images/cakes/white_forest.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 4.8,
    reviewsCount: 112,
  },

  // 7. Cassata
  {
    id: "sicilian-cassata-cake",
    name: "Sicilian Cassata Delight",
    category: "Cassata",
    categoryId: "cassata",
    weight: "1 kg",
    availableWeights: ["1 kg", "1.5 kg"],
    offerPrice: 850,
    originalPrice: 1250,
    description: "Multi-layered colorful sponge with candied fruits, dry fruits, and delicate fresh cream frosting.",
    image: "/images/cakes/white_forest.jpg",
    isOffer: true,
    rating: 4.7,
    reviewsCount: 64,
  },

  // 8. Caramel
  {
    id: "choco-caramel-fusion",
    name: "Choco Caramel",
    category: "Caramel",
    categoryId: "caramel",
    weight: "1.5 kg",
    availableWeights: ["1 kg", "1.5 kg", "2 kg"],
    offerPrice: 1200,
    originalPrice: 1800,
    description: "Chocolate and caramel fusion cake featuring dark chocolate sponge, smooth caramel drip, topped with cocoa truffles.",
    image: "/images/cakes/choco_caramel.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 4.9,
    reviewsCount: 178,
  },
  {
    id: "salted-caramel-drip",
    name: "Salted Caramel Drip Cake",
    category: "Caramel",
    categoryId: "caramel",
    weight: "1 kg",
    availableWeights: ["1 kg", "1.5 kg", "2 kg"],
    offerPrice: 950,
    originalPrice: 1400,
    description: "Moist sponge with golden salted caramel drizzle and toffee crunch pearls.",
    image: "/images/cakes/choco_caramel.jpg",
    isOffer: true,
    rating: 4.8,
    reviewsCount: 89,
  },

  // 9. Fruit Flavours
  {
    id: "fresh-mixed-fruit-cake",
    name: "Fresh Exotic Fruit Cake",
    category: "Fruit Flavours",
    categoryId: "fruit-flavours",
    weight: "1 kg",
    availableWeights: ["0.5 kg", "1 kg", "1.5 kg", "2 kg"],
    offerPrice: 950,
    originalPrice: 1400,
    description: "Light vanilla sponge loaded with fresh seasonal kiwis, strawberries, apples, and glazed pineapple.",
    image: "/images/cakes/white_forest.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 4.9,
    reviewsCount: 122,
  },
  {
    id: "alphonso-mango-cake",
    name: "Alphonso Mango Fresh Cream",
    category: "Fruit Flavours",
    categoryId: "fruit-flavours",
    weight: "1 kg",
    availableWeights: ["1 kg", "1.5 kg"],
    offerPrice: 850,
    originalPrice: 1200,
    description: "Juicy Alphonso mango pulp infused in light vanilla whipped cream.",
    image: "/images/cakes/white_forest.jpg",
    isOffer: true,
    rating: 4.8,
    reviewsCount: 95,
  },

  // 10. Rasmalai
  {
    id: "royal-rasmalai-cake",
    name: "Royal Rasmalai Fusion Cake",
    category: "Rasmalai",
    categoryId: "rasmalai",
    weight: "1 kg",
    availableWeights: ["1 kg", "1.5 kg", "2 kg"],
    offerPrice: 1200,
    originalPrice: 1700,
    description: "Authentic Indian sweet fusion cake soaked in cardamom-saffron milk, topped with tender rasmalai pieces and pistachios.",
    image: "/images/cakes/white_forest.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 5.0,
    reviewsCount: 156,
  },

  // 11. Spanish Delight
  {
    id: "spanish-delight-cake",
    name: "Spanish Delight Nutty Cake",
    category: "Spanish Delight",
    categoryId: "spanish-delight",
    weight: "1 kg",
    availableWeights: ["1 kg", "1.5 kg", "2 kg"],
    offerPrice: 1050,
    originalPrice: 1550,
    description: "Rich condensed milk and caramel flavor layered with roasted almonds and creamy Spanish delight frosting.",
    image: "/images/cakes/choco_caramel.jpg",
    isOffer: true,
    rating: 4.9,
    reviewsCount: 84,
  },

  // 12. Plum & Christmas
  {
    id: "traditional-plum-cake",
    name: "Traditional Rich Plum Cake",
    category: "Plum & Christmas",
    categoryId: "plum-christmas",
    weight: "1 kg",
    availableWeights: ["0.5 kg", "1 kg", "2 kg"],
    offerPrice: 850,
    originalPrice: 1200,
    description: "Spiced dark fruit cake slow-aged with premium soaked raisins, cashews, cranberries, and citrus peel.",
    image: "/images/cakes/black_forest.jpg",
    isOffer: true,
    rating: 4.9,
    reviewsCount: 110,
  },

  // 13. Doll & Theme Cakes
  {
    id: "barbie-princess-doll-cake",
    name: "Barbie Doll & Princess Theme Cake",
    category: "Doll & Theme Cakes",
    categoryId: "doll-theme",
    weight: "1.5 kg",
    availableWeights: ["1.5 kg", "2 kg", "3 kg"],
    offerPrice: 1600,
    originalPrice: 2200,
    description: "Handcrafted 3D sculpted doll dress cake with intricate pink & purple fresh cream rosettes.",
    image: "/images/cakes/custom_model.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 4.9,
    reviewsCount: 96,
  },

  // 14. Photo Cakes
  {
    id: "custom-photo-print-cake",
    name: "Edible Photo Print Cake",
    category: "Photo Cakes",
    categoryId: "photo-cakes",
    weight: "1 kg",
    availableWeights: ["1 kg", "1.5 kg", "2 kg"],
    offerPrice: 1100,
    originalPrice: 1500,
    description: "Personalized cake featuring your customized memory printed on high-grade edible sugar sheet.",
    image: "/images/cakes/custom_model.jpg",
    isOffer: true,
    rating: 4.8,
    reviewsCount: 74,
  },

  // 15. Wedding & Tier Cakes
  {
    id: "royal-wedding-elegance",
    name: "Royal Wedding Elegance",
    category: "Wedding & Tier Cakes",
    categoryId: "wedding-tier",
    weight: "3 kg",
    availableWeights: ["2 kg", "3 kg", "5 kg"],
    offerPrice: 3500,
    originalPrice: 4500,
    description: "Spectacular multi-tier fresh cream wedding cake decorated with gold leaf trim and fresh floral arrangements.",
    image: "/images/cakes/wedding_cake.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 5.0,
    reviewsCount: 45,
  },

  // 16. Custom Cakes
  {
    id: "golden-royalty-custom",
    name: "Golden Royalty Custom Model",
    category: "Custom Cakes",
    categoryId: "custom-cakes",
    weight: "2 kg",
    availableWeights: ["1.5 kg", "2 kg", "3 kg"],
    offerPrice: 2400,
    originalPrice: 3000,
    description: "Sculpted custom birthday tier cake featuring purple buttercream rosettes, gold macarons, and edible glitter.",
    image: "/images/cakes/custom_model.jpg",
    isBestseller: true,
    isOffer: true,
    rating: 4.9,
    reviewsCount: 92,
  },
];
