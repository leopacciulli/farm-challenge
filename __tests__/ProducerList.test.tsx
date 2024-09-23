import { render, screen, fireEvent } from '@testing-library/react'
import ProducerList from '../app/components/ProducerList'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProducer } from '../app/store/producersSlice'

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}))

jest.mock('../app/store/producersSlice', () => ({
  deleteProducer: jest.fn(),
}))

const mockDispatch = jest.fn()

const mockProducers = [
  {
    cpfCnpj: '548.059.654-5',
    name: 'Leonardo Pacciulli',
    farmName: 'Fazenda Santana',
    city: 'Campinas',
    state: 'São Paulo - SP',
  },
  {
    cpfCnpj: '32.980.450/0001-85',
    name: 'João Soares de Oliveira',
    farmName: 'LTDA Farm Zenda PJ',
    city: 'Baixada',
    state: 'Rio de Janeiro - RJ',
  },
]

describe('ProducerList Component', () => {
  beforeEach(() => {
    ;(useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the empty state when there are no producers', () => {
    // Given
    ;(useSelector as unknown as jest.Mock).mockReturnValue([])

    // When
    render(<ProducerList onEdit={jest.fn()} />)

    // Then
    expect(screen.getByText('No producers created')).toBeInTheDocument()
  })

  it('should render the list of producers', () => {
    // Given
    ;(useSelector as unknown as jest.Mock).mockReturnValue(mockProducers)

    // When
    render(<ProducerList onEdit={jest.fn()} />)

    // Then
    expect(screen.getByText('Leonardo Pacciulli')).toBeInTheDocument()
    expect(screen.getByText('João Soares de Oliveira')).toBeInTheDocument()
  })

  it('should call the onEdit function when Edit button is clicked', () => {
    // Given
    const mockOnEdit = jest.fn().mockReturnValue(mockProducers)

    // When
    render(<ProducerList onEdit={mockOnEdit} />)
    const editButton = screen.getAllByText('Edit producer')[0]
    fireEvent.click(editButton)

    // Then
    expect(mockOnEdit).toHaveBeenCalledWith(mockProducers[0])
  })

  it('should dispatch deleteProducer action when Delete button is clicked and confirmed', () => {
    // Given
    ;(useSelector as unknown as jest.Mock).mockReturnValue(mockProducers)
    window.confirm = jest.fn(() => true)

    // When
    render(<ProducerList onEdit={jest.fn()} />)
    const deleteButton = screen.getAllByText('Delete producer')[0]
    fireEvent.click(deleteButton)

    // Then
    expect(mockDispatch).toHaveBeenCalledWith(
      deleteProducer(mockProducers[0].cpfCnpj)
    )
  })

  it('should not dispatch deleteProducer if deletion is cancelled', () => {
    // Given
    ;(useSelector as unknown as jest.Mock).mockReturnValue(mockProducers)
    window.confirm = jest.fn(() => false)

    // When
    render(<ProducerList onEdit={jest.fn()} />)
    const deleteButton = screen.getAllByText('Delete producer')[0]
    fireEvent.click(deleteButton)

    // Then
    expect(mockDispatch).not.toHaveBeenCalled()
  })
})
