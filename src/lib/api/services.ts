import { apiClient } from "./client";
import type { SavingsGoal, Transaction, Landlord, SavingsOverview, Notification, AnalyticsData, UserProfile } from "./client";

export const authService = {
  getChallenge: (publicKey: string) => apiClient.post<{ challenge: string; token: string }>("/auth/challenge", { publicKey }, { auth: false }),
  verify: (publicKey: string, signedChallenge: string) => apiClient.post<{ token: string; user: UserProfile }>("/auth/verify", { publicKey, signedChallenge }, { auth: false }),
  me: () => apiClient.get<UserProfile>("/auth/me"),
};

export const savingsService = {
  getOverview: () => apiClient.get<SavingsOverview>("/savings/overview"),
  getGoals: () => apiClient.get<SavingsGoal[]>("/savings/goals"),
  getGoal: (id: string) => apiClient.get<SavingsGoal>(`/savings/goals/${id}`),
  createGoal: (data: Partial<SavingsGoal>) => apiClient.post<SavingsGoal>("/savings/goals", data),
  updateGoal: (id: string, data: Partial<SavingsGoal>) => apiClient.put<SavingsGoal>(`/savings/goals/${id}`, data),
  deleteGoal: (id: string) => apiClient.del<void>(`/savings/goals/${id}`),
  deposit: (goalId: string, amount: number) => apiClient.post<Transaction>("/savings/deposit", { goalId, amount }),
  withdraw: (goalId: string, amount: number) => apiClient.post<Transaction>("/savings/withdraw", { goalId, amount }),
};

export const rentService = {
  payRent: (landlordId: string, amount: number, goalId?: string) => apiClient.post<Transaction>("/rent/pay", { landlordId, amount, goalId }),
  getUpcoming: () => apiClient.get<{ dueDate: string; amount: number; landlord: Landlord }[]>("/rent/upcoming"),
};

export const landlordService = {
  list: () => apiClient.get<Landlord[]>("/landlords"),
  create: (data: Partial<Landlord>) => apiClient.post<Landlord>("/landlords", data),
  update: (id: string, data: Partial<Landlord>) => apiClient.put<Landlord>(`/landlords/${id}`, data),
  delete: (id: string) => apiClient.del<void>(`/landlords/${id}`),
};

export const transactionService = {
  list: (params?: { page?: number; limit?: number; type?: string }) => apiClient.get<{ transactions: Transaction[]; total: number }>("/transactions", { params }),
  get: (id: string) => apiClient.get<Transaction>(`/transactions/${id}`),
};

export const notificationService = {
  list: () => apiClient.get<Notification[]>("/notifications"),
  markRead: (id: string) => apiClient.put<void>(`/notifications/${id}/read`),
  markAllRead: () => apiClient.put<void>("/notifications/read-all"),
};

export const analyticsService = {
  get: (range?: string) => apiClient.get<AnalyticsData>("/analytics", { params: { range } }),
};

export const userService = {
  getProfile: () => apiClient.get<UserProfile>("/user/profile"),
  updateProfile: (data: Partial<UserProfile>) => apiClient.put<UserProfile>("/user/profile", data),
};

export const adminService = {
  getStats: () => apiClient.get<{ totalUsers: number; totalSaved: number; totalTransactions: number; activeGoals: number }>("/admin/stats"),
  getUsers: () => apiClient.get<UserProfile[]>("/admin/users"),
};
