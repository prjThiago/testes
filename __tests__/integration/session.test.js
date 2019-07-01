const request = require("supertest");
const app = require("../../src/app");
const truncate = require('../utils/truncate');
const factory = require('../factories');

describe("Authentication", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to authentication with valid credentials", async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post("/sessions")
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
  });

  it('should not be able to authenticate with invalid credentials', async() => {
    
    const user = await factory.create('User', {
      password: '123456'
    });


    const response = await request(app)
      .post("/sessions")
      .send({ email: user.email, password: "123123" });

    expect(response.status).toBe(401);
  });

  it('should return token when authenticated', async () => {

    const user = await factory.create('User');

    const response = await request(app)
      .post("/sessions")
      .send({ email: user.email, password: user.password });

    expect(response.body).toHaveProperty('token');
  }); 

  it('should be able access private routes when authenticated', async () => {
    const user = await factory.create('User');


    const token = user.generateToken()

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200)
  })

  it('should be able to access private routes when not authenticated', async () => {
    const response = await request(app)
      .get('/dashboard')

      expect(response.status).toBe(401)
  })

  it('should be able to access private routes when not authenticated', async () => {
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', 'Bearer 123123')

      expect(response.status).toBe(401)
  })
});
