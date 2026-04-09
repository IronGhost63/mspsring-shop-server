import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from "@src/drizzle/drizzle.provider";
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemDto } from "./dto/order-item.dto";
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserOrderDto } from "./dto/user-order.dto";
import { JwtPayload } from "@src/auth/dto/jwt-payload.dto";
import { ProductsService } from "@src/products/products.service";
import { UsersService } from "@src/users/users.service";
import { schema } from 'database/schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
    @Inject(ProductsService)
    private productsService: ProductsService,
    @Inject(UsersService)
    private usersService: UsersService,
  ) {}

  async create(user: Partial<JwtPayload>, userOrder: UserOrderDto) {
    try {
      const userDetail = await this.usersService.findOne(user.id!);
      const selectedItems = await this.productsService.findMany( userOrder.items.map( item => item.id ) );

      const orderItems = userOrder.items.map((item): OrderItemDto => {
        const itemDetail = selectedItems.find(selected => selected.id === item.id);

        if ( !itemDetail ) {
          throw new BadRequestException('Invalid product');
        }

        return {
          id: item.id,
          title: itemDetail.title,
          unit_price: itemDetail.unit_price!,
          quantity: item.quantity
        }
      });

      const total = orderItems.reduce((total, item) => (total + (item.quantity * item.unit_price)), 0);
      const discount = 0;
      const subtotal = total + discount;

      const orderDetail = {
        userId: userDetail.id,
        items: orderItems,
        total: total,
        discount: discount,
        subtotal: subtotal,
        shippingAddress: userDetail.shippingAddress!,
        billingAddress: userDetail.billingAddress!
      } satisfies Partial<CreateOrderDto>;

      const order = await this.db
        .insert( schema.orderTable )
        .values( orderDetail )
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
