import { openAsBlob } from 'node:fs';

import { File } from '../../../shared/model/file.model.js';
import { CoreApiService } from './core.api.service.js';

export type CreateFileRequestBodyDto = {
	path: string;
	name: string;
};

export type CreateFileResponseDto = {
	file: File;
};

export class FileApiService {
	private coreApiService: CoreApiService;

	constructor(coreApiService: CoreApiService) {
		this.coreApiService = coreApiService;
	}

	public async upload(path: string, fileName: string) {
		const fileBlob = await openAsBlob(path, { type: 'image/jpeg' });

		const formData = new FormData();
		formData.append('file', fileBlob, fileName);

		return this.coreApiService.request<CreateFileResponseDto>(
			'POST',
			'/api/cms/booking-template/file',
			formData,
			{ Authorization: `Bearer ${this.coreApiService.accessToken}` },
		);
	}
}
