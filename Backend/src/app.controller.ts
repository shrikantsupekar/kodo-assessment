import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { postDto, queryDto } from "./app.dto";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPosts(@Query() { query, page, sortBy }: queryDto): {
    posts: Array<postDto>;
    total: number;
  } {
    return this.appService.getPosts(query, +page, sortBy);
  }
}
