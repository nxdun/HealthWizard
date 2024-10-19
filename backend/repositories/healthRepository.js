const Health = require("../models/healthcareManager");

class HealthRepository {
  async findByEmail(email) {
    return await Health.findOne({ email });
  }

  async save(healthManager) {
    return await healthManager.save();
  }
}

module.exports = new HealthRepository();
