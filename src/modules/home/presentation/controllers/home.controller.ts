import { Controller, Get, Query } from '@nestjs/common';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { HomeService } from '../../application/home.service';
import { GetHomeQueryDto } from '../dto/get-home-query.dto';
import { HomeDto } from '../dto/home.dto';
import { HomeMapper } from '../mappers/home.mapper';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHome(
    @CurrentProfileId() profileId: string,
    @Query() query: GetHomeQueryDto,
  ): Promise<HomeDto> {
    const home = await this.homeService.getHome(profileId, query.date);

    return HomeMapper.toDto(home);
  }
}
