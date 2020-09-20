import { Instrucao } from './instrucao';

export class Fonte {
  private nome: string;
  private alfabetoMaquina: string[];
  private moverEsquerda: string;
  private moverDireita: string;
  private permanecerParado: string;
  private espacoVazio: string;
  private fita: string[];
  private fitaOriginal: string[];
  private instrucoes: Instrucao[][];
  private estados: string[];
  private estadoInicial: string;
  private estadosFinais: string[];
  private valida: boolean;

  constructor($nome: string, $alfabetoMaquina: string[], $moverEsquerda: string, $moverDireita: string, $permanecerParado: string, $espacoVazio: string, $fita: string[], $instrucoes: Instrucao[][], $estados: string[], $estadoInicial: string, $estadosFinais: string[], $valida: boolean) {
    this.nome = $nome;
    this.alfabetoMaquina = $alfabetoMaquina;
    this.moverEsquerda = $moverEsquerda;
    this.moverDireita = $moverDireita;
    this.permanecerParado = $permanecerParado;
    this.espacoVazio = $espacoVazio;
    this.fita = $fita;
    this.fitaOriginal = new Array(...$fita);
    this.instrucoes = $instrucoes;
    this.estados = $estados;
    this.estadoInicial = $estadoInicial;
    this.estadosFinais = $estadosFinais;
    this.valida = $valida;
  }

  public get $nome(): string {
    return this.nome;
  }

  public get $alfabetoMaquina(): string[] {
    return this.alfabetoMaquina;
  }

  public get $moverEsquerda(): string {
    return this.moverEsquerda;
  }

  public get $moverDireita(): string {
    return this.moverDireita;
  }

  public get $permanecerParado(): string {
    return this.permanecerParado;
  }

  public get $espacoVazio(): string {
    return this.espacoVazio;
  }

  public get $fita(): string[] {
    return this.fita;
  }

  public get $fitaOriginal(): string[] {
    return this.fitaOriginal;
  }

  public get $instrucoes(): Instrucao[][] {
    return this.instrucoes;
  }

  public get $estados(): string[] {
    return this.estados;
  }

  public get $estadoInicial(): string {
    return this.estadoInicial;
  }

  public get $estadosFinais(): string[] {
    return this.estadosFinais;
  }

  public get $valida(): boolean {
    return this.valida;
  }

  // Desfaz todas as mudanças efetuadas pela máquina
  resetFita() {
    this.fita = [...this.fitaOriginal];
  }
}
