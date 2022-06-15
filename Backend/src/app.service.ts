import { Injectable } from "@nestjs/common";
import { postDto } from "./app.dto";
import { postsModel } from "./posts.model";
@Injectable()
export class AppService {
  getPosts(
    query: string,
    skip: number,
    limit: number
  ): { posts: Array<postDto>; total: number } {
    if (query) {
      return new postsModel().search(query).skip(skip).limit(limit).get();
    }
    return new postsModel().skip(skip).limit(limit).get();
  }
}
