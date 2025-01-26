"use client"

import {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useCallback,
    Children,
    isValidElement,
    cloneElement,
  } from "react";
  
  interface ScrambleInProps {
    children: React.ReactNode;
    scrambleSpeed?: number;
    scrambledLetterCount?: number;
    characters?: string;
    className?: string;
    scrambledClassName?: string;
    autoStart?: boolean;
    onStart?: () => void;
    onComplete?: () => void;
    delay?: number;
  }
  
  export interface ScrambleInHandle {
    start: () => void;
    reset: () => void;
  }
  
  const extractTextFromChildren = (children: React.ReactNode): string => {
    return Children.toArray(children)
      .map(child => {
        if (typeof child === 'string') return child;
        if (typeof child === 'number') return String(child);
        if (isValidElement(child)) {
          // @ts-expect-error - child.props.children may not exist on all React element types,
          return extractTextFromChildren(child.props.children);
        }
        return '';
      })
      .join('');
  };
  
  const ScrambleIn = forwardRef<ScrambleInHandle, ScrambleInProps>(
    (
      {
        children,
        scrambleSpeed = 50,
        scrambledLetterCount = 10,
        characters = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
        className = "",
        scrambledClassName = "",
        autoStart = true,
        onStart,
        onComplete,
        delay = 0,
      },
      ref
    ) => {
      const text = extractTextFromChildren(children);

      const [displayText, setDisplayText] = useState("");
      const [isAnimating, setIsAnimating] = useState(false);
      const [visibleLetterCount, setVisibleLetterCount] = useState(0);
      const [scrambleOffset, setScrambleOffset] = useState(0);
  
      const startAnimation = useCallback(() => {
        setIsAnimating(true);
        setVisibleLetterCount(0);
        setScrambleOffset(0);
        onStart?.();
      }, [onStart]);
  
      const reset = useCallback(() => {
        setIsAnimating(false);
        setVisibleLetterCount(0);
        setScrambleOffset(0);
        setDisplayText("");
      }, []);
  
      useImperativeHandle(ref, () => ({
        start: startAnimation,
        reset,
      }));
  
      useEffect(() => {
        if (autoStart) {
          const timeout = setTimeout(() => {
            startAnimation();
          }, delay);

          return () => clearTimeout(timeout);
        }
      }, [autoStart, startAnimation, delay]);
  
      useEffect(() => {
        let interval: NodeJS.Timeout;
  
        if (isAnimating) {
          interval = setInterval(() => {
            // Increase visible text length
            if (visibleLetterCount < text.length) {
              setVisibleLetterCount((prev) => prev + 1);
            }
            // Start sliding scrambled text out
            else if (scrambleOffset < scrambledLetterCount) {
              setScrambleOffset((prev) => prev + 1);
            }
            // Complete animation
            else {
              clearInterval(interval);
              setIsAnimating(false);
              onComplete?.();
            }
  
            // Calculate how many scrambled letters we can show
            const remainingSpace = Math.max(0, text.length - visibleLetterCount);
            const currentScrambleCount = Math.min(
              remainingSpace,
              scrambledLetterCount
            );
  
            // Generate scrambled text
            const scrambledPart = Array(currentScrambleCount)
              .fill(0)
              .map(
                () => characters[Math.floor(Math.random() * characters.length)]
              )
              .join("");
  
            setDisplayText(text.slice(0, visibleLetterCount) + scrambledPart);
          }, scrambleSpeed);
        }
  
        return () => {
          if (interval) clearInterval(interval);
        };
      }, [
        isAnimating,
        text,
        visibleLetterCount,
        scrambleOffset,
        scrambledLetterCount,
        characters,
        scrambleSpeed,
        onComplete,
      ]);
  
      const renderText = () => {
        let currentIndex = 0;
        const revealed = displayText.slice(0, visibleLetterCount);
        const scrambled = displayText.slice(visibleLetterCount);
  
        const processNode = (node: React.ReactNode): React.ReactNode => {
          if (typeof node === 'string' || typeof node === 'number') {
            const nodeText = String(node);
            const nodeLength = nodeText.length;
            const nodeRevealed = revealed.slice(currentIndex, currentIndex + nodeLength);
            const nodeScrambled = scrambled.slice(currentIndex, currentIndex + nodeLength);
            currentIndex += nodeLength;
  
            return (
              <>
                <span className={className}>{nodeRevealed}</span>
                <span className={scrambledClassName}>{nodeScrambled}</span>
              </>
            );
          }
  
          if (isValidElement(node)) {
            return cloneElement(node, {
              // @ts-expect-error - node.props.children may not exist on all React element types,
              ...node.props,
              // @ts-expect-error - node.props may not exist on all React element types,
              children: Children.map(node.props.children, child => processNode(child))
            });
          }
  
          return node;
        };
  
        return Children.map(children, child => processNode(child));
      };
  
      return (
        <span className="inline-block whitespace-pre-wrap">
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{renderText()}</span>
        </span>
      );
    }
  );
  
  ScrambleIn.displayName = "ScrambleIn";
  export default ScrambleIn;
  