var oldCoin;
var selected_coin;
var numbers =[
  {"money": 100,
    "selected": 16  
  }
];
function coin_active(coinID) {
  selected_coin = document.getElementById(coinID);
  
  var allCoin = document.querySelectorAll(".coin10, .coin25, .coin50, .coin100, .coin500");
  allCoin.forEach(function(current_coin) {
    if (current_coin.classList.contains("roulette-coin-active")) {
      current_coin.classList.remove("roulette-coin-active");
    };
  });

  if (oldCoin == selected_coin) {
    selected_coin.classList.remove("roulette-coin-active");
    selected_coin = null;
    oldCoin = null;
  } else {
    selected_coin.classList.add("roulette-coin-active");
    oldCoin = document.getElementById(coinID);
  };
};



var time = 10;
var timer;
var displayTimer = document.getElementById("timer")
var wheel_spinning;


var storageTime = localStorage.getItem("timerTime");
if (storageTime) {
  time = parseInt(storageTime, 10);
};


var isTimerRunning = localStorage.getItem("isTimerRunning");
if (isTimerRunning == "true") {
  start_timer();
};

function start_timer() {
    timer = setInterval(function() {
    time--;

    if (time == 0) {
      spin_wheel();
      clearInterval(timer);
      time = 10;
    };
    updateTimer();
  }, 1000)
}


function updateTimer() {
  var minutes = Math.floor(time / 60);
  var seconds = time % 60;

  var formatedtime = (minutes < 10 ? "0": "") + minutes + ":" + (seconds < 10 ? "0": "") + seconds;

  displayTimer.textContent = formatedtime;

  localStorage.setItem("timerTime", time.toString());
};

window.addEventListener("beforeunload", function() {
  localStorage.setItem("isTimerRunning", timer ? "true" : "false");
})


const wheel = document.getElementById("roulette-wheel");


function spin_wheel() {
  if (wheel.classList.contains("roulette-wheel-spin")) {} else {
    wheel.classList.add("roulette-wheel-spin");
    wheel_spinning = true;
    setTimeout(stop_spin_wheel, 4000);
  };
};


function stop_spin_wheel() {
  if (wheel.classList.contains("roulette-wheel-spin")) {
    wheel.classList.remove("roulette-wheel-spin");
    wheel_spinning = false;
    start_timer();
  };
};



function place_coin(placeID) {
  var place = document.getElementById(placeID);

  if (selected_coin && !wheel_spinning) {
    var generate_number = Math.floor(Math.random() * 37);
    console.log(generate_number);
  } else {
    alert("Jelenleg nem tehetsz tétet!");
  }
}

