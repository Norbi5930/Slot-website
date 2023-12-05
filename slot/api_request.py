import requests


def make_deposit(card_number, cvc_code, amount):
    api_url = "http://127.0.0.1:5001/api/bank/" + str(card_number)
    data = {"money": amount, "cvc_code": cvc_code}
    response = requests.post(api_url, data=data)

    if response.status_code == 200:
        data = response.json()
        success = data.get("success")
        if success:
            return True
        else:
            return False
    elif response.status_code == 404:
        print("Felhasználó nem található.")
    else:
        print("Hiba a kérés során.")
    return None

def make_withdrawal(card_number, amount):
    api_url = "http://127.0.0.1:5001/api/bank/" + str(card_number)
    data = {"money": amount}
    response = requests.post(api_url, data=data)
    
    if response.status_code == 200:
        data = response.json()
        new_balance = data.get("new_balance")
        return new_balance
    elif response.status_code == 404:
        print("Felhasználó nem található.")
    else:
        print("Hiba a kérés során.")
    return None