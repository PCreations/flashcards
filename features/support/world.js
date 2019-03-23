const { setWorldConstructor } = require('cucumber');
const { getDependencies } = require('../../tests/getDependencies');

function World({ parameters: { dependencies } }) {
  this.dependencies = getDependencies(dependencies);
}

setWorldConstructor(World);
