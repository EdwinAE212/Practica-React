import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://swapi.info/'
})

export default instance;