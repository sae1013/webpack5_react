import React, {ReactNode} from 'react';

const ForwardRef = React.forwardRef<HTMLDivElement,{children?:JSX.Element}>((props,ref) => {
  const Children = React.cloneElement(props.children,{targetRef:ref})

  return (
      <>
          {Children}
      </>
  );
});

export default ForwardRef;

