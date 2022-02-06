import axios from 'axios'

let BASE_URL = '/api/persons'

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:3002/api/persons'
}

const getAll = () => {
  const request = axios.get(BASE_URL)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(BASE_URL, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  const request = axios.delete(`${BASE_URL}/${id}`)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${BASE_URL}/${id}`, newObject)
  return request.then(response => response.data)
}

export default {
  getAll, create, remove, update
}
