export function render(line: string): string {
  line = line.replace(/\n/g, '<br>');
  line = line.replace(/ /g, '&#8192');
  return line;
}
