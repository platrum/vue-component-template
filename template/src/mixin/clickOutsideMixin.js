export default function({ propertyName, enablingPropertyName, defaultEnablingPropertyValue = false }) {
  return {
    props: createProps(enablingPropertyName, defaultEnablingPropertyValue),
    watch: {
      [propertyName]: {
        immediate: true,
        handler(val) {
          if (val) {
            document.addEventListener('click', this[`${enablingPropertyName}Handler`], true);
          } else {
            document.removeEventListener('click', this[`${enablingPropertyName}Handler`], true);
          }
        }
      }
    },
    methods: createHandleOutsideClickMethod.bind(this, propertyName, enablingPropertyName)()
  };
};

function createHandleOutsideClickMethod(statusPropertyName, enablingPropertyName) {
  return {
    [`${enablingPropertyName}Handler`](e) {
      const element = this.$el;
      if (!element.contains(e.target)) {
        if (!enablingPropertyName || this[enablingPropertyName]) {
          this[statusPropertyName] = false;
        }

        this.$emit('outside-click', statusPropertyName);
      }
    }
  };
}

function createProps(prop, defaultValue) {
  if (!prop) {
    return {};
  }

  return {
    [prop]: {
      type: Boolean,
      default() {
        return defaultValue;
      }
    }
  };
}
