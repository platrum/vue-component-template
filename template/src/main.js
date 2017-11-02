import Vue from 'vue';
import App from './App.vue';
import localComponents from './localComponents';

const { components } = ui_app.default(Vue);
Object.keys(components).forEach(k => {
  if (localComponents[k]) {
    return;
  }

  Vue.component('ui-' + k, components[k]);
});

Object.keys(localComponents).forEach(k => {
  Vue.component(k, localComponents[k]);
});

new Vue({
  el: '#app',
  render: h => h(App)
});
