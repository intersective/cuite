import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {
  transform(items: any[], key: string, value: any): any[] {
    if (!items) {
      return [];
    }
    return items.filter(item => item[key] === value);
  }
}
