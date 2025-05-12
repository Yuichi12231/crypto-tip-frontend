import React, { useEffect, useState } from "react";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const magic = new Magic(import.meta.env.VITE_MAGIC_PUBLISHABLE_KEY, {
  extensions: [new OAuthExtension()],
});

function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new MetaMaskConnector() });
  const { disconnect } = useDisconnect();

  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    await magic.oauth.loginWithPopup({ provider: "twitter" });
    const metadata = await magic.user.getMetadata();
    setUser(metadata);
  };

  const handleLogout = async () => {
    await magic.user.logout();
    setUser(null);
    disconnect();
  };

  return (
    <div style={{ padding: "2rem" }}>
      {!user ? (
        <button onClick={handleLogin}>Войти через Twitter</button>
      ) : !isConnected ? (
        <button onClick={connect}>Подключить кошелёк</button>
      ) : (
        <div>
          <p>Twitter: {user.email || user.issuer}</p>
          <p>Кошелек: {address}</p>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      )}
    </div>
  );
}

export default App;