const { Configuration, OpenAIApi } = require("openai");

// ��������� API-����� ����� ���������� ���������
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// ������� ������� ��� Vercel
module.exports = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "���� 'message' �����������" });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }, { role: "assistant", content: "" }],
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "��������� ������" });
  }
};
