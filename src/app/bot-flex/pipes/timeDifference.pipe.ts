import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDifference'
})
export class TimeDifferencePipe implements PipeTransform {
  transform(startTime: number, endTime: number): string {
    // Convierte los timestamps UNIX a objetos Date
    const startDate = new Date(startTime * 1000);
    const endDate = new Date(endTime * 1000);

    // Calcula la diferencia en minutos
    const timeDifferenceInMinutes = (endDate.getTime() - startDate.getTime()) / 60000;

    // Formatea la diferencia en horas y minutos (por ejemplo, "2h 30min")
    const hours = Math.floor(timeDifferenceInMinutes / 60);
    const minutes = timeDifferenceInMinutes % 60;

    return `${hours}h ${minutes}min`;
  }
}
