/* eslint-disable */
// import { render } from "./init.js";
import onChange from 'on-change';

const render = (elements, state, i18n) => {

  if (state.rssProcess.stateProcess === 'failed') {
    const errors = state.rssProcess.errors
    const errDiv = document.querySelector('#notifications')
    console.log("Errors: ", errors)
    errors.forEach((error) => {
        errDiv.textContent = i18n.t(`errors.${error}`)
    })
    elements.inputEl.classList.add('is-invalid');

    return
  } else {
    elements.inputEl.classList.remove('is-invalid');
  }

  if (state.rssProcess.stateProcess === 'success') {
    elements.feedContainer.innerHTML = '';
    elements.postsContainer.innerHTML = '';

    const notifDiv = document.querySelector('#notifications')
    notifDiv.textContent = i18n.t(`success`)

    
    const h1Posts = document.createElement('h1')
    h1Posts.textContent = 'Посты'
    elements.postsContainer.appendChild(h1Posts)

    const h1Feeds = document.createElement('h1')
    h1Feeds.textContent = 'Фиды'
    elements.feedContainer.appendChild(h1Feeds)

    const ulPosts = document.createElement('ul')
    elements.postsContainer.appendChild(ulPosts)

    state.posts.forEach((post) => {

      const liEl = document.createElement('li')

      const aEl = document.createElement('a')
      aEl.href = post.link.textContent
      aEl.textContent = post.title.textContent

      const btnEl = document.createElement('button')
      btnEl.textContent = 'Просмотр'
      btnEl.type = 'button'

      liEl.appendChild(aEl)
      liEl.appendChild(btnEl)

      ulPosts.appendChild(liEl)
    })

    state.feeds.forEach((feed) => {
      const h3Feeds = document.createElement('h3');
      h3Feeds.textContent = feed.feedInfo.mainTitle;

      const pEl = document.createElement('p');
      pEl.textContent = feed.feedInfo.mainDescription;
      const feedDiv = document.createElement('div')

      feedDiv.appendChild(h3Feeds)
      feedDiv.appendChild(pEl)

      elements.feedContainer.appendChild(feedDiv)
    });

  }


  elements.inputEl.value = '';
  // elements.inputEl.focus()
}

const watchState = (state, elements, i18n) => {
    const watcherState = onChange(state, (path) => {
        render(elements, state, i18n)
    })

    return watcherState
}

export {watchState}