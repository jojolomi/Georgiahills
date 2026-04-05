export type Role = "admin" | "editor" | "traveler";

export type User = {
  id: string;
  email: string;
  role: Role;
  displayName?: string;
};

export type Destination = {
  id: string;
  slug: string;
  name: string;
  city?: string;
  country: string;
  shortDescription: string;
  imageUrl?: string;
  featured?: boolean;
};

export type Booking = {
  id: string;
  userId: string;
  destinationId: string;
  travelDate: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled";
};