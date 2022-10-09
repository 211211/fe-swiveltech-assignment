import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import EmployeeList from "../pages/employee/list";
import React from 'react'

describe("EmployeeList", () => {
  it("renders a header", () => {
    render(<EmployeeList />);

    const header = screen.getByTestId("employee-header");

    expect(header).toBeInTheDocument();
  });

  it("renders a menu", () => {
    render(<EmployeeList />);

    const menu = screen.getByTestId("employee-menu");
    const switchToTableViewButton = screen.getByTestId("employee-table-button");

    expect(menu).toBeInTheDocument();
    expect(switchToTableViewButton).toBeInTheDocument();
  });

  it("renders employee card list as default state", () => {
    render(<EmployeeList />);

    const employeeCard = screen.getByTestId("employee-card");

    expect(employeeCard).toBeInTheDocument();
  });

  it("should display employee as grid view", async () => {
    render(<EmployeeList />);

    const switchToGridViewButton = screen.getByTestId("employee-table-button");
    fireEvent.click(switchToGridViewButton);
    await waitFor(() => {
      const switchToTableViewButton = screen.getByTestId(
        "employee-grid-button"
      );
      expect(switchToTableViewButton).toBeInTheDocument();

      const employeeTable = screen.getByTestId("employee-table");
      expect(employeeTable).toBeInTheDocument();

      const employeeCard = screen.queryByTestId("employee-card");
      expect(employeeCard).not.toBeInTheDocument();
    });
  });

  it("should render employee list with mock data", () => {
    const useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockReturnValueOnce([[
        {
            "_id": "63425ba75278faadce5514aa",
            "firstName": "Adonis",
            "lastName": "Schuppe",
            "email": "Johann.Orn52@hotmail.com",
            "phoneNumber": "+94771277618",
            "gender": 0,
            "photo": "https://randomuser.me/api/portraits/men/36.jpg",
            "createdAt": 1665293223805,
            "updatedAt": 1665293223805
        },
        {
            "_id": "63425ba75278faadce5514a8",
            "firstName": "Kelton",
            "lastName": "Rafsfu",
            "email": "Patrick_Ratke@gmail.com",
            "phoneNumber": "+94771277688",
            "gender": 1,
            "photo": "https://randomuser.me/api/portraits/men/71.jpg",
            "createdAt": 1665293223803,
            "updatedAt": 1665293223803
        }], jest.fn()])
    render(<EmployeeList />);

    const employeeItems = screen.getAllByTestId("employee-item");

    expect(employeeItems).toHaveLength(2);
  });
});
