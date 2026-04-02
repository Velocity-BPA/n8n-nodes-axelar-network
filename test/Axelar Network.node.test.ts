/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AxelarNetwork } from '../nodes/Axelar Network/Axelar Network.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AxelarNetwork Node', () => {
  let node: AxelarNetwork;

  beforeAll(() => {
    node = new AxelarNetwork();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Axelar Network');
      expect(node.description.name).toBe('axelarnetwork');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('CrossChainTransfer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.axelarscan.io' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getTransfers operation', () => {
    it('should get cross-chain transfers successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        switch (param) {
          case 'operation': return 'getTransfers';
          case 'sourceChain': return 'ethereum';
          case 'destinationChain': return 'polygon';
          case 'limit': return 10;
          case 'offset': return 0;
          default: return '';
        }
      });

      const mockResponse = { transfers: [{ id: '1', status: 'confirmed' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCrossChainTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.axelarscan.io/cross-chain/transfers?sourceChain=ethereum&destinationChain=polygon&limit=10&offset=0',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getTransfers errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        return param === 'operation' ? 'getTransfers' : '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCrossChainTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTransfer operation', () => {
    it('should get specific transfer successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTransfer';
          case 'txHash': return '0x123abc';
          default: return '';
        }
      });

      const mockResponse = { transfer: { id: '1', txHash: '0x123abc', status: 'confirmed' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCrossChainTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.axelarscan.io/cross-chain/transfers/0x123abc',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getTransferStatus operation', () => {
    it('should get transfer status successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTransferStatus';
          case 'txHash': return '0x123abc';
          default: return '';
        }
      });

      const mockResponse = { status: 'executed', progress: 100 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCrossChainTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.axelarscan.io/cross-chain/transfers/status/0x123abc',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getTransferEstimate operation', () => {
    it('should get transfer estimate successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getTransferEstimate';
          case 'sourceChain': return 'ethereum';
          case 'destinationChain': return 'polygon';
          case 'asset': return 'USDC';
          case 'amount': return '100';
          default: return '';
        }
      });

      const mockResponse = { estimatedFee: '0.5', estimatedTime: '5 minutes' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCrossChainTransferOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.axelarscan.io/cross-chain/transfers/estimate?sourceChain=ethereum&destinationChain=polygon&asset=USDC&amount=100',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});

describe('General Message Passing Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.axelarscan.io',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getMessages operation', () => {
		it('should get GMP messages successfully', async () => {
			const mockResponse = { data: [{ messageId: 'test-message-1', status: 'confirmed' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMessages')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce('polygon')
				.mockReturnValueOnce('confirmed')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(0);

			const result = await executeGeneralMessagePassingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.axelarscan.io/gmp/messages?sourceChain=ethereum&destinationChain=polygon&status=confirmed&limit=100&offset=0',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when getting messages fails', async () => {
			const error = new Error('API Error');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getMessages');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeGeneralMessagePassingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getMessage operation', () => {
		it('should get specific message successfully', async () => {
			const mockResponse = { messageId: 'test-message-1', status: 'confirmed' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMessage')
				.mockReturnValueOnce('test-message-1');

			const result = await executeGeneralMessagePassingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.axelarscan.io/gmp/messages/test-message-1',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('getMessageStatus operation', () => {
		it('should get message status successfully', async () => {
			const mockResponse = { messageId: 'test-message-1', status: 'executed' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMessageStatus')
				.mockReturnValueOnce('test-message-1');

			const result = await executeGeneralMessagePassingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.axelarscan.io/gmp/messages/status/test-message-1',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('getContracts operation', () => {
		it('should get contracts successfully', async () => {
			const mockResponse = { data: [{ address: '0x123', chain: 'ethereum' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContracts')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(0);

			const result = await executeGeneralMessagePassingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.axelarscan.io/gmp/contracts?chain=ethereum&limit=100&offset=0',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('getContract operation', () => {
		it('should get contract details successfully', async () => {
			const mockResponse = { address: '0x123', chain: 'ethereum', stats: {} };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContract')
				.mockReturnValueOnce('0x123');

			const result = await executeGeneralMessagePassingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.axelarscan.io/gmp/contracts/0x123',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});
});

describe('InterchainTokenService Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.axelarscan.io' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(), 
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getTokens operation', () => {
    it('should get interchain tokens successfully', async () => {
      const mockResponse = { data: [{ tokenId: '0x123', symbol: 'USDC' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokens')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce('USDC')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(0);

      const result = await executeInterchainTokenServiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors in getTokens', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getTokens');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeInterchainTokenServiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getToken operation', () => {
    it('should get token details successfully', async () => {
      const mockResponse = { tokenId: '0x123', chains: ['ethereum', 'polygon'] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getToken')
        .mockReturnValueOnce('0x123');

      const result = await executeInterchainTokenServiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTokenTransfers operation', () => {
    it('should get token transfers successfully', async () => {
      const mockResponse = { data: [{ txHash: '0x456', status: 'completed' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenTransfers')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce('polygon')
        .mockReturnValueOnce('completed')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(0);

      const result = await executeInterchainTokenServiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTokenTransfer operation', () => {
    it('should get specific token transfer successfully', async () => {
      const mockResponse = { txHash: '0x456', status: 'completed', amount: '1000' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenTransfer')
        .mockReturnValueOnce('0x456');

      const result = await executeInterchainTokenServiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTokenDeployments operation', () => {
    it('should get token deployments successfully', async () => {
      const mockResponse = { data: [{ tokenId: '0x123', chain: 'ethereum', deploymentTx: '0x789' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenDeployments')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(0);

      const result = await executeInterchainTokenServiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Validator Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.axelarscan.io',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('getValidators operation success', async () => {
    const mockResponse = { data: [{ address: 'validator1', status: 'active' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getValidators')
      .mockReturnValueOnce('active')
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);

    const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.axelarscan.io/validators?status=active&limit=50&offset=0',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getValidator operation success', async () => {
    const mockResponse = { address: 'validator1', votingPower: '1000000' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getValidator')
      .mockReturnValueOnce('axelarvaloper1abc123');

    const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.axelarscan.io/validators/axelarvaloper1abc123',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getHeartbeats operation success', async () => {
    const mockResponse = { data: [{ validator: 'validator1', timestamp: '2023-01-01' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getHeartbeats')
      .mockReturnValueOnce('axelarvaloper1abc123')
      .mockReturnValueOnce(25)
      .mockReturnValueOnce(10);

    const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.axelarscan.io/validators/heartbeats?validatorAddress=axelarvaloper1abc123&limit=25&offset=10',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getVotingPower operation success', async () => {
    const mockResponse = { height: 1000, totalVotingPower: '50000000' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getVotingPower')
      .mockReturnValueOnce(1000);

    const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.axelarscan.io/validators/voting-power?height=1000',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('error handling with continueOnFail', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getValidators');

    const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  test('error handling without continueOnFail', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getValidators');

    await expect(
      executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});

describe('Chain Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.axelarscan.io'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getChains operation', () => {
    it('should get chains successfully', async () => {
      const mockResponse = { data: [{ id: 'ethereum', name: 'Ethereum' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getChains')
        .mockReturnValueOnce('active')
        .mockReturnValueOnce('evm')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getChains error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getChains');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getChain operation', () => {
    it('should get chain successfully', async () => {
      const mockResponse = { id: 'ethereum', name: 'Ethereum' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getChain')
        .mockReturnValueOnce('ethereum');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getChain error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getChain');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Chain not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Chain not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getChainAssets operation', () => {
    it('should get chain assets successfully', async () => {
      const mockResponse = { data: [{ symbol: 'ETH', decimals: 18 }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getChainAssets')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getChainAssets error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainAssets');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Assets not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Assets not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getChainStatus operation', () => {
    it('should get chain status successfully', async () => {
      const mockResponse = { status: 'active', height: 123456 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getChainStatus')
        .mockReturnValueOnce('ethereum');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getChainStatus error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainStatus');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Status not available'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Status not available' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Transaction Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.axelarscan.io',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getTransactions operation', () => {
		it('should get transactions successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransactions')
				.mockReturnValueOnce('transfer')
				.mockReturnValueOnce('success')
				.mockReturnValueOnce(12345)
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				transactions: [{ hash: 'tx123', type: 'transfer' }],
			});

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.transactions).toBeDefined();
		});

		it('should handle getTransactions errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getTransactions');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getTransaction operation', () => {
		it('should get specific transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransaction')
				.mockReturnValueOnce('0x123abc');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				hash: '0x123abc',
				status: 'success',
			});

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.hash).toBe('0x123abc');
		});

		it('should handle getTransaction errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransaction')
				.mockReturnValueOnce('invalid-hash');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transaction not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json.error).toBe('Transaction not found');
		});
	});

	describe('getBlocks operation', () => {
		it('should get blocks successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getBlocks')
				.mockReturnValueOnce(12345)
				.mockReturnValueOnce('axelarvaloper1abc123')
				.mockReturnValueOnce(20)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				blocks: [{ height: 12345, proposer: 'axelarvaloper1abc123' }],
			});

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.blocks).toBeDefined();
		});
	});

	describe('getBlock operation', () => {
		it('should get specific block successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getBlock')
				.mockReturnValueOnce(12345);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				height: 12345,
				timestamp: '2023-01-01T00:00:00Z',
			});

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.height).toBe(12345);
		});
	});

	describe('searchTransactions operation', () => {
		it('should search transactions successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('searchTransactions')
				.mockReturnValueOnce('0x123abc')
				.mockReturnValueOnce('transfer')
				.mockReturnValueOnce(10000)
				.mockReturnValueOnce(20000)
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				results: [{ hash: '0x123abc', type: 'transfer' }],
			});

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.results).toBeDefined();
		});

		it('should handle searchTransactions errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('searchTransactions')
				.mockReturnValueOnce('invalid-query');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid search query'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTransactionOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json.error).toBe('Invalid search query');
		});
	});
});
});
