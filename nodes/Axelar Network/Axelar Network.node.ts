/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-axelarnetwork/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AxelarNetwork implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Axelar Network',
    name: 'axelarnetwork',
    icon: 'file:axelarnetwork.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Axelar Network API',
    defaults: {
      name: 'Axelar Network',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'axelarnetworkApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'CrossChainTransfer',
            value: 'crossChainTransfer',
          },
          {
            name: 'General Message Passing',
            value: 'generalMessagePassing',
          },
          {
            name: 'InterchainTokenService',
            value: 'interchainTokenService',
          },
          {
            name: 'Validator',
            value: 'validator',
          },
          {
            name: 'Chain',
            value: 'chain',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          }
        ],
        default: 'crossChainTransfer',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['crossChainTransfer'] } },
  options: [
    { name: 'Get Transfers', value: 'getTransfers', description: 'Get cross-chain transfer transactions', action: 'Get cross-chain transfers' },
    { name: 'Get Transfer', value: 'getTransfer', description: 'Get specific transfer by transaction hash', action: 'Get specific transfer' },
    { name: 'Get Transfer Status', value: 'getTransferStatus', description: 'Get transfer status and progress', action: 'Get transfer status' },
    { name: 'Get Transfer Estimate', value: 'getTransferEstimate', description: 'Get transfer fee estimates', action: 'Get transfer estimate' }
  ],
  default: 'getTransfers',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
		},
	},
	options: [
		{
			name: 'Get Messages',
			value: 'getMessages',
			description: 'Get GMP messages with optional filtering',
			action: 'Get GMP messages',
		},
		{
			name: 'Get Message',
			value: 'getMessage',
			description: 'Get specific GMP message details by message ID',
			action: 'Get specific GMP message',
		},
		{
			name: 'Get Message Status',
			value: 'getMessageStatus',
			description: 'Get message execution status by message ID',
			action: 'Get message status',
		},
		{
			name: 'Get Contracts',
			value: 'getContracts',
			description: 'Get registered GMP contracts with optional filtering',
			action: 'Get GMP contracts',
		},
		{
			name: 'Get Contract',
			value: 'getContract',
			description: 'Get contract details and statistics by address',
			action: 'Get contract details',
		},
	],
	default: 'getMessages',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['interchainTokenService'] } },
  options: [
    { name: 'Get Tokens', value: 'getTokens', description: 'Get interchain tokens', action: 'Get interchain tokens' },
    { name: 'Get Token', value: 'getToken', description: 'Get token details across chains', action: 'Get token details' },
    { name: 'Get Token Transfers', value: 'getTokenTransfers', description: 'Get ITS token transfers', action: 'Get token transfers' },
    { name: 'Get Token Transfer', value: 'getTokenTransfer', description: 'Get specific token transfer', action: 'Get specific token transfer' },
    { name: 'Get Token Deployments', value: 'getTokenDeployments', description: 'Get token deployment transactions', action: 'Get token deployments' }
  ],
  default: 'getTokens',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['validator'] } },
  options: [
    { name: 'Get Validators', value: 'getValidators', description: 'Get validator list and details', action: 'Get validators' },
    { name: 'Get Validator', value: 'getValidator', description: 'Get specific validator information', action: 'Get validator' },
    { name: 'Get Heartbeats', value: 'getHeartbeats', description: 'Get validator heartbeat data', action: 'Get heartbeats' },
    { name: 'Get Voting Power', value: 'getVotingPower', description: 'Get validator voting power distribution', action: 'Get voting power' }
  ],
  default: 'getValidators',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['chain'] } },
  options: [
    { name: 'Get Chains', value: 'getChains', description: 'Get supported blockchain networks', action: 'Get supported blockchain networks' },
    { name: 'Get Chain', value: 'getChain', description: 'Get specific chain configuration', action: 'Get specific chain configuration' },
    { name: 'Get Chain Assets', value: 'getChainAssets', description: 'Get supported assets for a chain', action: 'Get supported assets for a chain' },
    { name: 'Get Chain Status', value: 'getChainStatus', description: 'Get chain connection and sync status', action: 'Get chain connection and sync status' }
  ],
  default: 'getChains',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
		},
	},
	options: [
		{
			name: 'Get Transactions',
			value: 'getTransactions',
			description: 'Get Axelar network transactions',
			action: 'Get transactions',
		},
		{
			name: 'Get Transaction',
			value: 'getTransaction',
			description: 'Get specific transaction details',
			action: 'Get a transaction',
		},
		{
			name: 'Get Blocks',
			value: 'getBlocks',
			description: 'Get block information',
			action: 'Get blocks',
		},
		{
			name: 'Get Block',
			value: 'getBlock',
			description: 'Get specific block details',
			action: 'Get a block',
		},
		{
			name: 'Search Transactions',
			value: 'searchTransactions',
			description: 'Search transactions by various criteria',
			action: 'Search transactions',
		},
	],
	default: 'getTransactions',
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransfers'] } },
  default: '',
  description: 'Transaction hash to filter transfers',
},
{
  displayName: 'Source Chain',
  name: 'sourceChain',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransfers'] } },
  default: '',
  description: 'Source blockchain network',
},
{
  displayName: 'Destination Chain',
  name: 'destinationChain',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransfers'] } },
  default: '',
  description: 'Destination blockchain network',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransfers'] } },
  options: [
    { name: 'Pending', value: 'pending' },
    { name: 'Confirmed', value: 'confirmed' },
    { name: 'Executed', value: 'executed' },
    { name: 'Error', value: 'error' }
  ],
  default: '',
  description: 'Transfer status to filter by',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransfers'] } },
  default: 25,
  description: 'Number of results to return (max 100)',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransfers'] } },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransfer'] } },
  default: '',
  description: 'Transaction hash of the transfer to retrieve',
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransferStatus'] } },
  default: '',
  description: 'Transaction hash to check status for',
},
{
  displayName: 'Source Chain',
  name: 'sourceChain',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransferEstimate'] } },
  default: '',
  description: 'Source blockchain network for the transfer',
},
{
  displayName: 'Destination Chain',
  name: 'destinationChain',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransferEstimate'] } },
  default: '',
  description: 'Destination blockchain network for the transfer',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransferEstimate'] } },
  default: '',
  description: 'Asset symbol to transfer (e.g., USDC, AXL)',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['crossChainTransfer'], operation: ['getTransferEstimate'] } },
  default: '',
  description: 'Amount to transfer (in asset units)',
},
{
	displayName: 'Message ID',
	name: 'messageId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
			operation: ['getMessage', 'getMessageStatus'],
		},
	},
	default: '',
	description: 'The unique identifier of the GMP message',
},
{
	displayName: 'Message ID',
	name: 'messageId',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
			operation: ['getMessages'],
		},
	},
	default: '',
	description: 'Filter by specific message ID',
},
{
	displayName: 'Source Chain',
	name: 'sourceChain',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
			operation: ['getMessages'],
		},
	},
	default: '',
	description: 'Filter by source blockchain network',
},
{
	displayName: 'Destination Chain',
	name: 'destinationChain',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
			operation: ['getMessages'],
		},
	},
	default: '',
	description: 'Filter by destination blockchain network',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	required: false,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
			operation: ['getMessages'],
		},
	},
	options: [
		{
			name: 'Pending',
			value: 'pending',
		},
		{
			name: 'Confirmed',
			value: 'confirmed',
		},
		{
			name: 'Executed',
			value: 'executed',
		},
		{
			name: 'Failed',
			value: 'failed',
		},
	],
	default: '',
	description: 'Filter by message status',
},
{
	displayName: 'Contract Address',
	name: 'contractAddress',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
			operation: ['getMessages', 'getContracts'],
		},
	},
	default: '',
	description: 'Filter by contract address',
},
{
	displayName: 'Chain',
	name: 'chain',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
			operation: ['getContracts'],
		},
	},
	default: '',
	description: 'Filter by blockchain network',
},
{
	displayName: 'Contract Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
			operation: ['getContract'],
		},
	},
	default: '',
	description: 'The contract address to get details for',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
			operation: ['getMessages', 'getContracts'],
		},
	},
	default: 100,
	description: 'Maximum number of results to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['generalMessagePassing'],
			operation: ['getMessages', 'getContracts'],
		},
	},
	default: 0,
	description: 'Number of results to skip for pagination',
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: false,
  default: '',
  placeholder: '0x123...',
  description: 'The token ID to filter by',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokens'] } },
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'string',
  required: false,
  default: '',
  placeholder: 'ethereum',
  description: 'The blockchain network (ethereum, polygon, avalanche, etc.)',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokens'] } },
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: false,
  default: '',
  placeholder: 'USDC',
  description: 'Token symbol to filter by',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokens'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  default: 100,
  description: 'Maximum number of results to return',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokens'] } },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  default: 0,
  description: 'Number of results to skip',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokens'] } },
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: true,
  default: '',
  placeholder: '0x123...',
  description: 'The token ID to get details for',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getToken'] } },
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: false,
  default: '',
  placeholder: '0x123...',
  description: 'The token ID to filter transfers by',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenTransfers'] } },
},
{
  displayName: 'Source Chain',
  name: 'sourceChain',
  type: 'string',
  required: false,
  default: '',
  placeholder: 'ethereum',
  description: 'The source blockchain network',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenTransfers'] } },
},
{
  displayName: 'Destination Chain',
  name: 'destinationChain',
  type: 'string',
  required: false,
  default: '',
  placeholder: 'polygon',
  description: 'The destination blockchain network',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenTransfers'] } },
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  options: [
    { name: 'All', value: '' },
    { name: 'Pending', value: 'pending' },
    { name: 'Completed', value: 'completed' },
    { name: 'Failed', value: 'failed' }
  ],
  default: '',
  description: 'Transfer status to filter by',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenTransfers'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  default: 100,
  description: 'Maximum number of results to return',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenTransfers'] } },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  default: 0,
  description: 'Number of results to skip',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenTransfers'] } },
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  default: '',
  placeholder: '0x123...',
  description: 'The transaction hash to get transfer details for',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenTransfer'] } },
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: false,
  default: '',
  placeholder: '0x123...',
  description: 'The token ID to filter deployments by',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenDeployments'] } },
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'string',
  required: false,
  default: '',
  placeholder: 'ethereum',
  description: 'The blockchain network to filter deployments by',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenDeployments'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  default: 100,
  description: 'Maximum number of results to return',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenDeployments'] } },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  default: 0,
  description: 'Number of results to skip',
  displayOptions: { show: { resource: ['interchainTokenService'], operation: ['getTokenDeployments'] } },
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'All', value: 'all' }
  ],
  default: 'all',
  description: 'Filter validators by status',
  displayOptions: { show: { resource: ['validator'], operation: ['getValidators'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  description: 'Maximum number of results to return',
  displayOptions: { show: { resource: ['validator'], operation: ['getValidators', 'getHeartbeats'] } },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Number of results to skip',
  displayOptions: { show: { resource: ['validator'], operation: ['getValidators', 'getHeartbeats'] } },
},
{
  displayName: 'Validator Address',
  name: 'address',
  type: 'string',
  required: true,
  default: '',
  description: 'The validator address to query',
  displayOptions: { show: { resource: ['validator'], operation: ['getValidator'] } },
},
{
  displayName: 'Validator Address',
  name: 'validatorAddress',
  type: 'string',
  default: '',
  description: 'Filter heartbeats by specific validator address',
  displayOptions: { show: { resource: ['validator'], operation: ['getHeartbeats'] } },
},
{
  displayName: 'Block Height',
  name: 'height',
  type: 'number',
  default: 0,
  description: 'Block height to get voting power for (0 = latest)',
  displayOptions: { show: { resource: ['validator'], operation: ['getVotingPower'] } },
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['chain'], operation: ['getChains'] } },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'All', value: 'all' }
  ],
  default: 'all',
  description: 'Filter chains by status'
},
{
  displayName: 'Type',
  name: 'type',
  type: 'string',
  displayOptions: { show: { resource: ['chain'], operation: ['getChains'] } },
  default: '',
  description: 'Filter chains by type (evm, cosmos, etc.)'
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['chain'], operation: ['getChains', 'getChainAssets'] } },
  default: 50,
  description: 'Maximum number of results to return'
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['chain'], operation: ['getChains', 'getChainAssets'] } },
  default: 0,
  description: 'Number of results to skip'
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['chain'], operation: ['getChain', 'getChainAssets', 'getChainStatus'] } },
  default: '',
  description: 'The ID of the chain'
},
{
	displayName: 'Transaction Hash',
	name: 'txHash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransaction'],
		},
	},
	default: '',
	description: 'The hash of the transaction to retrieve',
},
{
	displayName: 'Block Height',
	name: 'height',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getBlock'],
		},
	},
	default: 1,
	description: 'The height of the block to retrieve',
},
{
	displayName: 'Type',
	name: 'type',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactions'],
		},
	},
	default: '',
	description: 'Filter transactions by type',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactions'],
		},
	},
	options: [
		{
			name: 'Success',
			value: 'success',
		},
		{
			name: 'Failed',
			value: 'failed',
		},
		{
			name: 'Pending',
			value: 'pending',
		},
	],
	default: '',
	description: 'Filter transactions by status',
},
{
	displayName: 'Height',
	name: 'heightFilter',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactions', 'getBlocks'],
		},
	},
	default: '',
	description: 'Filter by block height',
},
{
	displayName: 'Proposer',
	name: 'proposer',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getBlocks'],
		},
	},
	default: '',
	description: 'Filter blocks by proposer address',
},
{
	displayName: 'Search Query',
	name: 'query',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['searchTransactions'],
		},
	},
	default: '',
	description: 'Search query for transactions',
},
{
	displayName: 'Search Type',
	name: 'searchType',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['searchTransactions'],
		},
	},
	default: '',
	description: 'Type filter for search results',
},
{
	displayName: 'From Height',
	name: 'fromHeight',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['searchTransactions'],
		},
	},
	default: '',
	description: 'Start block height for search range',
},
{
	displayName: 'To Height',
	name: 'toHeight',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['searchTransactions'],
		},
	},
	default: '',
	description: 'End block height for search range',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactions', 'getBlocks', 'searchTransactions'],
		},
	},
	default: 100,
	description: 'Maximum number of results to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactions', 'getBlocks', 'searchTransactions'],
		},
	},
	default: 0,
	description: 'Number of results to skip',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'crossChainTransfer':
        return [await executeCrossChainTransferOperations.call(this, items)];
      case 'generalMessagePassing':
        return [await executeGeneralMessagePassingOperations.call(this, items)];
      case 'interchainTokenService':
        return [await executeInterchainTokenServiceOperations.call(this, items)];
      case 'validator':
        return [await executeValidatorOperations.call(this, items)];
      case 'chain':
        return [await executeChainOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeCrossChainTransferOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('axelarnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://api.axelarscan.io';

      switch (operation) {
        case 'getTransfers': {
          const txHash = this.getNodeParameter('txHash', i) as string;
          const sourceChain = this.getNodeParameter('sourceChain', i) as string;
          const destinationChain = this.getNodeParameter('destinationChain', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const params = new URLSearchParams();
          if (txHash) params.append('txHash', txHash);
          if (sourceChain) params.append('sourceChain', sourceChain);
          if (destinationChain) params.append('destinationChain', destinationChain);
          if (status) params.append('status', status);
          if (limit) params.append('limit', limit.toString());
          if (offset) params.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/cross-chain/transfers?${params.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransfer': {
          const txHash = this.getNodeParameter('txHash', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/cross-chain/transfers/${txHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransferStatus': {
          const txHash = this.getNodeParameter('txHash', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/cross-chain/transfers/status/${txHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransferEstimate': {
          const sourceChain = this.getNodeParameter('sourceChain', i) as string;
          const destinationChain = this.getNodeParameter('destinationChain', i) as string;
          const asset = this.getNodeParameter('asset', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          const params = new URLSearchParams();
          params.append('sourceChain', sourceChain);
          params.append('destinationChain', destinationChain);
          params.append('asset', asset);
          params.append('amount', amount);

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/cross-chain/transfers/estimate?${params.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeGeneralMessagePassingOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('axelarnetworkApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getMessages': {
					const queryParams: any = {};
					
					const messageId = this.getNodeParameter('messageId', i) as string;
					const sourceChain = this.getNodeParameter('sourceChain', i) as string;
					const destinationChain = this.getNodeParameter('destinationChain', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const contractAddress = this.getNodeParameter('contractAddress', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					if (messageId) queryParams.messageId = messageId;
					if (sourceChain) queryParams.sourceChain = sourceChain;
					if (destinationChain) queryParams.destinationChain = destinationChain;
					if (status) queryParams.status = status;
					if (contractAddress) queryParams.contractAddress = contractAddress;
					if (limit) queryParams.limit = limit;
					if (offset) queryParams.offset = offset;

					const queryString = new URLSearchParams(queryParams).toString();
					const url = `${credentials.baseUrl}/gmp/messages${queryString ? '?' + queryString : ''}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getMessage': {
					const messageId = this.getNodeParameter('messageId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/gmp/messages/${messageId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getMessageStatus': {
					const messageId = this.getNodeParameter('messageId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/gmp/messages/status/${messageId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getContracts': {
					const queryParams: any = {};
					
					const chain = this.getNodeParameter('chain', i) as string;
					const contractAddress = this.getNodeParameter('contractAddress', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					if (chain) queryParams.chain = chain;
					if (contractAddress) queryParams.contractAddress = contractAddress;
					if (limit) queryParams.limit = limit;
					if (offset) queryParams.offset = offset;

					const queryString = new URLSearchParams(queryParams).toString();
					const url = `${credentials.baseUrl}/gmp/contracts${queryString ? '?' + queryString : ''}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getContract': {
					const address = this.getNodeParameter('address', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/gmp/contracts/${address}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeInterchainTokenServiceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('axelarnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTokens': {
          const queryParams: any = {};
          
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          if (tokenId) queryParams.tokenId = tokenId;
          if (chain) queryParams.chain = chain;
          if (symbol) queryParams.symbol = symbol;
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/its/tokens${queryString ? `?${queryString}` : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getToken': {
          const tokenId = this.getNodeParameter('tokenId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/its/tokens/${tokenId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenTransfers': {
          const queryParams: any = {};
          
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const sourceChain = this.getNodeParameter('sourceChain', i) as string;
          const destinationChain = this.getNodeParameter('destinationChain', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          if (tokenId) queryParams.tokenId = tokenId;
          if (sourceChain) queryParams.sourceChain = sourceChain;
          if (destinationChain) queryParams.destinationChain = destinationChain;
          if (status) queryParams.status = status;
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/its/transfers${queryString ? `?${queryString}` : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenTransfer': {
          const txHash = this.getNodeParameter('txHash', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/its/transfers/${txHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenDeployments': {
          const queryParams: any = {};
          
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          if (tokenId) queryParams.tokenId = tokenId;
          if (chain) queryParams.chain = chain;
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/its/deployments${queryString ? `?${queryString}` : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeValidatorOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('axelarnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getValidators': {
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams();
          if (status !== 'all') queryParams.append('status', status);
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/validators?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getValidator': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/validators/${encodeURIComponent(address)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getHeartbeats': {
          const validatorAddress = this.getNodeParameter('validatorAddress', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams();
          if (validatorAddress) queryParams.append('validatorAddress', validatorAddress);
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/validators/heartbeats?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getVotingPower': {
          const height = this.getNodeParameter('height', i) as number;

          const queryParams = new URLSearchParams();
          if (height > 0) queryParams.append('height', height.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/validators/voting-power?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeChainOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('axelarnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://api.axelarscan.io';

      switch (operation) {
        case 'getChains': {
          const status = this.getNodeParameter('status', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const params = new URLSearchParams();
          if (status && status !== 'all') params.append('status', status);
          if (type) params.append('type', type);
          if (limit) params.append('limit', limit.toString());
          if (offset) params.append('offset', offset.toString());

          const url = `${baseUrl}/chains${params.toString() ? '?' + params.toString() : ''}`;
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getChain': {
          const chainId = this.getNodeParameter('chainId', i) as string;

          const url = `${baseUrl}/chains/${encodeURIComponent(chainId)}`;
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getChainAssets': {
          const chainId = this.getNodeParameter('chainId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const params = new URLSearchParams();
          if (limit) params.append('limit', limit.toString());
          if (offset) params.append('offset', offset.toString());

          const url = `${baseUrl}/chains/${encodeURIComponent(chainId)}/assets${params.toString() ? '?' + params.toString() : ''}`;
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getChainStatus': {
          const chainId = this.getNodeParameter('chainId', i) as string;

          const url = `${baseUrl}/chains/${encodeURIComponent(chainId)}/status`;
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('axelarnetworkApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getTransactions': {
					const type = this.getNodeParameter('type', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const heightFilter = this.getNodeParameter('heightFilter', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const params = new URLSearchParams();
					if (type) params.append('type', type);
					if (status) params.append('status', status);
					if (heightFilter) params.append('height', heightFilter.toString());
					if (limit) params.append('limit', limit.toString());
					if (offset) params.append('offset', offset.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/transactions?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransaction': {
					const txHash = this.getNodeParameter('txHash', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/transactions/${txHash}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getBlocks': {
					const heightFilter = this.getNodeParameter('heightFilter', i) as number;
					const proposer = this.getNodeParameter('proposer', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const params = new URLSearchParams();
					if (heightFilter) params.append('height', heightFilter.toString());
					if (proposer) params.append('proposer', proposer);
					if (limit) params.append('limit', limit.toString());
					if (offset) params.append('offset', offset.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/blocks?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getBlock': {
					const height = this.getNodeParameter('height', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/blocks/${height}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'searchTransactions': {
					const query = this.getNodeParameter('query', i) as string;
					const searchType = this.getNodeParameter('searchType', i) as string;
					const fromHeight = this.getNodeParameter('fromHeight', i) as number;
					const toHeight = this.getNodeParameter('toHeight', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const params = new URLSearchParams();
					params.append('query', query);
					if (searchType) params.append('type', searchType);
					if (fromHeight) params.append('fromHeight', fromHeight.toString());
					if (toHeight) params.append('toHeight', toHeight.toString());
					if (limit) params.append('limit', limit.toString());
					if (offset) params.append('offset', offset.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/transactions/search?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
