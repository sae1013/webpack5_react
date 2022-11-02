import React, { forwardRef, useRef, useEffect, useState } from 'react';
import './App.scss';
import ForwardRef from './components/ForwardRef';
import Introduce from './components/Introduce';
import Price from './components/Price';
import Review from './components/Review';
import {throttle,debounce} from 'throttle-debounce';
import {DomOffset} from './type';

function App() {
  const introSectionRef = useRef<HTMLDivElement>(null);
  const priceSectionRef = useRef<HTMLDivElement>(null);
  const reviewSectionRef = useRef<HTMLDivElement>(null);
  const domOffsets = useRef<DomOffset>();

  const [currentHighLightIdx, setCurrentHighLightIdx] = useState(0);

  const scrollButtonHandler = (e: React.MouseEvent) => {
    const dataIndex = e.currentTarget.getAttribute('data-index');
    let offsetHeight = 0;

    switch (dataIndex) {
      case 'intro':
        offsetHeight = introSectionRef.current.offsetTop;
        break;

      case 'price':
        offsetHeight = priceSectionRef.current.offsetTop;
        break;

      case 'review':
        offsetHeight = reviewSectionRef.current.offsetTop;
        break;
    }
    window.scroll({
      top: offsetHeight,
      behavior: 'smooth',
    });
  };
  const highlightHandler = debounce(50,() => {
    if (!domOffsets.current) return;
    const { introSection, priceSection, reviewSection } = domOffsets.current;
    const scrollY = window.scrollY;
    if (scrollY + 200 < priceSection) {
      setCurrentHighLightIdx(0);
    } else if (
        scrollY + 200 > priceSection &&
        scrollY + 200 < reviewSection
    ) {
      setCurrentHighLightIdx(1);
    } else if (scrollY + 200 > reviewSection) {
      setCurrentHighLightIdx(2);
    }
  })

  useEffect(() => {

    window.addEventListener('scroll', highlightHandler);
  }, []);

  useEffect(() => {
    domOffsets.current = {
      introSection: introSectionRef.current.offsetTop,
      priceSection: priceSectionRef.current.offsetTop,
      reviewSection: reviewSectionRef.current.offsetTop,
    };
  }, []);

  return (
    <>
      <div className={'button__wrap'}>
        <button
          className={`${currentHighLightIdx === 0 ? 'highlight' : ''}`}
          data-index={'intro'}
          onClick={scrollButtonHandler}
        >
          인트로
        </button>
        <button
          className={`${currentHighLightIdx === 1 ? 'highlight' : ''}`}
          data-index={'price'}
          onClick={scrollButtonHandler}
        >
          가격
        </button>
        <button
          className={`${currentHighLightIdx === 2 ? 'highlight' : ''}`}
          data-index={'review'}
          onClick={scrollButtonHandler}
        >
          리뷰
        </button>
      </div>
      <div>
        <ForwardRef ref={introSectionRef}>
          <Introduce></Introduce>
        </ForwardRef>
        <ForwardRef ref={priceSectionRef}>
          <Price></Price>
        </ForwardRef>
        <ForwardRef ref={reviewSectionRef}>
          <Review></Review>
        </ForwardRef>
      </div>
    </>
  );
}

export default App;
