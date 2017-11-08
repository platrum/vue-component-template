const path = require('path');
const fs = require('fs');
const readlineSync = require('readline-sync');

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
const delimiter = '</template>';
let jsonStart = fileContent.indexOf(delimiter);
if (jsonStart > -1) {
  jsonStart += delimiter.length;
} else {
  jsonStart = 0;
}

const exampleTemplate = fileContent.substring(0, jsonStart);
const task = JSON.parse(fileContent.substring(jsonStart));

const sourcePath = path.join(__dirname, 'src');
fs.writeFileSync(path.join(sourcePath, 'App.vue'), exampleTemplate + "\n");

let componentMap = [];
Object.keys(task.components).forEach(k => {
  const component = task.components[k];
  const componentDir = path.join(sourcePath, component.group);
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir);
  }

  const componentFileName = path.join(componentDir, component.name + '.vue');
  if (!fs.existsSync(componentFileName) || shouldRewriteComponent(component.name)) {
    fs.writeFileSync(componentFileName, renderComponent(component));
  }

  const preparedFileName = componentFileName.replace(/\\/g, '\\\\');
  componentMap.push(`'${k}':require('${preparedFileName}').default`);
});

const componentMapFileName = path.join(sourcePath, 'localComponents.js');
if (fs.existsSync(componentMapFileName)) {
  fs.unlinkSync(componentMapFileName);
}
fs.appendFileSync(componentMapFileName, 'export default {' + componentMap.join(',') + '}');

function shouldRewriteComponent(name) {
  return readlineSync.question('rewrite component \'' + name + '\'? (y/n) ') === 'y';
}

function renderComponent({ props, methods, slots, events }) {
  const renderedSlots = renderSlots(slots);
  const renderedEvents = renderEvents(events);

  const objectBlocks = [
    renderProps(props),
    renderMethods(methods)
  ];

  const content = objectBlocks.filter(v => v.trim() !== '').join(",\n  ");

  return `<template>
  <div>
    ${renderedSlots}  
  </div>
</template>

<script>
${renderedEvents}export default {
  ${content}
};
</script>
`;
}

function renderSlots(slots) {
  if (!slots) {
    return '';
  }

  return Object.keys(slots).map(name => {
    const nameProp = name === 'default' ? '' : ` name="${name}"`;
    const { description } = slots[name];
    return `<slot${nameProp}><!-- ${description} --></slot>`;
  }).join("\n    ");
}

function renderEvents(events) {
  if (!events) {
    return '';
  }

  const result = Object.keys(events).map(name => {
    const { args, description } = events[name];
    if (!args) {
      return ` * @event ${name} ${description}`;
    }

    const renderedArgs = args.map(arg => `{${arg}}`).join(', ');
    return ` * @event ${name} ${renderedArgs} ${description}`;
  }).join("\n");

  return `/**\n${result}\n */\n`;
}

function renderProps(props) {
  if (!props) {
    return '';
  }

  const result = Object.keys(props).map(name => {
    return renderProp(Object.assign({}, props[name], { name }));
  }).join(",\n    ");

  return `props: {
    ${result}
  }`;
}

function renderMethods(methods) {
  if (!methods) {
    return '';
  }

  const result = Object.keys(methods).map(name => {
    return renderMethod(Object.assign({}, methods[name], { name }));
  }).join(",\n    ");

  return `methods: {
    ${result}
  }`
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
  if (typeof defaultValue !== 'undefined') {
    if (typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
      defaultValue = renderValue(defaultValue);
      defaultValueRender = `,
      default: () => {
        return ${defaultValue}; 
      }`;
    } else {
      defaultValue = renderValue(defaultValue);
      defaultValueRender = `,
      default: () => ${defaultValue}`;
    }
  }

  const renderedType = type.split('|').length > 1 ? '[ ' + type.split('|').join(', ') + ' ]' : type;
  const renderedName = dehyphenate(name);

  return `${renderedName}: {${description}
      type: ${renderedType}${defaultValueRender}
    }`;
}

function dehyphenate(name) {
  const result = name.split('-').map(upperCaseFirst).join('');
  return result.substring(0, 1).toLowerCase() + result.substring(1);
}

function renderMethod({ name, description }) {
  if (!description) {
    description = '';
  }

  return `${name}() {
      // @todo ${description}
    }`;
}

function renderValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }

    return '[ ' + value.map(renderValue).join(', ') + ' ]';
  }

  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) {
      return '{}';
    }

    return '{ ' + Object.keys(value).map(k => k + ': ' + renderValue(value[k])).join(', ') + ' }';
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  return `'${value}'`;
}

function upperCaseFirst(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

