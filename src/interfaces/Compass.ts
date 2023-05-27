interface Coordinates {
  latitude: number;
  longitude: number;
}

interface CompassRestaurant {
  streetAddress: string;
  postalCode: string;
  city: string;
  openingHoursToday: string;
  lunchHoursToday: string;
  distanceKm: null;
  callToActionPrimaryUrl: string;
  callToActionPrimaryName: null;
  callToActionSecondaryUrl: string;
  callToActionSecondaryName: null;
  squareTeaserImage: string;
  coordinates: Coordinates;
  title: string;
  teaserText: null;
  url: string;
  linkText: null;
  image: string;
  contentId: number;
}

interface MenuPackage {
  sortOrder: number;
  name: string;
  price: string;
  meals: Meal[];
}

interface Meal {
  name: string;
  recipeId: number;
  diets: string[];
  nutrients: Nutrients | null;
  structuredNutrients: StructuredNutrient[] | null;
  iconUrl: string;
  price?: string;
}

interface Nutrients {
  energyCalories: string;
  energyKj: string;
  protein: string;
  carbohydrates: string;
  fat: string;
  fatSaturated: string;
  sugars: string;
  fibre: string;
  salt: string;
}

interface StructuredNutrient {
  name: string;
  amount: number;
  unit: string;
}

interface CompassDailyMenu {
  dayOfWeek: string;
  date: string;
  menuPackages: MenuPackage[];
}

interface CompassWeeklyMenu {
  weekNumber: number;
  menus: CompassDailyMenu[];
}

export { CompassRestaurant, CompassDailyMenu, CompassWeeklyMenu, Meal };
