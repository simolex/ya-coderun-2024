import $ from 'jquery';
import { format, differenceInDays } from 'date-fns';
import { foxSay } from './helpers/foxsay';
import { render } from './helpers/render';

// Define an interface for our custom object
interface CustomObject {
  id: number;
  name: string;
  timestamp: string;
}

function insertText(content: string): void {
  $('#app').append(`<p>${content}</p>`);
}

function insertImg(imgName: string): void {
  $('#app').append(`
    <img src=${require(`../public/assets/images/${imgName}`)}>
  `);
}

// Demonstrate moment usage
const currentDate = format(
  new Date('2004-08-16'),
  'eeee, MMMM do yyyy, h:mm:ss a',
);
insertText(`My DOB: ${currentDate}`);

// Initialize array of CustomObject
const objectArray: CustomObject[] = [
  {
    id: 1,
    name: 'Peach',
    timestamp: format(new Date('2004-08-16'), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  },
  {
    id: 2,
    name: 'Grape',
    timestamp: format(new Date('2005-01-20'), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
  },
];

const daysSpan = differenceInDays(
  new Date(objectArray[0].timestamp),
  new Date(objectArray[1].timestamp),
);
insertText(`TimeDelta: ${daysSpan}`);

const newObject: CustomObject = {
  id: 3,
  name: 'Grapefruit',
  timestamp: format(new Date('2021-01-10'), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
};
objectArray.push(newObject);

// Map names and sort by length
const names = objectArray
  .map((obj) => obj.name)
  .sort((a, b) => a.length - b.length);
insertText(`${names.join(', ')}`);

insertText(render(foxSay('Hello')));

insertImg('peach.jpg');