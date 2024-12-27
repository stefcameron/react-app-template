import * as rtv from 'rtvjs';

export const withoutPropTypesProps =
  WP_BUILD_ENV === 'development'
    ? {
        // OTHER PROPS: applied to wrapper <div>

        // true if message should be rendered
        visible: [rtv.OPTIONAL, rtv.BOOLEAN],
      }
    : /* istanbul ignore next -- dev build only */ undefined;

export const WithoutPropTypes = (props) => {
  //
  // PROPS
  //

  /* istanbul ignore next -- dev build only */
  if (WP_BUILD_ENV === 'development') {
    rtv.verify(props, withoutPropTypesProps);
  }

  const { visible = false } = props;

  //
  // RENDER
  //

  return visible ? (
    <section className="without-prop-types">
      <p>
        The <code>WithoutPropTypes</code> demonstrates how to do runtime prop
        type checks in dev builds when not using TypeScript.
      </p>
    </section>
  ) : null;
};
