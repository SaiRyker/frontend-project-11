/* eslint-disable import/extensions */
/* eslint-disable */
import './style.css';
// import { proxy, snapshot, subscribe } from 'valtio/vanilla';
import { validateForm, validateDublicate } from './validation.js';
import i18next from 'i18next';
import resourses from './locales/resourses.js';
import { watchState } from './view.js';

const init = () => {
  const state = {

    formUrl: {
      url: '',
      errors: [],
    },

    rssProcess: {
      stateProcess: 'filling',
      errors: [],
    },

    feeds: [],

  };

  const elements = {
    formContainer: document.querySelector('#form-section'),
    feedContainer: document.querySelector('#feed-section'),
    formEl: document.querySelector('form.rss-form'),
    inputEl: document.querySelector('input#url-input'),
    submitBtn: document.querySelector('button'),
    feeds: document.createElement('div'),
  };

  const i18Instance = i18next.createInstance()

  i18Instance.init({
    lng: 'ru',
    fallbackLng: 'ru',
    debug: true,
    resources: resourses,
  }).then(() => {
    console.log(i18Instance.exists('errors.invalidUrl'));
    console.log(i18Instance.t('errors.invalidUrl')); 
    const watcher = watchState(state, elements, i18Instance)

    elements.formEl.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(event.target).get('url');
      const url = formData.trim();
      console.log(url);

      watcher.rssProcess.errors = [];
      watcher.rssProcess.stateProcess = 'processing';

      validateForm({url})
        .then(formResult => {
          if (formResult instanceof Error) {
            watcher.rssProcess.errors.push('invalidUrl');
            throw formResult
          }
          const dublicateResult = validateDublicate(url, state.feeds)

          if (dublicateResult instanceof Error) {
            watcher.rssProcess.errors.push('dublicate');
            throw dublicateResult
          }

          return new Promise(resolve => setTimeout(resolve, 100));
        })
        .then(() => {
          watcher.feeds.push(url);
          watcher.rssProcess.stateProcess = 'success';
          event.target.reset();
          console.log('Фид добавлен:', url);
        })
        .catch(error => {
          watcher.rssProcess.stateProcess = 'failed';
          console.error('Ошибка: ', error.message)
        })
    });

  })
};

export { init }