import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (!value) {
      return false;
    }
    const count = value / (1000 * 60 * 60);
    return Math.floor(count);
  }

}
