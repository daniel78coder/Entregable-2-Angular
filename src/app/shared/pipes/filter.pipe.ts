import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, property?: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      if (property) {
        return item[property]?.toString().toLowerCase().includes(searchText);
      } else {
        return Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchText)
        );
      }
    });
  }
}
