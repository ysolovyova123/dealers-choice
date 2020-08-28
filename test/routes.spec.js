const db = require('../db');
const app = require('supertest')(require('../app'));
const { expect } = require('chai');

describe('routes', ()=> {
  let seed;
  beforeEach(async()=> {
    seed = await db.syncAndSeed();
  });

  describe('/', ()=> {
    it('returns index.html', async()=> {
      const response = await app.get('/');
      expect(response.status).to.equal(200);
    });
  });
  describe('/api/users', ()=> {
    it('GET returns all users', async()=> {
      const response = await app.get('/api/users');
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(3);
      

    });
  });
  describe('GET /api/restaurants', ()=> {
    it('returns all restaurants', async()=> {
      const response = await app.get('/api/restaurants');
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(15);
    });
  });
  describe('GET /api/users/:userId/reservations', ()=> {
    describe('for moe', ()=> {
      it('returns a users (moes) reservations', async()=> {
        const response = await app.get(`/api/users/${seed.users.moe.id}/reservations`);
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
      });
    });
    describe('for lucy', ()=> {
      it('returns a users (lucys) reservations', async()=> {
        const response = await app.get(`/api/users/${seed.users.lucy.id}/reservations`);
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(2);
      });
    });
  });
  describe('POST /api/users/:id/reservations', ()=> {
    it('makes a reservation', async()=> {
      const response = await app.post(`/api/users/${seed.users.lucy.id}/reservations`)
      .send({
        restaurantId: seed.restaurants.Pylos.id
      })
      expect(response.status).to.equal(201);
      expect(response.body.restaurantId).to.equal(seed.restaurants.Pylos.id);
      expect(response.body.userId).to.equal(seed.users.lucy.id);
    });
  });
  describe('DELETE /api/reservations/:id', ()=> {
    it('deletes a reservation', async()=> {
      const response = await app.delete(`/api/reservations/${seed.reservations[0].id}`)
      expect(response.status).to.equal(204);
    });
  });
});
