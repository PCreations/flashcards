import { Given } from 'cucumber';
import { DateService } from '../../src/domain/box/dateService';

Given(/^today is (\d{4})-(\d{2})-(\d{2})$/, function(year, month, day) {
  this.dependencies.dateService = DateService({
    getToday: () => {
      const date = new Date();
      date.setFullYear(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
      return date;
    },
  });
});
