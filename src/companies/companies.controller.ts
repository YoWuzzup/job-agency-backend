import { Controller, Get, Param, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('all')
  async getCompanies(@Query() filter: any) {
    const companies = await this.companiesService.getCompanies(filter);

    return companies;
  }

  @Get('getAllJobs')
  async getAllJobs(@Query() filter: any) {
    const jobs = await this.companiesService.getJobs(filter);

    return jobs;
  }

  @Get('jobs/:id')
  async getSingleJob(@Param('id') id: string) {
    return this.companiesService.getSingleJob(id);
  }

  @Get('introInfo')
  async getLengthInfo() {
    return this.companiesService.getLengthInfo();
  }
}
