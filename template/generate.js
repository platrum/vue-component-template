const path = require('path');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (!process.argv[2]) {
  console.error(`Usage:\n\tnode generate.js path/to/task.json`);
  return;
}

const fileName = process.argv[2];
if (!fs.existsSync(fileName)) {
  console.error(`File ${fileName} does not exist`);
  return;
}

const fileContent = fs.readFileSync(fileName).toString();
const jsonStart = fileContent.search(/\n\{\n/);

const exampleTemplate = fileContent.substring(0, jsonStart);
const task = JSON.parse(fileContent.substring(jsonStart));

const sourcePath = path.join(__dirname, 'src');
fs.writeFileSync(sourcePath + '/App.vue', exampleTemplate + "\n");

let componentMap = [];
Object.keys(task.components).forEach(k => {
  const component = task.components[k];
  const componentDir = path.join(sourcePath, component.group);
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir);
  }

  const componentFileName = path.join(componentDir, component.name + '.vue');
  if (fs.existsSync(componentFileName)) {
    rl.question('rewrite component \'' + component.name + '\'? (y/n) ', (answer) => {
      rl.close();
      if (answer !== 'y') {
        return;
      }

      fs.writeFileSync(componentFileName, renderComponent(component));
    });
  } else {
    fs.writeFileSync(componentFileName, renderComponent(component));
  }

  componentMap.push(`'${k}':require('${componentFileName}').default`);
});

const componentMapFileName = path.join(sourcePath, 'localComponents.js');
if (fs.existsSync(componentMapFileName)) {
  fs.unlinkSync(componentMapFileName);
}
fs.appendFileSync(componentMapFileName, 'export default {' + componentMap.join(',') + '}');

function renderComponent({ props, methods, slots, events }) {
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

  const renderedEvents = Object.keys(events).map(name => {
    const event = events[name];
    if (!event.args) {
      return `// $emit('${name}')`;
    }

    const args = event.args.map(arg => `{${arg}}`).join(', ');
    return `// $emit('${name}', ${args})`;
  }).join("\n");

  return `<template>
  <div>
    ${renderedSlots}  
  </div>
</template>

<script>
${renderedEvents}
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