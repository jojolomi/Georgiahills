export function formatIsoDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(value.getTime())) {
    throw new Error("Invalid date value");
  }

  return value.toISOString();
}

export function isPastDate(date: Date | string): boolean {
  const value = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(value.getTime())) {
    throw new Error("Invalid date value");
  }

  return value.getTime() < Date.now();
}