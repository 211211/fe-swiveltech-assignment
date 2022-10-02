import Head from 'next/head'
import type { NextPage } from 'next'
import styled from 'styled-components';

export const Container = styled.section`
    display: flex;
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
`

export const Header = styled.header`
    display: flex;
    padding: 24px 48px 24px 48px;
`

export const MenuContainer = styled.div`
    padding: 24px 48px 24px 48px;
    display: flex;
    margin-left: auto;
    flex-direction: row;
`

export const AddEmployeeButton = styled.button`
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
`

export const ViewButton = styled.button`
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const CardContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 24px 48px 24px 48px;
`

export const CardItem = styled.div`
    display: flex;
    flex-direction: column;
    padding: 24px 48px 24px 48px;
`

export const CardItemEmployeeImage = styled.div`
    height: 100px;
    width: 200px;
    border: 3px;
`

export const CardItemEmployeeInfo = styled.div`
    height: 100px;
    width: 200px;
    border: 3px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`

export const CardItemEmployeeInfoLeft = styled.div`
    flex: 50%;
`

export const CardItemEmployeeInfoRight = styled.div`
    flex: 50%;
    margin-top: auto;
    margin-left: auto;
`

const EmployeeList: NextPage = () => {
  return (
    <Container>
      <Header>
        Employee Manager
      </Header>
    </Container>
  )
}

export default EmployeeList
