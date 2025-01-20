import { DeploymentScope } from '../enum/deployment-scope.enum.js';
import { DeploymentType } from '../enum/deployment-type.enum.js';
import { Organization } from '../model/organization.model.js';
import { Template } from '../model/template.model.js';
import { Workspace } from '../model/workspace.model.js';

export interface DeployTemplateCtx {
	deploymentScope: DeploymentScope;
	organizationId?: Organization['id'];
	workspaceId?: Workspace['id'];
	deploymentType: DeploymentType;
	templateId?: Template['id'];
	coverId?: Template['coverId'];
}
