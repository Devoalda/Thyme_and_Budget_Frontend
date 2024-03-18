// MessageParser starter code
class MessageParser {
    constructor(actionProvider, state) {
        this.actionProvider = actionProvider;
        this.state = state;
    }

    parse(message) {
        console.log(message)

        if (message.toLowerCase().includes("help")) {
            return this.actionProvider.handleHelp();
        } else {
            return this.actionProvider.defaultHandler();
        }
    }
}

export default MessageParser;