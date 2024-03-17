// config.js

import { createChatBotMessage, createCustomMessage, createClientMessage } from 'react-chatbot-kit';
import Options from "./Options";

const config = {
botName: "Thyme Bot",
    initialMessages: [
        createChatBotMessage("Hello! I am Thyme Bot. Type 'help' to display options available."),
        // createChatBotMessage("Hello, how can I assist you today?", {
        //         widget: "options",
        //     }),
    ],
    widgets: [
        {
            widgetName: "options",
            widgetFunc: (props) => <Options {...props} />,
        },
    ],
};

export default config;