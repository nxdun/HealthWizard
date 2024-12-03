const Health = require("../models/healthcareManager");
const Staff = require("../models/hospitalStaffMember");

class PersonFactory {
  static createPerson(type, data) {
    switch (type) {
      case "health":
        return new Health(data);
      case "staff":
        return new Staff(data);
      default:
        throw new Error("Invalid person type");
    }
  }
}

module.exports = PersonFactory;
