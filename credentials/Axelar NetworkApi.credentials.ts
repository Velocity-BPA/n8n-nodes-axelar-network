import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class AxelarNetworkApi implements ICredentialType {
	name = 'axelarNetworkApi';

	displayName = 'Axelar Network API';

	documentationUrl = 'https://docs.axelarscan.io';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'API key for Axelar Network. Get your API key from the Axelarscan dashboard.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: 'https://api.axelarscan.io',
			description: 'Base URL for the Axelar Network API',
		},
	];
}