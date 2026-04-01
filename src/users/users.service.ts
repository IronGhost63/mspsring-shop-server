import { Injectable, Inject, Logger, InternalServerErrorException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleAsyncProvider } from "@src/drizzle/drizzle.provider";
import { schema } from 'database/schema';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const insertUser = {
        ...createUserDto,
        password: await hash(createUserDto.password, 10),
      }

      const [user] = await this.db
        .insert( schema.userTable )
        .values( insertUser )
        .returning();

      return user;
    } catch ( error ) {
      this.logger.error(`Failed to create user: ${error.cause.detail}`);

      throw new InternalServerErrorException(error.cause.detail);
    }
  }

  async findAll() {
    try {
      const results = await this.db.select().from(schema.userTable);

      return results;
    } catch ( error ) {
      this.logger.error(`Failed to select users: ${error.cause.detail}`);

      throw new InternalServerErrorException( error.cause.detail );
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.db.query.userTable.findFirst({
        where: eq( schema.userTable.id, id ),
      });

      if (!result) {
        throw new InternalServerErrorException( `Unable to find user id ${id}` );
      }

      return result;
    } catch ( error ) {
      this.logger.error(`Failed to select user: ${error.cause.detail}`);

      throw new InternalServerErrorException( `Unable to find user id ${id}` );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      delete updateUserDto.role;

      await this.db
        .update( schema.userTable )
        .set( updateUserDto )
        .where( eq(schema.userTable.id, id) );

      const updated = await this.db.query.userTable.findFirst({
        where: eq(schema.userTable.id, id),
      });

      if (!updated) {
        throw new InternalServerErrorException( `Unable to update detail for ${id}` );
      }

      return updated;
    } catch ( error ) {
      this.logger.error(`Failed to update user: ${error.cause}`);

      throw new InternalServerErrorException( `Unable to update detail for ${id}` );
    }
  }

  async remove(id: string) {
    try {
      await this.db
        .delete(schema.userTable)
        .where( eq(schema.userTable.id, id) );

      return {
        message: 'success'
      }
    } catch ( error ) {
      this.logger.error(`Failed to delete user: ${error.cause}`);

      throw new InternalServerErrorException( `Unable to delete user ${id}` );
    }
  }
}
