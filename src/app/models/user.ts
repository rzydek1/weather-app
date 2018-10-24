// Interfejs usera
export interface User {
  _id?: {$oid: string};
  index?: number;
  name: string;
  surname: string;
  town: string;
  country: string;
  sex: string;
  weather?: any;
  readMode?: boolean;
}
