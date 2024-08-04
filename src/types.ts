export interface Bank {
  name: string;
  balance: number;
}

export interface Company {
  name: string;
  banks: Bank[];
}

export interface User {
  username: string;
  password: string;
  role: UserRole;
}

export interface UserResponse {
  message: string;
  user: {
    _id: string;
    username: string;
    role: UserRole;
  };
}

export interface TransferData {
  fromCompany: string;
  fromBankName?: string;
  toCompany?: string;
  toBankName?: string;
  amount: number;
  description?: string;
}

export type UserRole = 'user' | 'cashier' | 'admin';

export interface CashOperation {
  _id: string;
  amount: number;
  type: 'expense' | 'income'; 
  description: string;
  date: string;
}
