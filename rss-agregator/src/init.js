/* eslint-disable import/extensions */
/* eslint-disable */
import './style.css';
// import { proxy, snapshot, subscribe } from 'valtio/vanilla';
import { validateForm, validateDublicate } from './validation.js';
import i18next from 'i18next';
import resourses from './locales/resourses.js';
import { parser } from './parser.js';
import { watchState } from './view.js';
import axios from 'axios';
import _ from 'lodash';

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

    posts: [],

  };

  const elements = {
    formContainer: document.querySelector('#form-section'),
    feedContainer: document.querySelector('#feed-section'),
    postsContainer: document.querySelector('#posts-section'),
    formEl: document.querySelector('form.rss-form'),
    inputEl: document.querySelector('input#url-input'),
    submitBtn: document.querySelector('button'),
  };

  const i18Instance = i18next.createInstance()

  i18Instance.init({
    lng: 'ru',
    fallbackLng: 'ru',
    debug: true,
    resources: resourses,
  }).then(() => {
    const watcher = watchState(state, elements, i18Instance)

    const getUrl = (url) => {
      const protocol = 'https'
      const hostname = 'allorigins.hexlet.app/get'
      const path = 'get'
      const proxyUrl = new URL(path, `${protocol}://${hostname}`)
      proxyUrl.searchParams.set('disableCache', 'true')
      proxyUrl.searchParams.set('url', url)

      return proxyUrl.href
    } 

    const updatePosts = () => {
      const promisesUrl = watcher.feeds.map(({link}) => axios.get(getUrl(link)))
      const promise = Promise.all(promisesUrl)
      promise
      .then(responses => {
        const currentPosts = [...watcher.posts]
        const allUpdatedPosts = {
          posts: []
        }

        responses.forEach((response) => {
          const urlFeed = response.data.status.url
          const [{ id_feed }] = watcher.feeds.filter((feed) => feed.link === urlFeed)
          console.log(id_feed)
          const oldPosts = currentPosts.filter((post) => post.feed_id === id_feed)
          const parsedPosts = parser(response.data.contents, urlFeed)
          const newPosts = _.differenceBy(parsedPosts, oldPosts, 'link')
          console.log("Старые ", oldPosts)
          console.log("Парсерсные ", parsedPosts)
          console.log("Новые ", newPosts)
          const newPostsIds = newPosts.map((post) => ({
              id_post: _.uniqueId(),
              feed_id: id_feed,
              ...post
          }))
          allUpdatedPosts.posts = [...allUpdatedPosts.posts, ...newPostsIds, ...oldPosts]
        })
        watcher.posts = allUpdatedPosts.posts
      })
      .catch(error => {
        watcher.rssProcess.stateProcess = 'failed';
        console.error('Ошибка: ', error.message)
      })
      .finally(() => {
        setTimeout(updatePosts, 5000);
      })
    }

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
          const dublicateResult = validateDublicate(url, watcher.feeds)
          console.log("Dublicate valid: ", dublicateResult)
          if (dublicateResult instanceof Error) {
            watcher.rssProcess.errors.push('dublicate');
            throw dublicateResult
          }

          return axios.get(getUrl(url))
        })
        .then((response) => {
          if (response instanceof Error) {
            watcher.rssProcess.errors.push('invalidRSS');
            throw response
          }

          const parsedResponse = parser(response.data.contents, url)
          const posts = parsedResponse.posts
          const feedInfo = parsedResponse.feed
          watcher.feeds.push(feedInfo);
          watcher.posts.push(...posts)
          watcher.rssProcess.stateProcess = 'success';
          event.target.reset();
          console.log('Фид добавлен:', url);
          console.log(watcher.feeds)
        })
        .catch(error => {
          watcher.rssProcess.stateProcess = 'failed';
          console.error('Ошибка: ', error.message)
        })
    });
    setTimeout(updatePosts, 5000);
  })
};

export { init }