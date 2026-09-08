import { useEffect, useState } from "react";

export default function Welcome() {
  const [welcome, setWelcome] = useState<string | null>(null);
  const [welcomeJson, setWelcomeJson] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/welcome").then(async (response) => setWelcome(await response.text()));
    fetch("/welcome/json").then(async (response) => setWelcomeJson(await response.json()));
  });
  return (
    <div>
      <p>{welcome}</p>
      <p>{JSON.stringify(welcomeJson)}</p>
    </div>
  );
}
