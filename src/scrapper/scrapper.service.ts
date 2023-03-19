import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScrapperHelperService } from 'src/common/helpers/scrapper/scrapper-helper.service';
import { CompaniesService } from 'src/companies/companies.service';
import { JobsService } from 'src/jobs/jobs.service';
import { NewsService } from 'src/news/news.service';
import { acibadem } from 'src/scrappers/scrapper_acibadem';
import { akbank } from 'src/scrappers/scrapper_akbank';
import { anadolugrup } from 'src/scrappers/scrapper_anadolugrup';
import { aposto } from 'src/scrappers/scrapper_aposto';
import { ciceksepeti } from 'src/scrappers/scrapper_ciceksepeti';
import { dreamgames } from 'src/scrappers/scrapper_dreamgames';
import { emlakkatilim } from 'src/scrappers/scrapper_emlakkatilim';
import { getir } from 'src/scrappers/scrapper_getir';
import { insider } from 'src/scrappers/scrapper_insider';
import { isbankasi } from 'src/scrappers/scrapper_isbankasi';
import { koluman } from 'src/scrappers/scrapper_koluman';
import { iyzico } from 'src/scrappers/scrapper_iyzico';
import { siemens } from 'src/scrappers/scrapper_siemens';
import { tiktak } from 'src/scrappers/scrapper_tiktak';
import { trendyol } from 'src/scrappers/scrapper_trendyol';
import { turkcell } from 'src/scrappers/scrapper_turkcell';
import { unilever } from 'src/scrappers/scrapper_unilever';
import { CompanyFilterDto } from 'tools/dtos/company-filter.dto';
import { ScrapperFilterDto } from 'tools/dtos/scrapper-filter.dto';
import { CreateScrapperDto } from './dto/create-scrapper.dto';
import { UpdateScrapperDto } from './dto/update-scrapper.dto';
import { Scrapper } from './entitiy/scrapper.entitiy';
import { vodafone } from 'src/scrappers/scrapper_vodafone';
import { turkhavayollari } from 'src/scrappers/scrapper_turkhavayollari';
import { vakifkatilim } from 'src/scrappers/scrapper_vakitkatilim';
import { kuveytturk } from 'src/scrappers/scrapper_kuveytturk';
import { redbull } from 'src/scrappers/scrapper_redbull';
import { baykar } from 'src/scrappers/scrapper_baykar';
import { binance } from 'src/scrappers/scrapper_binance';
import { apple } from 'src/scrappers/scrapper_apple';
import { samsung } from 'src/scrappers/scrapper_samsung';
import { mastercard } from 'src/scrappers/scrapper_mastercard';
import { peak } from 'src/scrappers/scrapper_peak';
import { danone } from 'src/scrappers/scrapper_danone';
import { loreal } from 'src/scrappers/scrapper_loreal';
import { bosh } from 'src/scrappers/scrapper_bosh';

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
      document_count: false,
      state: '',
    };
    let companies = await this.companiesService.findAll(query);
    (companies.length);
    while (companies.length !== 0) {
      companies = await this.companiesService.findAll(query);
      query.page += 1;
      const response = await this.asyncForEach(companies, (err, response) => {
        (err);
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
        const scrapper_turkcell = await this.scrapperHelperService.runScrapper(
          'turkcell',
          turkcell,
        );
        return await this.create(scrapper_turkcell);
      case 'emlakkatilim':
        const scrapper_emlakkatilim =
          await this.scrapperHelperService.runScrapper(
            'emlakkatilim',
            emlakkatilim,
          );
        return await this.create(scrapper_emlakkatilim);
      case 'acibadem':
        const scrapper_acibadem = await this.scrapperHelperService.runScrapper(
          'acibadem',
          acibadem,
        );
        return await this.create(scrapper_acibadem);
      case 'trendyol':
        const scrapper_trendyol = await this.scrapperHelperService.runScrapper(
          'trendyol',
          trendyol,
        );
        return await this.create(scrapper_trendyol);
      case 'tiktak':
        const scrapper_tiktak = await this.scrapperHelperService.runScrapper(
          'tiktak',
          tiktak,
        );
        return await this.create(scrapper_tiktak);
      case 'aposto':
        const scrapper_aposto = await this.scrapperHelperService.runScrapper(
          'aposto',
          aposto,
        );
        return await this.create(scrapper_aposto);
      case 'ciceksepeti':
        const scrapper_ciceksepeti =
          await this.scrapperHelperService.runScrapper(
            'ciceksepeti',
            ciceksepeti,
          );
        return await this.create(scrapper_ciceksepeti);
      case 'insider':
        const scrapper_insider = await this.scrapperHelperService.runScrapper(
          'insider',
          insider,
        );
        return await this.create(scrapper_insider);
      case 'iyzico':
        const scrapper_iyzico = await this.scrapperHelperService.runScrapper(
          'iyzico',
          iyzico,
        );
        return await this.create(scrapper_iyzico);
      case 'akbank':
        const scrapper_akbank = await this.scrapperHelperService.runScrapper(
          'akbank',
          akbank,
        );
        return await this.create(scrapper_akbank);
      case 'vodafone':
        const scrapper_vodafone = await this.scrapperHelperService.runScrapper(
          'vodafone',
          vodafone,
        );
        return await this.create(scrapper_vodafone);
      case 'turkhavayollari':
        const scrapper_turkhavayollari =
          await this.scrapperHelperService.runScrapper(
            'turkhavayollari',
            turkhavayollari,
          );
        return await this.create(scrapper_turkhavayollari);
      case 'vakifkatilim':
        const scrapper_vakifkatilim =
          await this.scrapperHelperService.runScrapper(
            'vakifkatilim',
            vakifkatilim,
          );
        return await this.create(scrapper_vakifkatilim);
      case 'kuveytturk':
        const scrapper_kuveytturk =
          await this.scrapperHelperService.runScrapper(
            'kuveytturk',
            kuveytturk,
          );
        return await this.create(scrapper_kuveytturk);
      case 'redbull':
        const scrapper_redbull = await this.scrapperHelperService.runScrapper(
          'redbull',
          redbull,
        );
        return await this.create(scrapper_redbull);
      case 'baykar':
        const scrapper_baykar = await this.scrapperHelperService.runScrapper(
          'baykar',
          baykar,
        );
        return await this.create(scrapper_baykar);
      case 'binance':
        const scrapper_binance = await this.scrapperHelperService.runScrapper(
          'binance',
          binance,
        );
        return await this.create(scrapper_binance);
      case 'apple':
        const scrapper_apple = await this.scrapperHelperService.runScrapper(
          'apple',
          apple,
        );
        return await this.create(scrapper_apple);
      case 'samsung':
        const scrapper_samsung = await this.scrapperHelperService.runScrapper(
          'samsung',
          samsung,
        );
        return await this.create(scrapper_samsung);
      case 'mastercard':
        const scrapper_mastercard =
          await this.scrapperHelperService.runScrapper(
            'mastercard',
            mastercard,
          );
        return await this.create(scrapper_mastercard);
      case 'peak':
        const scrapper_peak = await this.scrapperHelperService.runScrapper(
          'peak',
          peak,
        );
        return await this.create(scrapper_peak);
      case 'danone':
        const scrapper_danone = await this.scrapperHelperService.runScrapper(
          'danone',
          danone,
        );
        return await this.create(scrapper_danone);
      case 'loreal':
        const scrapper_loreal = await this.scrapperHelperService.runScrapper(
          'loreal',
          loreal,
        );
        return await this.create(scrapper_loreal);
      case 'bosh':
        const scrapper_bosh = await this.scrapperHelperService.runScrapper(
          'bosh',
          bosh,
        );
        return await this.create(scrapper_bosh);
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
    const scrapper = await this.scrapperModel
      .findOne({ _id: id })
      .populate('scrapper_company')
      .exec();
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
