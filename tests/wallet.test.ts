import { EthereumWallet, BitcoinWallet, SolanaWallet, WalletManager, ChainType } from '../src/index';

describe('EthereumWallet', () => {
  let wallet: EthereumWallet;

  beforeEach(() => {
    wallet = new EthereumWallet();
  });

  test('should create a new account', async () => {
    const account = await wallet.createAccount();

    expect(account.address).toBeDefined();
    expect(account.publicKey).toBeDefined();
    expect(account.privateKey).toBeDefined();
    expect(account.chain).toBe(ChainType.ETHEREUM);
  });

  test('should import account from valid private key', async () => {
    const testPrivateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';

    const account = await wallet.importAccount(testPrivateKey);

    expect(account.address).toBeDefined();
    expect(account.chain).toBe(ChainType.ETHEREUM);
  });

  test('should throw error for invalid private key', async () => {
    expect(async () => {
      await wallet.importAccount('invalid_key');
    }).rejects.toThrow();
  });

  test('should validate Ethereum address format', () => {
    const validAddress = '0x742d35Cc6634C0532925a3b844Bc777e92c46f0d';
    // This is a simple format validation
    expect(validAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });
});

describe('BitcoinWallet', () => {
  let wallet: BitcoinWallet;

  beforeEach(() => {
    wallet = new BitcoinWallet('testnet');
  });

  test('should create a new account on testnet', async () => {
    const account = await wallet.createAccount();

    expect(account.address).toBeDefined();
    expect(account.publicKey).toBeDefined();
    expect(account.privateKey).toBeDefined();
    expect(account.chain).toBe(ChainType.BITCOIN);
  });

  test('should import account from mnemonic', async () => {
    const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

    const account = await wallet.importAccount(testMnemonic);

    expect(account.address).toBeDefined();
    expect(account.chain).toBe(ChainType.BITCOIN);
  });
});

describe('SolanaWallet', () => {
  let wallet: SolanaWallet;

  beforeEach(() => {
    wallet = new SolanaWallet();
  });

  test('should create a new account', async () => {
    const account = await wallet.createAccount();

    expect(account.address).toBeDefined();
    expect(account.publicKey).toBeDefined();
    expect(account.privateKey).toBeDefined();
    expect(account.chain).toBe(ChainType.SOLANA);
  });

  test('should import account from valid secret key', async () => {
    const account1 = await wallet.createAccount();
    const account2 = await wallet.importAccount(account1.privateKey!);

    expect(account2.address).toBe(account1.address);
  });
});

describe('WalletManager', () => {
  let manager: WalletManager;

  beforeEach(() => {
    manager = new WalletManager();
  });

  test('should create multi-chain accounts', async () => {
    const accounts = await manager.createMultiChainAccount();

    expect(accounts.ethereum).toBeDefined();
    expect(accounts.bitcoin).toBeDefined();
    expect(accounts.solana).toBeDefined();

    expect(accounts.ethereum.chain).toBe(ChainType.ETHEREUM);
    expect(accounts.bitcoin.chain).toBe(ChainType.BITCOIN);
    expect(accounts.solana.chain).toBe(ChainType.SOLANA);
  });

  test('should import account for specific chain', async () => {
    const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

    const account = await manager.importAccount(ChainType.ETHEREUM, testMnemonic);

    expect(account.chain).toBe(ChainType.ETHEREUM);
  });

  test('should retrieve all accounts', async () => {
    await manager.createMultiChainAccount();
    const accounts = manager.getAllAccounts();

    expect(accounts.length).toBeGreaterThan(0);
  });

  test('should throw error for unsupported chain', async () => {
    expect(async () => {
      await manager.importAccount('unsupported' as ChainType, 'test');
    }).rejects.toThrow();
  });
});
