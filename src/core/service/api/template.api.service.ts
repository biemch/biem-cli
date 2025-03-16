import { Template } from '../../../shared/model/template.model.js';
import { CoreApiService } from './core.api.service.js';

export type CreateTemplateRequestBodyDto = Pick<
	Template, 'name' | 'description' | 'version' | 'markup' | 'duration' | 'workspaceId' | 'organizationId' | 'fieldList' | 'coverId'
>;

export type UpdateTemplateRequestBodyDto = Pick<
	Template, 'name' | 'description' | 'version' | 'markup' | 'duration' | 'workspaceId' | 'organizationId' | 'fieldList' | 'coverId'
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

export class TemplateApiService {
	private coreApiService: CoreApiService;

	constructor(coreApiService: CoreApiService) {
		this.coreApiService = coreApiService;
	}

	async create(data: CreateTemplateRequestBodyDto): Promise<CreateTemplateResponseDto> {
		return this.coreApiService.request<CreateTemplateResponseDto>(
			'POST',
			'/api/cms/booking-template',
			data,
		);
	}

	async find(): Promise<GetTemplateResponseDto> {
		return this.coreApiService.request<GetTemplateResponseDto>(
			'GET',
			'/api/cms/booking-template',
		);
	}

	async update(id: Template['id'], data: UpdateTemplateRequestBodyDto): Promise<UpdateTemplateResponseDto> {
		return this.coreApiService.request<UpdateTemplateResponseDto>(
			'POST',
			`/api/cms/booking-template/${id}`,
			data,
		);
	}
}
