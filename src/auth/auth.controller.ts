import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginResponse } from './auth.service';
import { Public } from '../common/auth/decorators/public.decorator';

@Controller('login')
export class AuthController {
  constructor(private service: AuthService) {}

  @Public()
  @Post()
  async singIn(@Body() authDto: AuthDto): Promise<LoginResponse> {
    const data = await this.service.singIn(authDto.email, authDto.password);
    return data;
  }
}
