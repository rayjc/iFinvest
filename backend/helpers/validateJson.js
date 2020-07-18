const jsonschema = require("jsonschema");
const ExpressError = require("./expressError");

/**
 * Validte object against defined JSON schema;
 * throws 400 Error if fails.
 */
function validateJSON(data, schema) {
  const valResult = jsonschema.validate(data, schema);
  if (!valResult.valid) {
    const errors = valResult.errors.map(e => e.stack.replace('instance.', ''));
    throw new ExpressError(errors, 400);
  }
}


module.exports = validateJSON;