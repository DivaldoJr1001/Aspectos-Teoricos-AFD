import { Fonte } from '../models/fonte';

export class DataReader {

  constructor() {}

  read(rawData: string): Fonte {
    return new Fonte([], [], [], []);
  }
}
