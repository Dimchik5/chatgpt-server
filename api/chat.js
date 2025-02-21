const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Добавляем cors

const app = express();
app.use(express.json());
app.use(cors()); // Разрешаем запросы с любых доменов

// Настройка API-ключа через переменную окружения
require('dotenv').config();
const HF_API_KEY = process.env.HF_API_KEY;

// Обработка POST-запросов к /api/chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Поле 'message' отсутствует" });
    }

    const response = await axios.post("https://api-inference.huggingface.co/models/gpt2", {
      inputs: message,
      parameters: {
        max_new_tokens: 50, // Ограничить ответ до 50 токенов
      },
    }, {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
      },
    });

    res.json({ reply: response.data[0].generated_text });
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