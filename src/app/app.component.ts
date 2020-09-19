import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AFD } from './machine/afd';
import { Fonte } from './models/fonte';
import { Instrucao } from './models/instrucao';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'AFD';

  @ViewChild('fitaContainer', { static: true }) public fitaContainer: ElementRef<any>;
  @ViewChild('pointer', { static: true }) public pointer: ElementRef<any>;

  maquinaAFD = new AFD(['0', '1', 'X', 'Y'], 500);
  fonte: Fonte = this.maquinaAFD.fonteVazia();

  // Tamanho dos containers
  slotWidth = 144;
  distanceBetweenSlotsPx = 160;

  // Flags
  machineFinished = false;
  machineRunning = false;
  machineInitialState = true;

  loading = false;
  fileImported = false;
  fileInvalid = false;

  // Referente à velocidade do ponteiro
  movingDelay = 5;

  // Onde o ponteiro se encontra
  slotAtual: number;

  estadoAtual: string;
  proximaInstrucao: Instrucao | undefined;


  // Centraliza a scrollbar
  ngAfterViewInit(): void {
    this.prepareView();
  }

  async readData(fileInputEvent: any): Promise<void> {
    const file: File = fileInputEvent.target.files[0];
    let fileText: string;

    await Promise.all([
      file.text()
    ]).then(([text]) => {
      fileText = text;
    });

    this.loading = true;
    this.fonte = this.maquinaAFD.read(fileText);
    await this.delay(1000);
    this.fileInvalid = !this.fonte.$valida;
    this.fileImported = true;
    this.reset();

    this.loading = false;
  }

  async moveLeft(): Promise<void> {
    const originalMargin = this.pointer.nativeElement.style.marginLeft.split('px')[0];
    const newMargin = Number(originalMargin) - this.distanceBetweenSlotsPx;

    while (this.pointer.nativeElement.style.marginLeft.split('px')[0] > newMargin && this.machineRunning) {
      this.pointer.nativeElement.style.marginLeft = (Number(this.pointer.nativeElement.style.marginLeft.split('px')[0]) - 1) + 'px';
      await this.delay(this.movingDelay);
    }
  }

  async moveRight(): Promise<void> {
    const originalMargin = this.pointer.nativeElement.style.marginLeft.split('px')[0];
    const newMargin = Number(originalMargin) + this.distanceBetweenSlotsPx;

    while (this.pointer.nativeElement.style.marginLeft.split('px')[0] < newMargin && this.machineRunning) {
      this.pointer.nativeElement.style.marginLeft = (Number(this.pointer.nativeElement.style.marginLeft.split('px')[0]) + 1) + 'px';
      await this.delay(this.movingDelay);
    }
  }

  async run(): Promise<void> {
    this.machineRunning = true;
    this.machineInitialState = false;

    await this.doProximaInstrucao();

    this.machineRunning = false;
    this.machineFinished = true;
  }

  async doProximaInstrucao(): Promise<void> {
    this.fonte.$fita[this.slotAtual] = this.proximaInstrucao.$novoCaractere;
    this.estadoAtual = this.proximaInstrucao.$proximoEstado;

    if (this.proximaInstrucao.$movimento.includes('>') && this.slotAtual < this.fonte.$fita.length - 1 && this.machineRunning) {
      this.slotAtual++;
      this.getProximaInstrucao();
      await this.moveRight();
    } else if (this.proximaInstrucao.$movimento.includes('<') && this.slotAtual > 0 && this.machineRunning) {
      this.slotAtual--;
      this.getProximaInstrucao();
      await this.moveLeft();
    } else if (this.proximaInstrucao.$movimento.includes('=')) {
      this.getProximaInstrucao();
      await this.delay(1000);
    }

    if (!this.fonte.$estadosFinais.includes(this.estadoAtual) && this.proximaInstrucao !== undefined && this.machineRunning) {
      await this.doProximaInstrucao();
    }
  }

  getProximaInstrucao(): void {
    const estadoNumero = this.fonte.$estados.findIndex(estado => estado === this.estadoAtual);
    const caractereNumero = this.maquinaAFD.$alfabeto.findIndex(character => character === this.fonte.$fita[this.slotAtual]);
    this.proximaInstrucao = this.fonte.$instrucoes[estadoNumero][caractereNumero];
  }

  async stop(): Promise<void> {
    this.machineRunning = false;
    this.machineFinished = true;
  }

  reset(): void {
    this.machineFinished = false;
    this.machineRunning = false;
    this.machineInitialState = true;

    this.estadoAtual = this.fonte.$estadoInicial;
    this.fonte.resetFita();

    this.slotAtual = this.maquinaAFD.$surroundingSlots;
    this.pointer.nativeElement.style.marginLeft = '0px';
    this.prepareView();

    if (this.fileImported && !this.fileInvalid) {
      this.getProximaInstrucao();
    }
  }

  prepareView(): void {
    const fitaTotalWidth = this.fitaContainer.nativeElement.scrollWidth;
    const fitaVisibleWidth = this.fitaContainer.nativeElement.offsetWidth;
    this.fitaContainer.nativeElement.scrollLeft = (fitaTotalWidth / 2) - (fitaVisibleWidth / 2);

    const pointerWidth = this.pointer.nativeElement.offsetWidth;

    const pointerMargin = this.fileImported && !this.fileInvalid ? - (pointerWidth / 2) + (this.slotWidth / 2) +
      this.distanceBetweenSlotsPx * this.maquinaAFD.$surroundingSlots : - (pointerWidth / 2);
    this.pointer.nativeElement.style.marginLeft = pointerMargin + 'px';

  }

  private delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }
}
