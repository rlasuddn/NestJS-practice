require('dotenv').config({ path: '../.env' });

const { Configuration, OpenAIApi } = require('openai');

const wordCommand =
  'It tells you random 5 English words with Korean meanings. Tell me all the meanings in Korean.';
const phoneSentence =
  'It gives random 5 sentences used in phone calls and Korean meanings. First, English sentences, then Korean meanings.';
const lifeSentence =
  'It gives random 5 sentences used in life and Korean meanings. First, English sentences, then Korean meanings.';

const startGpt = async (prompt) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: prompt },
      // { role: "system", content: "you are a korean teacher" },
    ],
    temperature: 0,
  });
  console.log(response);
  console.log(response.data.choices[0].message.content);
};

startGpt(wordCommand);
