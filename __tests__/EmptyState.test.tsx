import { render, screen } from '@testing-library/react'
import EmptyState from '../app/components/EmptyState'

describe('EmptyState', () => {
  it('should render the EmptyState with the title "no content"', () => {
    // When
    render(<EmptyState title="no content" />)
    const container = screen.getByText('no content')

    // Then
    expect(container).toBeInTheDocument()
  })
})
