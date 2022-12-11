import ReactDOM from 'react-dom';
import '../public/index.css';
import { App } from './App';
import { init } from 'helper/adProtocols';

window.onload = () => {
    init(() => {
        ReactDOM.render(<App />, document.getElementById('game'));
    });
};
