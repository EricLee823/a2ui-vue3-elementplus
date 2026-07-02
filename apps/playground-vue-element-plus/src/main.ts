import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import A2ElementPlus from '@a2ui/element-plus';
import '@a2ui/element-plus/style.css';
import App from './App.vue';
import './styles.css';

createApp(App).use(ElementPlus).use(A2ElementPlus).mount('#app');
