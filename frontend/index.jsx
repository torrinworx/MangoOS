import { v4 as uuidv4 } from 'uuid';
import { mount, Observer, OObject, OArray } from 'destam-dom';
import { Theme, Icons, Typography, Icon, Scroll } from 'destamatic-ui';

import theme from './theme';
import icons from './icons';

let ws;
export const initWS = () => {
	const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
	const wsPort = '3001';
	const wsURL = `${protocol}${window.location.hostname}:${wsPort}/ws`;
	const ws = new WebSocket(wsURL);

	console.log("THIS IS INTERNAL WS: ", ws)

	return new Promise((resolve, reject) => {
		ws.addEventListener('open', () => resolve(ws));
		ws.addEventListener('error', (err) => reject(err));
		ws.addEventListener('close', () => { });
	});
};

export const jobRequest = ({ name, props }) => {
	return new Promise(async (resolve, reject) => {
		const msgID = uuidv4();

		const handleMessage = (event) => {
			const response = JSON.parse(event.data);
			if (response.id === msgID) {
				ws.removeEventListener('message', handleMessage);

				if (response.error) {
					console.error(response.error);
				} else {
					resolve(response.result);
				}
			}
		};

		const sendMessage = () => {
			try {
				ws.send(JSON.stringify({
					name: name,
					id: msgID,
					props
				}));
			} catch (error) {
				reject(new Error('Issue with server module request: ', error));
			}

		};

		ws.addEventListener('message', handleMessage);
		sendMessage();
	});
};

let pages = import.meta.glob('./pages/*.jsx', { eager: true });
pages = Object.fromEntries(
	Object.entries(pages)
		.map(([filePath, value]) => [
			filePath.split('/').pop().replace('.jsx', ''),
			value
		])
);

// header with music playing icon with scrolling text showing the currnet song playing and battery life indicator + bluetooth connection
const Header = ({ state }) => {
	const clock = Observer.timer(1000).map(() => new Date().toLocaleTimeString('en-GB'));

	return <div theme='row_spread'>
		<Icon size={40} name={state.observer.path('playerStatus').map(s => s ? 'play' : 'pause')} />
		<Typography type='h4' label={clock} />
		<div theme='center'>
			<Icon size={50} name='battery-full' />
			<Icon size={40} name='bluetooth' />
		</div>
	</div>;
};

const Fallback = () => {
	return <Typography type='h4' label='Page not found.' />;
};

const Router = ({ state }, cleanup) => {
	const handleKeyDown = (event) => {
		if (event.key === 'Escape' && state.history.length > 1) {
			state.history.pop();
		}
	}
	window.addEventListener('keydown', handleKeyDown);
	cleanup(() => {
		window.removeEventListener('keydown', handleKeyDown);
	});

	return state.observer.path('history').map(p => {
		const pageCmp = p.length > 0 ? pages[p[p.length - 1].name] : pages['Home'];
		if (!pageCmp) return <Fallback state={state} />;
		const page = pageCmp.default;
		const Page = page.page;
		if (Page) return <Page state={state} />
		else return <Fallback state={state} />;
	}).unwrap();
};

const App = () => {
	const state = OObject({
		playerStatus: false,
		history: OArray([{ name: 'Home' }]), // store index of focused her in history so that enter goes to this first
	});

	const something = async () => {
		console.log('wtf is happening')
		ws = await initWS();
		console.log('this is ws: ', ws);
		const result = jobRequest("test", { test: 'test' });
		console.log("THIS IS RESULT: ", result);
	};

	something();

	/* Something like this from MangoSync:
	if ('mediaSession' in navigator) {
		navigator.mediaSession.setActionHandler('play', () => {
			playerStatus.set(true);
		});

		navigator.mediaSession.setActionHandler('pause', () => {
			playerStatus.set(false);
		});

		navigator.mediaSession.setActionHandler('stop', () => {
			playerStatus.set(false);
			audio.currentTime = 0;
		});

		navigator.mediaSession.setActionHandler('seekbackward', (details) => {
			audio.currentTime = Math.max(audio.currentTime - (details.seekOffset || 10), 0);
			value.set(audio.currentTime * 1000);
		});

		navigator.mediaSession.setActionHandler('seekforward', (details) => {
			audio.currentTime = Math.min(audio.currentTime + (details.seekOffset || 10), audio.duration);
			value.set(audio.currentTime * 1000);
		});
	}
	for media session pause/play.

	// window.addEventListener('keydown', event => {
	// 	if (event.key === 'MediaPlayPause') {
	// 		playerStatus.set(!playerStatus.set());
	// 		console.log('test');
	// 	}
	// });
	*/

	return <div theme="page" style={{ padding: 10 }}>
		<Header state={state} />
		<Scroll style={{ height: 500 }}>
			<Router state={state} />
		</Scroll>
	</div>;
};


mount(document.body, <Theme value={theme.theme}>
	<Icons value={icons}>
		<App />
	</Icons>
</Theme>);
