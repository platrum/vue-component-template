import Vue from 'vue';
import App from './App.vue';
import components from './components';

Object.keys(components).forEach(k => {
  Vue.component(k, components[k]);
});

new Vue({
  el: '#app',
  render: h => h(App)
});
