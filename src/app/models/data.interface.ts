export interface Valute {
  ID?: string;
  NumCode: string;
  CharCode: string;
  Nominal: number;
  Name: string;
  Value: number;
  Previous?: number;
}

export interface ValCurs {
  ValCurs: Valute;
}
