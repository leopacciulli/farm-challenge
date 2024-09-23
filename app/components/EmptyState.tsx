import styled from 'styled-components'

interface EmptyStateProps {
  title: string
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 175px);
`

const Title = styled.div`
  font-size: 28px;
  font-weight: 800;
`

const EmptyState = ({ title }: EmptyStateProps) => {
  return (
    <Container data-testid="empty-state-id">
      <Title>{title}</Title>
    </Container>
  )
}

export default EmptyState
