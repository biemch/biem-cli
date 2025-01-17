import { ApiService } from './api.service.js';

export interface AuthLoginRequestBodyDto {
	email: string;
	password: string;
}

export interface AuthLoginResponseBodyDto {
	accessToken: string;
}

export class AuthService {
	private apiService: ApiService;

	constructor(apiService: ApiService) {
		this.apiService = apiService;
	}

	async login(data: AuthLoginRequestBodyDto): Promise<void> {
		const response = await this.apiService.request<AuthLoginResponseBodyDto >(
			'POST',
			'/api/cms/auth/login',
			data,
			{ 'Content-Type': 'application/json' },
		);

		this.apiService.accessToken = response.accessToken;
	}
}
