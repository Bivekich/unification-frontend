import axios from "axios";
import {
  Company,
  User,
  TransferData,
  UserResponse,
  CashOperation,
} from "./types";

const api = axios.create({
  baseURL: "https://apiunification-two.vercel.app/api",
});

export const login = (username: string, password: string) =>
  api.post<UserResponse>("/auth/login", { username, password });

export const getFinances = () => api.get<Company[]>("/finances");

export const getRecentTransfers = async () => {
  return api.get("/transfers/recent");
};

export const internalTransfer = (data: TransferData) =>
  api.post("/transfers/internal", data);

export const cashTransfer = (data: TransferData) =>
  api.post("/transfers/cash", data);

export const customTransfer = (data: TransferData) =>
  api.post("/transfers/custom", data);

export const replenishTransfer = (data: {
  fromCompany: string;
  fromBankName?: string;
  toCompany: string;
  toBankName?: string;
  amount: number;
  description?: string;
}) => api.post("/transfers/replenish", data);

export const addCompany = (data: Company) => api.post("/admin/company", data);

export const addBankToCompany = (data: {
  companyName: string;
  bankName: string;
  balance: number;
}) => api.post("/admin/company/bank", data);

export const updateBankBalance = (data: {
  companyName: string;
  bankName: string;
  newBalance: number;
}) => api.put("/admin/company/bank", data);

export const addUser = (data: User) => api.post("/admin/user", data);

export const addCashOperation = (data: {
  amount: number;
  type: "expense" | "income";
  description: string;
}) => api.post("/cash/add", data);

export const getCashOperations = () => api.get<CashOperation[]>("/cash");

export const getCashOperationsLast30Days = () => {
  return api.get("/cash/last-30-days");
};

export const getCashBalance = () =>
  api.get<{ balance: number }>("/cash/balance");
