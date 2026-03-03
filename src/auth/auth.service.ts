import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export interface LoginResponse {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(private httpService: HttpService) {}

  async singIn(email: string, password: string) {
    const response = await firstValueFrom(
      this.httpService.post<LoginResponse>(
        'https://auth-service-staging.livup-staging.com/api/auth/email/signin',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } },
      ),
    );
    return response.data;
  }
}
