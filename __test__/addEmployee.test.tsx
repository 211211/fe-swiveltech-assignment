import * as api from '../apis'

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import EmployeeAdd from "../pages/employee/add";
import React from "react";

jest.mock('../apis')

describe("EmployeeAdd", () => {
  it("renders a button to back to list view", () => {
    render(<EmployeeAdd />);

    const backToList = screen.getByTestId("back-to-list");

    expect(backToList).toBeInTheDocument();
  });

  it("renders a form", () => {
    render(<EmployeeAdd />);

    const addEmployeeForm = screen.getByTestId("add-employee");

    expect(addEmployeeForm).toBeInTheDocument();
  });

  it("renders all must-have inputs", () => {
    render(<EmployeeAdd />);

    const firstName = screen.getByTestId("input-firstName");

    expect(firstName).toBeInTheDocument();
  });

  it("should render an error message when firstName is empty", async () => {
    render(<EmployeeAdd />);

    const addEmployeeForm = screen.getByTestId("add-employee");
    fireEvent.submit(addEmployeeForm);

    await waitFor(() => {
      const errorFirstName = screen.getByTestId("error-firstName");
      expect(errorFirstName).toBeInTheDocument();
      expect(errorFirstName).toHaveTextContent("firstName is a required field");
    });
  });

  it("should be able to create new employer", async () => {
    render(<EmployeeAdd />);

    const employeeTestName = `employee1`;
    const createEmployerSpy = jest.spyOn(api, 'createEmployer')
    createEmployerSpy.mockResolvedValue({
      status: 200
    })
    const addEmployeeForm = screen.getByTestId("add-employee");
    const inputFirstName = screen.getByTestId("input-firstName");
    const inputLastName = screen.getByTestId("input-lastName");
    const inputEmail = screen.getByTestId("input-email");
    const inputPhoneNumber = screen.getByTestId("input-phoneNumber");
    const selectGender = screen.getByTestId("select-gender");

    fireEvent.change(inputFirstName, {target: {value: employeeTestName}})
    fireEvent.change(inputLastName, {target: {value: employeeTestName}})
    fireEvent.change(inputEmail, {target: {value: 'test@example.com'}})
    fireEvent.change(inputPhoneNumber, {target: {value: `+9434334343`}})
    fireEvent.change(selectGender, {target: {value: 0}}) // Male

    await waitFor(() => fireEvent.submit(addEmployeeForm));
    
    await waitFor(() => {
      expect(inputFirstName).toHaveValue(employeeTestName);
      expect(inputLastName).toHaveValue(employeeTestName);
      expect(inputEmail).toHaveValue('test@example.com');
      expect(inputPhoneNumber).toHaveValue(`+9434334343`);
      expect(selectGender).toHaveValue('0');

      expect(createEmployerSpy).toHaveBeenCalledTimes(1);
      expect(createEmployerSpy).toBeCalledWith({
        firstName: employeeTestName,
        lastName: employeeTestName,
        email: 'test@example.com',
        phoneNumber: `+9434334343`,
        gender: '0',
        photo: ''
      });
    });
  });
});
