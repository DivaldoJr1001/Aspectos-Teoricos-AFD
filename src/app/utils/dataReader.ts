import { Fonte } from '../models/fonte';
import { Instrucao } from '../models/instrucao';

export class DataReader {
  private alfabeto: string[];

  constructor($alfabeto: string[]) {
    this.alfabeto = $alfabeto;
  }

  read(rawText: string, surroundingSlots: number): Fonte | boolean {
    const textLines = rawText.split('\n');
    // Divide as primeiras 5 linhas com informações básicas em arrays de 2 com regex
    const infoLineArrays = textLines.slice(0, 5).map(line => line.split(/ (.+)/, 2));
    // Divide todas as linhas com instruções em arrays de 5 e ignora as que não se encaixam
    const instructionLineArrays = textLines.slice(5).map(line => line.split(',')).filter(lineArray => lineArray.length === 5);

    // CHECAGEM/VALIDAÇÃO DE INFORMAÇÕES BÁSICAS

    const fonteNameArray = infoLineArrays.find(array => array[0] === 'nome');
    if (fonteNameArray === undefined || fonteNameArray[1] === undefined) {
      return false;
    }

    const nome = fonteNameArray[1];

    const fonteFitaArray = infoLineArrays.find(array => array[0] === 'fita');
    if (fonteFitaArray === undefined || fonteFitaArray[1] === undefined) {
      return false;
    }

    const fita = fonteFitaArray[1].split('');

    // Popula os slots vazios à direita e esquerda da fita original
    for (let i = 0; i < surroundingSlots; i++) {
      fita.unshift('_');
      fita.push('_');
    }

    const fonteEstadosArray = infoLineArrays.find(array => array[0] === 'estados');
    if (fonteEstadosArray === undefined || fonteEstadosArray[1] === undefined) {
      return false;
    }

    const estados = fonteEstadosArray[1].split(',');

    // Checa se o array é vazio ou se há estados duplicados
    if (estados.length === 0 || new Set(estados).size !== estados.length) {
      return false;
    }

    const fonteEstadoInicialArray = infoLineArrays.find(array => array[0] === 'init');
    if (fonteEstadoInicialArray === undefined || !fonteEstadoInicialArray[1] === undefined) {
      return false;
    }

    const estadoInicial = fonteEstadoInicialArray[1];

    // Checa se o estado inicial existe
    if (!estados.includes(estadoInicial)) {
      return false;
    }

    const fonteEstadosFinaisArray = infoLineArrays.find(array => array[0] === 'accept');
    if (fonteEstadosFinaisArray === undefined || fonteEstadosFinaisArray[1] === undefined) {
      return false;
    }

    const estadosFinais = fonteEstadosFinaisArray[1].split(',');

    // Checa se o array é vazio ou se há estados duplicados
    if (estadosFinais.length === 0 || new Set(estadosFinais).size !== estadosFinais.length) {
      return false;
    }

    // Checa se todos os estados finais existem
    estadosFinais.forEach(estado => {
        if (!estados.includes(estado)) {
          return false;
        }
      });


    // CHECAGEM/VALIDAÇÃO DE MATRIZ DE INSTRUÇÕES

    const instrucoes: Instrucao[][] = [];

    // Popula uma matriz vazia
    for (let i = 0; i < estados.length; i++) {
      instrucoes.push([]);
      for (let {} of this.alfabeto) {
        instrucoes[i].push(undefined);
      }
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < instructionLineArrays.length; i++) {
      const instrucao = instructionLineArrays[i];
      const estadoNumero = estados.findIndex(estado => estado === instrucao[0]);
      const alfabetoNumero = this.alfabeto.findIndex(character => character === instrucao[1]);

      // Se o estado ou caractere não existir, a entrada é inválida
      if (estadoNumero === undefined || alfabetoNumero === undefined) {
        return false;
      }

      const novaInstrucao = new Instrucao(instrucao[2], instrucao[3], instrucao[4]);
      instrucoes[estadoNumero][alfabetoNumero] = novaInstrucao;
    }

    return new Fonte(
      fonteNameArray[1],
      fita,
      instrucoes,
      estados,
      estadoInicial,
      estadosFinais,
      true);
  }

  fonteVazia(surroundingSlots: number): Fonte {
    return new Fonte('', this.fitaVazia(surroundingSlots), [], [], '', [], true);
  }

  fonteInvalida(surroundingSlots: number): Fonte {
    return new Fonte('', this.fitaVazia(surroundingSlots), [], [], '', [], false);
  }

  fitaVazia(surroundingSlots: number): string[] {
    const fita = [];

    for (let i = 0; i < surroundingSlots; i++) {
      fita.unshift('_');
      fita.push('_');
    }

    return fita;
  }
}
