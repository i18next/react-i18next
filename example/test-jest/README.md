### Intro

`./src/__mocks__` contains the react-i18next mock (mocks translate and Trans; mock other components as needed!!!)

`./src/setupTests.js` registers the `@testing-library/jest-dom` matchers (and shows how to init i18next instead of stubbing)

`./src/App.test.jsx` basic render test
`./src/*.test.jsx` tests using `@testing-library/react`

Run the tests with `npm test` (Jest, config in `jest.config.js` / `babel.config.js`).

The app itself uses [Vite](https://vite.dev): `npm start` (dev server at [http://localhost:5173](http://localhost:5173)), `npm run build` (output in `dist/`), `npm run preview`.
