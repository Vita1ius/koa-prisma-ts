const request = require('supertest');
import { Post, User } from "@prisma/client";
import app from "../app";

describe ('User Component', () => {
  let token:string;
  let userTest:User;

  describe('POST /user', () => {
    it('should add one user', async () => {
      const res = await request(app.callback())
        .post('/user').send({
          username: "test",
          name: "Vitalik",
          lastName: "Balushchak",
          password: "password",
          gmail: "test@gmail.com",
        })
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe('test@gmail.com');
      userTest= res.body
    });
  });

  describe('POST /user/login', () => {
    it('get a token', async () => {
      const res = await request(app.callback()).post('/user/login').send({
        username: "user",
        password: "password"
      })
      expect(res.status).toBe(200);
      token = res.body.token;
    })
  })

  describe('GET /userById', () => {
    it('should get a user by ID', async () => {
      const res = await request(app.callback())
        .get(`/user/${userTest.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
    it('should return error', async () => {
      const res = await request(app.callback())
        .get('/user/99999')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error','User not found');
    });
  });

  describe('GET /users', () => {
    it('should return users', async () => {
      const res = await request(app.callback())
        .get('/users')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe('PUT /user/:id', () => {
    it('should return users', async () => {
      const res = await request(app.callback())
        .put(`/user/${userTest.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'test2@gmail.com'
        });
      expect(res.status).toBe(200);
      expect(res.body.email).toBe('test2@gmail.com');
      expect(res.body.email).not.toBe(userTest.email);
    });
  });
  describe ('Post Component', () => {
    let postTest:Post;
  
    describe('POST /createPost', () => {
      it('should add one post', async () => {
        const res = await request(app.callback())
          .post('/createPost')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: "test title",
            content: "Hello, Jest!"
          })
        expect(res.status).toBe(200);
        //expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('test title');
        postTest = res.body
      });
    });
  
    describe('GET /postById/:id', () => {
      it('should get a post by ID', async () => {
        const res = await request(app.callback())
          .get(`/postById/1`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
      });
      it('should return error', async () => {
        const res = await request(app.callback())
          .get('/postById/9999')
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error','Post not found');
      });
    });
  
    describe('GET /posts', () => {
      it('should return posts', async () => {
        const res = await request(app.callback())
          .get('/posts')
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
      });
    });
    describe('PUT /post/:id', () => {
      it('should return users', async () => {
        const res = await request(app.callback())
          .put(`/post/${postTest.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            content: "Hello, Jest!(update)",
            published: true
          });
        expect(res.status).toBe(200);
        expect(res.body.published).toBe(true);
        expect(res.body.published).not.toBe(postTest.published);
    });
    
    describe('DELETE /post/:id', () => {
      it('should delete post', async () => {
        const res = await request(app.callback())
          .delete(`/post/${postTest.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
      });
    });
  })

  describe('DELETE /user/:id', () => {
    it('should delete user', async () => {
      const res = await request(app.callback())
        .delete(`/user/${userTest.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });
})});

