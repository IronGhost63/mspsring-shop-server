import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from "@src/drizzle/drizzle.provider";
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { schema } from 'database/schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = await this.db
        .insert( schema.orderTable )
        .values( createOrderDto )
        .returning();

      return order;
    } catch ( error ) {
      this.logger.error(`Failed to create product: ${error.cause.detail}`);

      throw new BadRequestException(error.cause.detail);
    }
  }

  async findAll() {
    try {
      const results = await this.db
        .select()
        .from(schema.orderTable)

      return results;
    } catch ( error ) {
      this.logger.error(`Failed to select users: ${error.cause.detail}`);

      throw new BadRequestException( error.cause.detail );
    }
  }

  async findByCustomer( userId: string ) {
    try {
      const results = await this.db
        .select()
        .from(schema.orderTable)
        .where( eq( schema.orderTable.userId, userId));

      return results;

    } catch ( error ) {
      this.logger.error(`Failed to select orders: ${error.cause.detail}`);

      throw new BadRequestException(error.cause.detail);
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.db.query.orderTable.findFirst({
        where: eq( schema.orderTable.id, id ),
      });

      if (!result) {
        throw new BadRequestException( `Unable to find order id ${id}` );
      }

      return result;
    } catch ( error ) {
      this.logger.error(`Failed to select order: ${error.cause.detail}`);

      throw new BadRequestException( `Unable to find order id ${id}` );
    }
  }

  async update(id: string, updateOrderDto: Partial<UpdateOrderDto>) {
    try {

      await this.db
        .update( schema.orderTable )
        .set( updateOrderDto )
        .where( eq(schema.orderTable.id, id) );

      const updated = await this.db.query.orderTable.findFirst({
        where: eq(schema.orderTable.id, id),
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
        .delete(schema.orderTable)
        .where( eq(schema.orderTable.id, id) );

      return {
        message: 'success'
      }
    } catch ( error ) {
      this.logger.error(`Failed to delete order: ${error.cause}`);

      throw new BadRequestException( `Unable to delete order ${id}` );
    }
  }
}
