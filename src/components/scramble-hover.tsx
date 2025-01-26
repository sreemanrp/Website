"use client";

import {
  useState,
  useEffect,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ScrambleHoverProps {
  children: React.ReactNode;
  scrambleSpeed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  scrambledClassName?: string;
  isHovering?: boolean;
  onHoverChange?: (isHovering: boolean) => void;
  useInternalHover?: boolean;
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

const ScrambleHover: React.FC<ScrambleHoverProps> = ({
  children,
  scrambleSpeed = 50,
  maxIterations = 10,
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className,
  scrambledClassName,
  sequential = false,
  revealDirection = "start",
  isHovering: isHoveringProp,
  onHoverChange,
  useInternalHover = false,
  ...props
}) => {
  // Replace existing text extraction
  const text = extractTextFromChildren(children);

  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const [internalHovering, setInternalHovering] = useState(false);
  const [revealedIndices] = useState(new Set<number>());

  const isHovering = useInternalHover ? internalHovering : isHoveringProp;

  const handleHoverStart = () => {
    if (useInternalHover) {
      setInternalHovering(true);
    }
    onHoverChange?.(true);
  };

  const handleHoverEnd = () => {
    if (useInternalHover) {
      setInternalHovering(false);
    }
    onHoverChange?.(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIteration = 0;

    const getNextIndex = () => {
      const textLength = text.length;
      switch (revealDirection) {
        case "start":
          return revealedIndices.size;
        case "end":
          return textLength - 1 - revealedIndices.size;
        case "center":
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedIndices.size / 2);
          const nextIndex =
            revealedIndices.size % 2 === 0
              ? middle + offset
              : middle - offset - 1;

          if (
            nextIndex >= 0 &&
            nextIndex < textLength &&
            !revealedIndices.has(nextIndex)
          ) {
            return nextIndex;
          }

          for (let i = 0; i < textLength; i++) {
            if (!revealedIndices.has(i)) return i;
          }
          return 0;
        default:
          return revealedIndices.size;
      }
    };

    const shuffleText = (text: string) => {
      if (useOriginalCharsOnly) {
        const positions = text.split("").map((char, i) => ({
          char,
          isSpace: char === " ",
          index: i,
          isRevealed: revealedIndices.has(i),
        }));

        const nonSpaceChars = positions
          .filter((p) => !p.isSpace && !p.isRevealed)
          .map((p) => p.char);

        // Shuffle remaining non-revealed, non-space characters
        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [
            nonSpaceChars[j],
            nonSpaceChars[i],
          ];
        }

        let charIndex = 0;
        return positions
          .map((p) => {
            if (p.isSpace) return " ";
            if (p.isRevealed) return text[p.index];
            return nonSpaceChars[charIndex++];
          })
          .join("");
      } else {
        return text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (revealedIndices.has(i)) return text[i];
            return availableChars[
              Math.floor(Math.random() * availableChars.length)
            ];
          })
          .join("");
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("");

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        if (sequential) {
          if (revealedIndices.size < text.length) {
            const nextIndex = getNextIndex();
            revealedIndices.add(nextIndex);
            setDisplayText(shuffleText(text));
          } else {
            clearInterval(interval);
            setIsScrambling(false);
          }
        } else {
          setDisplayText(shuffleText(text));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
          }
        }
      }, scrambleSpeed);
    } else {
      setDisplayText(text);
      revealedIndices.clear();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isHovering,
    text,
    characters,
    scrambleSpeed,
    useOriginalCharsOnly,
    sequential,
    revealDirection,
    maxIterations,
  ]);

  const renderText = () => {
    let currentIndex = 0;

    const processNode = (node: React.ReactNode): React.ReactNode => {
      if (typeof node === 'string' || typeof node === 'number') {
        const nodeText = String(node);
        const nodeLength = nodeText.length;
        const chars = displayText
          .slice(currentIndex, currentIndex + nodeLength)
          .split('');
        const result = chars.map((char, i) => (
          <span
            key={currentIndex + i}
            className={cn(
              revealedIndices.has(currentIndex + i) ||
                !isScrambling ||
                !isHovering
                ? className
                : scrambledClassName
            )}
          >
            {char}
          </span>
        ));
        currentIndex += nodeLength;
        return result;
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
    <motion.span
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className={cn("inline-block whitespace-pre-wrap", className)}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{renderText()}</span>
    </motion.span>
  );
};

export default ScrambleHover;
