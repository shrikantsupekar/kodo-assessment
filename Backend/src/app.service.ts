import { Injectable } from "@nestjs/common";
import { postDto } from "./app.dto";
@Injectable()
export class AppService {
  getPosts(): Array<postDto> {
    return [];
  }
}
