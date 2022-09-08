const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status:200, responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200, responds with a single matching article", () => {
    const ARTICLE_ID = 2;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: ARTICLE_ID,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          comment_count: "0",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
        });
      });
  });
  test("status:400, responds with a invalid input", () => {
    const ARTICLE_ID = "not a number";
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("Invalid data type");
      });
  });
  test("status:404, article not found", () => {
    const ARTICLE_ID = "68";
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("No article found for article_id : 68");
      });
  });
});

describe("GET /api/users", () => {
  test("status:200, responds with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: update votes count, respond with newly updated article", () => {
    const updateVotes = {
      votes: 1,
    };
    const articleThree = {
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      body: "some gifs",
      created_at: "2020-11-03T09:12:00.000Z",
      votes: 1,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(updateVotes)
      .expect(200)
      .then((res) => {
        const { body } = res;
        expect(body.article).toEqual(articleThree);
      });
  });

  test("201: update votes count, respond with newly updated article", () => {
    const updateVotes = {
      votes: -98,
    };
    const articleOne = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 2,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then((res) => {
        const { body } = res;
        expect(body.article).toEqual(articleOne);
        expect(body.article.votes).toBe(2);
      });
  });
  test("status:404, article not found", () => {
    const updateVotes = {
      votes: 9,
    };
    return request(app)
      .patch("/api/articles/19")
      .send(updateVotes)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("No article found for article_id : 19");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200, responds with a single matching article that includes comments count", () => {
    const ARTICLE_ID = 10;
    const articleTen = {
      article_id: ARTICLE_ID,
      title: "Seven inspirational thought leaders from Manchester UK",
      topic: "mitch",
      author: "rogersop",
      body: "Who are we kidding, there is only one, and it's Mitch!",
      comment_count: "0",
      created_at: "2020-05-14T04:15:00.000Z",
      votes: 0,
    };
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(articleTen);
      });
  });
  test("status:200, responds with a single matching article that includes comments count", () => {
    const ARTICLE_ID = 1;
    const articleOne = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      comment_count: "11",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
    };
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(articleOne);
      });
  });
});
