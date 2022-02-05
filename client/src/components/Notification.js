import React from 'react'

const Notification = ({ message, isError }) => {
    if (message === null) {
        return null
      }
    if (isError === true) {
        return (
            <div className="error">{message}</div>
        )
    }
    return (
        <div className="success">{message}</div>
    )
}

export default Notification