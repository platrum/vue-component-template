export default {
  props: {
    hideBorder: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    hideBorderStyle() {
      return {
        'border-color': this.hideBorder ? 'transparent' : 'rgba(206, 206, 206, 0.37)'
      };
    }
  }
};
