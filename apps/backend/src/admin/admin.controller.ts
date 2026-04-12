import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { ZodValidationPipe } from '../common';
import type {
  BanUserDto,
  ListUserSessionsDto,
  ListUsersQueryDto,
  RevokeAllSessionsDto,
  RevokeSessionDto,
  SetRoleDto,
  UnbanUserDto,
} from './admin.schemas';
import {
  BanUserSchema,
  ListUserSessionsSchema,
  ListUsersQuerySchema,
  RevokeAllSessionsSchema,
  RevokeSessionSchema,
  SetRoleSchema,
  UnbanUserSchema,
} from './admin.schemas';
import { AdminService } from './admin.service';

@Controller('api/admin')
@Roles(['admin'])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('set-role')
  async setRole(
    @Headers() headers: Record<string, string>,
    @Body(new ZodValidationPipe(SetRoleSchema)) dto: SetRoleDto,
  ) {
    return this.adminService.setRole(fromNodeHeaders(headers), dto);
  }

  @Post('ban-user')
  async banUser(
    @Headers() headers: Record<string, string>,
    @Body(new ZodValidationPipe(BanUserSchema)) dto: BanUserDto,
  ) {
    return this.adminService.banUser(fromNodeHeaders(headers), dto);
  }

  @Post('unban-user')
  async unbanUser(
    @Headers() headers: Record<string, string>,
    @Body(new ZodValidationPipe(UnbanUserSchema)) dto: UnbanUserDto,
  ) {
    return this.adminService.unbanUser(fromNodeHeaders(headers), dto);
  }

  @Get('list-users')
  async listUsers(
    @Headers() headers: Record<string, string>,
    @Query(new ZodValidationPipe(ListUsersQuerySchema))
    query: ListUsersQueryDto,
  ) {
    return this.adminService.listUsers(fromNodeHeaders(headers), query);
  }

  @Post('list-sessions')
  async listSessions(
    @Headers() headers: Record<string, string>,
    @Body(new ZodValidationPipe(ListUserSessionsSchema))
    dto: ListUserSessionsDto,
  ) {
    return this.adminService.listUserSessions(fromNodeHeaders(headers), dto);
  }

  @Post('revoke-session')
  async revokeSession(
    @Headers() headers: Record<string, string>,
    @Body(new ZodValidationPipe(RevokeSessionSchema)) dto: RevokeSessionDto,
  ) {
    return this.adminService.revokeSession(fromNodeHeaders(headers), dto);
  }

  @Post('revoke-all-sessions')
  async revokeAllSessions(
    @Headers() headers: Record<string, string>,
    @Body(new ZodValidationPipe(RevokeAllSessionsSchema))
    dto: RevokeAllSessionsDto,
  ) {
    return this.adminService.revokeAllSessions(fromNodeHeaders(headers), dto);
  }

  @Get('user/:id')
  async getUserById(
    @Headers() headers: Record<string, string>,
    @Param('id') userId: string,
  ) {
    return this.adminService.getUserById(fromNodeHeaders(headers), userId);
  }

  @Get('total-users')
  async getTotalUsersCount(@Headers() headers: Record<string, string>) {
    return this.adminService.getTotalUsersCount(fromNodeHeaders(headers));
  }

  @Get('stats')
  async getDashboardStats(@Headers() headers: Record<string, string>) {
    return this.adminService.getDashboardStats(fromNodeHeaders(headers));
  }
}
