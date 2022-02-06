import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [errorBool, setErrorBool] = useState(false)

  useEffect(() => { // populate persons with JSON
    console.log('personService effect')
    personService
      .getAll()
      .then(initialPersons =>
        setPersons(initialPersons))
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => { // clear message after 5 seconds
    console.log('clearing message')
    setTimeout(() => {
      setMessage(null)
      setErrorBool(false)
    }, 5000)
  }, [message])

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

  const verifyName = (nameInput) => {
    if (!nameInput) {
      setMessage('Please enter a name.')
      setErrorBool(true)
      return false
    }
    if (nameInput.length > 30) {
      setMessage('Name must be under 30 characters.')
      setErrorBool(true)
      return false
    }

    console.log('verified ', nameInput)
    return true
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

    if (!verifyName(newName)) {
      return
    }

    if (checkIfNumberAlreadyThere()) {
      clearEntry()
      return
    }
    // TODO: remove dashes from newNumber state with replaceAll before verifying and submitting. Also remove spaces from newName and newNumber.
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
    // TODO: make React re-render with filter after deleting person.
    if (window.confirm(`Do you want to delete ${name} from the list?`)) {
      personService
        .remove(id)
        .then((returnedPerson) => {
          console.log('returned: ', returnedPerson)
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
      <label htmlFor='search'><h2>Search phonebook</h2></label>
      <form>
        <input onChange={handleSearchChange} type='search' name='search' />
      </form>
      <h2>Add new person</h2>
      <form onSubmit={addPerson}>
        <label>
          name: <input onChange={handleNameChange} />
        </label><br />
        <label>
          number: <input onChange={handleNumberChange} />
        </label>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
      <Notification message={message} isError={errorBool} />
      <h2>Numbers</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
            </tr>
          </thead>
          <tbody>
            {persons
              .filter((person) =>
                person.name.toLowerCase().includes(search.toLowerCase())
              )
              .map(persons =>
                <Person key={persons.name} persons={persons} remove={() => deletePerson(persons._id, persons.name)} />
              )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
