/* eslint-disable */
// import { render } from "./init.js";
import onChange from 'on-change';

const render = (elements, state, i18n) => {
  elements.feeds.innerHTML = '';

  state.feeds.forEach((feed) => {
    const h2El = document.createElement('h2');
    h2El.textContent = 'New Feed';
    const pEl = document.createElement('p');
    pEl.textContent = feed;
    elements.feeds.appendChild(h2El);
    elements.feeds.appendChild(pEl);
  });

  if (state.rssProcess.stateProcess === 'failed') {
    const errors = state.rssProcess.errors
    const errDiv = document.querySelector('#notifications')
    console.log("Errors: ", errors)
    errors.forEach((error) => {
        errDiv.textContent = i18n.t(`errors.${error}`)
    })
    elements.inputEl.classList.add('is-invalid');
  } else {
    elements.inputEl.classList.remove('is-invalid');
  }

  if (state.rssProcess.stateProcess === 'success') {
    const notifDiv = document.querySelector('#notifications')
    notifDiv.textContent = i18n.t(`success`)
  }


  elements.inputEl.value = '';
  elements.feedContainer.appendChild(elements.feeds);
  elements.inputEl.focus()
}

const watchState = (state, elements, i18n) => {
    const watcherState = onChange(state, (path) => {
        render(elements, state, i18n)
    })

    return watcherState
}

export {watchState}