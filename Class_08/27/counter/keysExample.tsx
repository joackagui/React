const message: string = "Hello World!";
const add = (a: number, b: number): number => a + b;

export default function KeysExample() {
  return (
    <section>
      <h1>{message}</h1>
      <p>3 + 4 = {add(3, 4)}</p>
    </section>
  );
}
