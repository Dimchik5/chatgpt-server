const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Настройка API-ключа через переменную окружения
require('dotenv').config();
const HF_API_KEY = process.env.HF_API_KEY;

// Обработка POST-запросов к /api/chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Поле 'message' отсутствует" });
    }

    let reply;

    if (mode === "translate") {
      // Режим перевода (используем Helsinki-NLP/opus-mt-ru-en)
      const translationResponse = await axios.post(
        "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-ru-en",
        {
          inputs: message,
        },
        {
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Проверяем формат ответа
      if (translationResponse.data && translationResponse.data[0] && translationResponse.data[0].translation_text) {
        reply = translationResponse.data[0].translation_text;
      } else {
        reply = "Не удалось получить перевод.";
      }
    } else {
      // Режим ChatGPT (используем facebook/bart-large)
      const chatResponse = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large", // Используем facebook/bart-large
        {
          inputs: message, // Убираем "Ответь на вопрос:", чтобы модель сама определяла контекст
        },
        {
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Проверяем формат ответа
      if (chatResponse.data && chatResponse.data[0] && chatResponse.data[0].generated_text) {
        reply = chatResponse.data[0].generated_text;
      } else {
        reply = "Не удалось получить ответ.";
      }
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Произошла ошибка" });
  }
});

// Экспорт приложения для Vercel module.exports = app;

// Экспорт приложения для локального запуска
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;