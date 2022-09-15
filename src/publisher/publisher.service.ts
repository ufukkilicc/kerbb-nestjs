import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublishersFilterDto } from 'tools/dtos/publishers-filter.dto';
import { CreatePublisherDto } from './dtos/create-publisher.dto';
import { UpdatePublisherDto } from './dtos/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import * as cloudinary from 'cloudinary';
const fs = require('fs');

@Injectable()
export class PublisherService {
  constructor(
    @InjectModel(Publisher.name)
    private readonly publisherModel: Model<Publisher>,
  ) {}
  generalSearchQuery = {
    page: 1,
    size: 10,
    sort: 'DESC',
    sort_by: 'publisher_date',
  };
  async findAll(query?: PublishersFilterDto) {
    const searchValue = await { ...this.generalSearchQuery, ...query };
    if (Object.keys(query).length !== 0) {
      return await this.publisherModel
        .find()
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .exec();
    } else {
      return await this.publisherModel
        .find()
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .exec();
    }
  }
  async findOne(id: string) {
    const publisher = await this.publisherModel.findOne({ _id: id }).exec();
    if (!publisher) {
      throw new NotFoundException(`Publisher ${id} was not found`);
    }
    return publisher;
  }
  create(createPublisherDto: CreatePublisherDto) {
    const publisher = new this.publisherModel(createPublisherDto);
    return publisher.save();
  }
  async update(id: string, updatePublisherDto: UpdatePublisherDto) {
    const existingPublisher = await this.publisherModel
      .findOneAndUpdate(
        { _id: id },
        { $set: updatePublisherDto },
        { new: true },
      )
      .exec();

    if (!existingPublisher) {
      throw new NotFoundException(`Publisher ${id} was not found`);
    }
    return existingPublisher;
  }
  async remove(id: string) {
    const publisher = await this.findOne(id);
    return publisher.remove();
  }
  async removeAll(): Promise<any> {
    return await this.publisherModel.deleteMany({}).exec();
  }
  async uploadLogo(file: any, id: string): Promise<any> {
    const publisher = await this.findOne(id);
    let result;
    if (publisher.logo_image_url !== '') {
      try {
        const cloudDeleteResponse = await cloudinary.v2.uploader.destroy(
          publisher.logo_image_public_id,
          function (error, response) {
            return response;
          },
        );
        const cloudResponse = await cloudinary.v2.uploader.upload(
          file.path,
          {
            folder: 'local/publisher_logos',
          },
          function (error, response) {
            return response;
          },
        );
        fs.unlinkSync(file.path);
        return await this.updateLogoImage(
          id,
          cloudResponse.url,
          cloudResponse.public_id,
        );
      } catch (ex) {
        return await ex;
      }
    } else {
      try {
        const cloudResponse = await cloudinary.v2.uploader.upload(
          file.path,
          {
            folder: 'local/publisher_logos',
          },
          function (error, response) {
            return response;
          },
        );
        fs.unlinkSync(file.path);
        return await this.updateLogoImage(
          id,
          cloudResponse.url,
          cloudResponse.public_id,
        );
      } catch (ex) {
        return await ex;
      }
    }
  }
  async updateLogoImage(id: string, imageUrl: string, publicId: string) {
    return await this.publisherModel
      .findByIdAndUpdate(
        { _id: id },
        { logo_image_url: imageUrl, logo_image_public_id: publicId },
        { new: true },
      )
      .exec();
  }
}
