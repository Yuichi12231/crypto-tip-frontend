import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, base, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";

const { chains, publicClient } = configureChains(
  [mainnet, base, polygon],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({ chains, options: { appName: "MagicAuth" } }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "demo",
        showQrModal: true,
      },
    }),
    new InjectedConnector({ chains, options: { name: "Injected" } }),
  ],
  publicClient,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiConfig config={config}>
    <App />
  </WagmiConfig>
);