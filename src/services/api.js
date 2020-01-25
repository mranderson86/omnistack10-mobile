import axios from 'axios';

const api = axios.create({
    //baseURL: 'https://arcane-depths-49398.herokuapp.com'
    baseURL: 'http://192.168.0.106:3333',
    //baseURL: 'http://127.0.0.1:3333',
    //baseURL: 'exp://2k-7mx.anonymous.mobile.exp.direct:3333'
});

export default api;