import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNewstDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-newst.dto';
import { News } from './entities/news.entitiy';
import * as cloudinary from 'cloudinary';
import { NewsFilterDto } from 'tools/dtos/news-filter.dto';
const fs = require('fs');

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<News>,
  ) {}
  generalSearchQuery = {
    page: 1,
    size: 10,
    sort: 'DESC',
    sort_by: 'news_date',
    query_text: '',
  };
  async findAll(query?: NewsFilterDto) {
    if (Object.keys(query).length !== 0) {
      const searchValue = await { ...this.generalSearchQuery, ...query };
      const userRegex = new RegExp(searchValue.query_text.trim(), 'i');
      console.log(userRegex);
      return this.newsModel
        .find({ news_title: userRegex })
        .limit(Math.max(0, searchValue.size))
        .skip(searchValue.size * (searchValue.page - 1))
        .sort([[`${searchValue.sort_by}`, searchValue.sort]])
        .populate({ path: 'news_tags', populate: { path: 'tag_type' } })
        .populate('news_publisher')
        .exec();
    } else {
      return this.newsModel
        .find()
        .limit(Math.max(0, this.generalSearchQuery.size))
        .skip(this.generalSearchQuery.size * (this.generalSearchQuery.page - 1))
        .sort([
          [`${this.generalSearchQuery.sort_by}`, this.generalSearchQuery.sort],
        ])
        .populate({ path: 'news_tags', populate: { path: 'tag_type' } })
        .populate('news_publisher')
        .exec();
    }
  }
  async findOne(id: string) {
    const news = await this.newsModel
      .findOne({ _id: id })
      .populate('news_tags')
      .populate('news_publisher')
      .exec();
    if (!news) {
      throw new NotFoundException(`News ${id} was not found`);
    }
    return news;
  }
  create(createNewsDto: CreateNewstDto) {
    const news = new this.newsModel(createNewsDto);
    return news.save();
  }
  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const existingNews = await this.newsModel
      .findOneAndUpdate({ _id: id }, { $set: updateNewsDto }, { new: true })
      .populate('news_tags')
      .populate('news_publisher')
      .exec();

    if (!existingNews) {
      throw new NotFoundException(`News ${id} was not found`);
    }
    return existingNews;
  }
  async incrementView(id: string) {
    const existingNews = await this.newsModel
      .findOneAndUpdate({ _id: id }, { $inc: { news_views: 1 } }, { new: true })
      .populate('news_tags')
      .populate('news_publisher')
      .exec();

    if (!existingNews) {
      throw new NotFoundException(`News ${id} was not found`);
    }
    return existingNews;
  }
  async remove(id: string) {
    const news = await this.findOne(id);
    return news.remove();
  }
  async removeAll(): Promise<any> {
    return await this.newsModel.deleteMany({}).exec();
  }
  async upload(file: any, id: string): Promise<any> {
    const company = await this.findOne(id);
    let result;
    if (company.image_url !== '') {
      try {
        const cloudDeleteResponse = await cloudinary.v2.uploader.destroy(
          company.image_public_id,
          function (error, response) {
            return response;
          },
        );
        const cloudResponse = await cloudinary.v2.uploader.upload(
          file.path,
          {
            folder: 'local/news_thumbnails',
          },
          function (error, response) {
            return response;
          },
        );
        fs.unlinkSync(file.path);
        return await this.updateImage(
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
            folder: 'local/news_thumbnails',
          },
          function (error, response) {
            return response;
          },
        );
        fs.unlinkSync(file.path);
        return await this.updateImage(
          id,
          cloudResponse.url,
          cloudResponse.public_id,
        );
      } catch (ex) {
        return await ex;
      }
    }
  }
  async updateImage(id: string, imageUrl: string, publicId: string) {
    return await this.newsModel
      .findByIdAndUpdate(
        { _id: id },
        { image_url: imageUrl, image_public_id: publicId },
        { new: true },
      )
      .populate('news_tags')
      .populate('news_publisher')
      .exec();
  }
  async uploadImageSecondary(file: any, id: string): Promise<any> {
    console.log('hey');
    const company = await this.findOne(id);
    let result;
    if (company.image_url_secondary !== '') {
      try {
        const cloudDeleteResponse = await cloudinary.v2.uploader.destroy(
          company.image_public_id_secondary,
          function (error, response) {
            return response;
          },
        );
        const cloudResponse = await cloudinary.v2.uploader.upload(
          file.path,
          {
            folder: 'local/news_thumbnails',
          },
          function (error, response) {
            return response;
          },
        );
        fs.unlinkSync(file.path);
        return await this.updateImageSecondary(
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
            folder: 'local/news_thumbnails',
          },
          function (error, response) {
            return response;
          },
        );
        fs.unlinkSync(file.path);
        return await this.updateImageSecondary(
          id,
          cloudResponse.url,
          cloudResponse.public_id,
        );
      } catch (ex) {
        return await ex;
      }
    }
  }
  async updateImageSecondary(id: string, imageUrl: string, publicId: string) {
    return await this.newsModel
      .findByIdAndUpdate(
        { _id: id },
        { image_url_secondary: imageUrl, image_public_id_secondary: publicId },
        { new: true },
      )
      .populate('news_tags')
      .populate('news_publisher')
      .exec();
  }
}
