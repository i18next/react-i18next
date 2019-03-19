import { configure } from '@storybook/react';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

function loadStories() {
  requireAll(require.context('../src/stories', true, /.stories\.js?$/));
}

configure(loadStories, module);
