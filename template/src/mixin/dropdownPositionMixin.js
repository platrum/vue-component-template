export default function ({ controlRefName, contentRefName } = {}) {
  return {
    props: {
      dropup: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    methods: {
      calculatePosition() {
        const style = { top: '100%', bottom: 'auto', left: 0, right: 'auto' };

        if (this.$refs[controlRefName]) {
          const controlParams = this.$refs[controlRefName].getBoundingClientRect();
          const windowHeight = window.innerHeight,
                windowWidth = window.innerWidth;
          const offsetTop = controlParams.top,
                offsetLeft = controlParams.left;
          const offsetBottom = windowHeight - offsetTop - controlParams.height,
                offsetRight =  windowWidth - offsetLeft - controlParams.width;

          if (this.$refs[contentRefName]) {
            const contentParams = this.$refs[contentRefName].getBoundingClientRect();
            const contentWidth = contentParams.width,
                  contentHeight = contentParams.height;

            const isBottomOutside = contentHeight > offsetBottom;
            const isTopOutside = contentHeight > offsetTop;
            const verticalOffsetDiff = offsetTop - offsetBottom;

            if (isBottomOutside && (this.dropup || !isTopOutside || verticalOffsetDiff > 0)) {
              style.top = 'auto';
              style.bottom = '100%';
            }

            const isRightOutside = offsetLeft + controlParams.width < contentWidth;
            const isLeftOutside = offsetRight + controlParams.width < contentWidth;
            const horizontalOffsetDiff = offsetLeft - offsetRight;

            if (isLeftOutside && (!isRightOutside || horizontalOffsetDiff > 0)) {
              style.right = 0;
              style.left = 'auto';
            }

            this.position = style;
          }
        }
      }
    }
  }
}
