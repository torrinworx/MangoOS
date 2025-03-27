import { mount, Observer } from 'destam-dom';
import { Theme, Icons, Typography, Icon, Scroll } from 'destamatic-ui';

import theme from './theme';

// header with music playing icon with scrolling text showing the currnet song playing and battery life indicator + bluetooth connection
const Header = ({ playerStatus }) => {
	const clock = Observer.timer(1000).map(() => new Date().toLocaleTimeString('en-GB'));
	const status = Observer.mutable(false);

	return <div theme='row_spread'>
		<Icon size={40} name={playerStatus.map(s => s ? 'play' : 'pause')} />
		<Typography type='h4' label={clock} />
		<div theme='center'>
			<Icon size={50} name='battery' />
			<Icon size={40} name='bluetooth' />
		</div>
	</div>;
};

const App = () => {
	const focused = Observer.mutable(0);
	const buttons = ['Music', 'Extras', 'Settings', 'Shuffle Songs', 'Now Playing'];
	const playerStatus = Observer.mutable(false);

	const Enter = ({ each }) => {
		const index = buttons.indexOf(each);

		return <div
			theme="row_spread"
			style={{
				padding: 10,
				background: focused.map(f => f === index ? '$color_top' : 'none'),
			}}
		>
			<Typography type="h4" label={each} style={{
				color: focused.map(f => f === index ? '$color_main' : '$color_top')
			}} />
			<Icon size={40} name="chevron-right" style={{
				color: focused.map(f => f === index ? '$color_main' : '$color_top')
			}} />
		</div>;
	};

	window.addEventListener('keydown', (event) => {
		const key = event.key;

		if (key === 'ArrowUp' && focused.get() > 0) {
			focused.set(focused.get() - 1);
		}

		if (key === 'ArrowDown' && focused.get() < buttons.length - 1) {
			focused.set(focused.get() + 1);
		}

		if (key === 'MediaPlayPause') {
			playerStatus.set(!playerStatus.set());
			console.log('test');
		}
	});

	return <div theme="page" style={{ padding: 10 }}>
		<Header playerStatus={playerStatus} />
		<Scroll style={{ height: 500 }}>
			<Enter each={buttons} />
		</Scroll>
	</div>;
};


mount(document.body, <Theme value={theme.theme}>
	<Icons value={theme.icons}>
		<App />
	</Icons>
</Theme>);
