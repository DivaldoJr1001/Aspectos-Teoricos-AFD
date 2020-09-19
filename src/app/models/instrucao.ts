export class Instrucao {
  private proximoEstado: string;
  private novoCaractere: string;
  private movimento: string;

  constructor($proximoEstado: string, $novoCaractere: string, $movimento: string) {
    this.proximoEstado = $proximoEstado;
    this.novoCaractere = $novoCaractere;
    this.movimento = $movimento;
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
