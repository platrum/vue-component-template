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

const emit = Vue.prototype.$emit;
Vue.prototype.$emit = function() {
  const componentTag = this.$vnode.componentOptions.tag;
  console.log(componentTag + ' -> ' + arguments[0], Array.from(arguments).slice(1));
  emit.apply(this, arguments);
};

new Vue({
  el: '#app',
  render: h => h(App)
});
