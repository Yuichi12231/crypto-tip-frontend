import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, base, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { metaMask, walletConnect, coinbaseWallet } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet, base, polygon],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
  },
  connectors: [
    metaMask(),
    walletConnect({ projectId: "demo" }), // replace with your real WalletConnect Project ID
    coinbaseWallet({ appName: "MagicWalletAuth" }),
  ],
  ssr: true,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
