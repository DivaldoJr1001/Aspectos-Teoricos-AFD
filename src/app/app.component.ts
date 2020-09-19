import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AFD } from './models/afd';
import { Fonte } from './models/fonte';
import { DataReader } from './utils/dataReader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'AFD';

  @ViewChild('fitaContainer', { static: true }) public fitaContainer: ElementRef<any>;
  @ViewChild('pointer', { static: true }) public pointer: ElementRef<any>;

  maquinaAFD = new AFD(['0', '1', '*']);
  dReader = new DataReader(500);
  fonte: Fonte = this.dReader.defaultFonte();

  // Tamanho dos containers
  slotWidth = 144;
  distanceBetweenSlotsPx = 160;

  // Flags
  machineFinished = false;
  machineRunning = false;
  machineInitialState = true;
  loading = false;
  fileImported = false;

  // Referenta à velocidade do ponteiro
  movingDelay = 5;

  // Onde o ponteiro se encontra
  currentSlot: number;

  // Centraliza a scrollbar
  ngAfterViewInit(): void {
    this.prepareView();
  }

  async readData(uploadedData: string): Promise<void> {
    this.loading = true;

    this.fonte = this.dReader.read(uploadedData);
    await this.delay(1000);
    this.fileImported = true;
    this.reset();

    this.loading = false;
  }

  async moveLeft(): Promise<void> {
    if (this.currentSlot > 0 && this.machineRunning) {
      const originalMargin = this.pointer.nativeElement.style.marginLeft.split('px')[0];
      const newMargin = Number(originalMargin) - this.distanceBetweenSlotsPx;

      while (this.pointer.nativeElement.style.marginLeft.split('px')[0] > newMargin && this.machineRunning) {
        this.pointer.nativeElement.style.marginLeft = (Number(this.pointer.nativeElement.style.marginLeft.split('px')[0]) - 1) + 'px';
        await this.delay(this.movingDelay);
      }

      this.currentSlot--;
    }
  }

  async moveRight(): Promise<void> {
    if (this.currentSlot < this.fonte.$fita.length - 1 && this.machineRunning) {
      const originalMargin = this.pointer.nativeElement.style.marginLeft.split('px')[0];
      const newMargin = Number(originalMargin) + this.distanceBetweenSlotsPx;

      while (this.pointer.nativeElement.style.marginLeft.split('px')[0] < newMargin && this.machineRunning) {
        this.pointer.nativeElement.style.marginLeft = (Number(this.pointer.nativeElement.style.marginLeft.split('px')[0]) + 1) + 'px';
        await this.delay(this.movingDelay);
      }

      this.currentSlot++;
      // TODO: Teste de sobrescrita, excluir quando importanção de arquivos estiver completa
      this.fonte.$fita[this.currentSlot] = '5';
    }
  }

  async run(): Promise<void> {
    this.machineRunning = true;
    this.machineInitialState = false;

    // TODO: Seguir as instruções da fonte importada em arquivo .txt
    await this.moveRight();
    await this.moveRight();
    await this.moveRight();
    await this.moveLeft();

    this.machineRunning = false;
    this.machineFinished = true;
  }

  stop(): void {
    this.machineRunning = false;
    this.machineFinished = true;
  }

  reset(): void {
    this.machineFinished = false;
    this.machineRunning = false;
    this.machineInitialState = true;

    this.fonte.resetFita();

    this.currentSlot = this.dReader.$surroundingSlots;
    this.pointer.nativeElement.style.marginLeft = '0px';
    this.prepareView();
  }

  prepareView(): void {
    const fitaTotalWidth = this.fitaContainer.nativeElement.scrollWidth;
    const fitaVisibleWidth = this.fitaContainer.nativeElement.offsetWidth;
    this.fitaContainer.nativeElement.scrollLeft = (fitaTotalWidth / 2) - (fitaVisibleWidth / 2);

    const pointerWidth = this.pointer.nativeElement.offsetWidth;

    const pointerMargin = this.fileImported ? - (pointerWidth / 2) + (this.slotWidth / 2) +
      this.distanceBetweenSlotsPx * this.dReader.$surroundingSlots : - (pointerWidth / 2);
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
