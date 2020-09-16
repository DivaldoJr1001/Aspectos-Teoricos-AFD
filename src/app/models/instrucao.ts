export class Instrucao {
  private estadoInicial: string;
  private caractere: string;
  private proximoEstado: string;
  private novoCaractere: string;
  private movimento: string;

  constructor($estadoInicial: string, $caractere: string, $proximoEstado: string, $novoCaractere: string, $movimento: string) {
    this.estadoInicial = $estadoInicial;
    this.caractere = $caractere;
    this.proximoEstado = $proximoEstado;
    this.novoCaractere = $novoCaractere;
    this.movimento = $movimento;
  }

  public get $estadoInicial(): string {
    return this.estadoInicial;
  }

  public get $caractere(): string {
    return this.caractere;
  }

  public get $proximoEstado(): string {
    return this.proximoEstado;
  }

  public get $novoCaractere(): string {
    return this.novoCaractere;
  }

  public get $movimento(): string {
    return this.movimento;
  }
}
