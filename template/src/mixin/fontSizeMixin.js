export default {
  props: {
    fontSize: {
      type: Number,
      default() {
        return 14;
      }
    }
  },
  computed: {
    fontSizeStyle() {
      return {
        'font-size': this.fontSize + 'px'
      };
    }
  }
};
