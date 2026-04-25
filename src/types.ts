/**
 * Core types and interfaces for Web3 wallet
 */

export enum ChainType {
  ETHEREUM = 'ethereum',
  BITCOIN = 'bitcoin',
  SOLANA = 'solana',
}

export interface WalletAccount {
  address: string;
  publicKey: string;
  privateKey?: string; // Should be kept secret
  chain: ChainType;
}

export interface Balance {
  address: string;
  balance: string;
  symbol: string;
  decimals: number;
  chain: ChainType;
}

export interface Transaction {
  hash?: string;
  from: string;
  to: string;
  amount: string;
  fee?: string;
  status?: 'pending' | 'confirmed' | 'failed';
  chain: ChainType;
  timestamp?: number;
}

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface WalletConfig {
  mnemonic?: string;
  privateKey?: string;
  path?: string; // BIP44 derivation path
}
