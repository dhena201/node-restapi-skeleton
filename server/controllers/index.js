const 
    requireDirectory = require('require-directory'),
    {namespace,slashNotation} = require('../components/utils');

/**
 * Formats every controller inside the directory 'controllers' into an object.
 * folder:
 *  - app
 *    - auth.controller
 *
 *  output:
 *  {
 *    App: {
 *      AuthController: (file exports)
 *    }
 *  }
 */

const controllers = requireDirectory(module, './', {
  rename: namespace
})

/**
 * Transform slash notation to the controller's method, appending/prepending any middleware required
 *
 * @export
 * @param {any} ctrllr
 * @returns
 */
module.exports = function (ctrllr) {
  const [controllerName, methodName] = ctrllr.split('@');
  const controller = slashNotation(controllerName, controllers);
  if(!controller) throw new Error(`Controller ${controllerName} not found`);
  const method = controller[methodName];
  if(!method) throw new Error(`Method ${methodName} not found in ${controllerName}`);
  return [method];
}