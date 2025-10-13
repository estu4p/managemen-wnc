export function formatRupiah(value: number) {
  if (!value) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value?: Date) {
  if (!value) return "";
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
      if (value && typeof value === "object" && "toNumber" in value) {
        return value.toNumber();
      }
      return value;
    })
  );
}

export function formatDateForInput(date?: Date): string {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

// ubah 08xxxx jadi 628xxxx
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    return "62" + cleaned.slice(1);
  }

  if (cleaned.startsWith("62")) {
    return cleaned;
  }

  return "62" + cleaned;
}
