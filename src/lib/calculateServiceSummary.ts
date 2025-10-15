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

type CalculationOptions = {
  discounts?: { amount: string }[];
};

export const calculateServiceSummary = (
  selectedServices: { [itemIndex: number]: number[] },
  serviceList: Service[],
  options?: CalculationOptions | { amount: string }[]
): {
  itemServices: ServiceSummary[];
  grandTotal: number;
  finalTotal: number;
} => {
  // Handle kedua format parameter
  const discounts = Array.isArray(options) ? options : options?.discounts || [];

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

  // Hitung grand total
  const grandTotal = servicesSummary.reduce((sum, s) => sum + s.total, 0);

  // Hitung diskon
  const totalDiscountPercent = discounts.reduce(
    (sum: number, d: { amount: string }) => sum + parseFloat(d.amount),
    0
  );

  const discountValue = grandTotal * (totalDiscountPercent / 100);
  const finalTotal = parseFloat((grandTotal - discountValue).toFixed(2));

  return {
    itemServices: servicesSummary,
    grandTotal,
    finalTotal,
  };
};
