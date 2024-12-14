import { FC, PropsWithChildren, useState } from 'react';
import './HelloWorld.css';

interface Props extends PropsWithChildren {
  message?: string;
}

export const HelloWorld: FC<Props> = ({ message, children }) => {
  const [visible, setVisible] = useState(true);

  const handleClick = () => {
    setVisible(!visible);
  };

  return (
    <div className="helloworld">
      <button onClick={handleClick}>Say {visible ? 'goodbye' : 'hello'}</button>
      {visible ? (
        <p className="helloworld__message">{message || 'Nothing to say...'}</p>
      ) : null}
      {children}
    </div>
  );
};
