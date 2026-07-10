const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const NETWORK = process.env.NEXT_PUBLIC_NETWORK || "testnet";
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || "CDUMMY";

export const config = {
  apiUrl: API_URL,
  network: NETWORK,
  contractId: CONTRACT_ID,
};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  auth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private getAuthToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("rentar_token");
  }

  private buildUrl(path: string, params?: RequestOptions["params"]) {
    const url = new URL(`${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`, window.location.origin);
    // If baseUrl is absolute, use it directly
    const finalUrl = this.baseUrl.startsWith("http")
      ? new URL(`${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`)
      : url;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) finalUrl.searchParams.set(k, String(v));
      });
    }
    return finalUrl.toString();
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, params, headers = {}, auth = true } = options;

    const url = (() => {
      if (this.baseUrl.startsWith("http")) {
        const u = new URL(`${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`);
        if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) u.searchParams.set(k, String(v)) });
        return u.toString();
      }
      // relative base like /api -> use fetch directly with path
      const query = params ? `?${new URLSearchParams(Object.entries(params).filter(([,v])=>v!==undefined).map(([k,v])=>[k,String(v)])).toString()}` : "";
      const prefix = this.baseUrl === "/api" ? "/api" : this.baseUrl;
      return `${prefix}${path.startsWith("/") ? path : `/${path}`}${query}`;
    })();

    const token = auth ? this.getAuthToken() : null;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorBody.message || `API Error ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return res.json() as Promise<T>;
    }
    return res.text() as unknown as T;
  }

  get<T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...opts, method: "GET" });
  }
  post<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...opts, method: "POST", body });
  }
  put<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(path, { ...opts, method: "PUT", body });
  }
  del<T>(path: string, opts?: Omit<RequestOptions, "method">) {
    return this.request<T>(path, { ...opts, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_URL);

// Types
export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyRent: number;
  deadline: string;
  landlordId?: string;
  status: "active" | "completed" | "paused";
  createdAt: string;
  progress: number;
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "rent_payment" | "yield";
  amount: number;
  status: "pending" | "completed" | "failed";
  timestamp: string;
  txHash?: string;
  goalId?: string;
  description: string;
}

export interface Landlord {
  id: string;
  name: string;
  walletAddress: string;
  email: string;
  propertyAddress: string;
  rentAmount: number;
  dueDay: number;
  autoPayEnabled: boolean;
}

export interface SavingsOverview {
  totalSaved: number;
  totalTarget: number;
  monthlyYield: number;
  activeGoals: number;
  nextRentDue: string;
  nextRentAmount: number;
  completionRate: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  savingsHistory: { date: string; amount: number }[];
  spendingByCategory: { name: string; value: number }[];
  rentPaymentHistory: { date: string; amount: number; onTime: boolean }[];
  yieldEarned: { date: string; yield: number }[];
}

export interface UserProfile {
  id: string;
  publicKey: string;
  email?: string;
  displayName?: string;
  avatar?: string;
  createdAt: string;
  kycStatus: "pending" | "verified" | "unverified";
}
