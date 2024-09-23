import React from 'react'
import styled from 'styled-components'
import { Doughnut } from 'react-chartjs-2'
import { RootState } from '../store/store'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import EmptyState from './EmptyState'
import { useSelector } from 'react-redux'

ChartJS.register(ArcElement, Tooltip, Legend)

const Titles = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  justify-content: center;
  margin: 40px 0px;
`

const TotalHa = styled.p`
  font-size: 24px;
  font-weight: 700;
`

const Charts = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
`

const ChartTitle = styled.p`
  font-size: 18px;
  font-weight: 800;
`

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33%;
  max-width: 450px;
  @media (max-width: 768px) {
    width: 60%;
    max-width: 450px;
  }
`

const Dashboard = () => {
  const producers = useSelector((state: RootState) => state.producers.producers)
  const totalFarms = producers.length
  const totalHectares = producers.reduce(
    (acc, producer) => acc + producer.totalArea,
    0
  )

  // State graph
  const statesCount = producers.reduce((acc, producer) => {
    acc[producer.state] = (acc[producer.state] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const stateData = {
    labels: Object.keys(statesCount),
    datasets: [
      {
        data: Object.values(statesCount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  }

  // Culture graph
  const cropCount = producers.reduce((acc, producer) => {
    producer.crops.forEach((crop) => {
      acc[crop] = (acc[crop] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const cropData = {
    labels: Object.keys(cropCount),
    datasets: [
      {
        data: Object.values(cropCount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  }

  // Agricultural Area vs Vegetation
  const totalAgriculturalArea = producers.reduce(
    (acc, producer) => acc + producer.agriculturalArea,
    0
  )
  const totalVegetationArea = producers.reduce(
    (acc, producer) => acc + producer.vegetationArea,
    0
  )

  const soilUseData = {
    labels: ['Agricultural Area', 'Vegetation Area'],
    datasets: [
      {
        data: [totalAgriculturalArea, totalVegetationArea],
        backgroundColor: ['#36A2EB', '#4BC0C0'],
      },
    ],
  }

  if (stateData.labels.length === 0) {
    return (
      <EmptyState title="No dashboard, you need to create a producer to see the graphs" />
    )
  }

  return (
    <>
      <Titles>
        <TotalHa>Total Farms: {totalFarms}</TotalHa>
        <TotalHa>Total Hectares: {totalHectares}</TotalHa>
      </Titles>

      <Charts>
        <ChartContainer>
          <ChartTitle>Chart by State</ChartTitle>
          <Doughnut data={stateData} />
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>Chart by Culture</ChartTitle>
          <Doughnut data={cropData} />
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>Agricultural Area vs Vegetation Area</ChartTitle>
          <Doughnut data={soilUseData} />
        </ChartContainer>
      </Charts>
    </>
  )
}

export default Dashboard
