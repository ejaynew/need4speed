// @ts-nocheck

// setup reading env vars
import * as dotenv from "dotenv";
dotenv.config();

const form = document.getElementById("chat-form");
const input = document.getElementById("user-message");
const output = document.getElementById("chat-output");
const API_KEY = process.env.API_KEY;

form.addEventListener("submit", async (event) => {
  console.log(input.value);
  event.preventDefault();
  const prompt = input.value;

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: "Hey there.",
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    }),
  });

  console.log(response.status);
  // const data = await response.json();
  const message = await response.json();
  console.log(message);
  // const message = response.json().choices[0].text;

  output.innerHTML += `<p>${prompt}</p><p>${message}</p>`;
  input.value = "";
  output.innerHTML += `<p>User: ${prompt}</p><p>Chat: ${response}</p>`;
});
