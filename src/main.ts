import { createApp } from 'vue';
import Pip from './vue/Pip.vue';
import { createPinia } from 'pinia';

const ID = 'root-pip-controller';

const root = document.createElement('div');
root.id = ID;
document.body.appendChild(root);

const pinia = createPinia();
const app = createApp(Pip);
app.use(pinia);
app.mount(root);
