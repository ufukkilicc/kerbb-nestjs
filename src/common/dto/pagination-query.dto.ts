import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @Type(()=>String)
    title:string

    @IsOptional()
    @Type(()=>String)
    company:string
}
