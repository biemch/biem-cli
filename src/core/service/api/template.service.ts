import { Template } from '../../../shared/model/template.model.js';
import { ApiService } from './api.service.js';

export type CreateTemplateRequestBodyDto = Pick<
	Template, 'name' | 'description' | 'version' | 'markup' | 'workspaceId' | 'organizationId' | 'fieldList' | 'coverId'
>;

export type UpdateTemplateRequestBodyDto = Pick<
	Template, 'name' | 'description' | 'version' | 'markup' | 'workspaceId' | 'organizationId' | 'fieldList' | 'coverId'
>;

export type GetTemplateResponseDto = {
	bookingTemplateList: Template[];
};

export type CreateTemplateResponseDto = {
	bookingTemplate: Template;
};

export type UpdateTemplateResponseDto = {
	bookingTemplate: Template;
};

export class TemplateService {
	private apiService: ApiService;

	constructor(apiService: ApiService) {
		this.apiService = apiService;
	}

	async create(data: CreateTemplateRequestBodyDto): Promise<CreateTemplateResponseDto> {
		return this.apiService.request<CreateTemplateResponseDto>(
			'POST',
			'/api/cms/booking-template',
			data,
		);
	}

	async find(): Promise<GetTemplateResponseDto> {
		return this.apiService.request<GetTemplateResponseDto>(
			'GET',
			'/api/cms/booking-template',
		);
	}

	async update(id: Template['id'], data: UpdateTemplateRequestBodyDto): Promise<UpdateTemplateResponseDto> {
		return this.apiService.request<UpdateTemplateResponseDto>(
			'POST',
			`/api/cms/booking-template/${id}`,
			data,
		);
	}
}
