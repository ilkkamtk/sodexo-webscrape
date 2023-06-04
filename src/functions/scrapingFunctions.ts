import jsdom from 'jsdom';
import { Restaurant } from '../interfaces/Restaurant';
import { Point } from 'geojson';
import { SodexoDailyMenu, SodexoWeeklyMenu } from '../interfaces/Sodexo';
import {
  CompassDailyMenu,
  CompassRestaurant,
  CompassWeeklyMenu,
} from '../interfaces/Compass';
import today from './today';

const url = 'https://www.sodexo.fi/opiskelijaravintolat';
const url2 = 'https://www.sodexo.fi';

const scrapeSodexoRestaurants = async () => {
  const restaurantsResponse = await fetch(url);
  const restaurantsHtml = await restaurantsResponse.text();
  const dom = new jsdom.JSDOM(restaurantsHtml);

  const links = dom.window.document.querySelectorAll(
    '#views-form-restaurant-listing-restaurants-by-venuetype-75 a',
  );

  // concert links to array
  const linksArray = Array.from(links);

  const restaurants = await Promise.all(
    linksArray.map(async (link) => {
      const href = link.getAttribute('href');
      const restaurantResponse = await fetch(url2 + href);
      const restaurantHtml = await restaurantResponse.text();
      const restaurantDom = new jsdom.JSDOM(restaurantHtml);
      const name =
        restaurantDom.window.document.querySelector(
          '.field--name-title',
        )?.textContent;
      const jsonLink = restaurantDom.window.document
        .querySelector('a[href*="daily_json"]')
        ?.getAttribute('href');
      const address = restaurantDom.window.document.querySelector(
        '.field--name-field-street-address',
      )?.textContent;
      const city = restaurantDom.window.document.querySelector(
        '.field--name-field-postal-office',
      )?.textContent;
      const zip = restaurantDom.window.document.querySelector(
        '.field--name-field-postal-code',
      )?.textContent;
      const phone = restaurantDom.window.document.querySelector(
        '.field--name-field-phone-number-1',
      )?.textContent;

      const geocodingResponse = await fetch(
        `https://api.digitransit.fi/geocoding/v1/search?text=${address}, ${city}&size=1&digitransit-subscription-key=${process.env.DIGITRANSIT_SUBSCRIPTION_KEY}`,
      );
      const geocodingJson = await geocodingResponse.json();
      const location = geocodingJson.features[0].geometry as Point;

      if (name && jsonLink && address && city && zip && phone) {
        const id = +jsonLink.split('/').slice(-2)[0];
        const restaurant: Restaurant = {
          companyId: id,
          name,
          address,
          city,
          postalCode: zip,
          phone,
          location,
          company: 'Sodexo',
        };
        return restaurant;
      }
    }),
  );
  return restaurants.filter((restaurant) => restaurant !== undefined);
};

const scrapeSodexoDailyMenu = async (id: number, lang: string) => {
  lang = lang !== 'en' ? '' : 'en/';
  const menuResponse = await fetch(
    `https://www.sodexo.fi/${lang}ruokalistat/output/daily_json/${id}/${today()}`,
  );
  const menuJson = (await menuResponse.json()) as SodexoDailyMenu;
  return menuJson;
};

const scrapeSodexoWeeklyMenu = async (id: number, lang: string) => {
  lang = lang !== 'en' ? '' : 'en/';
  const menuResponse = await fetch(
    `https://www.sodexo.fi/${lang}ruokalistat/output/weekly_json/${id}`,
  );
  const menuJson = (await menuResponse.json()) as SodexoWeeklyMenu;
  return menuJson;
};

const scrapeCompassRestaurants = async () => {
  const restaurants: CompassRestaurant[] = [];
  let looping = true;
  let page = 1;
  while (looping) {
    const restaurantsResponse = await fetch(
      `https://www.compass-group.fi/api/restaurant-search?q=&page=${page}&pageSize=5&language=fi&matchAllServiceIds=2921&date=${today()}`,
    );
    const restaurantsJson = await restaurantsResponse.json();
    restaurants.push(...restaurantsJson.hits);
    page++;
    looping = restaurantsJson.hasMore;
  }
  return restaurants;
};

const getCompassCostCenterId = async (contentUrl: string) => {
  const costCenterResponse = await fetch(
    `https://www.compass-group.fi/api/cda/content?contentUrl=${contentUrl}`,
  );
  const costCenterJson = await costCenterResponse.json();
  const costCenterId = costCenterJson[0].costCenter;
  return costCenterId;
};

const scrapeCompassDailyMenu = async (id: number, lang: string) => {
  const menuResponse = await fetch(
    `https://www.compass-group.fi/menuapi/day-menus?costCenter=${id}&date=${today()}&language=${lang}`,
  );
  const menuJson = (await menuResponse.json()) as CompassDailyMenu;
  return menuJson;
};

const scrapeCompassWeeklyMenu = async (id: number, lang: string) => {
  const menuResponse = await fetch(
    `https://www.compass-group.fi/menuapi/week-menus?costCenter=${id}&date=${today()}&language=${lang}`,
  );
  const menuJson = (await menuResponse.json()) as CompassWeeklyMenu;
  return menuJson;
};

export {
  scrapeSodexoRestaurants,
  scrapeSodexoDailyMenu,
  scrapeSodexoWeeklyMenu,
  scrapeCompassRestaurants,
  scrapeCompassDailyMenu,
  scrapeCompassWeeklyMenu,
  getCompassCostCenterId,
};
