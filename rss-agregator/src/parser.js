/* eslint-disable */
import axios from 'axios'
import _ from 'lodash'

const parser = (responseData, url) => {
    try {
        const parser = new DOMParser();
        const xmlData = responseData;
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
                obj[`${node.nodeName}`] = node.textContent
            })
            itemsArr.push(obj)
        })
        return {posts: itemsArr, feed: {id_feed, mainTitle, mainDescription, link: url}}
    } catch(err) {
        return err;
    }
}

export { parser }