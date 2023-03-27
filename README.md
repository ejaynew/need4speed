# need4speed"

### setup steps

1. clone this repository
2. `npm i`
3. create a file called `.env` and add an entry for your openAI API key: `API_KEY=sk-###`
4. run the API server, `npm run server`
5. create a build for the extension `npm run build`
6. upload the build onto `chrome://extensions` and unpack it following the setup instructions [here](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/)

### Prerequisites

-   node installed, preferably v18+
-   have an openAI API key
-   have setup certificates for running servers over `https` for local development (`.cert/cert.pem`, `.cert/key.pem`)
