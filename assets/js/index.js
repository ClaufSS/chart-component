
const chart = document.querySelector('.chart');


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


const createSpendingChartColumn = spending => {
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

  spending.columnNode = column;
}


const addColumnToChart = ({columnNode}) => chart.appendChild(columnNode);


const setHeightWeightToColumnBar = ({columnNode, weight}) => {
  const bar = columnNode.querySelector('.bar');
  
  bar.style.height = `${weight * 100}%`;
}


const getBiggerCost = spendingsList => spendingsList.reduce((acc, { amount }) => Math.max(acc, amount), 0);


const defineWeightCost = spendingsList => {
  const biggerCost = getBiggerCost(spendingsList);

  spendingsList.forEach(spending => spending.weight = spending.amount / biggerCost);
}


async function highlightColumnOfDay(spendingsList) {
  const { getDayName } = await import('./getday.js');

  const todayName = getDayName();

  spendingsList.forEach(spending => {
    if (spending.day === todayName.slice(0, 3)) {
      spending.columnNode.classList.add('today-spending')
    }
  })
} 


fetch('./assets/data/data.json')
  .then(response => response.json())
  .then(spendingLastSevenDays => {

    defineWeightCost(spendingLastSevenDays);

    spendingLastSevenDays.forEach(createSpendingChartColumn);
    spendingLastSevenDays.forEach(addColumnToChart);

    highlightColumnOfDay(spendingLastSevenDays);

    spendingLastSevenDays.forEach(setHeightWeightToColumnBar);


  })
  .catch(e => console.log(e))
