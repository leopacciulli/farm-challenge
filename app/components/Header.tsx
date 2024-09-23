import styled from 'styled-components'

const Container = styled.div`
  height: 60px;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Title = styled.div`
  color: #fff;
  font-size: 28px;
  font-weight: 800;
`

const Header = () => {
  return (
    <Container data-testid="header-id">
      <Title>Brain Agriculture</Title>
    </Container>
  )
}

export default Header
