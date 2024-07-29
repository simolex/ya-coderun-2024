const postcss = require('./postcss');
const plugin = require('./plugin');

const vendorPrefixes = {
  'display': ['webkit', 'moz'],
  'border-radius': ['webkit', 'moz', 'ms', 'o'],
  '::placeholder': ['ms-input', 'moz']
};

const styles = `
.card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 10px;
}

.secondary,
input::placeholder {
  color: #888;
}
`;

console.log('====== INPUT ======');
console.log(styles);
console.log('===================\n');

postcss([plugin({vendorPrefixes})])
  .process(styles)
  .then((result) => {
    console.log('====== OUTPUT ======');
    console.log(result.css);
    console.log('====================');
  });