/*
function music() {
  let audio = document.getElementById("audiomusic");
  audio.play();
};

window.addEventListener("DOMContentLoaded", function() {
  music();
});
window.addEventListener("beforeunload", function() {
  music();
});
*/

window.addEventListener("DOMContentLoaded", function() {
  load_user_data();
});

function load_user_data() {
  fetch("api/get_data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);

    document.getElementById("balance").innerHTML = data.balance + "$";
  })
  .catch(error => {
    console.error("Hiba: ", error);
  });
};

let oldCoin;
let selected_coin;
let numbers = [];
function coin_active(coinID) {
  selected_coin = document.getElementById(coinID);
  
  let allCoin = document.querySelectorAll(".coin10, .coin25, .coin50, .coin100, .coin500");
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



let time = 60;
let timer;
let displayTimer = document.getElementById("timer")
let wheel_spinning;


let storageTime = localStorage.getItem("timerTime");
if (storageTime) {
  time = parseInt(storageTime, 10);
};


let isTimerRunning = localStorage.getItem("isTimerRunning");
if (isTimerRunning == "true") {
  start_timer();
};

function start_timer() {
    timer = setInterval(function() {
    time--;

    if (time == 0) {
      spin_wheel();
      clearInterval(timer);
      time = 60;
    };
    updateTimer();
  }, 1000)
}


function updateTimer() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  let formatedtime = (minutes < 10 ? "0": "") + minutes + ":" + (seconds < 10 ? "0": "") + seconds;

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
  let generate_number = Math.floor(Math.random() * 37);

  if (numbers.length > 0) {
    numbers.forEach(function(item) {
      if (item.selected == generate_number) {
        console.log("Gratulálunk, a te számod nyert!", generate_number);
      } else {
        console.log("Sajnáljuk, nem nyert a megrakott száma(i)!", generate_number);
      };
    });
  };

};

function stop_spin_wheel() {
  if (wheel.classList.contains("roulette-wheel-spin")) {
    wheel.classList.remove("roulette-wheel-spin");
    wheel_spinning = false;
    start_timer();
  };
  numbers = [];
  generate_number = null;
};



function place_coin(placeID) {
  let place = document.getElementById(placeID);

  if (selected_coin && !wheel_spinning) {
    let number = place.textContent;
    let coin = selected_coin.name
    numbers.push({
      "money": Number(coin),
      "selected": Number(number)
    });
  } else {
    alert("Jelenleg nem tehetsz tétet!");
  }
}

