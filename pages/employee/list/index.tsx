import { useEffect, useState } from "react";

import Head from "next/head";
import { HeadersInit } from "node-fetch";
import { Link } from "../edit/[id]";
import NextImage from "next/image";
import type { NextPage } from "next";
import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  padding: 24px 48px 24px 48px;
  background-color: white;
`;

export const MenuContainer = styled.div`
  padding: 24px 48px 24px 48px;
  display: flex;
  margin-left: auto;
  flex-direction: row;
`;

export const AddEmployeeButton = styled.button`
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
`;

export const ViewButton = styled.button`
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px 48px 24px 48px;
  flex-wrap: wrap;
`;

export const CardItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 48px 24px 48px;
`;

export const CardItemEmployeeImage = styled.div`
  // height: 100px;
  width: 200px;
  border: 3px;
`;

export const CardItemEmployeeInfo = styled.div`
  height: 100px;
  width: 200px;
  border: 3px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const CardItemEmployeeInfoLeft = styled.div`
  flex: 50%;
`;

export const CardItemEmployeeInfoRight = styled.div`
  flex: 50%;
  margin-top: auto;
  margin-left: auto;
`;

// apis

const GRID_VIEW = "grid";
const TABLE_VIEW = "table";

const ITEMS_PER_PAGE = 10;
const DEFAULT_OFFSET = 0;
export const fetchEmployee = async (
  offset: number = DEFAULT_OFFSET,
  limit: number = ITEMS_PER_PAGE
) => {
  var requestOptions: HeadersInit = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(
    `http://127.0.0.1:4000/employee?offset=${offset}&limit=${limit}`,
    requestOptions
  );

  return await response.json();
};

const deleteEmployer = async (id: string) => {
  if (!id) {
    return;
  }

  var requestOptions: HeadersInit = {
    method: "DELETE",
    redirect: "follow",
  };

  const response = await fetch(
    `http://127.0.0.1:4000/employee/${id}`,
    requestOptions
  );

  return await response.json();
};

// {
//   "status": 200,
//   "message": "success",
//   "data": {
//       "_id": "6335a0de623cef784d21ce41",
//       "firstName": "Skye54554",
//       "lastName": "Rolfson",
//       "email": "Angelita_Simonis@hotmail.com",
//       "phoneNumber": "+94771277689",
//       "gender": 1
//   }
// }
const fetchEmployerById = async (id: string) => {
  if (!id) {
    return;
  }

  var requestOptions: HeadersInit = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(
    `http://127.0.0.1:4000/employee/${id}`,
    requestOptions
  );

  return await response.json();
};

export const getStaticProps = async ({
  params = {
    offset: DEFAULT_OFFSET,
    limit: ITEMS_PER_PAGE,
  },
  revalidate = 900000, // cache time
}: {
  params: {
    offset: number;
    limit: number;
  };
  revalidate: number;
}) => {
  const data = await fetchEmployee(params.offset, params.limit);

  return {
    props: {
      data: data,
      revalidate,
    },
  };
};

export const GENDER_OPTIONS: Record<string, string> = {
  0: "Male",
  1: "Female",
};

const Button = styled.button`
  width: inherit;
`

const EmployeeList: NextPage = ({ data }: any) => {
  const [view, setView] = useState(GRID_VIEW);
  const [list, setList] = useState(data?.data?.employee ?? []);
  // const [loading, setLoading] = useState(false);
  const onViewClicked = (_view: string) => {
    setView(_view);
  };

  const onClickedDelete = async (id: string) => {
    if (!id) {
      return;
    }

    // make call: delete
    await deleteEmployer(id);
    const data = await fetchEmployee()
    console.log({ data })
    setList(data.data.employee)
  };

  return (
    <Container>
      <Header>Employee Manager</Header>
      <MenuContainer>
        <Link href='/employee/add'>
          Add Employee
        </Link>
        {view === GRID_VIEW && (
          <ViewButton onClick={() => onViewClicked(TABLE_VIEW)}>
            Table
          </ViewButton>
        )}

        {view === TABLE_VIEW && (
          <ViewButton onClick={() => onViewClicked(GRID_VIEW)}>Grid</ViewButton>
        )}
      </MenuContainer>
      {view === GRID_VIEW && (
        <CardContainer>
          {(list ?? []).map((employee: any) => (
            <CardItem key={employee.email}>
              <CardItemEmployeeImage>
                <NextImage
                  src={employee?.photo}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  width={"200px"}
                  height={"150px"}
                />
              </CardItemEmployeeImage>
              <CardItemEmployeeInfo>
                <CardItemEmployeeInfoLeft>
                  <span>
                    {employee.firstName} {employee.lastName}
                  </span><br />
                  <span>{employee.email}</span><br />
                  <span>{employee.phoneNumber}</span><br />
                  <span>{GENDER_OPTIONS[employee.gender]}</span><br />
                </CardItemEmployeeInfoLeft>
                <CardItemEmployeeInfoRight>
                  <Button onClick={() => onClickedDelete(employee._id)}>
                    Delete
                  </Button>
                  &nbsp;&nbsp;
                  <Link href={`/employee/edit/${employee._id}`} passHref>
                    Edit
                  </Link>
                </CardItemEmployeeInfoRight>
              </CardItemEmployeeInfo>
            </CardItem>
          ))}
        </CardContainer>
      )}

      {view === TABLE_VIEW && (
        <table>
          <tr>
            <th>Image</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
          {(list ?? []).map((employee: any) => (
            <tr key={`${employee.firstName} ${employee.lastName}`}>
              <td>
                <NextImage
                  src={employee?.photo}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  width={"50px"}
                  height={"50px"}
                />
              </td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.phoneNumber}</td>
              <td>{GENDER_OPTIONS[employee.gender]}</td>
              <td>
                <Button onClick={() => onClickedDelete(employee._id)}>
                  delete
                </Button>
                <Link href={`/employee/edit/${employee._id}`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </table>
      )}
    </Container>
  );
};

export interface CardItemProps {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  gender: string;
  id: string;
  photo?: string;
}

export default EmployeeList;
