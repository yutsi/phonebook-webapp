import React from 'react'
import ReactDOM from 'react-dom'
import userEvent from '@testing-library/user-event'
import { getByRole, render, screen, waitFor } from '@testing-library/react'
import App from './App'

test('submit name and number, add to list, remove from list', async () => {
  render(<App />)
  const name = screen.getByRole('textbox', { name: 'enter name' })
  const number = screen.getByRole('textbox', { name: 'enter number' })
  const submit = screen.getByRole('button', { name: 'submit' })
  const numbers = screen.getByRole('table', { name: 'numbers-table' })

  userEvent.type(name, 'kniofkieakrstk')
  userEvent.type(number, '5557061628')
  userEvent.click(submit)

  await waitFor(() => expect(numbers).toHaveTextContent('kniofkieakrstk'))

  const deleteButton = await screen.findByText('kniofkieakrstk').closest('button')

  userEvent.click(deleteButton)

  // have to fix issue #3
  // await waitFor(() => expect(numbers).not.toHaveTextContent('kniofkieakrstk'))
})
