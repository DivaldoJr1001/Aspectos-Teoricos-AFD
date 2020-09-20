import { DataReader } from '../utils/dataReader';
import { Fonte } from '../models/fonte';

export class AFD {
  // O número de espaços para a direita e esquerda da fita importada, permitindo mais movimentos
  private surroundingSlots: number;

  // A classe responsável por ler a fonte
  private dReader: DataReader;

  constructor($surroundingSlots: number) {
    this.surroundingSlots = $surroundingSlots;
    this.dReader = new DataReader();
  }

  public get $surroundingSlots(): number {
    return this.surroundingSlots;
  }

  read(rawText: string): Fonte {
    const retorno = this.dReader.read(rawText, this.surroundingSlots);

    if (retorno === false) {
      return this.dReader.fonteInvalida(this.surroundingSlots);
    } else {
      return retorno as Fonte;
    }
  }

  fonteVazia(): Fonte {
    return this.dReader.fonteVazia(this.surroundingSlots);
  }
}
