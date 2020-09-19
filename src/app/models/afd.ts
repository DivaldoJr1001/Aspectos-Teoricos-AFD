export class AFD {
  private caracteresGlobais = ['_'];

  private alfabeto: string[];

  constructor($alfabeto: string[]) {
    this.alfabeto = $alfabeto.concat(this.caracteresGlobais);
  }

  public get $alfabeto(): string[] {
    return this.alfabeto;
  }
}
