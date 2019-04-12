const { setWorldConstructor } = require('cucumber');
const { getDependencies } = require('../../tests/getDependencies');

/**
 * @class
 */
function World({ parameters: { dependencies } }) {
  /**
   * @type {Object}
   * @member
   */
  this.dependencies = getDependencies(dependencies);
}

setWorldConstructor(World);
