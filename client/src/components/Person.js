import React from 'react'

const Person = ({ persons, remove }) => {
  return ( 
    <tr>
      <td>{persons.name}</td>
      <td>{persons.number}</td>
      <td className="button"><button onClick={remove}>Delete</button></td>
    </tr>
  )
}

export default Person