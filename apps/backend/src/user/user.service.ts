import { Inject, Injectable } from '@nestjs/common';
import { DB_CONNECTION } from '../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @Inject(DB_CONNECTION)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async getUserById(id: string) {
    return this.db
      .select({
        email: sc.user.email,
        name: sc.user.name,
        image: sc.user.image,
        termsAccepted: sc.user.termsAccepted,
      })
      .from(sc.user)
      .where(eq(sc.user.id, id));
  }
}
