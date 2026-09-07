interface WelcomeProps {
  name: string;
}

export const Welcome = (props: WelcomeProps) => {
  if (props.name === "Luis") {
    return <div>Hello, {props.name}!</div>;
  } else {
    return <div> You are not Luis, who the f*ck are you?</div>;
  }
};
