const React = require('react');
const ReactDOMServer = require('react-dom/server');
const path = require('path');

// Basic register to handle TSX on the fly in Node
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  extensions: ['.tsx', '.ts', '.js', '.jsx']
});

const componentName = process.argv[2];
const data = JSON.parse(process.argv[3] || '{}');

try {
  const Component = require(path.join(__dirname, componentName)).default;
  const element = React.createElement(Component, data);
  const html = ReactDOMServer.renderToStaticMarkup(element);
  console.log(html);
} catch (error) {
  console.error('Error rendering email:', error);
  process.exit(1);
}
