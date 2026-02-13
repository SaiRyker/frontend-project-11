/* eslint-disable */
// import { render } from "./init.js";
import onChange from 'on-change';

const render = (elements, state) => {
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
    const errDiv = document.querySelector('#errors')
    console.log("Errors: ", state.rssProcess.errors)
    const errors = state.rssProcess.errors.join(', ')
    errDiv.textContent = errors
    elements.inputEl.classList.add('is-invalid');
  } else {
    elements.inputEl.classList.remove('is-invalid');
  }


  elements.inputEl.value = '';
  elements.feedContainer.appendChild(elements.feeds);
  elements.inputEl.focus()
}

const watchState = (state, elements) => {
    const watcherState = onChange(state, (path) => {
        render(elements, state)
    })

    return watcherState
}

export {watchState}