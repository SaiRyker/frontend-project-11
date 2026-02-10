/* eslint-disable import/extensions */
/* eslint-disable */
import './style.css';
import { proxy, snapshot, subscribe } from 'valtio/vanilla';
import { validateForm, validateDublicate } from './validation.js';

export default () => {
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
    container: document.querySelector('#app'),
    formEl: document.createElement('form'),
    inputEl: document.createElement('input'),
    submitBtn: document.createElement('button'),
    feeds: document.createElement('div'),
  };

  function addStyles() {
    const obj = snapshot(state);
    elements.inputEl.id = 'url-input';
    elements.inputEl.type = 'text';
    elements.inputEl.name = 'url';
    elements.inputEl.placeholder = 'ссылка RSS';
    elements.inputEl.autocomplete = 'off';
    elements.inputEl.setAttribute('aria-label', 'url');
    elements.inputEl.required = true;
    elements.inputEl.autofocus = true;
    elements.inputEl.classList.remove('is-invalid');

    if (obj.rssProcess.stateProcess === 'failed') {
      elements.inputEl.classList.add('is-invalid');
    }

    elements.submitBtn.type = 'submit';
    elements.submitBtn.textContent = 'Добавить';
  }

  function render() {
    console.log(state.feeds);
    elements.container.innerHTML = '';
    elements.feeds.innerHTML = '';

    addStyles();
    state.feeds.forEach((feed) => {
      const h2El = document.createElement('h2');
      h2El.textContent = 'New Feed';
      const pEl = document.createElement('p');
      pEl.textContent = feed;
      elements.feeds.appendChild(h2El);
      elements.feeds.appendChild(pEl);
    });
    elements.inputEl.value = '';
    elements.formEl.appendChild(elements.inputEl);
    elements.formEl.appendChild(elements.submitBtn);
    elements.container.appendChild(elements.formEl);
    elements.container.appendChild(elements.feeds);
    // elements.inputEl.focus()
  }

  subscribe(state, render);

  elements.formEl.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target).get('url');
    const url = formData.trim();
    console.log(url);

    state.rssProcess.errors = [];
    state.rssProcess.stateProcess = 'processing';

    validateForm(({url}))
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
        state.feeds.push(url);
        state.rssProcess.stateProcess = 'success';
        event.target.reset();
        console.log('Фид добавлен:', url);
      })
      .catch(error => {
        state.rssProcess.stateProcess = 'failed';
        state.rssProcess.errors.push(error.message);
        console.error('Ошибка: ', error.message)
      })
  });

  render();
};
