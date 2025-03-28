import { Observer } from 'destam-dom';
import { Typography, Icon } from 'destamatic-ui';

const Row = ({ each, buttons, focused }) => {
    const index = buttons.indexOf(each);

    return <div
        theme="row_spread"
        style={{
            padding: 10,
            background: focused.map(f => f === index ? '$color_top' : 'none'),
        }}
    >
        <Typography type="h4" label={each.name} style={{
            color: focused.map(f => f === index ? '$color_main' : '$color_top')
        }} />
        <Icon size={40} name="chevron-right" style={{
            color: focused.map(f => f === index ? '$color_main' : '$color_top')
        }} />
    </div>;
};

const Enter = ({ state, buttons, prev = null }, cleanup) => {
    const focused = Observer.mutable(0)

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp' && focused.get() > 0) {
            focused.set(focused.get() - 1);
        }

        if (event.key === 'ArrowDown' && focused.get() < buttons.length - 1) {
            focused.set(focused.get() + 1);
        }

        if (event.key === 'Escape' && prev) {
            state.openPage = prev;
        }

        if (event.key === 'Enter') {
            state.openPage = buttons[focused.get()];
        }
    }

    window.addEventListener('keydown', handleKeyDown);

    cleanup(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });

    return <Row each={buttons} state={state} buttons={buttons} focused={focused} />;
};

export default Enter;
