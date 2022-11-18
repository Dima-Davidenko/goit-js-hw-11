import * as dotenv from 'dotenv';
dotenv.config();

export const pixabayKey = process.env.PIXABAY_SECRET_KEY;
export const IMAGES_PER_PAGE = 40;
export const THROTTLE_DELAY = 500;
export const LIGHTBOX_PARAMS = {
  captionsData: 'alt',
  captionDelay: 250,
  animationSlide: false,
  animationSpeed: 500,
  maxZoom: 5,
};
