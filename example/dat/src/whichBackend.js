module.exports = () => {
  const params = new URL(document.location).searchParams;
  const backend = (params.get('backend') || 'memory').toLowerCase();
  return backend;
};
