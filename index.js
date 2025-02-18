// Подключаем библиотеку dotenv для работы с переменными окружения (только для локальной разработки)
require('dotenv').config();

// Импортируем необходимые модули
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

// Создаём экземпляр Express
const app = express();
app.use(cors());
app.use(express.json());

// Настройка API-ключа через переменную окружения
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // <- Здесь используется переменная окружения
});

const openai = new OpenAIApi(configuration);

// Эндпоинт для отправки запросов к ChatGPT
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }, { role: "assistant", content: "" }],
    });
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Произошла ошибка" });
  }
});

// Запускаем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});