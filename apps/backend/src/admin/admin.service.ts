import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { eq, count } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../db/schema';
import type { ServerAuthType } from '../auth/auth.provider';
import { DB_CONNECTION } from '../db/db.provider';
import type {
  BanUserDto,
  ListUserSessionsDto,
  ListUsersQueryDto,
  RevokeAllSessionsDto,
  RevokeSessionDto,
  SetRoleDto,
  UnbanUserDto,
} from './admin.schemas';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @Inject(DB_CONNECTION)
    private db: NodePgDatabase<typeof sc>,
    private readonly authService: AuthService<ServerAuthType>,
  ) {}

  async setRole(headers: Headers, dto: SetRoleDto) {
    this.logger.log(`Setting role '${dto.role}' for user ${dto.userId}`);
    return this.authService.api.setRole({
      headers,
      body: {
        userId: dto.userId,
        role: dto.role,
      },
    });
  }

  async banUser(headers: Headers, dto: BanUserDto) {
    this.logger.log(
      `Banning user ${dto.userId} — reason: ${dto.banReason ?? 'No reason provided'}`,
    );
    return this.authService.api.banUser({
      headers,
      body: {
        userId: dto.userId,
        banReason: dto.banReason,
        banExpiresIn: dto.banExpiresIn,
      },
    });
  }

  async unbanUser(headers: Headers, dto: UnbanUserDto) {
    this.logger.log(`Unbanning user ${dto.userId}`);
    return this.authService.api.unbanUser({
      headers,
      body: {
        userId: dto.userId,
      },
    });
  }

  async listUsers(headers: Headers, query: ListUsersQueryDto) {
    const data = await this.authService.api.listUsers({
      headers,
      query: {
        limit: query.limit,
        offset: query.offset,
        searchField: query.searchField,
        searchValue: query.searchValue,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
      },
    });
    return data;
  }

  async listUserSessions(headers: Headers, dto: ListUserSessionsDto) {
    return this.authService.api.listUserSessions({
      headers,
      body: {
        userId: dto.userId,
      },
    });
  }

  async revokeSession(headers: Headers, dto: RevokeSessionDto) {
    if (dto.reason) {
      this.logger.log(
        `Revoking session ${dto.sessionToken} — reason: ${dto.reason}`,
      );
    }
    return this.authService.api.revokeUserSession({
      headers,
      body: {
        sessionToken: dto.sessionToken,
      },
    });
  }

  async revokeAllSessions(headers: Headers, dto: RevokeAllSessionsDto) {
    if (dto.reason) {
      this.logger.log(
        `Revoking all sessions for user ${dto.userId} — reason: ${dto.reason}`,
      );
    }
    return this.authService.api.revokeUserSessions({
      headers,
      body: {
        userId: dto.userId,
      },
    });
  }

  async getUserById(headers: Headers, userId: string) {
    return this.db
      .select({
        id: sc.user.id,
        email: sc.user.email,
        name: sc.user.name,
        emailVerified: sc.user.emailVerified,
        image: sc.user.image,
        role: sc.user.role,
        banned: sc.user.banned,
        banReason: sc.user.banReason,
        banExpiresAt: sc.user.banExpires,
        termsAccepted: sc.user.termsAccepted,
        createdAt: sc.user.createdAt,
        updatedAt: sc.user.updatedAt,
      })
      .from(sc.user)
      .where(eq(sc.user.id, userId));
  }

  async getTotalUsersCount(headers: Headers) {
    const result = await this.db.select({ count: count() }).from(sc.user);
    return result[0]?.count ?? 0;
  }

  async getDashboardStats(headers: Headers) {
    const [userCount, artistCount, albumCount, trackCount, genreCount, recordingCount] =
      await Promise.all([
        this.db.select({ count: count() }).from(sc.user),
        this.db.select({ count: count() }).from(sc.artist),
        this.db.select({ count: count() }).from(sc.album),
        this.db.select({ count: count() }).from(sc.track),
        this.db.select({ count: count() }).from(sc.genre),
        this.db.select({ count: count() }).from(sc.recording),
      ]);

    return {
      users: Number(userCount[0]?.count ?? 0),
      artists: Number(artistCount[0]?.count ?? 0),
      albums: Number(albumCount[0]?.count ?? 0),
      tracks: Number(trackCount[0]?.count ?? 0),
      genres: Number(genreCount[0]?.count ?? 0),
      recordings: Number(recordingCount[0]?.count ?? 0),
    };
  }
}
