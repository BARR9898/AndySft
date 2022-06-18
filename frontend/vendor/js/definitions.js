const API_ENDPOINT = 'http://api.template.loc/';
const USER_TOKEN = () => JSON.parse(localStorage.getItem('userToken')) || null;
const USER_INFO = () => JSON.parse(localStorage.getItem('userInfo')) || {};
const NO_IMAGE = '/vendor/images/no-image.png';