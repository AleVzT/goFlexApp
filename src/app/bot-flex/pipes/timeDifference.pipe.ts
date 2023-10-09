import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDifference'
})
export class TimeDifferencePipe implements PipeTransform {
  transform(startTime: string, endTime: string): string {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const timeDifferenceInMinutes = (endDate.getTime() - startDate.getTime()) / 60000;

    const hours = Math.floor(timeDifferenceInMinutes / 60);
    const minutes = timeDifferenceInMinutes % 60;

    return `${hours}h ${minutes}min`;
  }
}
