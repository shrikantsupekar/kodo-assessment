import { postDto } from "./app.dto";
import { plainToClass } from "class-transformer";
const fs = require("fs");
const data = fs.readFileSync("src/mock_data.json", "utf8");

const posts: Array<postDto> = JSON.parse(data).map((p) => {
  return plainToClass(postDto, p);
});

export class postsModel {
  posts: Array<postDto> = [...posts];
  skipPosts: number = null;
  limitPosts: number = null;
  search(query, fields = ["name", "description"]): postsModel {
    this.posts = this.posts.filter((post) => {
      return fields.some((field) => {
        return query
          .replace(/"([\s\S]*?)"/, function (s) {
            return s.replaceAll(" ", "_").replaceAll('"', "");
          })
          .split(" ")
          .every((term) => {
            return post[field].indexOf(term.replaceAll("_", " ")) > -1;
          });
      });
    });

    return this;
  }

  sort(sortBy: string): postsModel {
    this.posts.sort((a, b) => {
      if (typeof a[sortBy] === "string")
        return a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 : 1;
      return a[sortBy] < b[sortBy] ? -1 : 1;
    });
    return this;
  }

  skip(s: number): postsModel {
    this.skipPosts = s;
    return this;
  }

  limit(l: number): postsModel {
    this.limitPosts = l;
    return this;
  }

  get(): { posts: Array<postDto>; total: number } {
    const total = this.posts.length;
    if (this.skipPosts) this.posts = this.posts.slice(this.skipPosts);
    if (this.limitPosts) this.posts = this.posts.slice(0, this.limitPosts);
    return {
      posts: this.posts,
      total,
    };
  }
}
