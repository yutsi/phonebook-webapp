const mongoose = require('mongoose')
const supertest = require('supertest')
const server = require('../server')
const Person = require('../models/person')

const api = supertest(server)

const initialPersons = [
  {
    name: 'Danny Fletcher',
    number: '1231231234'
  },
  {
    name: 'Grover Weiss',
    number: '2186568168'
  },
  {
    name: 'Bobby Ewing',
    number: '7167619364'
  },
  {
    name: 'Leanna Douglas',
    number: '5872109608'
  },
  {
    name: 'Charlotte Richard',
    number: '6301085329'
  },
  {
    name: 'Lelia Terry',
    number: '6540822239'
  },
  {
    name: 'Marianne Vazquez',
    number: '9673635961'
  },
  {
    name: 'Ron Wong',
    number: '5316271273'
  },
  {
    name: 'Sanford Bright',
    number: '3659969996'
  },
  {
    name: 'Stevie Mooney',
    number: '4429045658'
  },
  {
    name: 'Jacquelyn Kerr',
    number: '1953044785'
  }
]

beforeEach(async () => {
  await Person.deleteMany({})
  await Person.insertMany(initialPersons)
})

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all persons are returned', async () => {
  const response = await api.get('/api/persons')
  expect(response.body).toHaveLength(initialPersons.length)
})

afterAll(() => {
  mongoose.connection.close()
})
