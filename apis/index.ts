import { GENDER_ENUM_OPTIONS } from "../pages/employee/add";

const NEXT_API_URL = process.env.NEXT_API_URL;

export const createEmployer = async (createInfo: {
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
