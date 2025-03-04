import { PropsWithChildren, useState } from 'react';
import './HelloWorld.css';

// NOTE: if no `children`, then just use a plain interface, no inheritance needed
interface Props extends PropsWithChildren {
  message?: string;
}

// NOTE: TypeScript automatically infers the return type as `JSX.Element`, even
//  `JSX.Element | null` if all you do is just `return null`, perhaps based on
//  the file type
export const HelloWorld = ({ message, children }: Props) => {
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
