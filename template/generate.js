const path = require('path');
const fs = require('fs');

if (!process.argv[2]) {
  console.error(`Usage:\n\tnode generate.js path/to/task.json`);
  return;
}

const fileName = process.argv[2];
if (!fs.existsSync(fileName)) {
  console.error(`File ${fileName} does not exist`);
  return;
}

const task = require(fileName);

const sourcePath = path.join(__dirname, 'src');
let componentMap = [];
Object.keys(task.components).forEach(k => {
  const component = task.components[k];
  const componentDir = path.join(sourcePath, component.group);
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir);
  }

  const componentFileName = path.join(componentDir, component.name + '.vue');
  fs.unlinkSync(componentFileName); // @todo: remove

  if (!fs.existsSync(componentFileName)) {
    fs.appendFileSync(componentFileName, renderComponent(component));
  }

  componentMap.push(`'${k}':require('${componentFileName}').default`);
});

const componentMapFileName = path.join(sourcePath, 'components.js');
fs.unlinkSync(componentMapFileName);
fs.appendFileSync(componentMapFileName, 'export default {' + componentMap.join(',') + '}');

function renderComponent({ name, props, methods, slots }) {
  const renderedProps = Object.keys(props).map(name => {
    return renderProp(Object.assign({}, props[name], { name }));
  }).join(",\n    ");

  const renderedMethods = Object.keys(methods).map(name => {
    return renderMethod(Object.assign({}, methods[name], { name }));
  }).join(",\n    ");

  const renderedSlots = Object.keys(slots).map(name => {
    const nameProp = name === 'default' ? '' : ` name="${name}"`;
    const { description } = slots[name];
    return `<slot${nameProp}><!-- ${description} --></slot>`;
  }).join("\n    ");

  return `<template>
  <div>
    ${renderedSlots}  
  </div>
</template>

<script>
export default {
  props: {
    ${renderedProps}
  },
  methods: {
    ${renderedMethods}
  }
};
</script>
`;
}

function renderProp(prop) {
  let { name, type, description } = prop;
  let defaultValue = prop.default;

  if (description) {
    description = ' // ' + description;
  } else {
    description = '';
  }

  let defaultValueRender = '';
  if (defaultValue) {
    defaultValue = type === 'Number' ? defaultValue : "'" + defaultValue + "'";
    defaultValueRender = `,
      default: () => ${defaultValue}`;
  }

  return `${name}: {${description}
      type: ${type}${defaultValueRender}
    }`;
}

function renderMethod({ name, description }) {
  if (!description) {
    description = '';
  }

  return `${name}() {
      // @todo ${description}
    }`;
}