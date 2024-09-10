const Role = require("../models/Role");

const createRoles = async () => {
  const count = await Role.estimatedDocumentCount();

  if (count === 0) {
    await Role.create({ name: "user" });
    await Role.create({ name: "admin" });
    await Role.create({ name: "employer" });
    console.log("Created default roles");
  }
};

module.exports = createRoles;
