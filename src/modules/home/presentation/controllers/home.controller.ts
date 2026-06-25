import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { ApiStandardErrorResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { HomeService } from '../../application/home.service';
import { GetHomeQueryDto } from '../dto/get-home-query.dto';
import { HomeDto } from '../dto/home.dto';
import { HomeMapper } from '../mappers/home.mapper';

@ApiProtectedTag('Home')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener datos de la pantalla principal',
    description:
      'Agrega próxima comida, comidas del día, racha, registros del día y recomendación para la fecha indicada.',
  })
  @ApiOkResponse({ type: HomeDto })
  @ApiStandardErrorResponses()
  async getHome(
    @CurrentProfileId() profileId: string,
    @Query() query: GetHomeQueryDto,
  ): Promise<HomeDto> {
    const home = await this.homeService.getHome(profileId, query.date);

    return HomeMapper.toDto(home);
  }
}
