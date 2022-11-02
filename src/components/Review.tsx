import React from 'react';
import "./scroll.scss";
import {RefType} from "../type";

function Review(props: { children?: JSX.Element, targetRef?:RefType<HTMLDivElement> }) {
    return (
        <div className="section__review" ref={props.targetRef}/>
    )
}

export default Review;
