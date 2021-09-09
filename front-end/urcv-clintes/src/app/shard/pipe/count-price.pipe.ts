import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countPrice'
})
export class CountPricePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    console.log(value);
    console.log(args);

    const count =+value
    return count;
  }

}
