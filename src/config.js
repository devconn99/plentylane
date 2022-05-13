export default {
    API_ORIGIN: 'http://192.168.0.140:3002',
    // API_ORIGIN: 'https://api.plentylane.com',
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
    PUBLISHABLE_KEY:
      "pk_test_51K8qCPGB4hdOutpgof9ByAyhSh8TEGa9gxWm7zFXppqjUqJu0twUuVDbvL4x6kgzVgKvpcLFCPoqv5J3kn86gJWj00RvDZA6zj",
    PRICE: {
      CASUAL_MONTHLY: { price: 4.95, id: "price_1KxhnmGB4hdOutpgm3lrDGFJ" },
      CASUAL_ANNUAL: { price: 49.5, id: "price_1KxhnmGB4hdOutpgB6eK9heI" },
      UNLIMITED_MONTHLY: { price: 8.95, id: "price_1KxhqpGB4hdOutpgQWcMxjVk" },
      UNLIMITED_ANNUAL: { price: 89.5, id: "price_1KxhqpGB4hdOutpgmNvLBJFR" },
    },
  },
};
