import * as yup from "yup";

import { SubmitHandler, useForm } from "react-hook-form";
import { forwardRef, useState } from "react";

import { ErrorMessage } from "@hookform/error-message";
import { HeadersInit } from "node-fetch";
import NextLink from "next/link";
import type { NextPage } from "next";
import React from "react";
import { createEmployer } from "../../../apis";
import styled from "styled-components";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";

export enum GENDER_ENUM_OPTIONS {
  M = "0",
  F = "1",
}

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

const EmployeeCreateSchema = yup.object().shape({
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

const EmployeeCreate: NextPage = () => {
  const router = useRouter();
  const [formData] = useState({
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
    // getValues,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
    },
    resolver: yupResolver(EmployeeCreateSchema),
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
      return;
    }
  };

  return (
    <Container>
      <MenuContainer data-testid="back-to-list">
        <Link
          href={`/employee/list`}
          styles={{
            color: "white",
          }}
        >
          Back to list view
        </Link>
      </MenuContainer>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="add-employee">
        <label htmlFor="firstName">First Name</label>
        <Input
          placeholder="Your first name"
          {...register("firstName")}
          data-testid="input-firstName"
        />
        <ErrorMessage
          errors={errors}
          name="firstName"
          render={({ message }) => (
            <p data-testid="error-firstName">{message}</p>
          )}
        />
        <label htmlFor="lastName">Last Name</label>
        <Input
          placeholder="Your last name"
          {...register("lastName")}
          data-testid="input-lastName"
        />
        <ErrorMessage
          errors={errors}
          name="lastName"
          render={({ message }) => (
            <p data-testid="error-lastName">{message}</p>
          )}
        />
        <label htmlFor="email">Email</label>
        <Input
          placeholder="example@email.com"
          type="email"
          {...register("email")}
          data-testid="input-email"
        />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => <p data-testid="error-email">{message}</p>}
        />
        <label htmlFor="phoneNumber">
          Phone Number. For example: +94 xx zzzzzzz
        </label>
        <Input
          placeholder="Must be start from +94 (Sri Lanka). I.e: +94 xx zzzzzzz"
          {...register("phoneNumber")}
          data-testid="input-phoneNumber"
        />
        <ErrorMessage
          errors={errors}
          name="phoneNumber"
          render={({ message }) => (
            <p data-testid="error-phoneNumber">{message}</p>
          )}
        />
        <label htmlFor="gender">Gender</label>
        <Select
          {...register("gender")}
          options={[
            { label: "Female", value: GENDER_ENUM_OPTIONS.F },
            { label: "Male", value: GENDER_ENUM_OPTIONS.M },
          ]}
          data-testid="select-gender"
        />
        <ErrorMessage
          errors={errors}
          name="gender"
          render={({ message }) => <p data-testid="error-gender">{message}</p>}
        />

        <button type="submit">Add</button>
      </form>
    </Container>
  );
};

export default EmployeeCreate;
