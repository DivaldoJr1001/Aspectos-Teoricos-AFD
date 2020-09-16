import { Component, OnInit } from '@angular/core';
import { AFD } from './models/afd';
import { Fonte } from './models/fonte';
import { DataReader } from './utils/dataReader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AFD';

  fonte: Fonte | undefined;
  dReader = new DataReader();

  maquinaAFD = new AFD(['0', '1', '*', ' ']);

  ngOnInit(): void {
    console.log(this.maquinaAFD.$alfabeto);
    console.log(this.maquinaAFD.$alfabeto.find(char => char === '1'));

    if (this.maquinaAFD.$alfabeto.find(char => char === '3') === undefined) {
      console.log('O caractere não existe no alfabeto da máquina');
    }
  }

  readData(uploadedData) {
    this.fonte = this.dReader.read(uploadedData);
  }
}
