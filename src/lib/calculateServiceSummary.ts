type ServiceSummary = {
  serviceId: number;
  service: string;
  qty: number;
  price: number;
  total: number;
};

type Service = {
  id: number;
  name: string;
  price: string | number;
};

type Discount = {
  id: number;
  price: string;
  type?: "PERCENTAGE" | "NOMINAL";
};

export const calculateServiceSummary = (
  selectedServices: { [itemIndex: number]: number[] },
  serviceList: Service[],
  discountList: Discount[] = [],
  selectedDiscounts: number[]
): {
  itemServices: ServiceSummary[];
  grandTotal: number;
  finalTotal: number;
  totalDiscount: number;
} => {
  const servicesSummary: ServiceSummary[] = [];

  // Hitung summary per layanan
  Object.values(selectedServices).forEach((serviceIds) => {
    serviceIds.forEach((serviceId) => {
      const service = serviceList.find((s) => s.id === serviceId);
      if (service) {
        const existingService = servicesSummary.find(
          (s) => s.serviceId === serviceId
        );
        if (existingService) {
          existingService.qty += 1;
          existingService.total = existingService.qty * existingService.price;
        } else {
          servicesSummary.push({
            serviceId: service.id,
            service: service.name,
            qty: 1,
            price:
              typeof service.price === "string"
                ? parseFloat(service.price)
                : service.price,
            total:
              typeof service.price === "string"
                ? parseFloat(service.price)
                : service.price,
          });
        }
      }
    });
  });

  const grandTotal = servicesSummary.reduce((sum, s) => sum + s.total, 0);

  let totalDiscount = 0;

  selectedDiscounts.forEach((discountId) => {
    const discount = discountList.find((d) => d.id === discountId);
    if (discount) {
      const discountAmount = parseFloat(discount.price);
      if (discount?.type === "NOMINAL") {
        totalDiscount += discountAmount;
      } else {
        totalDiscount += grandTotal * (discountAmount / 100);
      }
    }
  });

  // Pastikan discount tidak melebihi grand total
  totalDiscount = Math.min(totalDiscount, grandTotal);

  const finalTotal = Math.max(0, grandTotal - totalDiscount);

  return {
    itemServices: servicesSummary,
    grandTotal,
    finalTotal: parseFloat(finalTotal.toFixed(2)),
    totalDiscount: parseFloat(totalDiscount.toFixed(2)),
  };
};
