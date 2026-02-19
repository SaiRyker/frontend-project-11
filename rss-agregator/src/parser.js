/* eslint-disable */
import axios from 'axios'
import _ from 'lodash'

const parser = (url) => {

    const allOriginUrl = 'https://allorigins.hexlet.app/get'

    return axios.get(allOriginUrl, {
        params: {
            disableCache: true,
            url,
        },
    })
    .then( function (response) {
        const parser = new DOMParser();
        const xmlData = response.data.contents
        const docFetched = parser.parseFromString(xmlData, "application/xml")

        const mainTitle = docFetched.querySelector('title').textContent
        const mainDescription = docFetched.querySelector('description').textContent
        const id_feed = _.uniqueId()

        const items = docFetched.querySelectorAll('item')
        const itemsArr = []

        items.forEach((item) => {
            const obj = {
                id_post: _.uniqueId(),
                feed_id: id_feed,
            }
            item.childNodes.forEach((node) => {
                obj[`${node.nodeName}`] = node
            })
            itemsArr.push(obj)
        })

        console.log(itemsArr)
        return {posts: itemsArr, feed: {id_feed, mainTitle, mainDescription,}}
    })
    .catch(function (err) {
        console.log(err)
        return err
    })

}

parser('https://lorem-rss.hexlet.app/feed')
  .then((contents) => console.log(contents))
  .catch(console.error);

export { parser }