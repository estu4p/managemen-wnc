"use server";

import { ServiceSchema } from "./formValidationSchemas";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

export const createService = async (
  currentState: CurrentState,
  data: ServiceSchema
) => {
  try {
    await prisma.service.create({
      data: {
        name: data.name,
        price: data.price,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateService = async (
  currentState: CurrentState,
  data: ServiceSchema
) => {
  try {
    await prisma.service.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        price: data.price,
      },
    });
    console.log(data);

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteService = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.service.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
