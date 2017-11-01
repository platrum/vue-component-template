export default function({ horizontal = 8, vertical = 7 } = {}) {
  return {
    props: {
      paddingX: {
        type: Number,
        default() {
          return horizontal;
        }
      },
      paddingY: {
        type: Number,
        default() {
          return vertical;
        }
      }
    },
    computed: {
      paddingStyle() {
        return {
          'padding-left': this.paddingX + 'px',
          'padding-right': this.paddingX + 'px',
          'padding-top': this.paddingY + 'px',
          'padding-bottom': this.paddingY + 'px'
        };
      }
    }
  };
};
