import React, { useEffect, useRef, useState } from 'react';
import './StackSlide.css';

const StackSlide = ({ children, slideInfo = {}, mainContentStyle = {} }) => {
  const [slide, setSlide] = useState({});
  const slideContentRef = useRef();
  const mainContentRef = useRef();
  const clearTimer = useRef();
  const prevSlide = useRef('');

  useEffect(() => {
    if (prevSlide.current && prevSlide.current === slideInfo.direction) {
      setSlide(slideInfo);
      clearTimeout(clearTimer.current);
      return;
    }

    if (!slide.direction && slideInfo.direction) {
      setSlide(slideInfo);
      prevSlide.current = slideInfo.direction;
      return;
    }

    if (slide.direction && slideInfo.direction === '') {
      prevSlide.current = slide.direction;
      clearTimer.current = setTimeout(() => {
        setSlide({});
        prevSlide.current = '';
      }, 500);
    }
  }, [slideInfo, setSlide, slide]);

  useEffect(() => {
    if (
      slide.direction &&
      slideInfo.direction &&
      slide.direction !== slideInfo.direction
    )
      return;

    if (slide.direction && slideInfo.direction)
      setTimeout(() => {
        slideContentRef.current.classList.add('show');
        mainContentRef.current.classList.add(slide.direction);
      }, 16);
    if (slideInfo.direction === '') {
      if (slideContentRef.current)
        slideContentRef.current.classList.remove('show');
      mainContentRef.current.classList.remove('right');
      mainContentRef.current.classList.remove('left');
    }
  }, [slideInfo, slide]);

  return (
    <div className="__stackSlide">
      <div
        ref={mainContentRef}
        className={`__mainContent`}
        style={mainContentStyle}>
        {children}
      </div>
      {!slide.direction ? null : (
        <div
          ref={slideContentRef}
          className={`__slideContent ${slide.direction}`}>
          {slide.component}
        </div>
      )}
    </div>
  );
};

export default StackSlide;
