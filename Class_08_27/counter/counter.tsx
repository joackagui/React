import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <section>
      <h1>Increment</h1>
      <button
        onClick={(): void => {
          setCount((prevCount) => prevCount + 1);
        }}
      >
        {count}
      </button>
    </section>
  );
}
