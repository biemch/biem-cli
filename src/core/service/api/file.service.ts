import { openAsBlob } from 'node:fs';

import { File } from '../../../shared/model/file.model.js';
import { ApiService } from './api.service.js';

export type CreateFileRequestBodyDto = {
	path: string;
	name: string;
};

export type CreateFileResponseDto = {
	file: File;
};

export class FileService {
	private apiService: ApiService;

	constructor(apiService: ApiService) {
		this.apiService = apiService;
	}

	public async upload(path: string, fileName: string) {
		const fileBlob = await openAsBlob(path, { type: 'image/jpeg' });

		const formData = new FormData();
		formData.append('file', fileBlob, fileName);

		return this.apiService.request<CreateFileResponseDto>(
			'POST',
			'/api/cms/booking-template/file',
			formData,
			{ Authorization: `Bearer ${this.apiService.accessToken}` },
		);
	}
}
