import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagTypeFilterDto } from 'tools/dtos/tag-type-filter.dto';
import { CreateTagTypeDto } from './dtos/create-tag-type.dto';
import { UpdateTagTypeDto } from './dtos/update-tag-type.dto';
import { TagType } from './entities/tag-type.entity';

@Injectable()
export class TagTypesService {
  constructor(
    @InjectModel(TagType.name) private readonly tagTypeModel: Model<TagType>,
  ) {}
  generalSearchQuery = {
    page: 1,
    size: 10,
    sort: 'ASC',
    sort_by: 'tag_type_name',
  };
  async findAll(query?: TagTypeFilterDto) {
    const searchValue = await { ...this.generalSearchQuery, ...query };
    if (Object.keys(query).length !== 0) {
      return this.tagTypeModel
        .find({})
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .exec();
    } else {
      return this.tagTypeModel
        .find({})
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .exec();
    }
  }
  async findOne(id: string) {
    const tagType = await this.tagTypeModel.findOne({ _id: id }).exec();
    if (!tagType) {
      throw new NotFoundException(`Tag Type ${id} was not found`);
    }
    return tagType;
  }
  create(createTagTypeDto: CreateTagTypeDto) {
    const tagType = new this.tagTypeModel(createTagTypeDto);
    return tagType.save();
  }
  async update(id: string, updateTagTypeDto: UpdateTagTypeDto) {
    const existingTagType = await this.tagTypeModel
      .findOneAndUpdate({ _id: id }, { $set: updateTagTypeDto }, { new: true })
      .exec();

    if (!existingTagType) {
      throw new NotFoundException(`Tag Type ${id} was not found`);
    }
    return existingTagType;
  }
  async remove(id: string) {
    const tagType = await this.findOne(id);
    return tagType.remove();
  }
  async removeAll(): Promise<any> {
    return await this.tagTypeModel.deleteMany({}).exec();
  }
}
