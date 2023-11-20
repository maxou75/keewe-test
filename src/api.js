import axios from 'axios';


const baseURL = `http://localhost:3000`;

const setUrl = (uri) => (`${baseURL}${uri}`)

export const getCurrencies = () => {
    const url = setUrl('/currencies')
    return axios.get(url)
}

export const getConversion = ({amount, selectedCurrency}) => {
    const url = setUrl('/conversion')
    return axios.get(url, { params: { amount, selectedCurrency }})
}

export const postPayment = (data) => {
    const url = setUrl('/payment')
    return axios.post(url, data)
}

export const getPayments = () => {
    const url = setUrl('/payments')
    return axios.get(url)
}
