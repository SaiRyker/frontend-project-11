/* eslint-disable */
import axios from 'axios'

const parser = (url) => {

    const allOriginUrl = 'https://allorigins.hexlet.app/get'
    // const encodeUrlParam = encodeURIComponent(url) 

    return axios.get(allOriginUrl, {
        params: {
            disableCache: true,
            url,
        },
    })
    .then( function (response) {
        console.log(response)
        const parser = new DOMParser();
        const xmlData = response.data.contents
        const docFetched = parser.parseFromString(xmlData, "application/xml")
        console.log(docFetched)
        const mainTitle = docFetched.querySelector('title').textContent
        const mainDescription = docFetched.querySelector('description').textContent
        console.log(mainTitle)
        console.log(mainDescription)
        const items = docFetched.querySelectorAll('item')
        const itemsArr = []

        items.forEach((item) => {
            const obj = {}
            item.childNodes.forEach((node) => {
                obj[`${node.nodeName}`] = node
            })
            itemsArr.push(obj)
        })

        console.log(itemsArr)
        return {posts: itemsArr, feed: {mainTitle, mainDescription,}}
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