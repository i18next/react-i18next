# Getting started

```bash
# npm run dev
```

**open:**

will detect language: [http://localhost:3000](http://localhost:3000)

german: [http://localhost:3000/?lng=de](http://localhost:3000/?lng=de)

english: [http://localhost:3000/?lng=en](http://localhost:3000/?lng=en)


## Learn more

- Uses express to also serve translations for clientside
- Translations are passed down to client on initial serverside render -> no reload of translations, no flickering
- Uses *i18next-express-middleware* on the serverside to assert that every request gets his own instance of i18next (no race condition conflicts when user b overrides set language in i18next singleton of user a!!!)
