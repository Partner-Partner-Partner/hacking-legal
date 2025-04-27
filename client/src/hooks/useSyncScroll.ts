'use client';

import { useRef, useEffect, RefObject } from 'react';

/**
 * Custom hook to synchronize scrolling between two elements
 */
export function useSyncScroll(
  leftRef: RefObject<HTMLDivElement>,
  rightRef: RefObject<HTMLDivElement>
) {
  const scrollingFromLeft = useRef(false);
  const scrollingFromRight = useRef(false);

  useEffect(() => {
    const leftElem = leftRef.current;
    const rightElem = rightRef.current;

    if (!leftElem || !rightElem) {
      return;
    }

    const handleLeftScroll = () => {
      if (!scrollingFromRight.current && leftElem && rightElem) {
        scrollingFromLeft.current = true;
        rightElem.scrollTop = leftElem.scrollTop;
        setTimeout(() => {
          scrollingFromLeft.current = false;
        }, 50);
      }
    };

    const handleRightScroll = () => {
      if (!scrollingFromLeft.current && leftElem && rightElem) {
        scrollingFromRight.current = true;
        leftElem.scrollTop = rightElem.scrollTop;
        setTimeout(() => {
          scrollingFromRight.current = false;
        }, 50);
      }
    };

    leftElem.addEventListener('scroll', handleLeftScroll);
    rightElem.addEventListener('scroll', handleRightScroll);

    return () => {
      leftElem.removeEventListener('scroll', handleLeftScroll);
      rightElem.removeEventListener('scroll', handleRightScroll);
    };
  }, [leftRef, rightRef]);
}
