import React from 'react';
import { render } from '@testing-library/react';
import ComponentTranslation from './Translation';

it('test render', () => {
  const { container } = render(<ComponentTranslation />);

  expect(container.querySelector('div')).toHaveTextContent('description.part4');
});
