export class FindProductDto {
  order: string = 'asc';
  cursor: Date;
  perPage: number;
}
