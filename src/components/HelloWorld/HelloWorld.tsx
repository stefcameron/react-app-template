import { useState } from 'react';
import './HelloWorld.css';

export const HelloWorld = (): JSX.Element => {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(!visible);
  };

  return (
    <div className="helloworld">
      <button onClick={handleClick}>Say {visible ? 'goodbye' : 'hello'}</button>
      {visible ? <p>Hello, world!</p> : null}
      {WP_BUILD_ENV === 'development'
        ? '{Dev build}'
        : /* istanbul ignore next: cannot be tested */ '{Prod build}'}
    </div>
  );
};
