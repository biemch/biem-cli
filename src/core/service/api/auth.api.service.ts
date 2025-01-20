import { CoreApiService } from './core.api.service.js';

export interface AuthLoginRequestBodyDto {
	email: string;
	password: string;
}

export interface AuthLoginResponseBodyDto {
	accessToken: string;
}

export class AuthApiService {
	private coreApiService: CoreApiService;

	constructor(coreApiService: CoreApiService) {
		this.coreApiService = coreApiService;
	}

	async login(data: AuthLoginRequestBodyDto): Promise<void> {
		const response = await this.coreApiService.request<AuthLoginResponseBodyDto >(
			'POST',
			'/api/cms/auth/login',
			data,
			{ 'Content-Type': 'application/json' },
		);

		this.coreApiService.accessToken = response.accessToken;
	}
}
