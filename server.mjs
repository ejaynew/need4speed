import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import { ChatGPTAPI } from 'chatgpt';
import { oraPromise } from 'ora';
import config from './config.js';
dotenv.config();

const key = fs.readFileSync('./.cert/key.pem');
const cert = fs.readFileSync('./.cert/cert.pem');
const options = {
    key: key,
    cert: cert,
};

const app = express().use(cors()).use(bodyParser.json());
const server = https.createServer(options, app);
// gpt-3.5-turbo-0301
// https://platform.openai.com/docs/api-reference/chat/create
const gptApi = new ChatGPTAPI({
    apiKey: process.env.API_KEY,
    // completionParams: {
    //     temperature: 0.5,
    //     top_p: 0.8,
    // },
});

const Config = configure(config);

class Conversation {
    messageId = '';

    async sendMessage(msg, parentMessageId) {
        const res = await gptApi.sendMessage(
            msg,
            parentMessageId
                ? {
                      parentMessageId,
                  }
                : {}
        );

        if (res.response) {
            return res.response;
        }
        return res;
    }
}

const conversation = new Conversation();

app.post('/', async (req, res) => {
    try {
        const rawReply = await oraPromise(
            conversation.sendMessage(
                req.body.message,
                req.body.parentMessageId || conversation.messageId
            ),
            {
                text: req.body.message,
                parentMessageId:
                    req.body.parentMessageId || conversation.messageId,
            }
        );
        const reply = await Config.parse(rawReply.text);
        console.log(`----------\n${reply}\n----------`);
        res.json({ reply, id: rawReply.parentMessageId });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

async function start() {
    await oraPromise(Config.train(), {
        text: `Training ChatGPT (${Config.rules.length} plugin rules)`,
    });
    await oraPromise(
        new Promise((resolve) => server.listen(3000, () => resolve())),
        {
            text: `You may now use the extension`,
        }
    );
}

function configure({ plugins, ...opts }) {
    let rules = [];
    let parsers = [];

    // Collect rules and parsers from all plugins
    for (const plugin of plugins) {
        if (plugin.rules) {
            rules = rules.concat(plugin.rules);
        }
        if (plugin.parse) {
            parsers.push(plugin.parse);
        }
    }

    // Send ChatGPT a training message that includes all plugin rules
    const train = async () => {
        if (!rules.length) return;

        const message = `
      Please follow these rules when replying to me:
      ${rules.map((rule) => `\n- ${rule}`)}
    `;

        const result = await conversation.sendMessage(message);
        conversation.messageId = result.detail.id;
        console.log(result);
        return result;
    };

    // Run the ChatGPT response through all plugin parsers
    const parse = async (reply) => {
        for (const parser of parsers) {
            reply = await parser(reply);
        }
        return reply;
    };
    return { train, parse, rules, ...opts };
}

start();
