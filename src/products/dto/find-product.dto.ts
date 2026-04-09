export class FindProductDto {
  order: string = 'asc';
  cursor: Date|undefined;
  perPage: number;
}
