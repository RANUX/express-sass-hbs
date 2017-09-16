const hbs = require('hbs');
const i18n = require('i18n');


hbs.registerHelper('__', (...args) => {
  const options = args.pop();
  return Reflect.apply(i18n.__, options.data.root, args);
});

hbs.registerHelper('__n', (...args) => {
  const options = args.pop();
  return Reflect.apply(i18n.__n, options.data.root, args);
});
