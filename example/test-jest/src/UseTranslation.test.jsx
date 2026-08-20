import React from 'react';
import { render } from '@testing-library/react';
import ComponentUseTranslation from './UseTranslation';

it('test render', () => {
  const { container } = render(<ComponentUseTranslation />);

  expect(container.querySelector('div')).toHaveTextContent('description.part2');
});
