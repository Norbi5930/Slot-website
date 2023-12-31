
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

    document.getElementById("balance").textContent = data.balance + "$";
    document.getElementById("balance").name = data.balance;
  })
  .catch(error => {
    console.error("Hiba: ", error);
  });
};

let oldCoin;
let selected_coin;
let numbers = [];

let local_numbers = localStorage.getItem("numbers");
if (local_numbers) {
  try {
    numbers = JSON.parse(local_numbers);
  } catch (error) {
    console.error("Hiba az adatok betöltése során: ", error)
  }
}

let winner_number = localStorage.getItem("winner-number");
if (winner_number) {
  document.getElementById("winner-number").textContent = parseInt(winner_number);
}
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
const displayTimer = document.getElementById("timer")
let wheel_spinning;


let storageTime = localStorage.getItem("timerTime");
if (storageTime) {
  time = parseInt(storageTime, 10);
};


const isTimerRunning = localStorage.getItem("isTimerRunning");
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

let generate_number;
function spin_wheel() {
  if (wheel.classList.contains("roulette-wheel-spin")) {} else {
    wheel.classList.add("roulette-wheel-spin");
    wheel_spinning = true;
    setTimeout(stop_spin_wheel, 4000);
  };
  let black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 20, 22, 24, 26, 29, 31, 33, 35];
  let red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 23, 25, 27, 28, 30, 32, 34, 36]
  generate_number = Math.floor(Math.random() * 37);
  html_number_frame = document.getElementById("winner-number-frame")
  html_number = document.getElementById("winner-number");
  html_number.textContent = generate_number;
  if (black.includes(generate_number)) {
    html_number_frame.style.backgroundColor = "black";
    html_number.style.color = "white";
  } else if (red.includes(generate_number)) {
    html_number_frame.style.backgroundColor = "red";
    html_number.style.color = "black";
  } else {
    html_number_frame.style.backgroundColor = "darkgreen";
    html_number.style.color = "black";
  }
  let win = false;
  let win_money = 0;
  localStorage.setItem("winner-number", generate_number);

  if (numbers.length > 0) {
    numbers.forEach(function(item) {
      if (item.selected == generate_number) {
        win = true;
        win_money += item.money * 36;
      }
    });
    if (!win) {
      
    } else {
      roulette_win(win_money);
    }
  };
};

function roulette_win(money) {
  fetch("api/place/win", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      money: money
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      location.reload()
    } else {

    };
  })
  .catch(error => {
    console.error("Hiba: ", error);
  });
};

function stop_spin_wheel() {
  if (wheel.classList.contains("roulette-wheel-spin")) {
    wheel.classList.remove("roulette-wheel-spin");
    wheel_spinning = false;
    start_timer();
  };
  win = false;
  numbers = [];
  generate_number = null;
  localStorage.setItem("numbers", numbers);
};



function place_coin(placeID) {
  let place = document.getElementById(placeID);
  let balance = document.getElementById("balance").name;
  let coin = selected_coin.name;
  let number = place.textContent;

  if (selected_coin && !wheel_spinning) {
    if (Number(balance) >= Number(coin)) {
      fetch("api/place_coin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          money: Number(coin)
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          numbers.push({
            "money": Number(coin),
            "selected": Number(number)
          })
          localStorage.setItem("numbers", JSON.stringify(numbers));
          document.getElementById("balance").textContent = data.new_balance + "$";
          document.getElementById("balance").name = data.new_balance;
          document.getElementById("user-balance").textContent = data.new_balance + "$";
          document.getElementById("user-balance").name = data.new_balance;
        };
      })
      .catch(error => {
        console.error("Hiba: ", error);
      });
    } else {
      let alert = document.getElementById("balance-alert");
      alert.style.display = "block";
      setTimeout(function() {
        alert.style.display = "none";
      }, 3000);
    };
  } else {
    let alert = document.getElementById("place-alert");
    alert.style.display = "block";
    setTimeout(function() {
      alert.style.display = "none";
    }, 3000);
  };
};

