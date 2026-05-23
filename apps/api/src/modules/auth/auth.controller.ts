import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Public } from '../../common/decorators/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: {
    clinicName: string
    adminName: string
    email: string
    phone: string
    password: string
  }) {
    return this.authService.register(body)
  }

  @Public()
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password)
  }

  @Public()
  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken)
  }
}
