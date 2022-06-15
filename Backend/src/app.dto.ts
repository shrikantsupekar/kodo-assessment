import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  isString,
  IsString,
  IsUrl,
} from "class-validator";

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
  @IsString()
  dateLastEdited: String;
}
