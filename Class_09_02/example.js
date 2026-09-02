// console.log("start");
// setTimeout(() => {
//   console.log("I ran after 2 seconds");
// }, 2000);
// console.log("end");

// const timer = setTimeout(() => {
//   console.log("I ran after 5 seconds");
// }, 5000);

// clearTimeout(timer);
// console.log("I cleared the timer before it could run");

let seconds = 0;
const clock = setInterval(() => {
    seconds += 1;
    console.log(seconds);

    if (seconds === 10) {
        clearInterval(clock);
    }
}, 1000);

    
