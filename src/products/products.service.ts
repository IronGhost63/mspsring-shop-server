import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { gt, eq, asc, desc, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from "@src/drizzle/drizzle.provider";
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductDto } from "./dto/find-product.dto";
import { schema } from 'database/schema';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly condition = {gt, asc, desc};

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const [product] = await this.db
        .insert( schema.productTable )
        .values( createProductDto )
        .returning();

      return product;
    } catch ( error ) {
      this.logger.error(`Failed to create product: ${error.cause.detail}`);

      throw new BadRequestException(error.cause.detail);
    }
  }

  async findAll( criteria: FindProductDto ) {
    try {
      const results = await this.db
        .select()
        .from(schema.productTable)
        .where( criteria.cursor ? gt(schema.productTable.created, criteria.cursor) : undefined)
        .limit(criteria.perPage)
        .orderBy( this.condition[criteria.order](schema.productTable.created) );

      return results;
    } catch ( error ) {
      this.logger.error(`Failed to create product: ${error}`);

      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.db.query.productTable.findFirst({
        where: eq( schema.productTable.id, id ),
      });

      if (!result) {
        throw new BadRequestException( `Unable to find product id ${id}` );
      }

      return result;
    } catch ( error ) {
      this.logger.error(`Failed to select product: ${error.cause.detail}`);

      throw new BadRequestException( `Unable to find product id ${id}` );
    }
  }

  async findMany(ids: string[]) {
    try {
      const results = await this.db
        .select()
        .from(schema.productTable)
        .where( inArray( schema.productTable.id, ids ) );

      return results;
    } catch ( error ) {
      this.logger.error(`Failed to select products: ${error.cause.detail}`);

      throw new BadRequestException( `Unable to find product ids` );
    }
  }

  async update(id: string, updateProductDto: Partial<UpdateProductDto>) {
    try {

      await this.db
        .update( schema.productTable )
        .set( updateProductDto )
        .where( eq(schema.productTable.id, id) );

      const updated = await this.db.query.productTable.findFirst({
        where: eq(schema.productTable.id, id),
      });

      if (!updated) {
        throw new BadRequestException( `Unable to update detail for ${id}` );
      }

      return updated;
    } catch ( error ) {
      this.logger.error(`Failed to update user: ${error.cause}`);

      throw new BadRequestException( `Unable to update detail for ${id}` );
    }
  }

  async remove(id: string) {
    try {
      await this.db
        .delete(schema.productTable)
        .where( eq(schema.productTable.id, id) );

      return {
        message: 'success'
      }
    } catch ( error ) {
      this.logger.error(`Failed to delete product: ${error.cause}`);

      throw new BadRequestException( `Unable to delete product ${id}` );
    }
  }
}
