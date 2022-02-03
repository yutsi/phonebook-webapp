const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.match(/^\d{10}$/)
      },
      message: 'Incorrectly formatted phone number. Must be 10 digits with no other characters.'
    }
  }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
