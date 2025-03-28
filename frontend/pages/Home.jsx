import Enter from '../components/Enter';

const Home = ({ state }) => {
    // TODO: Fix scrolling so that the current focused scrolls the Scroll up/down appropriately
    // if the list of items goes off the screen
    const buttons = [
        {
            name: 'Music',
            page: ''
        },
        {
            name: 'Extras',
            page: ''
        },
        {
            name: 'Settings',
            page: 'Settings'
        },
        {
            name: 'Shuffle Songs',
            page: ''
        },
        {
            name: 'Now Playing',
            page: ''
        },
    ];
    return <Enter state={state} buttons={buttons} />
}

export default {
    page: Home,
};
