import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const CONTRACT_ADDRESS = "0x961d3F83FC8Da943071EA329D628249cA25F5B05";
const ABI = [
  "function register(string handle)",
  "function sendTip(address to) payable",
  "function getMyHandle() view returns (string)",
  "function getReceivedTips(address user) view returns (uint256)",
  "function users(address) view returns (string twitterHandle, bool registered)"
];

const magic = new Magic('pk_live_CBB4E24015C02A64', {
  extensions: [new OAuthExtension()]
});

function App() {
  const [wallet, setWallet] = useState('');
  const [handle, setHandle] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  async function connectWallet() {
    if (!window.ethereum) return alert('Установи MetaMask');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);
  }

  async function loginWithTwitter() {
    await magic.oauth.loginWithPopup({ provider: 'twitter' });
    const result = await magic.oauth.getRedirectResult();
    const twitterHandle = result.oauth.userInfo.raw.user.screen_name;
    setHandle('@' + twitterHandle);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const tx = await contract.register("@" + twitterHandle);
    await tx.wait();
  }

  async function sendTip() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const user = await contract.users(recipient);
    if (!user.registered) return alert("⛔ Получатель не зарегистрирован");
    const tx = await contract.sendTip(recipient, {
      value: ethers.utils.parseEther(amount)
    });
    alert("💸 Чаевые отправлены! TX: " + tx.hash);
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Crypto Tip Jar</h2>
      <button onClick={connectWallet}>🔌 Подключить MetaMask</button>
      <p>Кошелёк: {wallet}</p>
      <button onClick={loginWithTwitter}>🔐 Войти через Twitter</button>
      <p>{handle}</p>
      <input placeholder="Адрес получателя" onChange={e => setRecipient(e.target.value)} />
      <input placeholder="Сумма в ETH" onChange={e => setAmount(e.target.value)} />
      <button onClick={sendTip}>💸 Оставить чаевые</button>
    </div>
  );
}

export default App;