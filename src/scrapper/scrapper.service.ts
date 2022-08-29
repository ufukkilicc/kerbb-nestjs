import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScrapperHelperService } from 'src/common/helpers/scrapper/scrapper-helper.service';
import { CompaniesService } from 'src/companies/companies.service';
import { JobsService } from 'src/jobs/jobs.service';
import { NewsService } from 'src/news/news.service';
import { anadolugrup } from 'src/scrappers/scrapper_anadolugrup';
import { dreamgames } from 'src/scrappers/scrapper_dreamgames';
import { getir } from 'src/scrappers/scrapper_getir';
import { isbankasi } from 'src/scrappers/scrapper_isbankasi';
import { koluman } from 'src/scrappers/scrapper_koluman';
import { siemens } from 'src/scrappers/scrapper_siemens';
import { turkcell } from 'src/scrappers/scrapper_turkcell';
import { unilever } from 'src/scrappers/scrapper_unilever';
import { CompanyFilterDto } from 'tools/dtos/company-filter.dto';
import { ScrapperFilterDto } from 'tools/dtos/scrapper-filter.dto';
import { CreateScrapperDto } from './dto/create-scrapper.dto';
import { UpdateScrapperDto } from './dto/update-scrapper.dto';
import { Scrapper } from './entitiy/scrapper.entitiy';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly jobsService: JobsService,
    private readonly newsService: NewsService,
    private readonly companiesService: CompaniesService,
    private readonly scrapperHelperService: ScrapperHelperService,
    @InjectModel(Scrapper.name) private readonly scrapperModel: Model<Scrapper>,
  ) {}
  async asyncForEach(array, callback) {
    let scrapperArray = [];
    for (let index = 0; index < array.length; index++) {
      if (array[index].is_active) {
        const scrapper = await this.scrapeOne(array[index].scrape_name, true);
        scrapperArray.push(scrapper);
      }
    }
    return scrapperArray;
  }
  async scrapeAll() {
    await this.removeAll();
    let success_count: number = 0;
    let success_companies: string[] = [];
    let false_count: number = 0;
    let false_companies: string[] = [];
    let time_lasts: number = 0;
    let jobs_found_count: number = 0;
    let jobs_added_count: number = 0;
    let jobs_extracted_count: number = 0;
    let query: CompanyFilterDto = {
      page: 1,
      size: 10,
      sort: 'ASC',
      sort_by: 'name',
      query_text: '',
      search_name_by: 'name',
      search_scrape_by: 'scrape_name',
      search_highlighted_by: 'is_highlighted',
      is_highlighted: false,
      is_active: true,
      state: '',
    };
    let companies = await this.companiesService.findAll(query);
    while (companies.length !== 0) {
      companies = await this.companiesService.findAll(query);
      query.page += 1;
      const response = await this.asyncForEach(companies, (err, response) => {
        console.log(err);
      });

      response.forEach((scrapper) => {
        if (scrapper.scrapper_success === true) {
          success_count++;
          success_companies.push(scrapper.scrapper_title);
        } else {
          false_count++;
          false_companies.push(scrapper.scrapper_title);
        }
        time_lasts += scrapper.scrapper_time_lasts;
        jobs_found_count += scrapper.scrapper_jobs_found;
        jobs_added_count += scrapper.scrapper_jobs_added_count;
        jobs_extracted_count += scrapper.scrapper_jobs_extracted_count;
      });
    }
    return await {
      success_count,
      success_companies,
      false_count,
      false_companies,
      time_lasts,
      jobs_found_count,
      jobs_added_count,
      jobs_extracted_count,
    };
  }
  async scrapeOne(companyName: string, scrapeAll: boolean) {
    console.log(companyName);
    if (!scrapeAll) {
      const generalSearchQuery = {
        page: 1,
        size: 10,
        sort: 'ASC',
        sort_by: 'scrapper_title',
        query_text: companyName,
        search_name_by: 'scrapper_title',
        success: false,
      };
      const scrapperArray = await this.findAll(generalSearchQuery);
      const scrapper = scrapperArray[0];
      if (scrapper != undefined) {
        const scrapperDeleteResponse = await this.remove(scrapper._id);
      }
    }
    switch (companyName) {
      case 'getir':
        const scrapper_getir = await this.scrapperHelperService.runScrapper(
          'getir',
          getir,
        );
        return await this.create(scrapper_getir);
      case 'dreamgames':
        const scrapper_dreamgames =
          await this.scrapperHelperService.runScrapper(
            'dreamgames',
            dreamgames,
          );
        return await this.create(scrapper_dreamgames);
      case 'anadolugrup':
        const scrapper_anadolugrup =
          await this.scrapperHelperService.runScrapper(
            'anadolugrup',
            anadolugrup,
          );
        return await this.create(scrapper_anadolugrup);
      case 'isbankasi':
        const scrapper_isbankasi = await this.scrapperHelperService.runScrapper(
          'isbankasi',
          isbankasi,
        );
        return await this.create(scrapper_isbankasi);
      case 'siemens':
        const scrapper_siemens = await this.scrapperHelperService.runScrapper(
          'siemens',
          siemens,
        );
        return await this.create(scrapper_siemens);
      case 'unilever':
        const scrapper_unilever = await this.scrapperHelperService.runScrapper(
          'unilever',
          unilever,
        );
        return await this.create(scrapper_unilever);
      case 'koluman':
        const scrapper_koluman = await this.scrapperHelperService.runScrapper(
          'koluman',
          koluman,
        );
        return await this.create(scrapper_koluman);
      case 'turkcell':
        // NOT YET FINISHED
        const scrapper_turkcell = await this.scrapperHelperService.runScrapper(
          'turkcell',
          turkcell,
        );
        return await this.create(scrapper_turkcell);
      default:
        let scrapper: Scrapper;
        return scrapper;
    }
  }
  generalSearchQuery = {
    page: 1,
    size: 10,
    sort: 'ASC',
    sort_by: 'scrapper_title',
    query_text: '',
    search_name_by: 'scrapper_title',
    success: false,
  };
  async findAll(query?: ScrapperFilterDto) {
    const searchValue = await { ...this.generalSearchQuery, ...query };
    const userRegex = new RegExp(searchValue.query_text, 'i');

    if (Object.keys(query).length !== 0) {
      if (searchValue.success) {
        return await this.scrapperModel
          .aggregate()
          .match({
            ['scrapper_success']: true,
          })
          .group({
            _id: { success: '$scrapper_success' },
            total: { $sum: 1 },
            jobs_found: { $sum: '$scrapper_jobs_found' },
            jobs_added: { $sum: '$scrapper_jobs_added_count' },
            jobs_extracted: { $sum: '$scrapper_jobs_extracted_count' },
            time_lasts: { $sum: '$scrapper_time_lasts' },
          })
          .sort(`${searchValue.sort_by}`)
          .skip(searchValue.size * (searchValue.page - 1))
          .limit(Math.max(0, searchValue.size))
          .exec();
      } else {
        return await this.scrapperModel
          .find({ [searchValue.search_name_by]: userRegex })
          .limit(Math.max(0, searchValue.size))
          .skip(searchValue.size * (searchValue.page - 1))
          .sort([[`${searchValue.sort_by}`, searchValue.sort]])
          .populate('scrapper_company')
          .exec();
      }
    } else {
      return await this.scrapperModel
        .find({})
        .sort(`${searchValue.sort_by}`)
        .skip(searchValue.size * (searchValue.page - 1))
        .limit(Math.max(0, searchValue.size))
        .populate('scrapper_company')
        .exec();
    }
  }
  async findOne(id: string) {
    const scrapper = await this.scrapperModel.findOne({ _id: id }).populate('scrapper_company').exec();
    if (!scrapper) {
      throw new NotFoundException(`Scrapper ${id} was not found`);
    }
    return scrapper;
  }
  create(createScrapperDto: CreateScrapperDto) {
    const scrapper = new this.scrapperModel(createScrapperDto);
    return scrapper.save();
  }
  async update(id: string, updateScrapperDto: UpdateScrapperDto) {
    const existingScrapper = await this.scrapperModel
      .findOneAndUpdate({ _id: id }, { $set: updateScrapperDto }, { new: true })
      .exec();

    if (!existingScrapper) {
      throw new NotFoundException(`Scrapper ${id} was not found`);
    }
    return existingScrapper;
  }
  async remove(id: string) {
    const scrapper = await this.findOne(id);
    return scrapper.remove();
  }
  async removeAll(): Promise<any> {
    return await this.scrapperModel.deleteMany({}).exec();
  }
}
