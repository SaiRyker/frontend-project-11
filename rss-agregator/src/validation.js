/* eslint-disable no-unused-vars */
import { object, string, setLocale } from 'yup';

setLocale({
  mixed: {
    default: 'Что-то пошло не так',
  },
  string: {
    url: ({ url }) => ({ key: 'invalidUrl', values: { url } }),
  },
});

const formSchema = object().shape({
  url: string().url().required(),
});

const validateForm = (formData) => formSchema.validate(formData)
  .then(() => {
    console.log('success');
    return {};
  })
  .catch((err) => {
    console.log('Ошибка валидации URL: ', err.message);
    return err;
  });

const validateDublicate = (feed, arr) => {
  try {
    if (arr.includes(feed)) {
      throw new Error('RSS уже существует');
    }
    return {};
  } catch (err) {
    return err;
  }
};

export { validateForm, validateDublicate };
