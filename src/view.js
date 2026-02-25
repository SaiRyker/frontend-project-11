import onChange from 'on-change'

const render = (elements, state, i18n) => {
  const errDiv = document.querySelector('.feedback')

  if (state.rssProcess.stateProcess === 'processing') {
    elements.submitBtn.disabled = true
  }
  else {
    elements.submitBtn.disabled = false
  }

  if (state.rssProcess.stateProcess === 'failed') {
    const { errors } = state.rssProcess
    errors.forEach(error => {
      errDiv.textContent = i18n.t(`errors.${error}`)
      errDiv.classList.remove('text-success')
      errDiv.classList.add('text-danger')
    })
    elements.inputEl.classList.add('is-invalid')

    return
  }
  elements.inputEl.classList.remove('is-invalid')

  if (state.rssProcess.stateProcess === 'success') {
    elements.postsContainer.innerHTML = ''
    elements.feedContainer.innerHTML = ''
    errDiv.classList.remove('text-danger')
    errDiv.classList.add('text-success')
    errDiv.textContent = i18n.t('success')

    const h1Posts = document.createElement('h1')
    h1Posts.textContent = 'Посты'
    elements.postsContainer.appendChild(h1Posts)

    const h1Feeds = document.createElement('h1')
    h1Feeds.textContent = 'Фиды'
    elements.feedContainer.appendChild(h1Feeds)

    const ulPosts = document.createElement('ul')
    elements.postsContainer.appendChild(ulPosts)
    ulPosts.classList.add('list-group', 'border-0', 'rounded-0')

    state.posts.forEach(post => {
      const liEl = document.createElement('li')
      liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

      const aEl = document.createElement('a')
      aEl.href = post.link
      aEl.textContent = post.title
      aEl.target = '_blank'
      aEl.setAttribute('data-id', `${post.id_post}`)

      if (state.viewState.visitedPosts.has(post.id_post)) {
        aEl.classList.add('fw-normal')
      }
      else {
        aEl.classList.add('fw-bold')
      }

      const btnEl = document.createElement('button')
      btnEl.textContent = 'Просмотр'
      btnEl.type = 'button'
      btnEl.classList.add('view-btn', 'btn', 'btn-outline-primary', 'btn-sm')
      btnEl.setAttribute('data-bs-toggle', 'modal')
      btnEl.setAttribute('data-bs-target', '#modal-post')
      btnEl.setAttribute('data-id', `${post.id_post}`)

      liEl.appendChild(aEl)
      liEl.appendChild(btnEl)

      ulPosts.appendChild(liEl)
    })

    const ulFeeds = document.createElement('ul')
    elements.feedContainer.appendChild(ulFeeds)
    ulFeeds.classList.add('list-group', 'border-0', 'rounded-0')

    state.feeds.forEach(feed => {
      const liEl = document.createElement('li')
      liEl.classList.add('list-group-item', 'border-0', 'border-end-0')

      const h3Feeds = document.createElement('h3')
      h3Feeds.textContent = feed.mainTitle
      h3Feeds.classList.add('h6', 'm-0')

      const pEl = document.createElement('p')
      pEl.textContent = feed.mainDescription
      pEl.classList.add('m-0', 'small', 'text-black-50')

      liEl.appendChild(h3Feeds)
      liEl.appendChild(pEl)

      ulFeeds.appendChild(liEl)
    })

    const postModal = state.posts.find(post => post.id_post === state.viewState.modalWindowActive)
    if (postModal) {
      const modalTitle = document.querySelector('.modal-title')
      const modalBody = document.querySelector('.modal-body')
      modalTitle.textContent = postModal.title
      modalBody.textContent = postModal.description

      const modalFooter = document.querySelector('.modal-footer')
      const btnPrim = modalFooter.querySelector('.btn-primary')
      btnPrim.href = postModal.link
    }
  }

  elements.inputEl.value = ''
}

const watchState = (state, elements, i18n) => {
  const watcherState = onChange(state, () => {
    render(elements, state, i18n)
  })

  return watcherState
}

export default watchState
