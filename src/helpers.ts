export function enumToPgEnum(myEnum: any): [string, ...string[]] {
  return Object.values(myEnum) as [string, ...string[]];
}
