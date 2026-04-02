# n8n-nodes-axelar-network

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with Axelar Network's cross-chain infrastructure. This node provides access to 6 resources including cross-chain transfers, general message passing, interchain token services, validator operations, chain management, and transaction handling, enabling seamless blockchain interoperability workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Axelar Network](https://img.shields.io/badge/Axelar-Network-purple)
![Cross Chain](https://img.shields.io/badge/Cross--Chain-Interoperability-green)
![Blockchain](https://img.shields.io/badge/Blockchain-Integration-orange)

## Features

- **Cross-Chain Transfers** - Execute seamless asset transfers between different blockchain networks
- **General Message Passing** - Send and receive arbitrary data across blockchain networks
- **Interchain Token Service** - Create, manage, and deploy tokens across multiple chains
- **Validator Operations** - Monitor validator status, performance metrics, and network participation
- **Chain Management** - Access chain information, network status, and configuration details
- **Transaction Handling** - Track, verify, and manage cross-chain transaction states
- **Real-time Monitoring** - Get live updates on network status and transaction confirmations
- **Multi-Network Support** - Connect to various blockchain networks supported by Axelar

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-axelar-network`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-axelar-network
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-axelar-network.git
cd n8n-nodes-axelar-network
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-axelar-network
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Axelar Network API key for authentication | Yes |
| Environment | Network environment (mainnet/testnet) | Yes |
| Base URL | Custom API base URL (optional) | No |

## Resources & Operations

### 1. CrossChainTransfer

| Operation | Description |
|-----------|-------------|
| Initiate Transfer | Start a cross-chain asset transfer |
| Get Transfer Status | Check the status of an ongoing transfer |
| List Transfers | Retrieve a list of transfers |
| Get Transfer Details | Get detailed information about a specific transfer |
| Cancel Transfer | Cancel a pending transfer |
| Estimate Fees | Calculate transfer fees and gas costs |

### 2. General Message Passing

| Operation | Description |
|-----------|-------------|
| Send Message | Send a general message across chains |
| Get Message Status | Check message delivery status |
| List Messages | Retrieve sent/received messages |
| Get Message Details | Get detailed message information |
| Retry Message | Retry a failed message delivery |

### 3. InterchainTokenService

| Operation | Description |
|-----------|-------------|
| Deploy Token | Deploy a new interchain token |
| Get Token Info | Retrieve token information |
| List Tokens | Get list of deployed tokens |
| Mint Tokens | Mint tokens on specified chains |
| Burn Tokens | Burn tokens from circulation |
| Transfer Ownership | Transfer token ownership |

### 4. Validator

| Operation | Description |
|-----------|-------------|
| Get Validator Info | Retrieve validator details |
| List Validators | Get all network validators |
| Get Validator Performance | Check validator performance metrics |
| Get Validator Status | Check validator online status |
| Get Delegation Info | Retrieve delegation information |

### 5. Chain

| Operation | Description |
|-----------|-------------|
| Get Chain Info | Retrieve blockchain information |
| List Supported Chains | Get all supported chains |
| Get Chain Status | Check chain network status |
| Get Chain Configuration | Retrieve chain configuration |
| Get Network Parameters | Get network-specific parameters |

### 6. Transaction

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve transaction details |
| List Transactions | Get transaction history |
| Track Transaction | Monitor transaction progress |
| Verify Transaction | Verify transaction authenticity |
| Get Transaction Proof | Retrieve cryptographic proof |

## Usage Examples

```javascript
// Initiate a cross-chain USDC transfer from Ethereum to Polygon
{
  "sourceChain": "ethereum",
  "destinationChain": "polygon",
  "asset": "USDC",
  "amount": "100000000",
  "recipientAddress": "0x742d35Cc6634C0532925a3b8D4c0c8b6d1e8e7c8",
  "senderAddress": "0x8ba1f109551bD432803012645Hac136c0c8b6d1e"
}
```

```javascript
// Send a general message from Avalanche to Fantom
{
  "sourceChain": "avalanche",
  "destinationChain": "fantom",
  "destinationContract": "0x1234567890abcdef1234567890abcdef12345678",
  "payload": "0x68656c6c6f20776f726c64",
  "gasLimit": "500000"
}
```

```javascript
// Deploy an interchain token across multiple networks
{
  "tokenName": "MyToken",
  "tokenSymbol": "MTK",
  "decimals": 18,
  "initialSupply": "1000000000000000000000000",
  "chains": ["ethereum", "polygon", "avalanche", "fantom"],
  "mintable": true
}
```

```javascript
// Get validator performance metrics
{
  "validatorAddress": "axelarvaloper1abc123def456ghi789jkl012mno345pqr678st",
  "timeframe": "30d",
  "includeRewards": true,
  "includeDelegations": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and has proper permissions |
| Insufficient Balance | Not enough funds for transfer or gas fees | Check account balance and ensure sufficient funds |
| Unsupported Chain | Requested chain is not supported by Axelar | Use `List Supported Chains` to get valid options |
| Transaction Failed | Cross-chain transaction encountered an error | Check transaction status and retry if needed |
| Rate Limited | Too many requests in short time period | Implement request throttling and retry logic |
| Network Unavailable | Target blockchain network is temporarily down | Wait and retry, check chain status endpoint |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-axelar-network/issues)
- **Axelar Documentation**: [Axelar Network Docs](https://docs.axelar.dev/)
- **API Reference**: [Axelar API Documentation](https://docs.axelar.dev/dev/reference)