import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";
import { Type } from "class-transformer";

export class postDto {
  @IsNotEmpty()
  @IsString()
  name: String;

  @IsNotEmpty()
  @IsUrl()
  image: String;

  @IsNotEmpty()
  @IsString()
  description: String;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateLastEdited: Date;
}

enum sortBy {
  name = "name",
  dateLastEdited = "dateLastEdited",
}
export class queryDto {
  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @IsOptional()
  @IsEnum(sortBy)
  sortBy: sortBy;
}
