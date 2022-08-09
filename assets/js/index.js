
const createElement = (tagName, classList, attributes) => {
  const element = document.createElement(tagName);

  classList?.forEach(className => element.classList.add(className));

  try {
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  
  } catch (e) {}

  return element;
}


const createElementsGroup = (tagName, elementStatements) => elementStatements
  .map(({classList, attributes} = {}) => createElement(tagName, classList, attributes))


const appendChilds = (parent, childs) => childs?.forEach(child => parent.appendChild(child)); 


const createChartColumn = spending => {
  const [column, barContainer, bar, dayTag] = createElementsGroup('div', [
    { classList: ['chart-column'] },
    { classList: ['bar-container'] },
    {
      classList: ['bar'],
      attributes: {amount: spending.amount}
    },
    { classList: ['day-tag'] },
  ]);

  dayTag.textContent = spending.day;

  appendChilds(barContainer, [bar]);
  appendChilds(column, [barContainer, dayTag]);

  return {element: column, ...spending};
}


const addColumnToChart = (columnNode, chart) => chart.appendChild(columnNode);


const setHeightWeightToColumnBar = (columnNode, weight) => {
  const bar = columnNode.querySelector('.bar');
  
  bar.style.height = `${weight * 100}%`;
}


const getBiggestSpend = spendingList => spendingList.reduce((acc, { amount }) => Math.max(acc, amount), 0);


const defineWeightBasedOnSpend = chartColumnList => {
  const biggerCost = getBiggestSpend(chartColumnList);

  chartColumnList.forEach(columnItem => columnItem.weight = columnItem.amount / biggerCost);
}


async function highlightColumnOfDay(chartColumnList) {
  const { getDayName } = await import('./getday.js');

  const todayName = getDayName();

  chartColumnList.forEach(columnItem => {
    if (columnItem.day === todayName.slice(0, 3)) {
      columnItem.element.classList.add('today-spending')
    }
  })
} 


fetch('./assets/data/data.json')
  .then(response => response.json())
  .then(spendingLastSevenDays => spendingLastSevenDays.map(createChartColumn))
  .then(chartColumnList => {
    const chart = document.querySelector('.chart');

    defineWeightBasedOnSpend(chartColumnList);
    highlightColumnOfDay(chartColumnList);

    chartColumnList.forEach(columnItem => addColumnToChart(columnItem.element, chart));
    chartColumnList.forEach(({element, weight}) => setHeightWeightToColumnBar(element, weight));
  })
  .catch(e => console.log(e))
