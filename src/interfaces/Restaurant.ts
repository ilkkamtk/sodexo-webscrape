import { Point } from 'geojson';

interface Restaurant {
  companyId: number;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  location: Point;
  company: 'Sodexo' | 'Compass Group';
}

interface Course {
  name: string;
  price: string;
  diets: string;
}

interface DailyMenu {
  courses: Course[];
}

interface WeeklyMenu {
  day: {
    date: string;
    courses: Course[];
  };
}

export { Restaurant, DailyMenu, WeeklyMenu };
