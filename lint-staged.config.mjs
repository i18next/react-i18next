export default {
  '!*.?(c|m){js,ts}?(x)': ['prettier --write '],
  '*.?(c|m){js,ts}?(x)': ['prettier --write --ignore-unknown', 'eslint --cache --fix --env-info'],
};
