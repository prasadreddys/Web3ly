import { Keypair, PublicKey, Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import * as bip39 from 'bip39';
import nacl from 'tweetnacl';
import { BaseWallet } from './BaseWallet';
import { WalletAccount, Balance, Transaction as TxType, TransactionResult, ChainType } from './types';

/**
 * Solana wallet implementation
 */
export class SolanaWallet extends BaseWallet {
  private connection: Connection;

  constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
    super();
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  /**
   * Create a new Solana account with a random mnemonic
   */
  async createAccount(): Promise<WalletAccount> {
    const mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Create keypair from seed
    const keypair = Keypair.fromSeed(seed.slice(0, 32));

    return {
      address: keypair.publicKey.toString(),
      publicKey: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('base64'),
      chain: ChainType.SOLANA,
    };
  }

  /**
   * Import a Solana account from base64 secret key or mnemonic
   */
  async importAccount(secretKeyOrMnemonic: string): Promise<WalletAccount> {
    let keypair: Keypair;

    try {
      // Try as base64 secret key
      const secretKey = Buffer.from(secretKeyOrMnemonic, 'base64');
      keypair = Keypair.fromSecretKey(secretKey);
    } catch {
      // Try as mnemonic
      try {
        if (!bip39.validateMnemonic(secretKeyOrMnemonic)) {
          throw new Error('Invalid mnemonic');
        }

        const seed = await bip39.mnemonicToSeed(secretKeyOrMnemonic);
        keypair = Keypair.fromSeed(seed.slice(0, 32));
      } catch (error) {
        throw new Error(`Invalid secret key or mnemonic: ${error}`);
      }
    }

    return {
      address: keypair.publicKey.toString(),
      publicKey: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('base64'),
      chain: ChainType.SOLANA,
    };
  }

  /**
   * Get balance of a Solana address (in SOL)
   */
  async getBalance(address: string): Promise<Balance> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;

      return {
        address,
        balance: balanceInSol.toString(),
        symbol: 'SOL',
        decimals: 9,
        chain: ChainType.SOLANA,
      };
    } catch (error) {
      throw new Error(`Failed to get balance: ${error}`);
    }
  }

  /**
   * Send SOL transaction
   */
  async sendTransaction(from: string, to: string, amount: string, privateKey: string): Promise<TransactionResult> {
    try {
      const secretKey = Buffer.from(privateKey, 'base64');
      const fromKeypair = Keypair.fromSecretKey(secretKey);
      const toPublicKey = new PublicKey(to);

      // Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL),
      });

      // Create transaction
      const transaction = new Transaction().add(instruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromKeypair.publicKey;

      // Sign and send transaction
      const signature = await sendAndConfirmTransaction(this.connection, transaction, [fromKeypair]);

      return {
        success: true,
        txHash: signature,
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
  async getTransactionStatus(txHash: string): Promise<TxType> {
    try {
      const transaction = await this.connection.getTransaction(txHash);

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return {
        hash: txHash,
        from: transaction.transaction.message.accountKeys[0].toString(),
        to: transaction.transaction.message.accountKeys[1]?.toString() || 'unknown',
        amount: 'unknown',
        status: transaction.blockTime ? 'confirmed' : 'pending',
        chain: ChainType.SOLANA,
        timestamp: transaction.blockTime,
      };
    } catch (error) {
      throw new Error(`Failed to get transaction status: ${error}`);
    }
  }

  /**
   * Derive child account from mnemonic (Solana does not use standard BIP44)
   */
  async deriveAccount(mnemonic: string, index: number = 0): Promise<WalletAccount> {
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Solana uses the first 32 bytes of the seed
    // For multiple accounts, you would typically use a derivation library
    // This is a simplified version
    const keypair = Keypair.fromSeed(seed.slice(index * 32, (index + 1) * 32).slice(0, 32));

    return {
      address: keypair.publicKey.toString(),
      publicKey: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('base64'),
      chain: ChainType.SOLANA,
    };
  }
}
