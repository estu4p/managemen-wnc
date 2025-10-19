"use server";

import { faker } from "@faker-js/faker";
import {
  CustomerSchema,
  DiscountSchema,
  InventorySchema,
  InvoiceSchema,
  RevenueTargetSchema,
  ServiceSchema,
  TransactionSchema,
  UserSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { Progress } from "@prisma/client";

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

export const createCustomer = async (
  currentState: CurrentState,
  data: CustomerSchema
) => {
  try {
    await prisma.customer.create({
      data: {
        id: data.id ?? `cust-${Date.now()}-${faker.number.int(9999)}`,
        name: data.name,
        phone: data.phone,
        photo: data.photo,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateCustomer = async (
  currentState: CurrentState,
  data: CustomerSchema
) => {
  try {
    await prisma.customer.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        phone: data.phone,
        photo: data.photo,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteCustomer = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.customer.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const createInvoice = async (
  currentState: CurrentState,
  data: InvoiceSchema
) => {
  try {
    const id = data.id ?? `wnc-${Date.now()}-${faker.number.int(9999)}`;

    await prisma.invoice.create({
      data: {
        id,
        price: data.price,
        addDiscount: data.addDiscount,
        note: data.note,
        progress: data.progress,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        customer: {
          connectOrCreate: {
            where: { phone: data.customer.phone },
            create: {
              id:
                data.customer.id ??
                `cust-${Date.now()}-${faker.number.int(9999)}`,
              name: data.customer.name,
              phone: data.customer.phone,
              photo: data.customer.photo,
            },
          },
        },
        items: {
          create: data.items.map((item) => ({
            name: item.name,
            itemCategory: item.itemCategory,
            material: item.material,
            size: item.size,
            color: item.color,
            photos: item.photos,
            note: item.note,
            estimatedCompletion: item.estimatedCompletion,
            progress: item.progress,
            service: {
              connect: item.service.map((id) => ({ id })),
            },
          })),
        },
      },
    });

    return { success: true, error: false, invoiceId: id };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateInvoice = async (
  currentState: CurrentState,
  data: InvoiceSchema
) => {
  try {
    await prisma.invoice.update({
      where: { id: data.id },
      data: {
        price: data.price,
        addDiscount: data.addDiscount,
        note: data.note,
        progress: data.progress,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        customer: {
          update: {
            name: data.customer.name,
            phone: data.customer.phone,
            photo: data.customer.photo,
          },
        },
        items: {
          upsert: data.items.map((item) => ({
            where: { id: item.id ?? 0 },
            update: {
              name: item.name,
              itemCategory: item.itemCategory,
              material: item.material,
              size: item.size,
              color: item.color,
              photos: item.photos,
              note: item.note,
              estimatedCompletion: item.estimatedCompletion,
              progress: item.progress,
              service: {
                set: item.service.map((id) => ({ id })),
              },
            },
            create: {
              name: item.name,
              itemCategory: item.itemCategory,
              material: item.material,
              size: item.size,
              color: item.color,
              photos: item.photos,
              note: item.note,
              estimatedCompletion: item.estimatedCompletion,
              progress: item.progress,
              service: {
                connect: item.service.map((id) => ({ id })),
              },
            },
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteInvoice = async (
  currentState: CurrentState,
  data: InvoiceSchema
) => {
  try {
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteItem = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.item.delete({
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

export const updateProgress = async (
  currentState: CurrentState,
  data: FormData
) => {
  const invoiceId = data.get("id") as string;

  try {
    const itemProgresses: { itemId: number; progress: string }[] = [];
    console.log("Updating items for invoice:", invoiceId, itemProgresses);

    // Collect all item progresses from form data
    for (const [key, value] of data.entries()) {
      if (key.startsWith("progress_")) {
        const itemId = parseInt(key.replace("progress_", ""));
        if (!isNaN(itemId)) {
          itemProgresses.push({
            itemId,
            progress: value as string,
          });
        }
      }
    }

    // Update progress untuk masing-masing item
    for (const itemProgress of itemProgresses) {
      await prisma.item.update({
        where: {
          id: itemProgress.itemId,
          // invoiceId: invoiceId,
        },
        data: {
          progress: itemProgress.progress as Progress, // langsung gunakan string, Prisma akan handle conversion ke enum
        },
      });
    }

    return { success: true, error: false };
  } catch (error) {
    console.log("Error updating progress:", error);
    return { success: false, error: true };
  }
};

export const createUser = async (
  currentState: CurrentState,
  data: UserSchema
) => {
  const id = `user-${data.id}`;

  try {
    await prisma.user.create({
      data: {
        id: id,
        username: data.username,
        name: data.name,
        role: data.role,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.log("Error updating progress:", error);
    return { success: false, error: true };
  }
};

export const updateUser = async (
  currentState: CurrentState,
  data: UserSchema
) => {
  try {
    await prisma.user.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        role: data.role,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.log("Error updating progress:", error);
    return { success: false, error: true };
  }
};
