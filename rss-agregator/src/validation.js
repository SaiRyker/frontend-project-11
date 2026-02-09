import { object, string, number, date, array} from 'yup';
import {proxy, snapshot, subscribe} from 'valtio/vanilla'
import onChange from 'on-change';

const formSchema = object().shape({
    url: string().url().required()
})

const validateForm = async (formData, state) => {
    try {
        const resultValidation = await formSchema.validate(formData)
        console.log("success")
        return {}
    } catch (err) {
        console.error( "Ошибка валидации URL: ", err.message)
        return err
    }
    
}

const validateDublicate = (feed, arr) => {
    try {
        if (arr.includes(feed)) {
            throw new Error("RSS уже существует")
        }
        return {}
    } catch(err) {
        return {errors: err.message}
    }

}

export {validateForm, validateDublicate}
