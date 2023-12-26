import "./ImageWheelComponent.css";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  maxToDisplay: number /**number of items to display */;
  nodes: ReactNode[] /** nodes to display */;
  animationSpeed?: number /** animationSpeed - lower number means faster */;
}
const TRANSITION_LIMIT_DISTANCE = 30;

const CardStackComponent = ({
  nodes,
  maxToDisplay,
  animationSpeed = 15,
}: Props) => {
  const [speed, _setSpeed] = useState<number>(animationSpeed);
  const [jumping, setJumping] = useState<boolean>(false);
  const [jumpTo, setJumpTo] = useState<number>(0);
  const [displayedNodes, setDisplayedNodes] = useState<ReactNode[]>(
    [...nodes].slice(0, maxToDisplay)
  );

  const [transitionDistance, setTransitionDistance] = useState<number>(
    TRANSITION_LIMIT_DISTANCE
  );

  const [direction, setDirection] = useState<number>(1);
  const [index, setIndex] = useState<number>(0);

  const transition = (dir: number) => {
    if (transitioning && !jumping) {
      return;
    }
    setDirection(dir);

    if (dir) {
      const i = Math.abs((index + maxToDisplay + nodes.length) % nodes.length);
      const addition = [...nodes][i];
      setDisplayedNodes((c) => [...c, addition]);
      setIndex((c) => (c + 1 === nodes.length ? 0 : c + 1));
    } else {
      const i = index - 1 < 0 ? nodes.length - 1 : index - 1;
      const addition = [...nodes][i];

      setDisplayedNodes((c) => [addition, ...c]);
      setIndex((c) => (c - 1 === -1 ? nodes.length - 1 : c - 1));
    }
    setTransitionDistance(
      dir ? TRANSITION_LIMIT_DISTANCE : -TRANSITION_LIMIT_DISTANCE
    );

    setTransitioning(true);
  };

  const [transitioning, setTransitioning] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (transitioning) {
        setTransitionDistance((c) => (direction ? c - 1 : c + 1));
        if (transitionDistance == 0) {
          setDisplayedNodes((cur) => {
            const arr = [...cur];
            direction ? arr.shift() : arr.pop();
            return [...arr];
          });

          setTransitioning(false);
          if (jumping && Math.abs(index) % nodes.length !== jumpTo) {
            transition(getDirection(index, jumpTo));
          } else {
            setJumping(false);
          }
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [transitioning, transitionDistance, direction, jumping, speed, jumpTo]);

  const calcTranslateZ = (i: number) => {
    if (!transitioning) {
      return i * (TRANSITION_LIMIT_DISTANCE / 8);
    }
    return (
      (i + (direction ? 0 : 1)) * (TRANSITION_LIMIT_DISTANCE / 8) -
      Math.abs(
        (TRANSITION_LIMIT_DISTANCE - transitionDistance) /
          TRANSITION_LIMIT_DISTANCE
      ) *
        (TRANSITION_LIMIT_DISTANCE / 8)
    );
  };

  const calcTranslateY = (i: number) => {
    if (!transitioning) {
      return i * TRANSITION_LIMIT_DISTANCE;
    }
    return (
      (i + (direction ? 0 : 1)) * TRANSITION_LIMIT_DISTANCE -
      Math.abs(
        (TRANSITION_LIMIT_DISTANCE - transitionDistance) /
          TRANSITION_LIMIT_DISTANCE
      ) *
        TRANSITION_LIMIT_DISTANCE
    );
  };

  const calcOpacity = (i: number) => {
    if (!transitioning) {
      return 1;
    }

    if (direction) {
      if (i === 0) {
        return Math.abs(transitionDistance / TRANSITION_LIMIT_DISTANCE);
      } else if (i === displayedNodes.length - 1) {
        return 1 - Math.abs(transitionDistance / TRANSITION_LIMIT_DISTANCE);
      } else {
        return 1;
      }
    } else {
      if (i === 0) {
        return 1 - Math.abs(transitionDistance / TRANSITION_LIMIT_DISTANCE);
      } else if (i === displayedNodes.length - 1) {
        return Math.abs(transitionDistance / TRANSITION_LIMIT_DISTANCE);
      } else {
        return 1;
      }
    }
  };

  const onJump = (i: number) => {
    if (transitioning || i === index) {
      return;
    }

    setJumpTo(i);
    setJumping(true);
    transition(getDirection(index, i));
  };

  const getDirection = (currentIndex: number, jumpToIndex: number) => {
    const forwardDistance =
      (jumpToIndex - currentIndex + nodes.length) % nodes.length;
    const backwardDistance =
      (currentIndex - jumpToIndex + nodes.length) % nodes.length;

    return forwardDistance < backwardDistance ? 1 : 0;
  };

  return (
    <div>
      <button onClick={() => transition(1)}>Swap</button>
      <button onClick={() => transition(0)}>Swap</button>
      <div style={{ display: "flex" }}>
        {nodes.map((_, i) => (
          <button key={i} onClick={() => onJump(i)}>
            {i}
          </button>
        ))}
      </div>
      <div
        style={{
          marginTop: "200px",
          transformStyle: "preserve-3d",
          perspective: TRANSITION_LIMIT_DISTANCE,
        }}
      >
        {displayedNodes.map((node, i) => (
          <div
            key={i}
            style={{
              /** props to convert in tailwind*/
              position: "absolute",
              transformOrigin: "50% 50%",
              pointerEvents: "none",
              userSelect: "none",
              /** */
              opacity: calcOpacity(i),
              transform: `translateZ(-${calcTranslateZ(
                i
              )}px) translateY(-${calcTranslateY(i)}px) `,
            }}
          >
            {node}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardStackComponent;
