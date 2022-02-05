import React from 'react'

const Person = ({ persons, remove }) => {
  return (
    <li>{persons.name} {persons.number} <button onClick={remove}>Delete</button></li>
  )
}

export default Person