const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

export const BACKEND_URL = normalizeBaseUrl(
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
);
export const HOOKS_URL = normalizeBaseUrl(
	process.env.NEXT_PUBLIC_HOOKS_URL ?? "http://localhost:5003",
);