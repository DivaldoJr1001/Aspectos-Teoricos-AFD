import { Fonte } from '../models/fonte';
import { Instrucao } from '../models/instrucao';

export class DataReader {

  read(rawText: string, surroundingSlots: number): Fonte | boolean {
    const textLines = rawText.split('\n');
    // Divide as primeiras 7 linhas com informações básicas em arrays de 2 com regex
    const infoLineArrays = textLines.slice(0, 7).map(line => line.split(/ (.+)/, 2));
    // Divide todas as linhas com instruções em arrays de 5 e ignora as que não se encaixam
    const instructionLineArrays = textLines.slice(7).map(line => line.split(',')).filter(lineArray => lineArray.length === 5);

    // CHECAGEM/VALIDAÇÃO DE INFORMAÇÕES BÁSICAS

    const nameArray = infoLineArrays.find(array => array[0] === 'nome');
    if (nameArray === undefined || nameArray[1] === undefined) {
      return false;
    }
    const nome = nameArray[1];

    const alfabetoMaquinaArray = infoLineArrays.find(array => array[0] === 'alfabetoMaquina');
    if (alfabetoMaquinaArray === undefined || alfabetoMaquinaArray[1] === undefined) {
      return false;
    }
    const alfabetoMaquina = alfabetoMaquinaArray[1].split(',').map(element => element.trim());
    if (this.isEmptyOrHasDuplicates(alfabetoMaquina)) {
      return false;
    }

    const alfabetoFitaArray = infoLineArrays.find(array => array[0] === 'alfabetoFita');
    if (alfabetoFitaArray === undefined || alfabetoFitaArray[1] === undefined) {
      return false;
    }
    const alfabetoFita = alfabetoFitaArray[1].split(',').map(element => element.trim());
    if (this.isEmptyOrHasDuplicates(alfabetoFita)) {
      return false;
    }

    // Identifica as entradas específicas do alfabeto da fita, com símbolos para identificar movimentos e um espaço vazio
    const moverEsquerda = alfabetoFita[0];
    const moverDireita = alfabetoFita[1];
    const permanecerParado = alfabetoFita[2];
    const espacoVazio = alfabetoFita[3];

    // Insere símbolo de o espaço vazio no alfabeto da máquina para habilitar seu uso como variável nas instruções,
    // e o retira do alfabeto da fita para manter apenas os símbolos de movimento
    alfabetoMaquina.push(alfabetoFita.pop());

    const fitaArray = infoLineArrays.find(array => array[0] === 'fita');
    if (fitaArray === undefined || fitaArray[1] === undefined) {
      return false;
    }
    const fita = fitaArray[1].split('').map(element => element.trim());
    // Checa se há um espaço vazio ou algum caractere desconhecido na fita de entrada, invalidando-a
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < fita.length; i++) {
      if (fita[i] === espacoVazio || !alfabetoMaquina.includes(fita[i])) {
        return false;
      }
    }
    // Insere espaços vazios ao redor da entrada da fita para permitir mais movimentos
    for (let i = 0; i < surroundingSlots; i++) {
      fita.unshift(espacoVazio);
      fita.push(espacoVazio);
    }

    const estadosArray = infoLineArrays.find(array => array[0] === 'estados');
    if (estadosArray === undefined || estadosArray[1] === undefined) {
      return false;
    }
    const estados = estadosArray[1].split(',');
    if (this.isEmptyOrHasDuplicates(estados)) {
      return false;
    }

    const estadoInicialArray = infoLineArrays.find(array => array[0] === 'init');
    if (estadoInicialArray === undefined || !estadoInicialArray[1] === undefined) {
      return false;
    }
    const estadoInicial = estadoInicialArray[1];

    // Checa se o estado inicial existe
    if (!estados.includes(estadoInicial)) {
      return false;
    }

    const estadosFinaisArray = infoLineArrays.find(array => array[0] === 'accept');
    if (estadosFinaisArray === undefined || estadosFinaisArray[1] === undefined) {
      return false;
    }
    const estadosFinais = estadosFinaisArray[1].split(',');

    if (this.isEmptyOrHasDuplicates(estadosFinais)) {
      return false;
    }

    // Checa se todos os estados finais existem
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < estadosFinais.length; i++) {
      if (!estados.includes(estadosFinais[i])) {
        return false;
      }
    }


    // CHECAGEM/VALIDAÇÃO DE MATRIZ DE INSTRUÇÕES

    const instrucoes: Instrucao[][] = [];

    // Popula uma matriz vazia
    for (let i = 0; i < estados.length; i++) {
      instrucoes.push([]);
      for (let { } of alfabetoMaquina) {
        instrucoes[i].push(undefined);
      }
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < instructionLineArrays.length; i++) {
      const instrucao = instructionLineArrays[i];

      // Verifica todas as variáveis da instrução
      const estado1Numero = estados.findIndex(estado => estado === instrucao[0]);
      const caractere1Numero = alfabetoMaquina.findIndex(character => character === instrucao[1]);
      const estado2Numero = estados.findIndex(estado => estado === instrucao[2]);
      const caractere2Numero = alfabetoMaquina.findIndex(character => character === instrucao[3]);
      const actionNumero = alfabetoFita.findIndex(action => action === instrucao[4]);

      // Se um estado, caractere ou ação da instrução não existir, a entrada é inválida
      if (estado1Numero === undefined || caractere1Numero === undefined ||
        estado2Numero === undefined || caractere2Numero === undefined ||
        actionNumero === undefined) {
        return false;
      }

      // Cria o objeto da instrução e o organiza com base no estado original e no caractere encontrado
      const novaInstrucao = new Instrucao(instrucao[2], instrucao[3], instrucao[4]);
      instrucoes[estado1Numero][caractere1Numero] = novaInstrucao;
    }

    return new Fonte(
      nome,
      alfabetoMaquina,
      moverEsquerda,
      moverDireita,
      permanecerParado,
      espacoVazio,
      fita,
      instrucoes,
      estados,
      estadoInicial,
      estadosFinais,
      true);
  }

  fonteVazia(surroundingSlots: number): Fonte {
    return new Fonte('', [], '', '', '', '_', this.fitaVazia(surroundingSlots), [], [], '', [], true);
  }

  fonteInvalida(surroundingSlots: number): Fonte {
    return new Fonte('', [], '', '', '', '_', this.fitaVazia(surroundingSlots), [], [], '', [], false);
  }

  fitaVazia(surroundingSlots: number): string[] {
    const fita = [];

    for (let i = 0; i < surroundingSlots; i++) {
      fita.unshift('_');
      fita.push('_');
    }

    return fita;
  }

  isEmptyOrHasDuplicates(array: string[]) {
    return array.length === 0 || new Set(array).size !== array.length;
  }
}
