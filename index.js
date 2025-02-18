const axios = require("axios");

const apiKey = "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"; // Замените на ваш ключ

axios.get("https://api.openai.com/v1/models", {
  headers: {
    "Authorization": `Bearer ${apiKey}`,
  },
})
.then((response) => {
  console.log(response.data);
})
.catch((error) => {
  console.error("Ошибка:", error.response ? error.response.data : error.message);
});