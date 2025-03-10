import { createApp } from 'vue';
import App from './App.vue';
import '../../src/vue/styles/global.scss';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.mount('#root-pip-controller');
