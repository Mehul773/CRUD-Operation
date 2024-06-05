const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email(),
  age: Joi.number().min(1).max(150),
  address: Joi.string(),
});

const updateSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().min(1).max(150),
  address: Joi.string(),
});

const validate = (task) => {
  return (req, res, next) => {
    if (task === "create") {
      var { value, error } = schema.validate(req.body);
    } else if (task === "update") {
      var { value, error } = updateSchema.validate(req.body);
    }
    if (error) {
      console.log("From validate.js===========\n", error);
      return res.status(400).json({ error: error.details[0].message });
    }
    if (value) {
      next();
    }
  };
};

module.exports = validate;
