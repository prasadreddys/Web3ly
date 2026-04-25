# Web3ly - Multi-Chain Web3 Wallet

A comprehensive TypeScript/JavaScript library for creating and managing Web3 wallets across multiple blockchain networks (Ethereum, Bitcoin, and Solana).

## Features

- **Multi-Chain Support**: Seamlessly manage wallets across Ethereum, Bitcoin, and Solana
- **Account Creation**: Generate new wallets with secure random mnemonics
- **Key Management**: Import accounts using private keys or mnemonics
- **Balance Queries**: Check account balances on any supported chain
- **Transaction Management**: Send transactions and track their status
- **BIP39/BIP44 Support**: HD wallet derivation for multiple accounts from a single seed
- **TypeScript**: Full type safety and IDE support
- **Zero External Dependencies**: Minimal trust requirements

## Installation

```bash
npm install web3ly
```

Or clone and build from source:

```bash
git clone <repository>
cd Web3ly
npm install
npm run build
```

## Quick Start

### Create a Multi-Chain Wallet

```typescript
import { WalletManager } from 'web3ly';

const manager = new WalletManager();

// Create accounts on all supported chains
const accounts = await manager.createMultiChainAccount();

console.log('Ethereum:', accounts.ethereum.address);
console.log('Bitcoin:', accounts.bitcoin.address);
console.log('Solana:', accounts.solana.address);
```

### Create Chain-Specific Wallets

#### Ethereum Wallet

```typescript
import { EthereumWallet } from 'web3ly';

const wallet = new EthereumWallet('https://eth.llamarpc.com');

// Create account
const account = await wallet.createAccount();
console.log('Address:', account.address);
console.log('Private Key:', account.privateKey);

// Check balance
const balance = await wallet.getBalance('0x...');
console.log('Balance:', balance.balance, balance.symbol);

// Send transaction
const result = await wallet.sendTransaction(
  '0xFrom...',
  '0xTo...',
  '1.5', // 1.5 ETH
  'privateKey...'
);
console.log('TX Hash:', result.txHash);
```

#### Bitcoin Wallet

```typescript
import { BitcoinWallet } from 'web3ly';

const wallet = new BitcoinWallet('mainnet'); // or 'testnet'

// Create account
const account = await wallet.createAccount();
console.log('Address:', account.address);

// Check balance
const balance = await wallet.getBalance(account.address);
console.log('Balance:', balance.balance, balance.symbol);
```

#### Solana Wallet

```typescript
import { SolanaWallet } from 'web3ly';

const wallet = new SolanaWallet('https://api.mainnet-beta.solana.com');

// Create account
const account = await wallet.createAccount();
console.log('Address:', account.address);

// Send transaction
const result = await wallet.sendTransaction(
  'from_address',
  'to_address',
  '1.5', // 1.5 SOL
  'private_key'
);
console.log('TX Hash:', result.txHash);
```

### Import Existing Account

```typescript
import { EthereumWallet, ChainType } from 'web3ly';

const wallet = new EthereumWallet();

// Import from private key
const account = await wallet.importAccount('0xprivatekey...');

// Or import from mnemonic
const account = await wallet.importAccount(
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
);
```

### Derive Multiple Accounts from Seed

```typescript
const mnemonic = 'your mnemonic phrase here...';

// Derive accounts with different indices
const account0 = await wallet.deriveAccount(mnemonic, 0);
const account1 = await wallet.deriveAccount(mnemonic, 1);
const account2 = await wallet.deriveAccount(mnemonic, 2);
```

## API Reference

### WalletManager

Unified interface for managing multiple chain wallets.

#### Methods

- `createMultiChainAccount()`: Create new accounts on all supported chains
- `importAccount(chain, privateKeyOrMnemonic)`: Import account for a specific chain
- `getBalance(chain, address)`: Get balance on a specific chain
- `sendTransaction(chain, from, to, amount, privateKey)`: Send transaction
- `getTransactionStatus(chain, txHash)`: Check transaction status
- `getAllAccounts()`: Get all stored accounts
- `getAccount(chain, address)`: Get specific account

