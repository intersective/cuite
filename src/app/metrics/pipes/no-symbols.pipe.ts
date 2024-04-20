import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noSymbols'
})
export class NoSymbolsPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/[\W_]+/g, ' ');
  }
}
