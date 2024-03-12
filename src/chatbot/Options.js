const Options = (props) => {
    const options = [
        {
            text: "What is Thyme and Budget?",
            handler: props.actionProvider.aboutThymeAndBudgetHandler,
            id: 1,
        },
        {
            text: "How can I be a Donor?",
            handler: props.actionProvider.handleDonor,
            id: 2,
        },
        {
            text: "How can I be a Receiver?",
            handler: props.actionProvider.handleReceiver,
            id: 3,
        },
    ];

    const buttonsMarkup = options.map((option) => (
        <button key={option.id} onClick={option.handler} className="option-button">
            {option.text}
        </button>
    ));

    return <div className="options-container">{buttonsMarkup}</div>;
}

export default Options;