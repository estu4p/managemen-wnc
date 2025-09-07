"use server";

import {
  DiscountSchema,
  InventorySchema,
  RevenueTargetSchema,
  ServiceSchema,
  TransactionSchema,
} from "./formValidationSchemas";
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

export const createDiscount = async (
  currentState: CurrentState,
  data: DiscountSchema
) => {
  try {
    await prisma.discount.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        fromDate: data.fromDate,
        untilDate: data.untilDate,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateDiscount = async (
  currentState: CurrentState,
  data: DiscountSchema
) => {
  try {
    await prisma.discount.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        fromDate: data.fromDate,
        untilDate: data.untilDate,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteDiscount = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.discount.delete({
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

export const createRevenueTarget = async (
  currentState: CurrentState,
  data: RevenueTargetSchema
) => {
  try {
    await prisma.revenueTarget.create({
      data: {
        title: data.title,
        category: data.category,
        fromDate: data.fromDate,
        untilDate: data.untilDate,
        totalTarget: data.totalTarget,
        status: data.status,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateRevenueTarget = async (
  currentState: CurrentState,
  data: RevenueTargetSchema
) => {
  try {
    await prisma.revenueTarget.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        category: data.category,
        fromDate: data.fromDate,
        untilDate: data.untilDate,
        totalTarget: data.totalTarget,
        status: data.status,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteRevenueTarget = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.revenueTarget.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const createInventory = async (
  currentState: CurrentState,
  data: InventorySchema
) => {
  try {
    await prisma.inventory.create({
      data: {
        name: data.name,
        category: data.category,
        unit: data.unit,
        initialStock: data.initialStock,
        currentStock: data.currentStock,
        price: data.price,
        photo: data.photo,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};
export const updateInventory = async (
  currentState: CurrentState,
  data: InventorySchema
) => {
  try {
    await prisma.inventory.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        category: data.category,
        unit: data.unit,
        initialStock: data.initialStock,
        currentStock: data.currentStock,
        price: data.price,
        photo: data.photo,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};
export const deleteInventory = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.inventory.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const createTransaction = async (
  currentState: CurrentState,
  data: TransactionSchema
) => {
  try {
    await prisma.transaction.create({
      data: {
        id: data.id,
        title: data.title,
        type: data.type,
        category: data.category,
        amount: data.amount,
        notes: data.notes,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateTransaction = async (
  currentState: CurrentState,
  data: TransactionSchema
) => {
  try {
    await prisma.transaction.update({
      where: {
        id: data.id,
      },
      data: {
        id: data.id,
        title: data.title,
        type: data.type,
        category: data.category,
        amount: data.amount,
        notes: data.notes,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteTransaction = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.transaction.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};
