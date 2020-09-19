import { Instrucao } from './instrucao';

export class Fonte {
  private fita: string[];
  // TODO: Tornar private após todos os testes
  fitaOriginal: string[];
  private conjuntoInstrucoes: Instrucao[];
  private conjuntoEstados: string[];
  private conjuntoEstadosFinais: string[];

  constructor($fita: string[], $conjuntoInstrucoes: Instrucao[], $conjuntoEstados: string[], $conjuntoEstadosFinais: string[]) {
    this.fita = $fita;
    // TODO: Criar nova instância para this.fitaOriginal (Atual é modificada junto de this.fita)
    this.fitaOriginal = new Array(...$fita);
    this.conjuntoInstrucoes = $conjuntoInstrucoes;
    this.conjuntoEstados = $conjuntoEstados;
    this.conjuntoEstadosFinais = $conjuntoEstadosFinais;
  }

  public get $fita(): string[] {
    return this.fita;
  }

  public get $conjuntoInstrucoes(): Instrucao[] {
    return this.conjuntoInstrucoes;
  }

  public get $conjuntoEstados(): string[] {
    return this.conjuntoEstados;
  }

  public get $conjuntoEstadosFinais(): string[] {
    return this.conjuntoEstadosFinais;
  }

  // Desfaz todas as mudanças efetuadas pela máquina
  resetFita() {
    this.fita = [...this.fitaOriginal];
  }
}
