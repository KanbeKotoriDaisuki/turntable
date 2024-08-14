import { last, random, zip } from "radash";
import { useState } from "react";
import { Link, Redirect } from "wouter";
import { useParsedData } from "../hooks/url";
import { animate } from "popmotion";
import { queryBuilder } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import "./TurnTable.css";

const angleItem = (starts: number[], totalWeight: number, angle: number) => {
  const calculateAngle = (i: number) =>
    ((360 * starts[i]) / totalWeight + angle) % 360;

  const res =
    (1 +
      zip(starts, [...starts.slice(1), starts[0]]).findIndex(([start, end]) => {
        const startAngle = calculateAngle(start);
        const endAngle = calculateAngle(end);

        return 90 < endAngle && (startAngle > endAngle || startAngle < 90);
      })) %
    (starts.length - 1);

  return res;
};

export const TurnTable = () => {
  const { title, tableItems, historyItems, procedure } = useParsedData();

  if (!title || !tableItems || !historyItems) {
    return <Redirect to="/" />;
  }

  const r = 1000;
  const stroke = 30;

  const totalWeight = tableItems.reduce((acc, [, w]) => acc + w, 0);
  const starts = tableItems.reduce(
    (acc, [, w]) => [...acc, (last(acc) ?? 0) + w],
    [0] as number[]
  );

  const currentStep = historyItems.length;
  const [angle, setAngle] = useState(last(historyItems) ?? 0);
  const [hasRolled, setHasRolled] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const currentItem = angleItem(starts, totalWeight, angle);

  const roll = () => {
    setHasRolled(true);
    setIsRolling(true);
    const targetAngle = random(10 * 360, 20 * 360 - 1);

    animate({
      from: angle,
      to: targetAngle,
      onUpdate: setAngle,
      mass: 4,
      stiffness: 100,
      damping: 75,
      velocity: 1000,
      onComplete: () => {
        setAngle(targetAngle % 360);
        setIsRolling(false);
      },
    });
  };

  return (
    <main>
      <header>
        <h1>转盘</h1>
        <Link
          to={`/${queryBuilder(title, tableItems, procedure, historyItems)}`}
          asChild
        >
          <button>
            <FontAwesomeIcon size="sm" icon={faGear} />
          </button>
        </Link>
      </header>
      <div
        className={
          currentStep === procedure.length ? "columns one-col" : "columns"
        }
      >
        <div className="column">
          <h2>{title}</h2>
          {currentStep !== procedure.length && (
            <>
              <h3>
                {currentStep + 1}：{procedure[currentStep]}
              </h3>
              <p>{tableItems[currentItem][0]}</p>
              <svg
                id="turntable"
                viewBox={`0 0 ${2 * r} ${2 * r}`}
                width="400"
                height="400"
              >
                <g transform={`rotate(${angle} 1000 1000)`}>
                  {tableItems.map(([name, weight], i) => {
                    const angle = (weight / totalWeight) * 2 * Math.PI;
                    const x = -Math.cos(angle) * r + r;
                    const y = Math.sin(angle) * r + r;
                    const path = `M0 ${r}A${r} ${r} 0 0 0 ${x} ${y}L${r} ${r}Z`;

                    return (
                      <g
                        key={i}
                        transform={`rotate(${(360 * starts[i]) / totalWeight})`}
                        transform-origin={`${r} ${r}`}
                      >
                        <path
                          d={path}
                          fill={`hsl(${
                            (starts[i] * 360) / totalWeight
                          }, 75%, 50%)`}
                        />
                        <text
                          x={1000}
                          y={300}
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          fontSize={150}
                          fontWeight="bold"
                          fill="white"
                          transform={`rotate(${
                            -(360 * weight) / totalWeight / 2 - 90
                          } 1000 1000)`}
                        >
                          {name}
                        </text>
                      </g>
                    );
                  })}
                </g>
                <path
                  fill="white"
                  d={`M${r + 300} ${r}L${r} ${r - 370}L${r - 300} ${r}Z`}
                />
                <circle
                  cx={r}
                  cy={r}
                  r={300}
                  fill={isRolling ? "grey" : "orange"}
                  stroke="white"
                  strokeWidth={stroke}
                  onClick={roll}
                  pointerEvents={isRolling ? "none" : "auto"}
                />
                <text
                  x={r}
                  y={r}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={150}
                  fontWeight="bold"
                  fill="white"
                  style={{ pointerEvents: "none" }}
                >
                  開始
                </text>
              </svg>
              <Link
                to={`/turn${queryBuilder(title, tableItems, procedure, [
                  ...historyItems,
                  angle,
                ])}`}
                asChild
              >
                <button disabled={!hasRolled || isRolling}>確認</button>
              </Link>
            </>
          )}
        </div>
        <div className="column">
          <ul>
            {zip(procedure, historyItems).map(([step, angle], i) => (
              <li key={i}>
                {step}:{" "}
                {angle
                  ? tableItems[angleItem(starts, totalWeight, angle)][0]
                  : "？"}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {currentStep === procedure.length && (
        <div id="restart">
          <Link href="/" asChild>
            <button>从零重新开始</button>
          </Link>
          <Link href={`/turn${queryBuilder(title, tableItems, procedure, [])}`}>
            <button>以同样的设置重新开始</button>
          </Link>
        </div>
      )}
    </main>
  );
};
