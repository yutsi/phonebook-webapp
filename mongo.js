const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

if (process.argv.length > 5) {
  console.log('Too many arguments, use either 3 or 5.')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://yutsi:${password}@cluster0.k8wfi.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const savePerson = () => {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`Added ${person.name} with number ${person.number} to the phonebook.`)
    mongoose.connection.close()
  })
}

const findPerson = () => {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  findPerson()
}

if (process.argv.length === 5) {
  savePerson()
}