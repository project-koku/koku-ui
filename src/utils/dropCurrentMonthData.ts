export function dropCurrentMonthData(res, query): any {
  const repsonseData = res.data;
  const isLastMonth = query.indexOf('filter[time_scope_value]=-2') >= 0;
  const isDaily = query.indexOf('filter[resolution]=daily') >= 0;
  if (isLastMonth && isDaily) {
    const today = new Date();
    const thisMonth = today.getMonth() + 1;
    const thisMonthStr = thisMonth > 9 ? thisMonth.toString() : '0' + thisMonth.toString();
    const thisYear = today.getFullYear();
    const thisMonthPrefix = thisYear.toString() + '-' + thisMonthStr;
    const newData = [];
    repsonseData.data.forEach(element => {
      if (element.date && !element.date.startsWith(thisMonthPrefix)) {
        newData.push(element);
      }
    });
    repsonseData.data = newData;
  }
  return repsonseData;
}
