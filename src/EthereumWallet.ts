import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import { BaseWallet } from './BaseWallet';
import { WalletAccount, Balance, Transaction, TransactionResult, ChainType } from './types';

/**
 * Ethereum wallet implementation
 * Supports Ethereum and EVM-compatible chains
 */
export class EthereumWallet extends BaseWallet {
  private provider: ethers.JsonRpcProvider;
  private chainId: string;

  constructor(rpcUrl: string = 'https://eth.llamarpc.com', chainId: string = 'mainnet') {
    super();
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.chainId = chainId;
  }

  /**
   * Create a new Ethereum account with a random mnemonic
   */
  async createAccount(): Promise<WalletAccount> {
    const mnemonic = bip39.generateMnemonic();
    const wallet = ethers.Wallet.fromPhrase(mnemonic);

    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      chain: ChainType.ETHEREUM,
    };
  }

  /**
   * Import an Ethereum account from private key or mnemonic
   */
  async importAccount(privateKeyOrMnemonic: string): Promise<WalletAccount> {
    let wallet: ethers.Wallet;

    try {
      // Try as private key first
      wallet = new ethers.Wallet(privateKeyOrMnemonic);
    } catch {
      // Try as mnemonic
      try {
        wallet = ethers.Wallet.fromPhrase(privateKeyOrMnemonic);
      } catch (error) {
        throw new Error('Invalid private key or mnemonic');
      }
    }

    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      chain: ChainType.ETHEREUM,
    };
  }

  /**
   * Get balance of an Ethereum address (in ETH)
   */
  async getBalance(address: string): Promise<Balance> {
    try {
      const balance = await this.provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);

      return {
        address,
        balance: balanceInEth,
        symbol: 'ETH',
        decimals: 18,
        chain: ChainType.ETHEREUM,
      };
    } catch (error) {
      throw new Error(`Failed to get balance: ${error}`);
    }
  }

  /**
   * Send ETH transaction
   */
  async sendTransaction(from: string, to: string, amount: string, privateKey: string): Promise<TransactionResult> {
    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);

      // Validate addresses
      if (!ethers.isAddress(to)) {
        return { success: false, error: 'Invalid recipient address' };
      }

      // Create transaction
      const tx = await wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      // Wait for confirmation
      await tx.wait();

      return {
        success: true,
        txHash: tx.hash,
      };
    } catch (error) {
      return {
        success: false,
        error: `Transaction failed: ${error}`,
      };
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(txHash: string): Promise<Transaction> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);

      if (!receipt) {
        throw new Error('Transaction not found');
      }

      return {
        hash: receipt.hash,
        from: receipt.from,
        to: receipt.to || 'unknown',
        amount: ethers.formatEther(receipt.value),
        fee: ethers.formatEther(receipt.gasUsed * receipt.gasPrice),
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        chain: ChainType.ETHEREUM,
        timestamp: undefined,
      };
    } catch (error) {
      throw new Error(`Failed to get transaction status: ${error}`);
    }
  }

  /**
   * Derive child account from mnemonic (BIP44)
   */
  async deriveAccount(mnemonic: string, index: number = 0): Promise<WalletAccount> {
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
    const child = hdNode.derivePath(`m/44'/60'/0'/0/${index}`);

    return {
      address: child.address,
      publicKey: child.publicKey,
      privateKey: child.privateKey,
      chain: ChainType.ETHEREUM,
    };
  }
}
