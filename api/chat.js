const axios = require("axios");

// Настройка API-ключа через переменную окружения
const HF_API_KEY = process.env.HF_API_KEY;

module.exports = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Поле 'message' отсутствует" });
    }

    // Отправка запроса к Hugging Face API
    const response = await axios.post("https://api-inference.huggingface.co/models/gpt2", {
      inputs: message,
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