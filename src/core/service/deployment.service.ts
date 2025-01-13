import { CreateTemplateCtx } from '../../shared/ctx/create-template.ctx.js';
import { DeploymentType } from '../../shared/enum/deployment-type.enum.js';
import { ConfigService } from './config.service.js';
import { FileService } from './file.service.js';
import {
	CreateTemplateRequestBodyDto,
	CreateTemplateResponseDto,
	TemplateService,
	UpdateTemplateResponseDto,
} from './template.service.js';

export class DeploymentService {
	constructor(
		private configService: ConfigService,
		private templateService: TemplateService,
		private fileService: FileService,
	) {}

	private createDeploymentPayload(ctx: CreateTemplateCtx): CreateTemplateRequestBodyDto {
		return {
			name: this.configService.config.name,
			description: this.configService.config.description,
			version: this.configService.config.version,
			markup: this.configService.templateMarkup,
			fieldList: this.configService.config.template.fieldList,
			...(ctx.organizationId ? { organizationId: ctx.organizationId } : {}),
			...(ctx.workspaceId ? { workspaceId: ctx.workspaceId } : {}),
			...(ctx.templateId ? { templateId: ctx.templateId } : {}),
			...(ctx.coverId ? { coverId: ctx.coverId } : {}),
		};
	}

	async deploy(ctx: CreateTemplateCtx): Promise<CreateTemplateResponseDto | UpdateTemplateResponseDto | void> {
		const fileResponse = await this.fileService.upload(this.configService.coverFile, this.configService.config.cover);
		const deploymentPayload = this.createDeploymentPayload({ ...ctx, coverId: fileResponse.file.id });

		if (ctx.templateId && ctx.deploymentType === DeploymentType.UPDATE) {
			return this.templateService.update(ctx.templateId, deploymentPayload);
		} else {
			return await this.templateService.create(deploymentPayload);
		}
	}
}
