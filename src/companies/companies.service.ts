import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceService } from 'libs/services/resource.service';
import { Model } from 'mongoose';
import { CompanyFilterDto } from 'tools/dtos/company-filter.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entitiy';
import * as cloudinary from 'cloudinary';
import { Job } from 'src/jobs/entities/job.entitiy';
const fs = require('fs');

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
  ) {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }
  generalSearchQuery = {
    page: 1,
    size: 10,
    sort: 'ASC',
    sort_by: 'name',
    query_text: '',
    search_name_by: 'name',
    search_scrape_by: 'scrape_name',
    search_highlighted_by: 'is_highlighted',
    search_active_by: 'is_active',
    is_highlighted: false,
    document_count: false,
    is_active: false,
    state: '',
  };
  async findAll(query?: CompanyFilterDto) {
    const searchValue = await { ...this.generalSearchQuery, ...query };
    const userRegex = new RegExp(searchValue.query_text, 'i');
    if (Object.keys(query).length !== 0) {
      if (searchValue.is_highlighted) {
        return await this.companyModel
          .aggregate()
          .match({
            $or: [
              {
                $and: [
                  {
                    [searchValue.search_name_by]: userRegex,
                  },
                  {
                    [searchValue.search_highlighted_by]:
                      searchValue.is_highlighted,
                  },
                ],
              },
              {
                $and: [
                  {
                    [searchValue.search_scrape_by]: userRegex,
                  },
                  {
                    [searchValue.search_highlighted_by]:
                      searchValue.is_highlighted,
                  },
                ],
              },
            ],
          })
          .sort({
            [searchValue.sort_by]: searchValue.sort === 'ASC' ? 'asc' : 'desc',
          })
          .skip(searchValue.size * (searchValue.page - 1))
          .limit(Math.max(0, searchValue.size))
          .lookup({
            from: 'jobs',
            localField: 'scrape_name',
            foreignField: 'scrape_name',
            as: 'highlighted_jobs',
            pipeline: [{ $sort: { date: -1 } }, { $limit: 2 }],
          })
          .exec();
      } else if (searchValue.is_active) {
        if (searchValue.document_count) {
          return [await this.companyModel
            .find({})
            .or([
              {
                $and: [
                  {
                    [searchValue.search_name_by]: userRegex,
                  },
                  {
                    [searchValue.search_active_by]: searchValue.is_active,
                  },
                ],
              },
              {
                $and: [
                  {
                    [searchValue.search_scrape_by]: userRegex,
                  },
                  {
                    [searchValue.search_active_by]: searchValue.is_active,
                  },
                ],
              },
            ])
            .countDocuments()
            .exec()];
        } else {
          return await this.companyModel
            .aggregate()
            .match({
              $or: [
                {
                  $and: [
                    {
                      [searchValue.search_name_by]: userRegex,
                    },
                    {
                      [searchValue.search_active_by]: searchValue.is_active,
                    },
                  ],
                },
                {
                  $and: [
                    {
                      [searchValue.search_scrape_by]: userRegex,
                    },
                    {
                      [searchValue.search_active_by]: searchValue.is_active,
                    },
                  ],
                },
              ],
            })
            .sort(`${searchValue.sort_by}`)
            .skip(searchValue.size * (searchValue.page - 1))
            .limit(Math.max(0, searchValue.size))
            .lookup({
              from: 'jobs',
              localField: 'scrape_name',
              foreignField: 'scrape_name',
              as: 'highlighted_jobs',
              pipeline: [{ $sort: { date: -1 } }, { $limit: 2 }],
            })
            .exec();
        }
      } else if (searchValue.state === 'active') {
        return await this.companyModel
          .aggregate()
          .match({ ['is_active']: true })
          .group({
            _id: { is_active: '$is_active' },
            total: { $sum: 1 },
          })
          .sort(`${searchValue.sort_by}`)
          .skip(searchValue.size * (searchValue.page - 1))
          .limit(Math.max(0, searchValue.size))
          .exec();
      } else {
        return await this.companyModel
          .aggregate()
          .match({
            $or: [
              {
                [searchValue.search_name_by]: userRegex,
              },
              {
                [searchValue.search_scrape_by]: userRegex,
              },
            ],
          })
          .sort({
            [searchValue.sort_by]: searchValue.sort === 'ASC' ? 'asc' : 'desc',
          })
          .skip(searchValue.size * (searchValue.page - 1))
          .limit(Math.max(0, searchValue.size))
          .lookup({
            from: 'jobs',
            localField: 'scrape_name',
            foreignField: 'scrape_name',
            as: 'highlighted_jobs',
            pipeline: [{ $sort: { date: -1 } }, { $limit: 2 }],
          })
          .exec();
      }
    } else {
      return await this.companyModel
        .find({})
        .limit(Math.max(0, this.generalSearchQuery.size))
        .skip(this.generalSearchQuery.size * (this.generalSearchQuery.page - 1))
        .sort([
          [`${this.generalSearchQuery.sort_by}`, this.generalSearchQuery.sort],
        ])
        .populate([{ path: 'company_tags', populate: 'tag_type' }])
        .exec();
    }
  }
  async findOne(id: string) {
    const company = await this.companyModel.findOne({ _id: id }).exec();
    if (!company) {
      throw new NotFoundException(`company ${id} was not found`);
    }
    return company;
  }
  create(createcompanyDto: CreateCompanyDto) {
    const company = new this.companyModel(createcompanyDto);
    return company.save();
  }
  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const existingCompany = await this.companyModel
      .findOneAndUpdate({ _id: id }, { $set: updateCompanyDto }, { new: true })
      .exec();
    const scrapeName = existingCompany.scrape_name;
    await this.jobModel.updateMany(
      { scrape_name: scrapeName },
      { $set: { company: existingCompany.name } },
    );
    if (!existingCompany) {
      throw new NotFoundException(`Company ${id} was not found`);
    }
    return existingCompany;
  }
  async incrementView(id: string) {
    const existingCompany = await this.companyModel
      .findOneAndUpdate(
        { _id: id },
        { $inc: { company_views: 1 } },
        { new: true },
      )
      .exec();

    if (!existingCompany) {
      throw new NotFoundException(`Company ${id} was not found`);
    }
    return existingCompany;
  }
  async highlightCompany(id: string) {
    const company = await this.findOne(id);
    if (!company.is_active && !company.is_highlighted) {
      throw new BadRequestException(
        `Company ${id} can not be highlighted if it's not active`,
      );
    }
    if (company.is_highlighted) {
      const existingCompany = await this.companyModel
        .findOneAndUpdate(
          { _id: id },
          {
            $set: {
              is_highlighted: !company.is_highlighted,
              highlight_order: null,
            },
          },
          { new: true },
        )
        .populate([{ path: 'company_tags', populate: 'tag_type' }])
        .exec();
      return existingCompany;
    } else {
      const existingCompany = await this.companyModel
        .findOneAndUpdate(
          { _id: id },
          { $set: { is_highlighted: !company.is_highlighted } },
          { new: true },
        )
        .populate([{ path: 'company_tags', populate: 'tag_type' }])
        .exec();
      return existingCompany;
    }
  }
  async highlightOrderCompany(id: string, highlight_order: number) {
    const company = await this.findOne(id);
    if (!company.is_active && !company.is_highlighted) {
      throw new BadRequestException(
        `Company ${id} highlight order can not be setted if it's not active`,
      );
    }
    const existingCompany = await this.companyModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { highlight_order: highlight_order } },
        { new: true },
      )
      .populate([{ path: 'company_tags', populate: 'tag_type' }])
      .exec();

    if (!existingCompany) {
      throw new NotFoundException(`Company ${id} was not found`);
    }
    return existingCompany;
  }
  async activateCompany(id: string) {
    const company = await this.findOne(id);
    const existingCompany = await this.companyModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { is_active: !company.is_active, is_highlighted: false } },
        { new: true },
      )
      .exec();

    if (!existingCompany) {
      throw new NotFoundException(`Company ${id} was not found`);
    }
    if (company.is_active) {
      await this.jobModel.deleteMany({ scrape_name: company.scrape_name });
    }
    return existingCompany;
  }
  async approveCompany(id: string) {
    const company = await this.findOne(id);
    const existingCompany = await this.companyModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { is_approved: !company.is_approved } },
        { new: true },
      )
      .exec();

    if (!existingCompany) {
      throw new NotFoundException(`Company ${id} was not found`);
    }
    return existingCompany;
  }
  async remove(id: string) {
    const company = await this.findOne(id);
    await this.jobModel.deleteMany({ scrape_name: company.scrape_name });
    return company.remove();
  }
  async removeAll(): Promise<any> {
    return await this.companyModel.deleteMany({}).exec();
  }
  async uploadLogo(file: any, id: string): Promise<any> {
    const company = await this.findOne(id);
    let result;
    if (company.logo_image_url !== '') {
      try {
        const cloudDeleteResponse = await cloudinary.v2.uploader.destroy(
          company.logo_image_public_id,
          function (error, response) {
            return response;
          },
        );
        const cloudResponse = await cloudinary.v2.uploader.upload(
          file.path,
          {
            folder: 'local/company_logos',
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
            folder: 'local/company_logos',
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
  async uploadCover(file: any, id: string): Promise<any> {
    const company = await this.findOne(id);
    let result;
    if (company.cover_image_url !== '') {
      try {
        const cloudDeleteResponse = await cloudinary.v2.uploader.destroy(
          company.cover_image_public_id,
          function (error, response) {
            return response;
          },
        );
        const cloudResponse = await cloudinary.v2.uploader.upload(
          file.path,
          {
            folder: 'local/company_covers',
          },
          function (error, response) {
            return response;
          },
        );
        fs.unlinkSync(file.path);
        return await this.updateCoverImage(
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
            folder: 'local/company_covers',
          },
          function (error, response) {
            return response;
          },
        );
        fs.unlinkSync(file.path);
        return await this.updateCoverImage(
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
    return await this.companyModel
      .findByIdAndUpdate(
        { _id: id },
        { logo_image_url: imageUrl, logo_image_public_id: publicId },
        { new: true },
      )
      .exec();
  }
  async updateCoverImage(id: string, imageUrl: string, publicId: string) {
    return await this.companyModel
      .findByIdAndUpdate(
        { _id: id },
        { cover_image_url: imageUrl, cover_image_public_id: publicId },
        { new: true },
      )
      .exec();
  }
}
