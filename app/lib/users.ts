// lib/users.ts
export type Role = "partner" | "pm" | "admin";

export type User = {
  email: string; // used as username
  password: string; // PLAIN TEXT for now (okay for dev only)
  role: Role;
  partnerId?: string; // for partner users
};

// seed a few users
export const USERS: User[] = [
  {
    email: "owner@aqua-vista.com",
    password: "test1234",
    role: "partner",
    partnerId: "aqua-vista",
  },
  {
    email: "pm@30a-escapes.com",
    password: "test1234",
    role: "pm",
  },
  {
    email: "alex@coastalbeach.co",
    password: "test1234",
    role: "admin",
  },
];

// simple lookup
export function findUser(email: string) {
  return (
    USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  );
}