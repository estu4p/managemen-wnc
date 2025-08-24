export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: Date) {
  return new Date(value).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(value: Date) {
  return new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Decimal to Number
export function serialize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // Prisma Decimal biasanya punya method toNumber
      if (value && typeof value === "object" && "toNumber" in value) {
        return value.toNumber();
      }
      return value;
    })
  );
}
