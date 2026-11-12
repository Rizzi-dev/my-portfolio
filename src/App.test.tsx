import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the RizziOS root', () => {
    render(<App />)
    expect(screen.getByTestId('rizzios-root')).toBeInTheDocument()
  })
})
