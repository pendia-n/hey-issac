export interface ApiError extends Error { status?: number }

export async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    const problem = new Error(typeof data.error === "string" ? data.error : "Something went wrong. Please try again.") as ApiError;
    problem.status = response.status;
    throw problem;
  }
  return data as T;
}

export interface SessionUser { id: string; username: string }
export interface BillingStatus {
  ready: boolean;
  subscription: null | { plan: "solo" | "studio" | "partner"; status: string; currentPeriodEnd: number; cancelAtPeriodEnd: boolean; firstPaidAt: number | null; firstRefunded: boolean; firstRefundPending: boolean; active: boolean };
}
