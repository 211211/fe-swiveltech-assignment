import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import EmployeeList from '../pages/employee/list'

describe('EmployeeList', () => {
  it('renders a header', () => {
    render(<EmployeeList />)

    const header = screen.getByTestId('employee-header')

    expect(header).toBeInTheDocument()
  })

  it('renders a menu', () => {
    render(<EmployeeList />)

    const menu = screen.getByTestId('employee-menu')
    const switchToTableViewButton = screen.getByTestId('employee-table-button')

    expect(menu).toBeInTheDocument()
    expect(switchToTableViewButton).toBeInTheDocument()
  })

  it('renders employee card list as default state', () => {
    render(<EmployeeList />)

    const employeeCard = screen.getByTestId('employee-card')

    expect(employeeCard).toBeInTheDocument()
  })

  it('should display employee as grid view', async () => {
    render(<EmployeeList />)

    const switchToGridViewButton = screen.getByTestId('employee-table-button')
    fireEvent.click(switchToGridViewButton)
    await waitFor(() => {
        const switchToTableViewButton = screen.getByTestId('employee-grid-button')
        expect(switchToTableViewButton).toBeInTheDocument()
    })
  })
})