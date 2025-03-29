import config from "./config.js";

console.log("=== COIN FLIP EXTENSION STARTED ===");

document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup загружен");

  const coin = document.getElementById("coin");
  const button = document.getElementById("flip_button");
  const result = document.getElementById("result");

  const base64ToBytes = (base64) =>
    Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));

  const fetchRandomByte = async () => {
    try {
      console.log("Отправка запроса к Qrypt API");
      const response = await fetch(config.QRYPT_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.QRYPT_API_TOKEN}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Сырой ответ от API:", data);
      return base64ToBytes(data.random[0])[0];
    } catch (error) {
      console.error("Ошибка при запросе к API:", error);
      return null;
    }
  };

  const animateCoinFlip = (isHeads) => {
    setTimeout(() => {
      console.log("Завершение анимации");
      coin.classList.remove("flipping");
      result.textContent = isHeads ? "Орёл!" : "Решка!";
      coin.style.transform = `rotateY(${isHeads ? 0 : 180}deg)`;
      button.disabled = false;
    }, 3000);
  };

  const flipCoin = async () => {
    console.log("Начало подбрасывания монетки");
    button.disabled = true;
    result.textContent = "Подбрасываем...";
    coin.classList.add("flipping");

    const randomByte = await fetchRandomByte();
    if (randomByte === null) {
      result.textContent = "Произошла ошибка :(";
      coin.classList.remove("flipping");
      button.disabled = false;
      return;
    }

    console.log("Используемый байт:", randomByte);
    const isHeads = randomByte % 2 === 0;
    console.log("Результат (isHeads):", isHeads);

    animateCoinFlip(isHeads);
  };

  button.addEventListener("click", flipCoin);
  console.log("Обработчик клика добавлен");

  document.getElementById('extension-id').textContent = chrome.runtime.id;
});
