export class AFD {
  private alfabeto: string[];

  constructor(alfabeto: string[]) {
    this.alfabeto = alfabeto;
  }

  public get $alfabeto(): string[] {
    return this.alfabeto;
  }

  printAlfabeto() {
    console.log(this.alfabeto);
  }
}
