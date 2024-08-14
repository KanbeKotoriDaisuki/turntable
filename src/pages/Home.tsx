import { useLocation } from "wouter";
import { useParsedData } from "../hooks/url";
import { useState } from "react";
import { queryBuilder } from "../utils";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const mapAtIndex = <T,>(a: T[], i: number, f: (x: T) => T) =>
  a.map((x, j) => (i === j ? f(x) : x));

export const Home = () => {
  const { title, tableItems, procedure, historyItems } = useParsedData();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string>();
  const [currentTitle, setCurrentTitle] = useState(title ?? "");
  const [item, setItem] = useState("");
  const [weight, setWeight] = useState(1);
  const [currentItems, setCurrentItems] = useState(tableItems);
  const [step, setStep] = useState("");
  const [currentProcedure, setCurrentProcedure] = useState(procedure);

  const clearItem = () => {
    setItem("");
    setWeight(1);
  };

  const clearAllItems = () => {
    clearItem();
    setCurrentItems([]);
  };

  const commit = () => {
    if (currentTitle === "") {
      setError("標題不能為空");
      return;
    } else if (currentItems.length === 0) {
      setError("轉盤列表不能為空");
      return;
    } else if (currentItems.some(([name]) => name === "")) {
      setError("轉盤列表不能有空值");
      return;
    } else if (currentProcedure.length === 0) {
      setError("過程不能為空");
      return;
    } else if (currentProcedure.some((step) => step === "")) {
      setError("過程不能有空值");
      return;
    }

    let url = queryBuilder(
      currentTitle,
      currentItems,
      currentProcedure,
      title === currentTitle &&
        tableItems === currentItems &&
        procedure === currentProcedure
        ? historyItems
        : []
    );

    setLocation(`/turn${url}`);
  };

  return (
    <form action="javascript:void(0)">
      <h1>转盘设置</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label htmlFor="title">
        <span>标题</span>
        <input
          type="text"
          id="title"
          name="title"
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
        />
      </label>
      <hr />
      <label htmlFor="new-item">
        <span>扇面列表</span>
        <input
          type="text"
          id="new-item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <input
          type="number"
          value={weight}
          min={1}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
        <button
          type="button"
          onClick={() => {
            setCurrentItems([...currentItems, [item, weight]]);
            clearItem();
          }}
        >
          <FontAwesomeIcon size="sm" icon={faPlus} />
        </button>
        <button type="reset" onClick={clearAllItems}>
          <FontAwesomeIcon size="sm" icon={faTrash} />
        </button>
      </label>
      <ul>
        {currentItems.map(([name, weight], i) => (
          <li key={i}>
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setCurrentItems(
                  mapAtIndex(currentItems, i, ([, weight]) => [
                    e.target.value,
                    weight,
                  ])
                )
              }
            />
            <input
              type="number"
              value={weight}
              onChange={(e) =>
                setCurrentItems(
                  mapAtIndex(currentItems, i, ([name]) => [
                    name,
                    Number(e.target.value),
                  ])
                )
              }
            />
            <button
              type="button"
              onClick={() =>
                setCurrentItems(currentItems.filter((_, j) => i !== j))
              }
            >
              <FontAwesomeIcon size="sm" icon={faClose} />
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <label htmlFor="new-step">
        <span>流程</span>
        <input
          type="text"
          id="new-step"
          value={step}
          onChange={(e) => setStep(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setCurrentProcedure([...currentProcedure, step]);
            setStep("");
          }}
        >
          <FontAwesomeIcon size="sm" icon={faPlus} />
        </button>
        <button type="reset" onClick={() => setCurrentProcedure([])}>
          <FontAwesomeIcon size="sm" icon={faTrash} />
        </button>
      </label>
      <ol>
        {currentProcedure.map((step, i) => (
          <li key={i}>
            <input
              type="text"
              value={step}
              onChange={(e) =>
                setCurrentProcedure(
                  mapAtIndex(currentProcedure, i, () => e.target.value)
                )
              }
            />
            <button
              type="button"
              onClick={() =>
                setCurrentProcedure(currentProcedure.filter((_, j) => i !== j))
              }
            >
              <FontAwesomeIcon size="sm" icon={faClose} />
            </button>
          </li>
        ))}
      </ol>
      <hr />
      <button type="submit" onClick={commit}>
        确认
      </button>
    </form>
  );
};
