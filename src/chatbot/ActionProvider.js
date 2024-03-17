// ActionProvider starter code
import React from 'react';
class ActionProvider {
    constructor(
        createChatBotMessage,
        setStateFunc,
        createClientMessage,
        stateRef,
        createCustomMessage,
        ...rest
    ) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
        this.createClientMessage = createClientMessage;
        this.stateRef = stateRef;
        this.createCustomMessage = createCustomMessage;
    }

    handleHello = () => {
        const message = this.createChatBotMessage("Hello! How can I help you today?");
        this.setChatbotMessage(message);
    }

    handleHelp = () => {
        const message = this.createChatBotMessage("I can help you with the following: ", {
            widget: "options",
        });
        this.setChatbotMessage(message);
    }

    aboutThymeAndBudgetHandler = () => {
        const message = this.createChatBotMessage("Thyme and Budget is a non-profit organization that helps connect food donors with food receivers. We help to reduce food waste and feed the hungry.");
        this.setChatbotMessage(message);
    };

    handleDonor = () => {
        const message = this.createChatBotMessage("If you are a food donor, you can register with us and we will help you connect with a food receiver. Select the 'Donor' option and fill in the required details.");
        this.setChatbotMessage(message);

    }

    handleReceiver = () => {
        const message = this.createChatBotMessage("If you are a food receiver, you can register with us and we will help you connect with a food donor. Select the 'Receiver' option and fill in the required details.");
        this.setChatbotMessage(message);
    }

    defaultHandler = () => {
        const message = this.createChatBotMessage("I'm sorry, I didn't understand that. Please type 'help' to display the available options.");
        this.setChatbotMessage(message);
    }

    setChatbotMessage = (message) => {
        this.setState((state) => ({ ...state, messages: [...state.messages, message] }));
    };
}

export default ActionProvider;