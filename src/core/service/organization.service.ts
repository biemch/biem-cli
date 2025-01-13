import { Organization } from '../../shared/model/organization.model.js';
import { ApiService } from './api.service.js';

type GetOrganizationResponseBodyDto = {
	organizationList: Organization[];
};

export class OrganizationService {
	private apiService: ApiService;

	constructor(apiService: ApiService) {
		this.apiService = apiService;
	}

	async find(): Promise<GetOrganizationResponseBodyDto> {
		return this.apiService.request<GetOrganizationResponseBodyDto>(
			'GET',
			'/api/cms/organizationx',
		);
	}
}
