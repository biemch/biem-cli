import { ApiError } from '../../../shared/error/api.error.js';
import { maskSensitiveData } from '../../../shared/lib/util/object.util.js';

export class ApiService {
	#baseUrl: string;
	#accessToken: string | null = null;

	constructor(baseUrl: string) {
		this.#baseUrl = baseUrl;
	}

	public get baseUrl(): string {
		return this.#baseUrl;
	}

	public createEndpoint(path: string): string {
		return `${this.baseUrl}/${this.normalizeUrl(path)}`;
	}

	public get accessToken(): string | null {
		return this.#accessToken;
	}

	public set accessToken(accessToken: string) {
		this.#accessToken = accessToken;
	}

	public async request<T>(
		method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
		path: string,
		body?: unknown,
		headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${this.accessToken}`,
		},
	): Promise<T> {
		const endpoint = this.createEndpoint(path);

		const response = await fetch(endpoint, {
			method,
			headers,
			body: this.prepareBody(body),
		});

		if (!response.ok) {
			const errorBody = maskSensitiveData(body as unknown as Record<string, unknown>);
			const errorResponse = await response.json().catch(() => null);
			const errorMessage = errorResponse?.message || response.statusText || 'An unknown error occurred';
			const statusCode = response.status;

			throw new ApiError(errorMessage, statusCode, {
				endpoint,
				method,
				body: errorBody,
				response: errorResponse,
			});
		}

		return response.json();
	}

	private prepareBody(body: unknown) {
		if (body instanceof FormData) {
			return body;
		}

		if (typeof body === 'object') {
			return JSON.stringify(body);
		}

		return undefined;
	}

	private normalizeUrl(path: string): string {
		return path.replace(/^\/+/, '');
	}
}
