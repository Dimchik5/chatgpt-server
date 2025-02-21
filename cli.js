const readline = require("readline");
const axios = require("axios");

// Настройка API-ключа через переменную окружения
require('dotenv').config();
const HF_API_KEY = process.env.HF_API_KEY;

// Создание интерфейса для ввода/вывода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Функция для отправки сообщения на API
async function sendMessage(message, mode) {
  try {
    let url, responseKey, payload;

    if (mode === "translate") {
      // Режим перевода
      url = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-ru-en";
      responseKey = "translation_text";
      payload = {
        inputs: message,
      };
    } else {
      // Режим ChatGPT (ответы на вопросы)
      url = "https://api-inference.huggingface.co/models/facebook/bart-large";
      responseKey = "generated_text";
      payload = {
        inputs: `Ответь на вопрос: ${message}`,
      };
    }

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return response.data[0][responseKey];
  } catch (error) {
    console.error("Ошибка:", error.message);
    return "Не удалось получить ответ.";
  }
}

// Основной цикл
function startChat() {
  rl.question("Выберите режим (chat/translate): ", (mode) => {
    if (mode !== "chat" && mode !== "translate") {
      console.log("Неверный режим. Используйте 'chat' или 'translate'.");
      startChat();
      return;
    }

    console.log(`Режим: ${mode}. Введите 'exit' для выхода.`);

    function chatLoop() {
      rl.question("Вы: ", async (message) => {
        if (message.toLowerCase() === "exit") {
          rl.close();
          return;
        }

        const reply = await sendMessage(message, mode);
        console.log("GPT:", reply);

        // Повторный вызов для следующего сообщения
        chatLoop();
      });
    }

    chatLoop();
  });
}

console.log("Чат с GPT. Введите 'exit' для выхода.");
startChat();