import { useState } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/app/store/store'
import Dashboard from '@/app/components/Dashboard'
import ProducerForm from '@/app/components/ProducerForm'
import ProducerList from '@/app/components/ProducerList'
import { Producer } from '@/app/types/producer'
import Header from '@/app/components/Header'

import styled from 'styled-components'
import '../app/styles/globals.css'

const Tabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin: 32px 0px;
  @media (max-width: 580px) {
    padding: 0 16px;
    display: grid;
    grid-template-columns: auto;
    gap: 8px;
  }
`

const Tab = styled.button<{ isActive?: boolean }>`
  width: 160px;
  height: 35px;
  font-size: 16px;
  border-radius: 8px;
  color: ${(props) => (props.isActive ? '#fff' : '#333')};
  border: 1px solid ${(props) => (props.isActive ? '#0a7620' : '#333')};
  background-color: ${(props) => (props.isActive ? '#0a7620' : '#f2f2f2')};
  &:hover {
    cursor: pointer;
  }
`

export default function Home() {
  const [isHomeVisible, setIsHomeVisible] = useState(true)
  const [isProducerVisible, setIsProducerVisible] = useState(false)
  const [isDashboardVisible, setIsDashboardVisible] = useState(false)

  const [editingProducer, setEditingProducer] = useState<Producer | null>(null)

  const onTabChange = (tab: string) => {
    if (tab === 'home') {
      setIsHomeVisible(true)
      setIsProducerVisible(false)
      setIsDashboardVisible(false)
      setEditingProducer(null)
    }
    if (tab === 'producer') {
      setIsHomeVisible(false)
      setIsProducerVisible(true)
      setIsDashboardVisible(false)
    }
    if (tab === 'dashboard') {
      setIsHomeVisible(false)
      setIsProducerVisible(false)
      setIsDashboardVisible(true)
      setEditingProducer(null)
    }
  }

  const onEditProducer = (producer: Producer) => {
    setEditingProducer(producer)
    onTabChange('producer')
  }

  return (
    <Provider store={store}>
      <div>
        <Header />

        <Tabs>
          <Tab onClick={() => onTabChange('home')} isActive={isHomeVisible}>
            Home
          </Tab>
          <Tab
            onClick={() => onTabChange('producer')}
            isActive={isProducerVisible}
          >
            {`${editingProducer ? 'Update' : 'Create'}`} Producer
          </Tab>
          <Tab
            onClick={() => onTabChange('dashboard')}
            isActive={isDashboardVisible}
          >
            Dashboard
          </Tab>
        </Tabs>

        {isHomeVisible && <ProducerList onEdit={onEditProducer} />}

        {isProducerVisible && (
          <ProducerForm
            producer={editingProducer}
            resetTab={() => onTabChange('home')}
          />
        )}

        {isDashboardVisible && <Dashboard />}
      </div>
    </Provider>
  )
}
