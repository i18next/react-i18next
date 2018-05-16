const React = require('react');

module.exports = {
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  translate: () => Component => props => <Component t={(k) => k} {...props} />,
  Trans: ({ children }) => children
};
