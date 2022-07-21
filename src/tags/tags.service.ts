import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagFilterDto } from 'tools/dtos/tag-filter.dto';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { Tag } from './entities/tag.entitiy';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private readonly tagModel: Model<Tag>) {}
  generalSearchQuery = {
    page: 1,
    size: 10,
    sort: 'ASC',
    sort_by: 'tag_name',
    search_tag_type_by: 'tag_type.tag_type_name',
    tag_type: '',
  };
  async findAll(query?: TagFilterDto) {
    const searchValue = await { ...this.generalSearchQuery, ...query };
    const tagTypeRegex = new RegExp(searchValue.tag_type, 'i');
    if (Object.keys(query).length !== 0) {
      if (query.tag_type) {
        return this.tagModel
          .find({ 'tag_type.tag_type_name': 'Job' })
          .limit(Math.max(0, searchValue.size))
          .skip(searchValue.size * (searchValue.page - 1))
          .sort([[`${searchValue.sort_by}`, searchValue.sort]])
          .populate('tag_type')
          .exec();
      } else {
        return this.tagModel
          .find({})
          .limit(Math.max(0, searchValue.size))
          .skip(searchValue.size * (searchValue.page - 1))
          .sort([[`${searchValue.sort_by}`, searchValue.sort]])
          .populate('tag_type')
          .exec();
      }
    } else {
      return this.tagModel
        .find({})
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .populate('tag_type')
        .exec();
    }
  }
  async findOne(id: string) {
    const tag = await this.tagModel
      .findOne({ _id: id })
      .populate('tag_type')
      .exec();
    if (!tag) {
      throw new NotFoundException(`Tag ${id} was not found`);
    }
    return tag;
  }
  create(createTagDto: CreateTagDto) {
    const tag = new this.tagModel(createTagDto);
    return tag.save();
  }
  async update(id: string, updateTagDto: UpdateTagDto) {
    const existingTag = await this.tagModel
      .findOneAndUpdate({ _id: id }, { $set: updateTagDto }, { new: true })
      .exec();

    if (!existingTag) {
      throw new NotFoundException(`Tag ${id} was not found`);
    }
    return existingTag;
  }
  async remove(id: string) {
    const tag = await this.findOne(id);
    return tag.remove();
  }
  async removeAll(): Promise<any> {
    return await this.tagModel.deleteMany({}).exec();
  }
}
