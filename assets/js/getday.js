
const daysListNames = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

export const getDayName = () => daysListNames.at(new Date().getDay());