### EthereumWallet

Ethereum and EVM-compatible blockchain wallet.

#### Methods

- `createAccount()`: Create new Ethereum account
- `importAccount(privateKeyOrMnemonic)`: Import account
- `getBalance(address)`: Get ETH balance
- `sendTransaction(from, to, amount, privateKey)`: Send ETH
- `getTransactionStatus(txHash)`: Check transaction status
- `deriveAccount(mnemonic, index)`: Derive child account (BIP44)

### BitcoinWallet

Bitcoin blockchain wallet.

#### Methods

- `createAccount()`: Create new Bitcoin account
- `importAccount(wifOrMnemonic)`: Import account
- `getBalance(address)`: Get BTC balance
- `sendTransaction(from, to, amount, privateKey)`: Send BTC
- `getTransactionStatus(txHash)`: Check transaction status
- `deriveAccount(mnemonic, index)`: Derive child account (BIP44)

### SolanaWallet

Solana blockchain wallet.

#### Methods

- `createAccount()`: Create new Solana account
- `importAccount(secretKeyOrMnemonic)`: Import account
- `getBalance(address)`: Get SOL balance
- `sendTransaction(from, to, amount, privateKey)`: Send SOL
- `getTransactionStatus(txHash)`: Check transaction status
- `deriveAccount(mnemonic, index)`: Derive child account

## Types

```typescript
enum ChainType {
  ETHEREUM = 'ethereum',
  BITCOIN = 'bitcoin',
  SOLANA = 'solana',
}

interface WalletAccount {
  address: string;
  publicKey: string;
  privateKey?: string;
  chain: ChainType;
}

interface Balance {
  address: string;
  balance: string;
  symbol: string;
  decimals: number;
  chain: ChainType;
}

interface Transaction {
  hash?: string;
  from: string;
  to: string;
  amount: string;
  fee?: string;
  status?: 'pending' | 'confirmed' | 'failed';
  chain: ChainType;
  timestamp?: number;
}

interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}
```

## Security Best Practices

⚠️ **IMPORTANT**: This library is for educational purposes. For production use:

1. **Never store private keys in plain text**
   - Use secure key management services (e.g., AWS KMS, HashiCorp Vault)
   - Consider hardware wallets for high-value accounts

2. **Validate all inputs**
   - Always validate addresses before transactions
   - Check balance before sending

3. **Use environment variables**
   ```bash
   export PRIVATE_KEY="your_key_here"
   ```

4. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

5. **Use testnet for testing**
   - Test on Bitcoin testnet and Ethereum testnet before mainnet
   - Use Solana devnet for development

## Testing

```bash
npm test
```

## Building

```bash
npm run build
```

Output will be in the `dist/` directory.

## Linting

```bash
npm run lint
```

## RPC Providers

### Ethereum
- Mainnet: https://eth.llamarpc.com
- Sepolia Testnet: https://sepolia.infura.io/v3/YOUR_PROJECT_ID

### Bitcoin
- Mainnet: Bitcoin P2P network
- Testnet: Bitcoin testnet P2P network

### Solana
- Mainnet: https://api.mainnet-beta.solana.com
- Devnet: https://api.devnet.solana.com
- Testnet: https://api.testnet.solana.com

## Example Usage

See [src/examples.ts](src/examples.ts) for comprehensive examples.

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Disclaimer

This library is provided as-is for educational purposes. Use at your own risk. The developers are not responsible for any lost funds or security issues. Always test thoroughly with small amounts before moving to production.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Roadmap

- [ ] Add Polygon support
- [ ] Add Arbitrum support
- [ ] Add hardware wallet integration (Ledger, Trezor)
- [ ] Add WebSocket support for real-time updates
- [ ] Add advanced transaction features (gas optimization, batching)
- [ ] Add ERC-20 token transfer support
- [ ] Add NFT support
- [ ] Add DeFi integration examples