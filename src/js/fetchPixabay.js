import axios from 'axios';
import { pixabayKey, IMAGES_PER_PAGE } from './utils/envConsts.js';

const axiosPixabay = axios.create({
  baseURL: 'https://pixabay.com/api',
  params: {
    key: pixabayKey,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: IMAGES_PER_PAGE,
  },
});

export async function fetchPixabayImages(q, page) {
  const { data } = await axiosPixabay.get('', { params: { q, page } });
  return data;
}
