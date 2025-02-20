const axios = require("axios");

// Подключаем dotenv для работы с переменными окружения
require('dotenv').config();
const HF_API_KEY = process.env.HF_API_KEY;

module.exports = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Поле 'message' отсутствует" });
    }

    // Отправляем запрос к API Hugging Face
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
};

// Локальный запуск (только для тестирования)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}