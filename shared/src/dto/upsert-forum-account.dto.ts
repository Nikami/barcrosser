// shared/src/dto/upsert-forum-account.dto.ts
export class UpsertForumAccountDto {
  name!: string; // персонаж
  password!: string; // plain password, will be encrypted server‑side
}
