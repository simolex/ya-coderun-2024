import data from './data.hehehe';

console.log(data);


export function foxSay(message: string): string {
  return `
   /|_/|
  / ^ ^(_o  <  ${message}
 /    __.'
 /     \\
(_) (_) '._
  '.__     '. .-''-'.
     ( '.   ('.____.''
     _) )'_, )
    (__/ (__/
    ${data.pod}
  `;
}
