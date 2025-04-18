import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shuffle',
  standalone: true
})
export class ShufflePipe implements PipeTransform {

  transform<T>(array: T[]): T[] {
    if (!array) {
      return [];
    }
    const newArray = [...array];
    let currentIndex = newArray.length;
    let randomIndex: number;
    let temporaryValue: T;


    while (currentIndex !== 0) {


      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;


      temporaryValue = newArray[currentIndex];
      newArray[currentIndex] = newArray[randomIndex];
      newArray[randomIndex] = temporaryValue;
    }

    return newArray;
  }
}
