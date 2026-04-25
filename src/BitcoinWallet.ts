import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { BaseWallet } from './BaseWallet';
import { WalletAccount, Balance, Transaction, TransactionResult, ChainType } from './types';

/**
 * Bitcoin wallet implementation
 */
export class BitcoinWallet extends BaseWallet {
  private network: bitcoin.Network;

  constructor(network: 'mainnet' | 'testnet' = 'mainnet') {
    super();
    this.network = network === 'mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
  }

  /**
   * Create a new Bitcoin account with a random mnemonic
   */
  async createAccount(): Promise<WalletAccount> {
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Create HD wallet root key
    const root = bip32.fromSeed(seed, this.network);

    // Derive first address (m/44'/0'/0'/0/0)
    const path = "m/44'/0'/0'/0/0";
    const child = root.derivePath(path);

    if (!child.publicKey) {
      throw new Error('Failed to derive public key');
    }

    const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: this.network });

    if (!address) {
      throw new Error('Failed to generate address');
    }

    return {
      address,
      publicKey: child.publicKey.toString('hex'),
      privateKey: child.toWIF(),
      chain: ChainType.BITCOIN,
    };
  }

  /**
   * Import a Bitcoin account from WIF or mnemonic
   */
  async importAccount(wifOrMnemonic: string): Promise<WalletAccount> {
    let privateKey: Buffer;
    let publicKey: Buffer;

    try {
      // Try as WIF first
      const keyPair = bitcoin.ECPair.fromWIF(wifOrMnemonic, this.network);
      if (!keyPair.publicKey) {
        throw new Error('Invalid key pair');
      }
      privateKey = keyPair.privateKey!;
      publicKey = keyPair.publicKey;
    } catch {
      // Try as mnemonic
      try {
        if (!bip39.validateMnemonic(wifOrMnemonic)) {
          throw new Error('Invalid mnemonic');
        }

        const seed = await bip39.mnemonicToSeed(wifOrMnemonic);
        const root = bip32.fromSeed(seed, this.network);
        const child = root.derivePath("m/44'/0'/0'/0/0");

        if (!child.publicKey || !child.privateKey) {
          throw new Error('Failed to derive keys');
        }

        privateKey = child.privateKey;
        publicKey = child.publicKey;
      } catch (error) {
        throw new Error(`Invalid WIF or mnemonic: ${error}`);
      }
    }

    const { address } = bitcoin.payments.p2pkh({ pubkey: publicKey, network: this.network });

    if (!address) {
      throw new Error('Failed to generate address');
    }

    const keyPair = bitcoin.ECPair.fromPrivateKey(privateKey, { network: this.network });

    return {
      address,
      publicKey: publicKey.toString('hex'),
      privateKey: keyPair.toWIF(),
      chain: ChainType.BITCOIN,
    };
  }

  /**
   * Get balance of a Bitcoin address (requires external API call)
   * Using BlockchairAPI as example
   */
  async getBalance(address: string): Promise<Balance> {
    try {
      const response = await fetch(`https://blockchair.com/bitcoin/dashboards/address/${address}`);
      const data: any = await response.json();

      if (data.data && data.data[address]) {
        const balance = data.data[address].address.balance / 1e8; // Convert from satoshis
        return {
          address,
          balance: balance.toString(),
          symbol: 'BTC',
          decimals: 8,
          chain: ChainType.BITCOIN,
        };
      }

      throw new Error('Address not found');
    } catch (error) {
      throw new Error(`Failed to get balance: ${error}`);
    }
  }

  /**
   * Send Bitcoin transaction (simplified - requires UTXO management)
   */
  async sendTransaction(from: string, to: string, amount: string, privateKey: string): Promise<TransactionResult> {
    try {
      const keyPair = bitcoin.ECPair.fromWIF(privateKey, this.network);

      // In production, you would:
      // 1. Fetch UTXOs for the address
      // 2. Select appropriate UTXOs
      // 3. Create and sign the transaction
      // 4. Broadcast to the network

      // This is a placeholder for demonstration
      console.log(`Transaction from ${from} to ${to} for ${amount} BTC`);

      return {
        success: true,
        txHash: 'placeholder_tx_hash',
      };
    } catch (error) {
      return {
        success: false,
        error: `Transaction failed: ${error}`,
      };
    }
  }

  /**
   * Get transaction status (placeholder)
   */
  async getTransactionStatus(txHash: string): Promise<Transaction> {
    try {
      const response = await fetch(`https://blockchair.com/bitcoin/transactions/${txHash}`);
      const data: any = await response.json();

      if (data.data && data.data[txHash]) {
        const tx = data.data[txHash];
        return {
          hash: tx.hash,
          from: 'input_addresses',
          to: 'output_addresses',
          amount: (tx.output_total / 1e8).toString(),
          chain: ChainType.BITCOIN,
          timestamp: tx.time,
        };
      }

      throw new Error('Transaction not found');
    } catch (error) {
      throw new Error(`Failed to get transaction status: ${error}`);
    }
  }

  /**
   * Derive child account from mnemonic (BIP44)
   */
  async deriveAccount(mnemonic: string, index: number = 0): Promise<WalletAccount> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed, this.network);
    const path = `m/44'/0'/0'/0/${index}`;
    const child = root.derivePath(path);

    if (!child.publicKey) {
      throw new Error('Failed to derive public key');
    }

    const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: this.network });

    if (!address) {
      throw new Error('Failed to generate address');
    }

    return {
      address,
      publicKey: child.publicKey.toString('hex'),
      privateKey: child.toWIF(),
      chain: ChainType.BITCOIN,
    };
  }
}
