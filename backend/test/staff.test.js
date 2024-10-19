const request = require('supertest');
const app = require('../server'); // Adjust the path if necessary
const staffRepository = require('../repositories/staffRepository');
const healthRepository = require('../repositories/healthRepository');

jest.mock('../repositories/staffRepository'); // Mock the staff repository
jest.mock('../repositories/healthRepository'); // Mock the health repository

describe('Staff Registration API', () => {
  
  describe('POST /api/staff/registerHealth', () => {
    it('should register a Health Manager successfully', async () => {
      const newHealthManager = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      healthRepository.findByEmail.mockResolvedValue(null); // No existing email
      healthRepository.save.mockResolvedValue(newHealthManager); // Mock successful save

      const response = await request(app)
        .post('/api/staff/registerHealth')
        .send(newHealthManager);

      expect(response.statusCode).toBe(201);
      expect(response.text).toBe('Health Manager registered successfully');
    });

    it('should return an error if the email already exists', async () => {
      const existingEmail = {
        email: 'john.doe@example.com',
      };

      healthRepository.findByEmail.mockResolvedValue(existingEmail); // Existing email mock

      const response = await request(app)
        .post('/api/staff/registerHealth')
        .send(existingEmail);

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Email already exists');
    });

    it('should return an error if registration fails', async () => {
      const newHealthManager = {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      };

      healthRepository.findByEmail.mockResolvedValue(null); // No existing email
      healthRepository.save.mockResolvedValue(null); // Simulate failure on save

      const response = await request(app)
        .post('/api/staff/registerHealth')
        .send(newHealthManager);

      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('Unable to register Health Manager');
    });
  });

  describe('POST /api/staff/registerStaff', () => {
    it('should register a Staff Member successfully', async () => {
      const newStaffMember = {
        firstname: 'Alice',
        lastname: 'Smith',
        email: 'alice.smith@example.com',
        password: 'password123',
      };

      staffRepository.findByEmail.mockResolvedValue(null); // No existing email
      staffRepository.save.mockResolvedValue(newStaffMember); // Mock successful save

      const response = await request(app)
        .post('/api/staff/registerStaff')
        .send(newStaffMember);

      expect(response.statusCode).toBe(201);
      expect(response.text).toBe('Staff registered successfully');
    });

    it('should return an error if the email already exists', async () => {
      const existingEmail = {
        email: 'alice.smith@example.com',
      };

      staffRepository.findByEmail.mockResolvedValue(existingEmail); // Existing email mock

      const response = await request(app)
        .post('/api/staff/registerStaff')
        .send(existingEmail);

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Email already exists');
    });

    it('should return an error if registration fails', async () => {
      const newStaffMember = {
        firstname: 'Bob',
        lastname: 'Johnson',
        email: 'bob.johnson@example.com',
        password: 'password123',
      };

      staffRepository.findByEmail.mockResolvedValue(null); // No existing email
      staffRepository.save.mockResolvedValue(null); // Simulate failure on save

      const response = await request(app)
        .post('/api/staff/registerStaff')
        .send(newStaffMember);

      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('Unable to register Staff');
    });
  });
});
