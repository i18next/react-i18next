import React from 'react';
import { mount } from 'enzyme';
import MyComponent, { CustomComponent } from './MyComponent';

it('test render of named export', () => {
  const mounted = mount(<CustomComponent t={k => 'translate hardcoded'} />);

  // console.log(mounted.debug());
  expect(mounted.contains(<div>translate hardcoded</div>)).toBe(true);
});

it('test render of component inside hoc (default export)', () => {
  const mounted = mount(<MyComponent />);

  // console.log(mounted.debug());
  expect(mounted.contains(<div>description.part2</div>)).toBe(true);
});
