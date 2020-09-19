import { Fonte } from '../models/fonte';

export class DataReader {

  // O número de espaços para a direita e esquerda da fita importada
  private surroundingSlots: number;

  constructor($surroundingSlots: number) {
    this.surroundingSlots = $surroundingSlots;
  }

  // TODO: Implementar leitura do arquivo importado
  read(rawData: string): Fonte {
    const fita = ['1', '0', '0', '1'];

    for (let i = 0; i < this.surroundingSlots; i++) {
      fita.unshift('_');
      fita.push('_');
    }

    return new Fonte(fita, [], [], []);
  }

  defaultFonte(): Fonte {
    const fita = [];

    for (let i = 0; i < this.surroundingSlots; i++) {
      fita.unshift('_');
      fita.push('_');
    }

    return new Fonte(fita, [], [], []);
  }


  public get $surroundingSlots(): number {
    return this.surroundingSlots;
  }

}
