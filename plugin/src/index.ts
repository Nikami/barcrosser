import './styles/main.scss';
import { initUI } from './ui/form';

// Type definitions for GM functions mapped via Webpack BannerPlugin and @types/tampermonkey
// The script will execute in the context of barcross.ru

console.log('[BarCrosser Tracker] Script initialized.');

// Initialize the plugin form UI.
initUI();

