from random import randint, choice



class Roulette:
    def __init__(self, coin, selected_numbers=None, selected_color=None, odd_even=None):
        self.coin = coin
        self.selected_numbers = selected_numbers
        self.selected_color = selected_color
        self.odd_even = odd_even
        self.colors = ["RED", "BLACK"]
        self.win_coin = 0
    
    def spin(self):
        number = randint(0, 36)
        print(number)

        if self.selected_color:
            color = choice(self.colors)
            print(color)

            if self.selected_color == color:
                coin = self.coin * 2
                self.win_coin += coin
                print("Az ön szine nyert!")
            else:
                coin = -self.coin
                self.win_coin += coin
                print("Nem nyert a színe!")
        
        if self.selected_numbers == number:
            coin = self.coin * 36
            self.win_coin += coin
            print("Az ön száma nyert!")
        else:
            coin = -self.coin
            self.win_coin += coin
            print("Nem nyert az ön száma!")
        
        if self.odd_even == "EVEN":
            if self.selected_numbers % 2 == 0:
                coin = self.coin * 2
                self.win_coin += coin
                print("EVEN lett a szám!")
            else:
                coin = -self.coin
                self.win_coin += coin
                print("Nem lett EVEN a szám!")
        elif self.odd_even == "ODD":
            if self.selected_numbers % 2 != 0:
                coin = self.coin * 2
                self.win_coin += coin
                print("ODD lett a szám!")
            else:
                coin = -self.coin
                self.win_coin += coin
                print("Nem lett ODD a szám!")

        return self.win_coin
    


a = Roulette(100, 26, "RED", "EVEN").spin()


print(a)

        