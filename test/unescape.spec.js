import { unescape } from '../src/unescape';

describe('unescape', () => {
  it('should correctly unescape', () => {
    const unescaped = unescape(
      '&amp; &#38; &lt; &#60; &gt; &#62; &apos; &#39; &quot; &#34; &nbsp; &#160; &copy; &#169; &reg; &#174; &hellip; &#8230;',
    );

    expect(unescaped).toEqual('& & < < > > \' \' " "     © © ® ® … …');
  });
});
