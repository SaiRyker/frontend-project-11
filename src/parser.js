import _ from 'lodash'

const parser = (responseData, url) => {
  try {
    const parserXml = new DOMParser()
    const xmlData = responseData
    const docFetched = parserXml.parseFromString(xmlData, 'application/xml')
    const mainTitle = docFetched.querySelector('title').textContent
    const mainDescription = docFetched.querySelector('description').textContent
    const idFeed = _.uniqueId()

    const items = docFetched.querySelectorAll('item')
    const itemsArr = []

    items.forEach((item) => {
      const obj = {
        id_post: _.uniqueId(),
        feed_id: idFeed,
      }
      item.childNodes.forEach((node) => {
        obj[`${node.nodeName}`] = node.textContent
      })
      itemsArr.push(obj)
    })
    return {
      posts: itemsArr,
      feed: {
        idFeed, mainTitle, mainDescription, link: url,
      },
    }
  }
  catch (err) {
    return err
  }
}

export default parser
