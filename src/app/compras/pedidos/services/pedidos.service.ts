import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PoTableColumn, PoTableColumnSort, PoTableColumnSortType, PoTableDetail } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(public http: HttpClient) {}

  downloadCsv(endpoint: any) {
    this.http.get(endpoint).subscribe((data: any) => {
      const csvStr = this.parseJsonToCsv(data['items']);
      const dataUri = 'data:text/csv;charset=utf-8,' + csvStr;

      const exportFileDefaultName = 'data.csv';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    });
  }

  parseJsonToCsv(jsonData = []) {
    if (!jsonData.length) {
      return '';
    }

    const keys = Object.keys(jsonData[0]);
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const csvColumnHeader = keys.join(columnDelimiter);

    const csvStr = jsonData.reduce((accCsvStr, currentItem) => {
      keys.forEach((key, index) => {
        if (index && index < keys.length - 1) {
          accCsvStr += columnDelimiter;
        }

        accCsvStr += currentItem[key];
      });

      return accCsvStr + lineDelimiter;
    }, csvColumnHeader + lineDelimiter);

    return encodeURIComponent(csvStr);
  }

  private apiUrl = 'http://vhwin1065:9023/rest/zWSPedidos/get_all_po';

  // pedidos: Array<any> = [      {
  //   Item: 11234,
  //   initials: 'BR',
  //   country: 'Brazil',
  //   value: 1000.0,
  //   date: '2018-10-09',
  //   returnDate: '2018-11-01',
  //   class: 'Economic',
  //   onBoardService: false,
  //   destination: 'Rio de Janeiro',
  //   airline: 'Azul',
  //   status: 'available',
  //   region: 'Latin America',
  // },]

  pedidos: Array<any>

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'Item' },
      { property: 'Codigo' },
      { property: 'Produto' },
      { property: 'Un1A' },
      { property: 'Un2A' },
      { property: 'Qtde1A' },
      { property: 'Qtde2A' },
      { property: 'Preco'},
      { property: 'R$'},
      { property: 'Pagamento' },
      { property: 'Condicao'},
      { property: 'Fornecedor' },
      { property: 'Loja' },
      { property: 'rzSocial' },
      { property: 'Data' }

    ];
  }  
  getPedidos(data1: string, data2: string): Observable<any> {
    const url = `${this.apiUrl}?data1=${data1}&data2=${data2}`;
    return this.http.get<any>(url);  // Retorna o Observable
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

}