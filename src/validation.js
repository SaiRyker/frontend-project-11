import { object, string, setLocale } from 'yup'

setLocale({
  mixed: {
    default: 'Что-то пошло не так',
  },
  string: {
    url: ({ url }) => ({ key: 'invalidUrl', values: { url } }),
  },
})

const formSchema = object().shape({
  url: string().url().required(),
})

const validateForm = formData => formSchema.validate(formData)
  .then(() => ({}))
  .catch(err => err)

const validateDublicate = (feedUrl, arrFeeds) => {
  try {
    arrFeeds.forEach((feed) => {
      if (feed.link === feedUrl) {
        throw new Error('RSS уже существует')
      }
    })
    return {}
  }
  catch (err) {
    return err
  }
}

export { validateForm, validateDublicate }
