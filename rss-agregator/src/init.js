/* eslint-disable import/extensions */
/* eslint-disable */
import './style.css';
import { proxy, snapshot, subscribe } from 'valtio/vanilla';
import { validateForm, validateDublicate } from './validation.js';
import { watchState } from './view.js';

const init = () => {
  const state = proxy({

    formUrl: {
      url: '',
      errors: [],
    },

    rssProcess: {
      stateProcess: 'filling',
      errors: [],
    },

    feeds: [],

  });

  const elements = {
    formContainer: document.querySelector('#form-section'),
    feedContainer: document.querySelector('#feed-section'),
    formEl: document.querySelector('form.rss-form'),
    inputEl: document.querySelector('input#url-input'),
    submitBtn: document.querySelector('button'),
    feeds: document.createElement('div'),
  };

  const watcher = watchState(state, elements)

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
            throw formResult
        }
        const dublicateResult = validateDublicate(url, state.feeds)

        if (dublicateResult instanceof Error) {
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
        watcher.rssProcess.errors.push(error.message);
        console.error('Ошибка: ', error.message)
      })
  });

};

export { init }