import { Workspace } from '../../shared/model/workspace.model.js';
import { ApiService } from './api.service.js';

type GetWorkspaceResponseBodyDto = {
	workspaceList: Workspace[];
};

export class WorkspaceService {
	private apiService: ApiService;

	constructor(apiService: ApiService) {
		this.apiService = apiService;
	}

	async find(): Promise<GetWorkspaceResponseBodyDto> {
		return this.apiService.request<GetWorkspaceResponseBodyDto>(
			'GET',
			'/api/cms/workspace',
			undefined, {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.apiService.accessToken}`,
			},
		);
	}
}
