import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [errorBool, setErrorBool] = useState(false)

  useEffect(() => { // populate persons with JSON
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons =>
        setPersons(initialPersons))
      .catch((err) => {
        console.log(err)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const verifyNumber = (numberInput) => {
    const re = /^\d{10}$/
    if (numberInput.match(re)) {
      console.log('verified ', numberInput)
      return true
    } else {
      setMessage('Incorrectly formatted phone number. Must be 10 digits with no other characters.')
      setErrorBool(true)
      return false
    }
  }

  const checkIfNameAlreadyThere = () => {
    if (
      persons.some(
        (person) => person.name.toLowerCase() === newName.toLowerCase() // If name is already in list
      )
    ) {
      return true
    }
  }

  const checkIfNumberAlreadyThere = () => {
    if (
      persons.some(
        (person) => person.number === newNumber // If number is already in list
      )
    ) {
      setMessage('Number already exists in list.')
      setErrorBool(true)
      return true
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    console.log('Add button clicked')

    const clearEntry = () => {
      setNewName('')
      setNewNumber('')
      event.target.reset()
    }

    if (!newName) {
      setMessage('Please enter a name.')
      setErrorBool(true)
      return
    }

    if (checkIfNumberAlreadyThere()) {
      clearEntry()
      return
    }
    // TODO: remove dashes from newNumber state with replaceAll before verifying and submitting.
    if (!verifyNumber(newNumber)) return // stop if number invalid

    if (checkIfNameAlreadyThere()) {
      if (window.confirm(`${newName} is already in the list, would you like to update their number?`)) {
        updateNumber()
        setMessage(`Successfully updated number of ${newName}.`)
        setErrorBool(false)
        return
      } else {
        console.log(`Not updating number for ${newName}`)
        clearEntry()
        return
      }
    }

    const personObj = {
      name: newName,
      number: newNumber
    }
    personService
      .create(personObj)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        console.log({ persons })
        setNewName('')
        setNewNumber('')
        setMessage('Successfully added person.')
        setErrorBool(false)
        event.target.reset()
      })
      .catch((err) => {
        setMessage(err)
        setErrorBool(true)
      }
      )
  }

  const updateNumber = () => {
    const existingPerson = persons.find(person => person.name === newName)
    const updatedPerson = { ...existingPerson, number: newNumber }
    personService
      .update(existingPerson._id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person =>
          person._id !== existingPerson._id ? person : returnedPerson))
      })
      .catch(() => {
        console.log('failed to update number')
        setMessage(`Could not update the number for ${newName} as they have been deleted from the server`)
        setPersons(persons.filter((person) => person._id !== existingPerson._id))
        setErrorBool(true)
      })
  }

  const deletePerson = (id, name) => {
    console.log('Delete button clicked')

    if (window.confirm(`Do you want to delete ${name} from the list?`)) {
      personService
        .remove(id)
        .then((returnedPerson) => {
          setPersons(persons.filter((person) => person.id !== id))
          setMessage(`Successfully deleted ${name} from the list.`)
          setErrorBool(false)
        })
        .catch((err) => {
          setMessage(err)
          setErrorBool(true)
        })
    }
  }

  return (
    <div>
      <h2>Search phonebook</h2>
      <form>
        <div>
          <input onChange={handleSearchChange} />
        </div>
      </form>
      <h2>Add new person</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input onChange={handleNameChange} />
        </div>
        <div>
          number: <input onChange={handleNumberChange} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
      <Notification message={message} isError={errorBool} />
      <h2>Numbers</h2>
      <div>
        <ul>
          {persons
            .filter((person) =>
              person.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(persons =>
              <Person key={persons.name} persons={persons} remove={() => deletePerson(persons._id, persons.name)} />
            )}
        </ul>
      </div>
    </div>
  )
}

export default App
