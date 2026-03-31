import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OptionsModule } from './options/options.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, OrdersModule, OptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
