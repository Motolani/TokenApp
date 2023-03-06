import {Platform} from 'react-native';
import packageJson from '../package.json';
const APP_NAME = 'pinspay Token App';

const BASE_URL = 'https://hordecall.net/backend/public/api';

// const BASE_URL = Platform.select({
//   android: 'http://10.0.2.2:8000/api',
//   ios: 'http://127.0.0.1:8000/api',
// });

const Config = {
  base_url: BASE_URL,
  appName: APP_NAME,
};

export default Config;
