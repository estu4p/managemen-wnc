import {
  Discount,
  Service,
} from "@/app/(dashboard)/invoices/invoice-settings/columns";

export const transformInvoiceForCalculation = (
  invoice: any
): {
  selectedServices: { [itemIndex: number]: number[] };
  serviceList: Service[];
  // discounts: { amount: string }[];
  discountList: any[];
  selectedDiscounts: number[];
} => {
  const selectedServices: { [itemIndex: number]: number[] } = {};
  const selectedDiscounts: number[] = [];

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

  const discountList = invoice.discounts.map((disc: any) => ({
    id: disc.id,
    title: disc.name,
    amount: disc.price,
  }));

  // selectedDiscounts.forEach((discountId) => {
  //   const discount = discountList.find((d) => d.id === discountId);
  //   if (discount) {
  //     const discountAmount = parseFloat(discount.price);
  //     if (discount?.type === "NOMINAL") {
  //       totalDiscount += discountAmount;
  //     } else {
  //       totalDiscount += grandTotal * (discountAmount / 100);
  //     }
  //   }
  // });

  const uniqueServiceList = Array.from(
    new Map(
      serviceList.map((service: Service) => [service.id, service])
    ).values()
  );

  return {
    selectedServices,
    serviceList: Array.from(uniqueServiceList) as Service[],
    discountList: invoice.discounts,
    selectedDiscounts,
  };
};
