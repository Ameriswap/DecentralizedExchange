import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Coinbase", // Required
      infuraId: "529670718fd74cd2a041466303daecd7" // Required unless you provide a JSON RPC url; see `rpc` below
    }
  },
  // walletconnect: {
  //   package: WalletConnect, // required
  //   options: {
  //     infuraId: "529670718fd74cd2a041466303daecd7" // required
  //   }
  // }
};
