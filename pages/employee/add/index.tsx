import { SubmitHandler, UseFormReturn, useForm } from "react-hook-form";
import { forwardRef, useEffect, useId, useState } from "react";

import Head from "next/head";
import { HeadersInit } from "node-fetch";
import NextImage from "next/image";
import NextLink from "next/link";
import type { NextPage } from "next";
import React from "react";
import { fetchEmployee } from "../list";
import styled from "styled-components";
import { useRouter } from "next/router";

const NEXT_API_URL = process.env.NEXT_API_URL;

export enum GENDER_ENUM_OPTIONS {
  M,
  F,
}
const createEmployer = async (createInfo: {
  lastName?: string;
  firstName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: GENDER_ENUM_OPTIONS.M | GENDER_ENUM_OPTIONS.F;
  photo?: string;
}) => {
  if (!NEXT_API_URL) {
    throw new Error(`NEXT_API_URL is ${NEXT_API_URL}`);
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // as requirement, photo property is not mandatory
  delete createInfo.photo;

  const raw = JSON.stringify({
    firstName: createInfo.firstName,
    lastName: createInfo.lastName,
    email: createInfo.email,
    phoneNumber: createInfo.phoneNumber,
    gender: createInfo.gender,
    // photo: createInfo?.photo,
  });

  const requestOptions: HeadersInit = {
    method: "POST",
    headers: myHeaders as any,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(`${NEXT_API_URL}/employee`, requestOptions);

  return await response.json();
};

export const GENDER_OPTIONS: Record<string, string> = {
  0: "Male",
  1: "Female",
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

const EmployeeCreate: NextPage = ({ data }: any) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
  });
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
      gender: formData.gender,
    },
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    const response = await createEmployer({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      photo: data?.photo ?? "",
    });

    if (response.status === 201) {
      // back to list page
      router.push("/employee/list");
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
        <label htmlFor="lastName">Last Name</label>
        <Input placeholder="Your last name" {...register("lastName")} />
        <label htmlFor="email">Email</label>
        <Input
          placeholder="example@email.com"
          type="email"
          {...register("email")}
        />
        <label htmlFor="phoneNumber">Phone Number</label>
        <Input
          placeholder="Must be start from +94"
          {...register("phoneNumber")}
        />
        <label htmlFor="gender">Gender</label>
        <Select
          {...register("gender")}
          options={[
            { label: "Female", value: GENDER_ENUM_OPTIONS.F },
            { label: "Male", value: GENDER_ENUM_OPTIONS.M },
          ]}
        />

        <button type="submit">Add</button>
      </form>
    </Container>
  );
};

export default EmployeeCreate;
