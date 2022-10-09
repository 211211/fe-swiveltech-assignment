import * as yup from "yup";

import { SubmitHandler, useForm } from "react-hook-form";
import { forwardRef, useState } from "react";

import { ErrorMessage } from "@hookform/error-message";
import { HeadersInit } from "node-fetch";
import NextLink from "next/link";
import type { NextPage } from "next";
import React from "react";
import { fetchEmployee } from "../list";
import styled from "styled-components";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";

const NEXT_API_URL = process.env.NEXT_API_URL;

export enum GENDER_ENUM_OPTIONS {
  M = "0",
  F = "1",
}
const updateEmployerById = async (
  id: string,
  updateInfo: {
    lastName?: string;
    firstName?: string;
    email?: string;
    phoneNumber?: string;
    gender?: GENDER_ENUM_OPTIONS.M | GENDER_ENUM_OPTIONS.F;
  }
) => {
  if (!id) {
    return;
  }

  if (!NEXT_API_URL) {
    throw new Error(`NEXT_API_URL is ${NEXT_API_URL}`);
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    firstName: updateInfo.firstName,
    lastName: updateInfo.lastName,
    email: updateInfo.email,
    phoneNumber: updateInfo.phoneNumber,
    gender: updateInfo.gender,
  });

  const requestOptions: HeadersInit = {
    method: "PUT",
    headers: myHeaders as any,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    `${NEXT_API_URL}/employee/${id}`,
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
    `${NEXT_API_URL}/employee/${id}`,
    requestOptions
  );

  return await response.json();
};

export const getStaticProps = async ({
  params,
  revalidate = 900000, // cache time
}: {
  params: {
    id: string;
  };
  revalidate: number;
}) => {
  const data = await fetchEmployerById(params.id);

  return {
    props: {
      data: data,
      revalidate,
    },
  };
};

export const filterPathsToRender = (paths: any[]): any[] => {
  // currently, as a quick fix, we don't want to pre-render any pages
  const filteredPaths = paths.filter(() => false);
  return filteredPaths;
};

export const getStaticPaths = async () => {
  let paths: any[] = [];

  // fetch all to get employee path on server side
  const data = await fetchEmployee(0, 100);

  // create one path per slug and locale
  data.data.employee.forEach(({ _id }: any) => {
    paths.push({
      params: {
        id: _id,
      },
    });
  });

  // do not pre-render the page in server side due to memory safety
  paths = filterPathsToRender(paths);

  return {
    paths,
    fallback: "blocking",
  };
};

export const MenuContainer = styled.div`
  padding: 24px 48px 24px 48px;
  display: flex;
  margin-left: auto;
  flex-direction: row;
`;

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <input ref={ref} {...props} />
));

type Option = {
  label: React.ReactNode;
  value: string | number | string[];
};

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & { options: Option[] };

// eslint-disable-next-line react/display-name
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, ...props }, ref) => (
    <select ref={ref} {...props}>
      {options.map(({ label, value }, index: number) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
);

export const Container = styled.section`
  display: flex;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
`;

export const Link = ({ href, children, styles = {} }: any) => {
  return (
    <NextLink href={href} passHref>
      <a style={{ color: "white", ...styles }}>{children}</a>
    </NextLink>
  );
};

const EmployeeEditSchema = yup.object().shape({
  firstName: yup.string().required().min(6).max(10),
  lastName: yup.string().required().min(6).max(10),
  email: yup.string().required().max(255),
  phoneNumber: yup.string().required(),
  gender: yup
    .mixed()
    .required()
    .oneOf(
      [GENDER_ENUM_OPTIONS.M, GENDER_ENUM_OPTIONS.F],
      "Your gender must be Male or Female"
    ),
});

const EmployeeEdit: NextPage = ({ data }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({ ...data.data });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },

  } = useForm<any>({
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender.toString(),
    },
    resolver: yupResolver(EmployeeEditSchema),
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    const response = await updateEmployerById(id as string, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
    });

    if (response.status === 200) {
      // back to list page
      router.push("/employee/list");
      return
    }
  };

  return (
    <Container>
      <MenuContainer>
        <Link
          href={`/employee/list`}
          styles={{
            color: "white",
          }}
        >
          Back to list view
        </Link>
      </MenuContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="firstName">First Name</label>
        <Input placeholder="Your first name" {...register("firstName")} />
        <ErrorMessage
          errors={errors}
          name="firstName"
          render={({ message }) => <p>{message}</p>}
        />
        <label htmlFor="lastName">Last Name</label>
        <Input placeholder="Your last name" {...register("lastName")} />
        <ErrorMessage
          errors={errors}
          name="lastName"
          render={({ message }) => <p>{message}</p>}
        />
        <label htmlFor="email">Email</label>
        <Input
          placeholder="example@email.com"
          type="email"
          {...register("email")}
        />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => <p>{message}</p>}
        />
        <label htmlFor="phoneNumber">
          Phone Number. For example: +94 xx zzzzzzz
        </label>
        <Input
          placeholder="Must be start from +94 (Sri Lanka). I.e: +94 xx zzzzzzz"
          {...register("phoneNumber")}
        />
        <ErrorMessage
          errors={errors}
          name="phoneNumber"
          render={({ message }) => <p>{message}</p>}
        />
        <label htmlFor="gender">Gender</label>
        <Select
          {...register("gender")}
          options={[
            { label: "Female", value: GENDER_ENUM_OPTIONS.F },
            { label: "Male", value: GENDER_ENUM_OPTIONS.M },
          ]}
        />
        <ErrorMessage
          errors={errors}
          name="gender"
          render={({ message }) => <p>{message}</p>}
        />

        <button type="submit">Save</button>
      </form>
    </Container>
  );
};

export default EmployeeEdit;
