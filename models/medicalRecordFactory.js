// MedicalRecord model
const { GeneralMedicalRecord, SurgeryMedicalRecord, PrescriptionMedicalRecord } = require('./medicalRecord');

class MedicalRecordFactory {
  createRecord(type, recordData) {
    switch (type) {
      case 'General':
        return new GeneralMedicalRecord(recordData);
      case 'Surgery':
        return new SurgeryMedicalRecord(recordData);
      case 'Prescription':
        return new PrescriptionMedicalRecord(recordData);
      default:
        throw new Error(`Record type ${type} not recognized.`);
    }
  }
}

module.exports = MedicalRecordFactory;
