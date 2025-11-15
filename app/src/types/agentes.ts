export interface CreateUserParams {
  name: string;
  email: string;
  role: "MANAGER" | "EMPLOYEE";
  office: string;
  phone?: string;
  createdByID: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  office: string | null;
  isActive: boolean;
  createdAt: string;
}