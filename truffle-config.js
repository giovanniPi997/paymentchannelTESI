/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('truffle-hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
var privateKeys=[
  "3E407F89ED1A35D05BD91FCE64408A2920F4A378B4D363539C989631EDD9E9F9",
  "694BF3FC75043CDEE5DF03B6CDDE0EA4F53DEF916126C6B8446170541A701C87",
  "0ECC0805A13A0ACFDB1CA66F1A2E20AA5E0623C5F550A7C13BF22416B4B66D42"
 ];
// const mnemonic = fs.readFileSync(".secret").toString().trim();
var HDWalletProvider = require("truffle-hdwallet-provider");
var MNENOMIC ="audit choose abuse noise plate book aim bargain flash swear electric time neither small bright";
module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", 
      gas: 4500000,   
     gasPrice : 5000000000, 
        },
   
   
    
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },

    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
     ropsten: {
     provider: () => new HDWalletProvider(privateKeys, "https://ropsten.infura.io/v3/0076f4627b9643ad963f1cb0aaf5a623",0,3),//6b2231813d30464ba7b7f62384dbd5a8
     network_id: 3,
     from:"0x63bE0896612465A759dF929C42670055D7F9E3B2",
     //0x0df64dD4744bc4436bD5c656815531E7149CFf46
     //"0x574E8c0925858Ae829d816f6d0A062e7CEfC7aF2",
     //0x00Aff0F1B13F88e0212E8bF90676edA4f9652827
     gas: 6000000,   
     gasPrice : 1000000000,     // Ropsten has a lower block limit than mainnet
       // Ropsten's id
         // Skip dry run before migrations? (default: false for public nets )
     },

    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}