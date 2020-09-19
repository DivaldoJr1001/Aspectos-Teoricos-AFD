import { DataReader } from '../utils/dataReader';
import { Fonte } from '../models/fonte';

export class AFD {
  private caracteresGlobais = ['_'];
  private alfabeto: string[] = [];

  // O número de espaços para a direita e esquerda da fita importada
  private surroundingSlots: number;

  private dReader: DataReader;

  constructor($alfabeto: string[], $surroundingSlots: number) {
    // Adiciona os caracteres globais
    const alfabeto = $alfabeto.concat(this.caracteresGlobais);
    // Garante que o alfabeto final não terá caracteres duplicados com Set, que ignora duplicatas
    new Set(alfabeto).forEach(character => {
      this.alfabeto.push(character);
    });


    this.surroundingSlots = $surroundingSlots;
    this.dReader = new DataReader(this.alfabeto);
  }

  public get $alfabeto(): string[] {
    return this.alfabeto;
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
