import { Injectable } from "@nestjs/common";
import { postDto } from "./app.dto";
import { postsModel } from "./posts.model";
@Injectable()
export class AppService {
  getPosts(
    query: string,
    page: number,
    sortBy: string
  ): { posts: Array<postDto>; total: number } {
    const limit = 10;
    let skip = ((page || 1) - 1) * limit;
    let q = new postsModel();
    if (query) {
      q = q.search(query);
    }
    if (sortBy) {
      q = q.sort(sortBy);
    }
    return q.skip(skip).limit(limit).get();
  }
}
