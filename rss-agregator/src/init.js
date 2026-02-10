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

    feeds: {
      list: [],
    },

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
    console.log(state.feeds.list);
    elements.container.innerHTML = '';
    elements.feeds.innerHTML = '';

    addStyles();
    state.feeds.list.forEach((feed) => {
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

  elements.formEl.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target).get('url');
    const validationResult = await validateForm({ url: formData });
    console.log(formData);

    if (Object.entries(validationResult).length !== 0) {
      state.rssProcess.stateProcess = 'failed';
      state.rssProcess.errors.push(validationResult.message);
      console.log(state.rssProcess.errors);
      return;
    }

    const validateDublicateResult = validateDublicate(formData, state.feeds.list);
    console.log(validateDublicateResult);
    console.log(Object.entries(validateDublicateResult));

    if (Object.entries(validateDublicateResult).length !== 0) {
      state.rssProcess.stateProcess = 'failed';
      state.rssProcess.errors.push(validateDublicateResult.message);
      console.log(state.rssProcess.errors);
      return;
    }

    state.rssProcess.stateProcess = 'searching';

    setTimeout(() => {
      state.rssProcess.stateProcess = 'success';
      state.feeds.list.push(formData);
    }, 100);
  });

  render();
};
