import React from 'react';
import "./scroll.scss";
import {RefType} from "../type";

function Introduce(props: { children?: JSX.Element, targetRef?:RefType<HTMLDivElement> }) {
  return (
    <div className="section__intro" ref={props.targetRef}/>
  )
}

export default Introduce;
