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

let generate_number;
function spin_wheel() {
  if (wheel.classList.contains("roulette-wheel-spin")) {} else {
    wheel.classList.add("roulette-wheel-spin");
    wheel_spinning = true;
    setTimeout(stop_spin_wheel, 4000);
  };
  generate_number = Math.floor(Math.random() * 37);
  let win = false;
  let win_money = 0;

  if (numbers.length > 0) {
    numbers.forEach(function(item) {
      if (item.selected == generate_number) {
        win = true;
        win_money += item.money * 36;
      }
    });
    if (!win) {
      alert("Sajnáljuk, nem nyert!")
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
      alert("Gratulálunk, NYERT. Az összeget az egyenlegéhez írtuk!");
    } else {
      alert("Az összeget nem sikerült az egyenlegéhez írni, kérjük vegye fel velünk a kapcsolatot!");
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
      alert("Nincs elegendő pénz mennyiséged!")
    };
  } else {
    alert("Jelenleg nem rakhatsz tétet!")
  };
};

