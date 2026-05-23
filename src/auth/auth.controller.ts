import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from '../common/auth/decorators/public.decorator';
import { UserCreateDto } from '../users/interface/userCreateDto';

@Controller('login')
export class AuthController {
  constructor(private service: AuthService) {}

  @Public()
  @Post()
  async singIn(@Body() authDto: AuthDto) {
    const data = await this.service.singIn(authDto.email, authDto.password);
    return data;
  }
  @Public()
  @Post('/register')
  async register(@Body() registerUser: UserCreateDto) {
    const data = await this.service.register(registerUser);
    return data;
  }
}
