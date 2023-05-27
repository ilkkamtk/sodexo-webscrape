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

interface Day {
  date: string;
  courses: Course[];
}

interface WeeklyMenu {
  days: Day[];
}

export { Restaurant, DailyMenu, WeeklyMenu, Course };
