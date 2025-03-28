import Enter from '../components/Enter';

const Settings = ({ state }) => {
    // TODO: Fix scrolling so that the current focused scrolls the Scroll up/down appropriately
    // if the list of items goes off the screen
    const buttons = [
        {
            name: 'Bluetooth',
            page: ''
        },
    ];
    return <Enter state={state} buttons={buttons} />
};

export default {
    page: Settings,
};
