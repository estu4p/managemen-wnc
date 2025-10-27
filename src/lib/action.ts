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
  UserUpdateSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { Progress, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

type CurrentState = {
  success: boolean;
  error: boolean;
  invoiceId?: string;
  message?: string;
};

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
        invoiceId: data.invoiceId,
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
): Promise<CurrentState> => {
  try {
    const id = data.id ?? `wnc-${Date.now()}-${faker.number.int(9999)}`;

    const result = await prisma.$transaction(async (tx) => {
      let customer = await tx.customer.findUnique({
        where: { phone: data.customer.phone },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            id:
              data.customer.id ??
              `cust-${Date.now()}-${faker.number.int(9999)}`,
            name: data.customer.name,
            phone: data.customer.phone,
            photo: data.customer.photo,
          },
        });
      }

      const invoice = await tx.invoice.create({
        data: {
          id,
          price: data.price,
          addDiscount: data.addDiscount,
          note: data.note,
          progress: data.progress ?? "NEW_ORDER",
          paymentStatus: data.paymentStatus ?? "UNPAID",
          paymentMethod: data.paymentMethod,
          customer: {
            connect: { id: customer.id },
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
          discounts: {
            connect: data.discounts?.map((id) => ({ id })) || [],
          },
        },
      });

      if (data.paymentStatus === "PAID") {
        const existingTransaction = await tx.transaction.findFirst({
          where: { invoiceId: invoice.id },
        });

        if (!existingTransaction) {
          await tx.transaction.create({
            data: {
              title: `Payment ${data.customer.name}`,
              type: "INCOME",
              invoiceId: invoice.id,
              amount: data.price,
              category: "SERVICE_INCOME",
            },
          });
        }
      }

      return invoice;
    });

    return { success: true, error: false, invoiceId: id };
  } catch (error: any) {
    console.error("Update Invoice Error:", error);

    if (error.code === "P2002" && error.meta?.target?.includes("phone")) {
      return {
        success: false,
        error: true,
        message: "Phone number already exists for another customer.",
      };
    }

    return {
      success: false,
      error: true,
      message: "Failed to update invoice.",
    };
  }
};

export const updateInvoice = async (
  currentState: CurrentState,
  data: InvoiceSchema
) => {
  try {
    await prisma.$transaction(async (tx) => {
      // 🔍 Ambil status pembayaran lama
      const existing = await tx.invoice.findUnique({
        where: { id: data.id },
        select: { paymentStatus: true },
      });

      if (!existing) throw new Error("Invoice not found");

      // 🧾 Update data invoice
      const invoice = await tx.invoice.update({
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
          // 🧱 Update item — pisahkan antara update & create
          items: {
            deleteMany: {
              id: { notIn: data.items.filter((i) => i.id).map((i) => i.id!) },
            },
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
          discounts: {
            set: [], // bersihkan dulu
            connect: data.discounts?.map((id) => ({ id })) || [],
          },
        },
      });

      // 💰 Transaksi otomatis jika status berubah
      if (existing.paymentStatus !== "PAID" && data.paymentStatus === "PAID") {
        const exists = await tx.transaction.findFirst({
          where: { invoiceId: invoice.id },
        });

        if (!exists) {
          await tx.transaction.create({
            data: {
              title: `Payment ${data.customer.name}`,
              type: "INCOME",
              invoiceId: invoice.id,
              amount: data.price,
              category: "SERVICE_INCOME",
            },
          });
        }
      }

      // ❌ Hapus transaksi kalau dibatalkan pembayarannya
      if (existing.paymentStatus === "PAID" && data.paymentStatus !== "PAID") {
        await tx.transaction.deleteMany({
          where: { invoiceId: invoice.id },
        });
      }
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.error("Update Invoice Error:", error);

    if (error.code === "P2002" && error.meta?.target?.includes("phone")) {
      return {
        success: false,
        error: true,
        message: "Phone number already exists for another customer.",
      };
    }

    return {
      success: false,
      error: true,
      message: "Failed to update invoice.",
    };
  }
};

export const deleteInvoice = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.invoice.delete({
      where: { id: id },
    });
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
  const id = `user-${Date.now()}`;
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    await prisma.user.create({
      data: {
        id: id,
        username: data.username,
        password: hashedPassword,
        name: data.name,
        role: data.role,
        status: data.status ?? "ACTIVE",
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
  data: UserUpdateSchema
) => {
  console.log(data);

  try {
    const updateData: any = {
      username: data.username,
      name: data.name,
      role: data.role,
      status: data.status ?? "ACTIVE",
    };

    if (data.password && data.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updateData.password = hashedPassword;
    }

    await prisma.user.update({
      where: { id: data.id },
      data: updateData,
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error updating progress:", error);
    return { success: false, error: true };
  }
};

export const updateStatusUser = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.user.update({
      where: { id: id },
      data: {
        status: data.get("status") as UserStatus,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error updating progress:", error);
    return { success: false, error: true };
  }
};

export const deleteUser = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.user.delete({
      where: { id: id },
    });

    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};
