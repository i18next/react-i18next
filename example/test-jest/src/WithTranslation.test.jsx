import React from 'react';
import { render } from '@testing-library/react';
import ComponentWithTranslation from './WithTranslation';

it('test render', () => {
  const { container } = render(<ComponentWithTranslation />);

  expect(container.querySelector('div')).toHaveTextContent('description.part3');
});
