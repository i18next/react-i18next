import React from 'react';
import { render } from '@testing-library/react';
import ComponentTrans from './Trans';

it('test render', () => {
  const { container } = render(<ComponentTrans />);

  expect(container.querySelector('strong')).toHaveTextContent('description.bold');
});
