import { Workspace } from '../../../shared/model/workspace.model.js';
import { CoreApiService } from './core.api.service.js';

type GetWorkspaceResponseBodyDto = {
	workspaceList: Workspace[];
};

export class WorkspaceApiService {
	private coreApiService: CoreApiService;

	constructor(coreApiService: CoreApiService) {
		this.coreApiService = coreApiService;
	}

	async find(): Promise<GetWorkspaceResponseBodyDto> {
		return this.coreApiService.request<GetWorkspaceResponseBodyDto>(
			'GET',
			'/api/cms/workspace',
			undefined, {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.coreApiService.accessToken}`,
			},
		);
	}
}
