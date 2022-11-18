import { fetchPixabayImages } from './js/fetchPixabay.js';
import { IMAGES_PER_PAGE } from './js/utils/envConsts.js';
import { Notify } from 'notiflix';
import throttle from 'lodash.throttle';
import cardTpl from './js/templates/cardTpl.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
let page = null;
let query = null;
let imagesAvailable = null;
const throttledHandlerDocumentScroll = throttle(handleDocumentScroll, 500);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  animationSlide: false,
  animationSpeed: 500,
  maxZoom: 5,
});

function handleFormSubmit(e) {
  e.preventDefault();
  page = 1;
  query = e.target.elements.searchQuery.value.trim();
  fetchPixabayImages(query, page).then(({ hits, totalHits }) => {
    galleryEl.innerHTML = '';
    if (!hits.length) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    imagesAvailable = totalHits;
    const markup = hits.map(image => cardTpl(image)).join('');
    galleryEl.innerHTML = markup;
    lightbox.refresh();
    Notify.info(`Hooray! We found ${totalHits} images.`);
  });
}

function handleDocumentScroll({ target }) {
  if (target.documentElement.scrollHeight - target.documentElement.scrollTop < 2000) {
    page += 1;
    fetchPixabayImages(query, page).then(({ hits }) => {
      const markup = hits.map(image => cardTpl(image)).join('');
      galleryEl.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
    });
  }
  if (page * IMAGES_PER_PAGE >= imagesAvailable) {
    document.removeEventListener('scroll', throttledHandlerDocumentScroll);
  }
}

formEl.addEventListener('submit', handleFormSubmit);
document.addEventListener('scroll', throttledHandlerDocumentScroll);
