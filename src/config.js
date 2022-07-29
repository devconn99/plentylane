export default {
  // API_ORIGIN: 'http://192.168.0.140:3002',
  API_ORIGIN: 'https://api.plentylane.com',
  PWD_MIN_LENGTH: 8,
  PWD_MAX_LENGTH: 20,
  USER_NAME_MIN_LENGTH: 6,
  USER_NAME_MAX_LENGTH: 15,
  MEAL_INFO: {
    DESCRIPTION_MAX_LENGTH: 4000,
    QUANTITY_MIN: 1,
    QUANTITY_MAX: 1000,
  },
  DINE_NOTES_MAX_LENGTH: 4000,
  TEXT_AREA_MAX_LENGTH: 4000,
  SEARCH: {
    AVAILABLE_SERVINGS_MIN: 1,
    AVAILABLE_SERVINGS_MAX: 1000,
  },
  LOADER_OPTIONS: {
    COLOR: "#009C90",
    BACKGROUND_COLOR: "#FEF8E6",
    IS_FULL_PAGE: false,
  },
  DIETARY_NOTES: {
    DAIRY: "Contains dairy",
    EGGS: "Contains eggs",
    PEANUTS: "Contains peanuts",
    TREE_NUTS: "Contains tree nuts",
    FISH: "Contains fish",
    SHELLFISH: "Contains shellfish",
    SOY: "Contains soy",
    VEGETARIAN: "Vegetarian",
    VEGAN: "Vegan",
    GLUTEN_FREE: "Gluten free",
    GLUTEN_FREE_KITCHEN: "Gluten free kitchen",
  },
  STRIPE_INFO: {
    SUCCESS_URL:"https://www.plentylane.com/plan-success",
    CANCEL_URL:"https://www.plentylane.com/choose-plan",
    SHOP_SUCCESS_URL:"https://www.plentylane.com/dashboard/shop/success",
    SHOP_CANCEL_URL:"https://www.plentylane.com/dashboard/shop",
    PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY,
    PRICE: {
      'starter-monthly': { price: 0, id: process.env.STARTER_MONTHLY_ID },
      'starter-annual': { price: 0, id: process.env.STARTER_ANNUAL_ID },
      'casual-monthly': { price: 4.95, id: process.env.CASUAL_MONTHLY_ID },
      'casual-annual': { price: 49.5, id: process.env.CASUAL_ANNUAL_ID },
      'unlimited-monthly': { price: 8.95, id: process.env.UNLIMITED_MONTHLY_ID },
      'unlimited-annual': { price: 89.5, id: process.env.UNLIMITED_ANNUAL_ID },
      'initial-fee': { price: 29.5, id: process.env.INITIAL_FEE },
      'container-fee':{ price:35, id: process.env.CONTAINER_FEE },
    },
    TAX: {
      'container-tax': { rate: 11.49, id: process.env.CONTAINER_TAX }
    }
  },
  RATINGS: {
    TAGS: [ "tastes great", "ready on time", "plenty to eat" ]
  }
};
