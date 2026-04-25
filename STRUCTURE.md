# Web3ly - Project Structure

## Overview

```
Web3ly/
├── src/                      # Source code
│   ├── types.ts             # Type definitions and enums
│   ├── BaseWallet.ts        # Abstract base wallet class
│   ├── EthereumWallet.ts    # Ethereum wallet implementation
│   ├── BitcoinWallet.ts     # Bitcoin wallet implementation
│   ├── SolanaWallet.ts      # Solana wallet implementation
│   ├── WalletManager.ts     # Multi-chain wallet manager
│   ├── examples.ts          # Example usage
│   └── index.ts             # Main entry point
├── tests/                    # Test files
│   └── wallet.test.ts       # Wallet tests
├── dist/                     # Compiled output (generated after build)
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── jest.config.js           # Jest testing configuration
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── .env.example            # Example environment variables
├── LICENSE                 # MIT License
└── README.md               # Project documentation
```

## Key Files Description

### Source Files (src/)

- **types.ts**: Defines all TypeScript interfaces and enums
  - `ChainType` enum for supported blockchains
  - `WalletAccount` interface for account data
  - `Balance` interface for balance information
  - `Transaction` interface for transaction details

- **BaseWallet.ts**: Abstract base class defining the wallet interface
  - All wallet implementations extend this class
  - Ensures consistent API across different chains

- **EthereumWallet.ts**: Ethereum and EVM-compatible chain implementation
  - Account creation with BIP39 mnemonics
  - Private key and mnemonic import
  - Balance checking
  - Transaction sending and status tracking
  - BIP44 account derivation

- **BitcoinWallet.ts**: Bitcoin blockchain implementation
  - Account creation with BIP39 mnemonics
  - WIF and mnemonic import
  - Balance checking via Blockchair API
  - Transaction handling
  - BIP44 account derivation

- **SolanaWallet.ts**: Solana blockchain implementation
  - Account creation with keypairs
  - Secret key and mnemonic import
  - Balance checking in lamports
  - SOL transfer transactions
  - Account derivation support

- **WalletManager.ts**: Multi-chain wallet management
  - Unified interface for all chains
  - Account management across chains
  - Balance and transaction queries
  - Account storage and retrieval

- **examples.ts**: Practical usage examples
  - Creating wallets for all chains
  - Importing accounts
  - Balance queries
  - Transaction examples

- **index.ts**: Main entry point
  - Exports all public APIs
  - Users import from 'web3ly'

### Configuration Files

- **package.json**: npm project configuration
  - Dependencies: ethers, bitcoinjs-lib, @solana/web3.js, bip39, tweetnacl
  - Scripts: build, dev, test, lint
  - Entry point: dist/index.js

- **tsconfig.json**: TypeScript compiler options
  - Target: ES2020
  - Module: CommonJS
  - Strict mode enabled
  - Output to dist/ directory

- **jest.config.js**: Jest testing framework configuration
  - Uses ts-jest preset for TypeScript
  - Test environment: node
  - Test file patterns

- **.eslintrc.json**: Code linting rules
  - TypeScript parser
  - ESLint recommended rules
  - Custom rules for code quality

### Documentation & Configuration

- **.gitignore**: Files to exclude from version control
  - node_modules, dist, .env
  - IDE and build artifacts

- **.env.example**: Example environment variables
  - RPC URLs for each chain
  - Private key placeholders
  - Network configurations

- **LICENSE**: MIT License
  - Permissive open source license

- **README.md**: Comprehensive project documentation
  - Installation instructions
  - Quick start guides
  - API reference
  - Security best practices
  - Contributing guidelines

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Run examples**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Lint code**
   ```bash
   npm run lint
   ```

## Development Workflow

1. Make changes to files in `src/`
2. TypeScript is automatically checked
3. Run `npm run build` to compile
4. Run `npm test` to verify changes
5. Run `npm run lint` to check code quality

## Output Structure

After building, the `dist/` directory contains:

```
dist/
├── index.js
├── index.d.ts
├── types.js
├── types.d.ts
├── BaseWallet.js
├── BaseWallet.d.ts
├── EthereumWallet.js
├── EthereumWallet.d.ts
├── BitcoinWallet.js
├── BitcoinWallet.d.ts
├── SolanaWallet.js
├── SolanaWallet.d.ts
├── WalletManager.js
├── WalletManager.d.ts
└── examples.js
```

## Adding New Features

### Adding a New Blockchain

1. Create a new wallet class extending `BaseWallet`
   ```typescript
   export class PolygonWallet extends BaseWallet {
     // Implement required methods
   }
   ```

2. Add the chain type to `ChainType` enum in types.ts

3. Update `WalletManager` to support the new chain

4. Add tests in `tests/`

5. Update documentation in README.md

## Best Practices

- Always validate user inputs (addresses, amounts)
- Use TypeScript's type system for safety
- Handle errors gracefully
- Never log sensitive information
- Keep private keys secure
- Test thoroughly before production use
- Follow the existing code style
