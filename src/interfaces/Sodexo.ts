interface Recipe {
  name: string;
  ingredients: string;
  nutrients: string;
}

interface AdditionalDietInfo {
  dietcodeImages: string[];
  allergens: string;
}

interface RecipeCollection {
  [key: string]: Recipe;
}

interface Course {
  title_fi: string;
  title_en: string;
  category: string;
  dietcodes: string;
  properties: string;
  additionalDietInfo: AdditionalDietInfo;
  price: string;
  recipes: Recipe[] | RecipeCollection | { hideAll: { dietcodes: string } };
}

interface Meta {
  generated_timestamp: string;
  ref_url: string;
  ref_title: string;
}

interface SodexoDailyMenu {
  meta: Meta;
  courses: {
    [key: string]: Course;
  };
}

interface SodexoWeeklyMenu {
  meta: Meta;
  timeperiod: string;
  mealdates: {
    date: string;
    courses: {
      [key: string]: Course;
    };
  }[];
}

export { SodexoDailyMenu, SodexoWeeklyMenu };
