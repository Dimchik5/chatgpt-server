const axios = require("axios");

module.exports = async (req, res) => {
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
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
      },
    });

    res.json({ reply: response.data[0].generated_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Произошла ошибка" });
  }
};