import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      }
    });
    return;
  }

  const GPT35TurboMessage = [
    { role: "system", content: `You are an encyclopedia.` },
    {
      role: "user",
      content: prompt,
    }
  ];

  try {
    //const completion = await openai.createChatCompletion({
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      //model: "gpt-3.5-turbo",
      prompt: prompt,
      //prompt: generatePrompt(prompt),
//      n: 1,
//      stop: "\n",
      temperature: 0.7,
      max_tokens: 2000,
/*      messages: [
        {
          role: "user",
          content: prompt,
        }
      ] */
    });
    res.status(200).json({ 
      result: completion.data.choices[0].text 
      //result: completion.data.choices[0].message.content;
    });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(prompt) {
  const capitalizedPrompt =
    prompt[0].toUpperCase() + prompt.slice(1).toLowerCase();
  return `Suggest three names for a prompt that is a superhero.

prompt: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
prompt: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
prompt: ${capitalizedPrompt}
Names:`;
}
