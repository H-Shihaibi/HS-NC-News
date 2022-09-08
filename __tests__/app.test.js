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

describe("GET /api/articles", () => {
  test("status:200, responds with an array of articles objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              comment_count: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("status:200, responds with an array of articles objects in DESC created_at order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const articlesDesc = [
          {
            article_id: 3,
            author: "icellusedkars",
            body: "some gifs",
            comment_count: "2",
            created_at: "2020-11-03T09:12:00.000Z",
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            votes: 0,
          },
          {
            article_id: 6,
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            comment_count: "1",
            created_at: "2020-10-18T01:00:00.000Z",
            title: "A",
            topic: "mitch",
            votes: 0,
          },

          {
            article_id: 2,
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            comment_count: "0",
            created_at: "2020-10-16T05:03:00.000Z",
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            votes: 0,
          },

          {
            article_id: 12,
            author: "butter_bridge",
            body: "Have you seen the size of that thing?",
            comment_count: "0",
            created_at: "2020-10-11T11:24:00.000Z",
            title: "Moustache",
            topic: "mitch",
            votes: 0,
          },

          {
            article_id: 5,
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            comment_count: "2",
            created_at: "2020-08-03T13:14:00.000Z",
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            votes: 0,
          },

          {
            article_id: 1,
            author: "butter_bridge",
            body: "I find this existence challenging",
            comment_count: "11",
            created_at: "2020-07-09T20:11:00.000Z",
            title: "Living in the shadow of a great man",
            topic: "mitch",
            votes: 100,
          },

          {
            article_id: 9,
            author: "butter_bridge",
            body: "Well? Think about it.",
            comment_count: "2",
            created_at: "2020-06-06T09:10:00.000Z",
            title: "They're not exactly dogs, are they?",
            topic: "mitch",
            votes: 0,
          },

          {
            article_id: 10,
            author: "rogersop",
            body: "Who are we kidding, there is only one, and it's Mitch!",
            comment_count: "0",
            created_at: "2020-05-14T04:15:00.000Z",
            title: "Seven inspirational thought leaders from Manchester UK",
            topic: "mitch",
            votes: 0,
          },

          {
            article_id: 4,
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            comment_count: "0",
            created_at: "2020-05-06T01:14:00.000Z",
            title: "Student SUES Mitch!",
            topic: "mitch",
            votes: 0,
          },

          {
            article_id: 8,
            author: "icellusedkars",
            body: "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
            comment_count: "0",
            created_at: "2020-04-17T01:08:00.000Z",
            title: "Does Mitch predate civilisation?",
            topic: "mitch",
            votes: 0,
          },

          {
            article_id: 11,
            author: "icellusedkars",
            body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
            comment_count: "0",
            created_at: "2020-01-15T22:21:00.000Z",
            title: "Am I a cat?",
            topic: "mitch",
            votes: 0,
          },

          {
            article_id: 7,
            author: "icellusedkars",
            body: "I was hungry.",
            comment_count: "0",
            created_at: "2020-01-07T14:08:00.000Z",
            title: "Z",
            topic: "mitch",
            votes: 0,
          },
        ];
        expect(articles).toEqual(articlesDesc);
      });
  });
  test("status:404, topic not found", () => {
    const topic = "crepuscular";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("No topic found for crepuscular");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status:200, responds with an array of comments for the given `article_id`", () => {
    const ARTICLE_ID = 6;
    const commentsArr = [
      {
        author: "butter_bridge",
        body: "This is a bad article name",
        comment_id: 16,
        created_at: "2020-10-11T15:23:00.000Z",
        votes: 1,
      },
    ];
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(commentsArr);
      });
  });
  test("status:200, responds with an array of comments for the given `article_id`", () => {
    const ARTICLE_ID = 9;
    const commentsArr = [
      {
        author: "butter_bridge",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        comment_id: 1,
        created_at: "2020-04-06T12:17:00.000Z",
        votes: 16,
      },
      {
        author: "icellusedkars",
        body: "The owls are not what they seem.",
        comment_id: 17,
        created_at: "2020-03-14T17:02:00.000Z",
        votes: 20,
      },
    ];
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(commentsArr);
      });
  });
  test("status:404, no comments found", () => {
    const ARTICLE_ID = 4;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual(`No comments found for article_id : ${ARTICLE_ID}`);
      });
  });

  test("status:400, responds with a invalid input", () => {
    const ARTICLE_ID = "not a number";
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}/comments`)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("Invalid data type");
      });
  });
});
