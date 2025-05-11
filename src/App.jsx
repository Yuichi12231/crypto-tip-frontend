
import { useState } from 'react';
import { magic } from './magic';

function App() {
  const [address, setAddress] = useState('');
  const [handle, setHandle] = useState('');

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Установи MetaMask');

    const [addr] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAddress(addr);
  };

  const loginWithTwitter = async () => {
    try {
      await magic.oauth.loginWithPopup({ provider: 'twitter' });
      const userInfo = await magic.user.getInfo();
      setHandle(userInfo.oauth?.userInfo?.screen_name || 'Не найден');
    } catch (err) {
      console.error('Ошибка входа:', err);
      alert('❌ Ошибка авторизации через Twitter');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Crypto Tip Jar</h1>
      <button onClick={connectWallet}>🔌 Подключить кошелёк</button>
      <p>Кошелёк: {address}</p>

      <button onClick={loginWithTwitter}>🔐 Войти через Twitter</button>
      <p>Twitter: @{handle}</p>
    </div>
  );
}

export default App;
