import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import './main.scss';

import { dom,library } from '@fortawesome/fontawesome-svg-core';
import {
faGithub,
faLinkedin,
faStackOverflow
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faGithub, faLinkedin, faStackOverflow);
dom.watch();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(createPinia())
  .use(router)
  .mount('#app');

if ('addEventListener' in window) {
  window.addEventListener('load', function () {
    document.body.classList.remove('loading');
    document.body.classList.add('random-background');
  });
}
