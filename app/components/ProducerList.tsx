import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { deleteProducer } from '../store/producersSlice'
import { Producer } from '../types/producer'
import EmptyState from './EmptyState'
import styled from 'styled-components'

interface ProducerListProps {
  onEdit: (producer: Producer) => void
}

const Container = styled.div`
  padding: 16px;
`

const UL = styled.ul`
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 24px;
  margin-top: 12px;
  @media (max-width: 916px) {
    grid-template-columns: auto auto;
  }
  @media (max-width: 610px) {
    grid-template-columns: auto;
  }
`

const LI = styled.li`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f2f2f2;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 2px 2px 8px #959595;
`

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  button {
    height: 30px;
    width: 120px;
    border-radius: 8px;
    border: 1px solid #ccc;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      background-color: #ddd;
    }
  }
`

const ProducerList: React.FC<ProducerListProps> = ({ onEdit }) => {
  const dispatch = useDispatch()
  const producers = useSelector((state: RootState) => state.producers.producers)

  const onDelete = (producer: Producer) => {
    const confirmDelete = confirm(`Delete the producer ${producer.name}?`)
    if (confirmDelete) {
      dispatch(deleteProducer(producer.cpfCnpj))
    }
  }

  if (producers.length === 0) {
    return <EmptyState title="No producers created" />
  }

  return (
    <Container>
      <h1>Producers</h1>
      <UL>
        {producers.map((producer) => {
          const city =
            producer.city.charAt(0).toUpperCase() +
            producer.city.slice(1).toLowerCase()
          return (
            <LI key={producer.cpfCnpj}>
              <div>
                <b>Name:</b> {producer.name}
              </div>
              <div>
                <b>Document:</b> {producer.cpfCnpj}
              </div>
              <div>
                <b>Farm name:</b> {producer.farmName}
              </div>
              <div>
                <b>City:</b> {city}
              </div>
              <div>
                <b>State:</b> {producer.state}
              </div>
              <Buttons>
                <button onClick={() => onEdit(producer)}>Edit producer</button>
                <button onClick={() => onDelete(producer)}>
                  Delete producer
                </button>
              </Buttons>
            </LI>
          )
        })}
      </UL>
    </Container>
  )
}

export default ProducerList
