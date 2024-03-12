// MessageParser starter code
class MessageParser {
    constructor(actionProvider, state) {
        this.actionProvider = actionProvider;
        this.state = state;
    }

    parse(message) {
        console.log(message)

        if (message.includes("1")) {

            return this.actionProvider.aboutThymeAndBudgetHandler();
        }
    }
}

export default MessageParser;