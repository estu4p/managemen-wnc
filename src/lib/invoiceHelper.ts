import { Service } from "@/app/(dashboard)/invoices/invoice-settings/columns";

export const transformInvoiceForCalculation = (
  invoice: any
): {
  selectedServices: { [itemIndex: number]: number[] };
  serviceList: Service[];
  discounts: { amount: string }[];
} => {
  const selectedServices: { [itemIndex: number]: number[] } = {};

  invoice.items.forEach((item: any, index: number) => {
    selectedServices[index] = item.service.map((service: any) => service.id);
  });

  const serviceList = invoice.items.flatMap((item: any) =>
    item.service.map(
      (service: any): Service => ({
        id: service.id,
        name: service.name,
        price: service.price,
      })
    )
  );

  const uniqueServiceList = Array.from(
    new Map(
      serviceList.map((service: Service) => [service.id, service])
    ).values()
  );

  return {
    selectedServices,
    serviceList: Array.from(uniqueServiceList) as Service[],
    discounts: invoice.discounts,
  };
};
