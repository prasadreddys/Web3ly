import { WalletAccount, Balance, Transaction, TransactionResult, ChainType } from './types';

/**
 * Base wallet interface
 */
export abstract class BaseWallet {
  abstract createAccount(): Promise<WalletAccount>;
  abstract importAccount(privateKeyOrMnemonic: string): Promise<WalletAccount>;
  abstract getBalance(address: string): Promise<Balance>;
  abstract sendTransaction(from: string, to: string, amount: string, privateKey: string): Promise<TransactionResult>;
  abstract getTransactionStatus(txHash: string): Promise<Transaction>;
}
