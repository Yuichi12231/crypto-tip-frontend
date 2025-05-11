window.addEventListener("load", () => {
  const CONTRACT_ADDRESS = "0x961d3F83FC8Da943071EA329D628249cA25F5B05";
  const ABI = [
    "function register(string handle)",
    "function sendTip(address to) payable",
    "function getMyHandle() view returns (string)",
    "function getReceivedTips(address user) view returns (uint256)",
    "function users(address) view returns (string twitterHandle, bool registered)"
  ];

  let signer;
  let provider;

  // ✅ Ключевой момент — Magic.default
  const magic = new window.Magic.default("pk_live_CBB4E24015C02A64", {
    oauthOptions: { providers: ["twitter"] }
  });

  document.getElementById("connect").onclick = async () => {
    if (!window.ethereum) {
      alert("Установи MetaMask");
      return;
    }

    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();

      const network = await provider.getNetwork();
      if (network.chainId !== 84532) {
        alert("⛔ Пожалуйста, переключитесь на сеть Base Sepolia в MetaMask");
        return;
      }

      const address = await signer.getAddress();
      document.getElementById("wallet").innerText = "Кошелёк: " + address;
    } catch (err) {
      console.error("Ошибка подключения:", err);
      alert("❌ Не удалось подключиться к MetaMask");
    }
  };

  document.getElementById("login").onclick = async () => {
    try {
      const result = await magic.oauth.loginWithPopup({ provider: "twitter" });

      console.log("Twitter login result:", result);

      const twitterHandle = result.oauth.userInfo.raw.user.screen_name;
      document.getElementById("handle").innerText = "Twitter: @" + twitterHandle;

      if (!signer) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.register("@" + twitterHandle);
      await tx.wait();

      alert("✅ Зарегистрировано как @" + twitterHandle);
    } catch (err) {
      console.error("Twitter login failed:", err);
      alert("❌ Ошибка авторизации через Twitter: " + (err?.message || "Неизвестно"));
    }
  };

  document.getElementById("tip").onclick = async () => {
    const recipient = document.getElementById("recipient").value.trim();
    const amount = document.getElementById("amount").value.trim();

    if (!signer) {
      alert("Сначала подключи кошелёк");
      return;
    }

    if (!ethers.utils.isAddress(recipient)) {
      alert("Некорректный адрес получателя");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Введите корректную сумму в ETH");
      return;
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const user = await contract.users(recipient);

      if (!user.registered) {
        alert("⛔ Получатель не зарегистрирован в системе Tip Jar");
        return;
      }

      const tx = await contract.sendTip(recipient, {
        value: ethers.utils.parseEther(amount)
      });

      alert("💸 Чаевые отправлены!\nTX: " + tx.hash);
    } catch (err) {
      console.error("Ошибка отправки чаевых:", err);
      alert("❌ Ошибка транзакции: " + (err?.message || "Неизвестно"));
    }
  };
});
