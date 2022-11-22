import { fetchPixabayImages } from './js/fetchPixabay.js';
import { IMAGES_PER_PAGE, THROTTLE_DELAY, LIGHTBOX_PARAMS } from './js/utils/envConsts.js';

import { Notify } from 'notiflix';
import throttle from 'lodash.throttle';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';

import cardTpl from './js/templates/cardTpl.hbs';

import './css/styles.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');

let page = null;
let query = null;
let pagesAvailable = null;
let isFetching = false;
const throttledHandlerDocumentScroll = throttle(handleDocumentScroll, THROTTLE_DELAY);

const lightbox = new SimpleLightbox('.gallery a', LIGHTBOX_PARAMS);

async function handleFormSubmit(e) {
  e.preventDefault();
  page = 1;
  query = e.target.elements.searchQuery.value.trim();
  if (!query) return;
  try {
    const { hits, totalHits } = await fetchPixabayImages(query, page);
    galleryEl.innerHTML = '';
    pagesAvailable = Math.ceil(totalHits / IMAGES_PER_PAGE);
    if (!hits.length) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    const markup = hits.map(image => cardTpl(image)).join('');
    galleryEl.innerHTML = markup;
    lightbox.refresh();
    Notify.info(`Hooray! We found ${totalHits} images.`);
    document.addEventListener('scroll', throttledHandlerDocumentScroll);
    showMoreImages();
  } catch (error) {
    Notify.failure(error.message);
  }
}

function handleDocumentScroll() {
  if (isFetching) return;
  showMoreImages();
  if (page === pagesAvailable) {
    document.removeEventListener('scroll', throttledHandlerDocumentScroll);
  }
}

async function showMoreImages() {
  // new comment
  if (isFetching || page === pagesAvailable) return;
  if (document.documentElement.scrollHeight - document.documentElement.scrollTop < 2000) {
    isFetching = true;
    page += 1;
    try {
      const { hits } = await fetchPixabayImages(query, page);
      const markup = hits.map(image => cardTpl(image)).join('');
      galleryEl.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
    } catch (error) {
      Notify.failure(error.message);
    }
    isFetching = false;
  }
}

formEl.addEventListener('submit', handleFormSubmit);
