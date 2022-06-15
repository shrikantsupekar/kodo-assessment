import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { postDto } from "./app.dto";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPosts(
    @Query("query") query: string,
    @Query("skip") skip: number,
    @Query("limit") limit: number
  ): { posts: Array<postDto>; total: number } {
    return this.appService.getPosts(query, +skip, +limit);
  }
}
