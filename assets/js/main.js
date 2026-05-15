import { animatePluraLogoIntro } from './logo-anim.js';
import { imgs2svg } from './utils.js';

const DEV = new URLSearchParams(location.search).get('dev') === '1';

await imgs2svg();

const tl = animatePluraLogoIntro();
if (DEV) tl.progress(1);
