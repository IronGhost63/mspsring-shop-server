import { Module } from '@nestjs/common';
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

          cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
        }
      })
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
