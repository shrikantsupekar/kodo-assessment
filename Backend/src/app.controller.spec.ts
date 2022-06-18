import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { sortBy } from "./app.dto";
import { AppModule } from "./app.module";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it("should return posts and total", async () => {
      const res = await appController.getPosts({
        query: "",
        page: 1,
        sortBy: null,
      });
      expect(res).toHaveProperty("posts");
      expect(res).toHaveProperty("total");
      expect(Array.isArray(res.posts)).toBeTruthy();
      expect(res.posts.length).toBe(10);
    });

    it("should return searched posts and total", async () => {
      const query = "Dynamic";
      const res = await appController.getPosts({
        query,
        page: 1,
        sortBy: null,
      });
      expect(res).toHaveProperty("posts");
      expect(res).toHaveProperty("total");
      expect(Array.isArray(res.posts)).toBeTruthy();

      const search = res.posts.every(
        (p) => p.name.includes(query) || p.description.includes(query)
      );
      expect(search).toBeTruthy();

      const exactQuery = '"Marketing Consultant"';
      const res1 = await appController.getPosts({
        query: exactQuery,
        page: 1,
        sortBy: null,
      });
      expect(res1).toHaveProperty("posts");
      expect(res1).toHaveProperty("total");
      expect(Array.isArray(res.posts)).toBeTruthy();

      const search1 = res1.posts.every(
        (p) =>
          p.name.includes(exactQuery.replace(/"/g, "")) ||
          p.description.includes(exactQuery.replace(/"/g, ""))
      );

      expect(search1).toBeTruthy();
    });

    it("should return sorted posts by name and total", async () => {
      const res = await appController.getPosts({
        query: "",
        page: 1,
        sortBy: sortBy.name,
      });
      expect(res).toHaveProperty("posts");
      expect(res).toHaveProperty("total");
      expect(Array.isArray(res.posts)).toBeTruthy();

      const sorted = res.posts.every((cur, index, posts) => {
        if (index < posts.length - 2) {
          return cur.name.toLowerCase() < posts[index + 1].name.toLowerCase();
        }
        return true;
      });
      expect(sorted).toBeTruthy();
    });

    it("should return sorted posts by dateLastEdited and total", async () => {
      const res = await appController.getPosts({
        query: "",
        page: 1,
        sortBy: sortBy.dateLastEdited,
      });
      expect(res).toHaveProperty("posts");
      expect(res).toHaveProperty("total");
      expect(Array.isArray(res.posts)).toBeTruthy();

      const sorted = res.posts.every((cur, index, posts) => {
        if (index < posts.length - 2) {
          return cur.dateLastEdited < posts[index + 1].dateLastEdited;
        }
        return true;
      });
      expect(sorted).toBeTruthy();
    });

    it("should return sorted posts by name and total with search query", async () => {
      const query = "Dynamic";
      const res = await appController.getPosts({
        query,
        page: 1,
        sortBy: sortBy.name,
      });
      expect(res).toHaveProperty("posts");
      expect(res).toHaveProperty("total");
      expect(Array.isArray(res.posts)).toBeTruthy();

      const sorted = res.posts.every((cur, index, posts) => {
        if (index < posts.length - 2) {
          return cur.name.toLowerCase() < posts[index + 1].name.toLowerCase();
        }
        return true;
      });
      expect(sorted).toBeTruthy();
    });

    it("should return sorted posts by dateLastEdited and total with search query", async () => {
      const query = "Dynamic";
      const res = await appController.getPosts({
        query,
        page: 1,
        sortBy: sortBy.dateLastEdited,
      });
      expect(res).toHaveProperty("posts");
      expect(res).toHaveProperty("total");
      expect(Array.isArray(res.posts)).toBeTruthy();

      const sorted = res.posts.every((cur, index, posts) => {
        if (index < posts.length - 2) {
          return cur.dateLastEdited < posts[index + 1].dateLastEdited;
        }
        return true;
      });
      expect(sorted).toBeTruthy();
    });
  });
});

describe("App end to end", () => {
  let app: INestApplication;
  let appService = {
    getPosts: () => {
      return { posts: ["test"], total: 100 };
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(appService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`/GET posts without params`, () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect(appService.getPosts());
  });

  it(`/GET posts with valid params`, () => {
    return request(app.getHttpServer())
      .get("/?page=1&query=test&sortBy=name")
      .expect(200)
      .expect(appService.getPosts());
  });

  it(`/GET posts invalid page type`, () => {
    return request(app.getHttpServer()).get("/?page=s").expect(400);
  });

  it(`/GET posts invalid sortBy value`, () => {
    return request(app.getHttpServer()).get("/?sortBy=s").expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
