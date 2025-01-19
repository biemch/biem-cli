import { Organization } from '../../../shared/model/organization.model.js';
import { CoreApiService } from './core.api.service.js';

type GetOrganizationResponseBodyDto = {
	organizationList: Organization[];
};

export class OrganizationApiService {
	private coreApiService: CoreApiService;

	constructor(coreApiService: CoreApiService) {
		this.coreApiService = coreApiService;
	}

	async find(): Promise<GetOrganizationResponseBodyDto> {
		return this.coreApiService.request<GetOrganizationResponseBodyDto>(
			'GET',
			'/api/cms/organization',
		);
	}
}
