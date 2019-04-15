import { Given } from 'cucumber';
import dayjs from 'dayjs';
import { DateService } from '../../src/domain/box/dateService';

Given(/^today is ((?:\d{4})-(?:\d{2})-(?:\d{2}))$/, function(todayDate) {
  this.dependencies.dateService = DateService({
    getToday: () => dayjs(todayDate).toDate(),
  });
});
