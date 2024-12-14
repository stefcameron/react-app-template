import { FC } from 'react';

export const StylePreview: FC = () => {
  return (
    <section>
      <h1>Header 1</h1>
      <h2>Header 2</h2>
      <h3>Header 3</h3>
      <h4>Header 4</h4>
      <h5>Header 5</h5>
      <h6>Header 6</h6>
      <p>
        Paragraph text with <strong>strong</strong>, <em>italic</em>,{' '}
        <code>code</code>, <a href="#">link</a>.
      </p>
      <small>
        Paragraph text with <strong>strong</strong>, <em>italic</em>,{' '}
        <code>code</code>, <a href="#">link</a>.
      </small>
      <pre>
        Preformatted text block{'\n'}
        with newline.
      </pre>
    </section>
  );
};
