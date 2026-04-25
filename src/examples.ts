import { WalletManager, ChainType, EthereumWallet, BitcoinWallet, SolanaWallet } from './index';

/**
 * Example usage of Web3ly wallet
 */
async function main() {
  console.log('=== Web3ly Wallet Examples ===\n');

  // Example 1: Create multi-chain wallet
  console.log('1. Creating multi-chain wallet...');
  const manager = new WalletManager();

  try {
    const accounts = await manager.createMultiChainAccount();
    console.log('\nMulti-chain accounts created:');
    console.log('\nEthereum Account:');
    console.log(`  Address: ${accounts.ethereum.address}`);
    console.log(`  Public Key: ${accounts.ethereum.publicKey}`);
    console.log(`  Private Key: ${accounts.ethereum.privateKey?.substring(0, 20)}...`);

    console.log('\nBitcoin Account:');
    console.log(`  Address: ${accounts.bitcoin.address}`);
    console.log(`  Public Key: ${accounts.bitcoin.publicKey?.substring(0, 20)}...`);

    console.log('\nSolana Account:');
    console.log(`  Address: ${accounts.solana.address}`);
    console.log(`  Public Key: ${accounts.solana.publicKey}`);
  } catch (error) {
    console.error('Error creating accounts:', error);
  }

  // Example 2: Ethereum wallet specific operations
  console.log('\n\n2. Ethereum Wallet Example');
  const ethWallet = new EthereumWallet();

  try {
    // Create account
    const ethAccount = await ethWallet.createAccount();
    console.log('Created Ethereum Account:');
    console.log(`  Address: ${ethAccount.address}`);
    console.log(`  Mnemonic stored securely`);

    // Get balance (using a test address)
    const balance = await ethWallet.getBalance('0x0000000000000000000000000000000000000000');
    console.log('\nBalance example:');
    console.log(`  ${balance.balance} ${balance.symbol}`);
  } catch (error) {
    console.error('Error with Ethereum wallet:', error);
  }

  // Example 3: Bitcoin wallet specific operations
  console.log('\n\n3. Bitcoin Wallet Example');
  const btcWallet = new BitcoinWallet('mainnet');

  try {
    // Create account
    const btcAccount = await btcWallet.createAccount();
    console.log('Created Bitcoin Account:');
    console.log(`  Address: ${btcAccount.address}`);
    console.log(`  Network: mainnet`);
  } catch (error) {
    console.error('Error with Bitcoin wallet:', error);
  }

  // Example 4: Solana wallet specific operations
  console.log('\n\n4. Solana Wallet Example');
  const solWallet = new SolanaWallet();

  try {
    // Create account
    const solAccount = await solWallet.createAccount();
    console.log('Created Solana Account:');
    console.log(`  Address: ${solAccount.address}`);
    console.log(`  Network: mainnet-beta`);
  } catch (error) {
    console.error('Error with Solana wallet:', error);
  }

  // Example 5: Importing accounts
  console.log('\n\n5. Importing Accounts');
  console.log('(Note: Using example keys - do not use in production!)');

  // Import from mnemonic
  const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

  try {
    const importedEth = await ethWallet.importAccount(testMnemonic);
    console.log('\nImported Ethereum account from mnemonic:');
    console.log(`  Address: ${importedEth.address}`);
  } catch (error) {
    console.error('Error importing:', error);
  }

  console.log('\n=== Examples Complete ===');
}

// Run examples
main().catch(console.error);
