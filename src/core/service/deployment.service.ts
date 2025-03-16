import { DeployTemplateCtx } from '../../shared/ctx/deploy-template.ctx.js';
import { DeploymentType } from '../../shared/enum/deployment-type.enum.js';
import { FileApiService } from './api/file.api.service.js';
import {
	CreateTemplateRequestBodyDto,
	CreateTemplateResponseDto,
	TemplateApiService,
	UpdateTemplateResponseDto,
} from './api/template.api.service.js';
import { ConfigService } from './config.service.js';

export class DeploymentService {
	constructor(
		private configService: ConfigService,
		private templateApiService: TemplateApiService,
		private fileApiService: FileApiService,
	) {}

	private createDeploymentPayload(ctx: DeployTemplateCtx): CreateTemplateRequestBodyDto {
		return {
			name: this.configService.config.name,
			description: this.configService.config.description,
			version: this.configService.config.version,
			markup: this.configService.templateMarkup,
			duration: this.configService.config.template.duration,
			fieldList: this.configService.config.template.fieldList,
			...(ctx.organizationId ? { organizationId: ctx.organizationId } : {}),
			...(ctx.workspaceId ? { workspaceId: ctx.workspaceId } : {}),
			...(ctx.templateId ? { templateId: ctx.templateId } : {}),
			...(ctx.coverId ? { coverId: ctx.coverId } : {}),
		};
	}

	async deploy(ctx: DeployTemplateCtx): Promise<CreateTemplateResponseDto | UpdateTemplateResponseDto | void> {
		const fileResponse = await this.fileApiService.upload(this.configService.coverFile, this.configService.config.cover);
		const deploymentPayload = this.createDeploymentPayload({ ...ctx, coverId: fileResponse.file.id });

		if (ctx.templateId && ctx.deploymentType === DeploymentType.UPDATE) {
			return this.templateApiService.update(ctx.templateId, deploymentPayload);
		} else {
			return await this.templateApiService.create(deploymentPayload);
		}
	}
}
