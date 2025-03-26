import config from "./config.js";

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

// Обработчик сообщений от приложения
chrome.runtime.onMessageExternal.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log("🎲 1. Получен запрос на подбрасывание");

  if (request.action === "flip") {
    // Делаем два подбрасывания сразу
    Promise.all([fetchRandomByte(), fetchRandomByte()])
      .then(([byte1, byte2]) => {
        const results = {
          first: byte1 % 2 === 0,
          second: byte2 % 2 === 0
        };
        console.log(`🎲 2. Результаты подбрасывания: 
          1: ${results.first ? "Орёл" : "Решка"}
          2: ${results.second ? "Орёл" : "Решка"}`);
        sendResponse({ 
          success: true, 
          results: results 
        });
      })
      .catch((error) => {
        console.error("🎲 ❌ Ошибка при подбрасывании:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

console.log("=== COIN FLIP BACKGROUND SERVICE STARTED ===");
