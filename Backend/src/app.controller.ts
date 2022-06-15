import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { postDto } from "./app.dto";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPosts(): Array<postDto> {
    return this.appService.getPosts();
  }
}
