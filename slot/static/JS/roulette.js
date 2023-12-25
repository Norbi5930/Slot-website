var oldCoin;
var selected_coin;
var numbers =[];
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


const spin_button = document.getElementById("spinbutton").addEventListener("click", function() { spin_wheel() });
const wheel = document.getElementById("roulette-wheel");


function spin_wheel() {
  if (wheel.classList.contains("roulette-wheel-spin")) {} else {
    wheel.classList.add("roulette-wheel-spin");
    setTimeout(stop_spin_wheel, 4000);
  };
};


function stop_spin_wheel() {
  if (wheel.classList.contains("roulette-wheel-spin")) {
    wheel.classList.remove("roulette-wheel-spin");
  };
};



function place_coin(placeID) {
  var place = document.getElementById(placeID);

  if (selected_coin) {
    
  } else {
    alert("Válassz először egy tétet!")
  }
}

