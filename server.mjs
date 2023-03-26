import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ChatGPTAPI } from 'chatgpt';
import { oraPromise } from 'ora';
import config from './config.js';
dotenv.config();

const app = express().use(cors()).use(bodyParser.json());

const gptApi = new ChatGPTAPI({
    apiKey: process.env.API_KEY,
});

const Config = configure(config);

class Conversation {
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
                req.body.parentMessageId
            ),
            {
                text: req.body.message,
                parentMessageId: req.body.parentMessageId,
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
        new Promise((resolve) => app.listen(3000, () => resolve())),
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
    const train = () => {
        if (!rules.length) return;

        const message = `
      Please follow these rules when replying to me:
      ${rules.map((rule) => `\n- ${rule}`)}
    `;
        return conversation.sendMessage(message);
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
