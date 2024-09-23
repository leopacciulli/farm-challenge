import { render, screen } from '@testing-library/react'
import Header from '../app/components/Header'

describe('Header', () => {
  it('should render the header', () => {
    // When
    render(<Header />)
    const container = screen.getByTestId('header-id')

    // Then
    expect(container).toBeInTheDocument()
  })
})
