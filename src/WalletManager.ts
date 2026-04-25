import { EthereumWallet } from './EthereumWallet';
import { BitcoinWallet } from './BitcoinWallet';
import { SolanaWallet } from './SolanaWallet';
import { WalletAccount, Balance, Transaction, TransactionResult, ChainType } from './types';

/**
 * Unified wallet manager for managing multiple chain wallets
 */
export class WalletManager {
  private ethereumWallet: EthereumWallet;
  private bitcoinWallet: BitcoinWallet;
  private solanaWallet: SolanaWallet;
  private accounts: Map<string, WalletAccount> = new Map();

  constructor(
    ethereumRpcUrl?: string,
    bitcoinNetwork?: 'mainnet' | 'testnet',
    solanaRpcUrl?: string
  ) {
    this.ethereumWallet = new EthereumWallet(ethereumRpcUrl);
    this.bitcoinWallet = new BitcoinWallet(bitcoinNetwork);
    this.solanaWallet = new SolanaWallet(solanaRpcUrl);
  }

  /**
   * Create new accounts across all chains
   */
  async createMultiChainAccount(): Promise<{ ethereum: WalletAccount; bitcoin: WalletAccount; solana: WalletAccount }> {
    const ethAccount = await this.ethereumWallet.createAccount();
    const btcAccount = await this.bitcoinWallet.createAccount();
    const solAccount = await this.solanaWallet.createAccount();

    // Store accounts
    this.accounts.set(`ethereum-${ethAccount.address}`, ethAccount);
    this.accounts.set(`bitcoin-${btcAccount.address}`, btcAccount);
    this.accounts.set(`solana-${solAccount.address}`, solAccount);

    return {
      ethereum: ethAccount,
      bitcoin: btcAccount,
      solana: solAccount,
    };
  }

  /**
   * Import account for a specific chain
   */
  async importAccount(chain: ChainType, privateKeyOrMnemonic: string): Promise<WalletAccount> {
    let account: WalletAccount;

    switch (chain) {
      case ChainType.ETHEREUM:
        account = await this.ethereumWallet.importAccount(privateKeyOrMnemonic);
        break;
      case ChainType.BITCOIN:
        account = await this.bitcoinWallet.importAccount(privateKeyOrMnemonic);
        break;
      case ChainType.SOLANA:
        account = await this.solanaWallet.importAccount(privateKeyOrMnemonic);
        break;
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }

    this.accounts.set(`${chain}-${account.address}`, account);
    return account;
  }

  /**
   * Get balance for an address on a specific chain
   */
  async getBalance(chain: ChainType, address: string): Promise<Balance> {
    switch (chain) {
      case ChainType.ETHEREUM:
        return await this.ethereumWallet.getBalance(address);
      case ChainType.BITCOIN:
        return await this.bitcoinWallet.getBalance(address);
      case ChainType.SOLANA:
        return await this.solanaWallet.getBalance(address);
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }
  }

  /**
   * Send transaction on a specific chain
   */
  async sendTransaction(
    chain: ChainType,
    from: string,
    to: string,
    amount: string,
    privateKey: string
  ): Promise<TransactionResult> {
    switch (chain) {
      case ChainType.ETHEREUM:
        return await this.ethereumWallet.sendTransaction(from, to, amount, privateKey);
      case ChainType.BITCOIN:
        return await this.bitcoinWallet.sendTransaction(from, to, amount, privateKey);
      case ChainType.SOLANA:
        return await this.solanaWallet.sendTransaction(from, to, amount, privateKey);
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }
  }

  /**
   * Get transaction status on a specific chain
   */
  async getTransactionStatus(chain: ChainType, txHash: string): Promise<Transaction> {
    switch (chain) {
      case ChainType.ETHEREUM:
        return await this.ethereumWallet.getTransactionStatus(txHash);
      case ChainType.BITCOIN:
        return await this.bitcoinWallet.getTransactionStatus(txHash);
      case ChainType.SOLANA:
        return await this.solanaWallet.getTransactionStatus(txHash);
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }
  }

  /**
   * Get all stored accounts
   */
  getAllAccounts(): WalletAccount[] {
    return Array.from(this.accounts.values());
  }

  /**
   * Get account by address
   */
  getAccount(chain: ChainType, address: string): WalletAccount | undefined {
    return this.accounts.get(`${chain}-${address}`);
  }
}
