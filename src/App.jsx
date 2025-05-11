import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Magic } from 'magic-sdk';
import { oauthExtension } from '@magic-ext/oauth';

const magic = new Magic('pk_live_CBB4E24015C02A64', {
  extensions: [oauthExtension()]
});

function App() {
  const [wallet, setWallet] = useState('');
  const [handle, setHandle] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Установи MetaMask');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);
  };

  const loginWithTwitter = async () => {
    try {
      const result = await magic.oauth.loginWithPopup({ provider: 'twitter' });
      const userInfo = result.oauth.userInfo;
      setHandle(userInfo.raw.user.screen_name);
    } catch (err) {
      console.error('Ошибка авторизации:', err);
      alert('❌ Ошибка авторизации через Twitter');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Crypto Tip Jar</h2>
      <button onClick={connectWallet}>🔌 Подключить MetaMask</button>
      <p>Кошелёк: {wallet}</p>

      <button onClick={loginWithTwitter}>🔐 Войти через Twitter</button>
      <p>Twitter: @{handle}</p>
    </div>
  );
}

export default App;