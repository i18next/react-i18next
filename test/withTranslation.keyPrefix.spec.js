import React from 'react';
import { render } from '@testing-library/react';
import i18n from './i18n';
import { withTranslation } from '../src/withTranslation';

jest.unmock('../src/withTranslation');

describe('withTranslation', () => {
  class TestComponentKeyPrefix extends React.Component {
    render() {
      const { t, i18n: instance } = this.props;
      expect(typeof t).toBe('function');
      expect(instance).toBe(i18n);

      return <div>{t('deepKey1')}</div>;
    }
  }

  it('should render correct content', () => {
    const HocElement = withTranslation('translation', { keyPrefix: 'deepPath' })(
      TestComponentKeyPrefix,
    );
    const { container } = render(<HocElement />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        value1
      </div>
    `);
  });
});
