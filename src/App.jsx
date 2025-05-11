import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const magic = new Magic('pk_live_CBB4E24015C02A64', {
  extensions: [new OAuthExtension()],
});

const CONTRACT_ADDRESS = "0x961d3F83FC8Da943071EA329D628249cA25F5B05";
const ABI = [
  "function register(string handle)",
  "function sendTip(address to) payable",
  "function getMyHandle() view returns (string)",
  "function getReceivedTips(address user) view returns (uint256)",
  "function users(address) view returns (string twitterHandle, bool registered)"
];

function App() {
  const [wallet, setWallet] = useState(null);
  const [handle, setHandle] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Установите MetaMask");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);
  };

  const loginWithTwitter = async () => {
    try {
      const result = await magic.oauth.loginWithPopup({ provider: 'twitter' });
      const twitterHandle = result.oauth.userInfo.raw.user.screen_name;
      setHandle(twitterHandle);
    } catch (err) {
      console.error("Ошибка авторизации:", err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Crypto Tip Jar</h2>
      <button onClick={connectWallet}>🔌 Подключить кошелёк</button>
      <p>Кошелёк: {wallet}</p>
      <button onClick={loginWithTwitter}>🔐 Войти через Twitter</button>
      <p>Twitter: @{handle}</p>
    </div>
  );
}

export default App;
