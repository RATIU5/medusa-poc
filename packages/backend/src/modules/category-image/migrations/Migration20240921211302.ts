import { Migration } from '@mikro-orm/migrations';

export class Migration20240921211302 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "category-image" ("id" text not null, "image" text null, "thumbnail" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "category-image_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "category-image" cascade;');
  }

}
