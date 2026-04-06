import { z } from 'zod';

export const SetRoleSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['admin', 'user'], {
    message: "Role must be 'admin' or 'user'",
  }),
});

export const BanUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  banReason: z.string().optional(),
  banExpiresIn: z.number().positive('Ban duration must be positive').optional(),
});

export const UnbanUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const ListUserSessionsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const RevokeSessionSchema = z.object({
  sessionToken: z.string().min(1, 'Session token is required'),
  reason: z.string().optional(),
});

export const RevokeAllSessionsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  reason: z.string().optional(),
});

export const ListUsersQuerySchema = z.object({
  limit: z.coerce.number().positive().optional(),
  offset: z.coerce.number().min(0).optional(),
  searchField: z.enum(['email', 'name']).optional(),
  searchValue: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
});

export type UnbanUserDto = z.infer<typeof UnbanUserSchema>;
export type SetRoleDto = z.infer<typeof SetRoleSchema>;
export type BanUserDto = z.infer<typeof BanUserSchema>;
export type ListUserSessionsDto = z.infer<typeof ListUserSessionsSchema>;
export type RevokeSessionDto = z.infer<typeof RevokeSessionSchema>;
export type RevokeAllSessionsDto = z.infer<typeof RevokeAllSessionsSchema>;
export type ListUsersQueryDto = z.infer<typeof ListUsersQuerySchema>;
