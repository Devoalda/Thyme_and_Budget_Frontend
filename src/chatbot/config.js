// config.js

import { createChatBotMessage, createCustomMessage, createClientMessage } from 'react-chatbot-kit';
import Options from "./Options";

const config = {
botName: "Thyme and Budget",
    initialMessages: [
        createChatBotMessage("Hello, how can I assist you today?", {
                widget: "options",
            }),
    ],
    widgets: [
        {
            widgetName: "options",
            widgetFunc: (props) => <Options {...props} />,
        },
    ],
};

export default config;