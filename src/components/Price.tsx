import React from 'react';
import './scroll.scss';
import {RefType} from "../type";

function Price(props:{targetRef?:RefType<HTMLDivElement>}) {
    return (
        <div ref = {props.targetRef} className={'section__price'}></div>
    );
}

export default Price;
