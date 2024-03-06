import React from "react";

import './Button.css';

export type ButtonProps = {
  primary: boolean;
  backgroundColor: string | undefined;
  size: 'small' | 'medium' | 'large';
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  children?: any
};

const Button = ({
  onClick,
  children,
  backgroundColor,
  primary = true,
  size = 'medium',
  ...props
}: ButtonProps) => {
  const mode = primary ? 'echo-button--primary' : 'echo-button--secondary';

  return (
    <button
      className={['echo-button', `echo-button--${size}`, mode].join(' ')}
      onClick={onClick}
      style={backgroundColor ? { backgroundColor: backgroundColor } : {}}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
