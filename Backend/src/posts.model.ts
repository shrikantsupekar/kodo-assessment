import { postDto } from "./app.dto";
const fs = require("fs");
const data = fs.readFileSync("src/mock_data.json", "utf8");

const posts: Array<postDto> = JSON.parse(data);

export class postsModel {
  posts: Array<postDto> = posts;
  skipPosts: number = null;
  limitPosts: number = null;
  search(query, fields = ["name", "description"]) {
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

  skip(s: number) {
    this.skipPosts = s;
    return this;
  }

  limit(l: number) {
    this.limitPosts = l;
    return this;
  }

  get() {
    const total = this.posts.length;
    if (this.skipPosts) this.posts = this.posts.slice(this.skipPosts);
    if (this.limitPosts) this.posts = this.posts.slice(0, this.limitPosts);
    return {
      posts: this.posts,
      total,
    };
  }
}
