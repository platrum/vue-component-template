export default {
  props: {
    replaceText: {
      type: String,
      default() {
        return '';
      }
    },
  },
  data() {
    return {
      isReplaceTextHidden: false
    };
  },
  computed: {
    isReplaceTextVisible() {
      return this.replaceText !== ''
        && !this.value
        && this.isReplaceTextHidden === false;
    }
  },
  methods: {
    hideReplaceText() {
      this.isReplaceTextHidden = true;
    },
    showReplaceText() {
      this.isReplaceTextHidden = false;
    }
  }
};
