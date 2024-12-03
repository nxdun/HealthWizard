const Staff = require("../models/hospitalStaffMember");

class StaffRepository {
  async findByEmail(email) {
    return await Staff.findOne({ email });
  }

  async save(staff) {
    return await staff.save();
  }
}

module.exports = new StaffRepository();
