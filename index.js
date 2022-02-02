const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const app = express()

app.use(cors())

app.use(express.json())

app.use(morgan('tiny'))

// let info = `Phonebook has info for ${persons.length} people. <br /> ${new Date()}`;

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/info', (request, response) => {
  response.send(info)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(persons => {
    response.json(persons)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log(`${id} deleted.`)

  response.status(204).end()
})

/*
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}
*/

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
/*
  if (persons.find(person => person.name === body.name)) {
    return response.status(418).json({ 
      error: `${body.name} is already in the phonebook.` 
    })
  }
*/

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})
  
const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)