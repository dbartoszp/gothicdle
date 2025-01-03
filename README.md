
# Gothicdle

Gothicdle to aplikacja imitująca znaną grę przeglądarkową Wordle, polegającą na codziennym zgadywaniu losowego słowa.

Gothicdle polega na codziennym zgadywaniu losowej postaci wybranej z puli dostępnych. Aplikacja działa zarówno na urządzeniach mobilnych, jak i desktopowych.

Grupą docelową są fani serii Gothic - gra jako osoba nigdy nie mająca styczności z serią gier będzie miała bardzo duże problemy w odgadnięciu postaci.

# Funkcjonalności

Gothicdle oferuje dwa główne tryby gry: Klasyczny, oraz Endless.

Tryb klasyczny polega na codziennej zmianie zgadywanej postaci. Po poprawnym odgadnięciu użytkownik musi zaczekać do kolejnej zmiany postaci, by mógł zgadywać ponownie.

Tryb endless pozwala użytkownikowi o nieskończone zgadywanie postaci, które losowane są na bieżąco.

Każdy z trybów oferuje także wybór bazy danych: najbardziej rozpoznawane postaci, po bazie danych na każdą część serii gier oraz wszystkie postacie zebrane w jednej bazie danych.

Dla ułatwienia rozgrywki możliwe jest także włączenie podpowiedzi, które ujawniają kolejne litery imienia postaci co 5 nieudanych prób.

# Instrukcja użytkownia od strony użytkownika

Aby dostać się na stronę, użytkownik powinien przejść na adres https://www.gothicdle.com/.

Po przejściu na stronę użytkownik ma do wyboru kilka przycisków:
możliwość sprawdzenia aktualności, wsparcia, wybrania trybu gry oraz zgłoszenia błędów w bazie danych.

<div align="center">
  <img src="https://github.com/user-attachments/assets/d245ee96-c7f0-4692-a2c9-bf165065e052" alt="Image description" />
</div>

Przycisk aktualności wyświetla modal z ostatnimi zmianami strony. 
Przycisk przejścia do wsparcia przekierowuje do strony oferującej możliwość wsparcia autorów strony.

<div align="center">
  <img src="https://github.com/user-attachments/assets/a9158d8a-e864-4e20-ab39-64ddd25b0b91" alt="Image description" />
</div>

Zgłaszanie błędów w bazie danych przekierowuje do strony z dostępną do odczytu bazą danych z udostępnioną możliwością dodawania komentarzy.

<div align="center">
  <img src="https://github.com/user-attachments/assets/9fc51ded-a1a7-4f51-b18e-5fed077f7a69" alt="Image description" />
</div>

Poniżej przycisków znajduje się pokrótka instrukcja dotycząca sprawdzania poprawności odpowiedzi.
<div align="center">
  <img src="https://github.com/user-attachments/assets/dc0e6304-c237-4ac0-a896-49727b34ec5b" alt="Image description" />
</div>

Po wybraniu trybu gry, użytkownik przenoszony jest do ekranu z rozgrywką. Tutaj wybrany został tryb klasyczny:
<div align="center">
  <img src="https://github.com/user-attachments/assets/b484d201-ac4a-4677-bbdd-33a9cc212d37" alt="Image description" />
</div>
Użytkownik może wrócić do poprzedniej strony za pomocą przycisku powrotu do menu. Może także wybrać bazę danych, z której losowana jest postać.
<div align="center">
  <img src="https://github.com/user-attachments/assets/18d84bc1-d3c9-4563-95c7-f9e1e4877999" alt="Image description" />
</div>

Następnie użytkownik może przejść do głównej funkcjonalności aplikacji, czyli samego zgadywania postaci. Na środku ekranu znajduje się pole tekstowe, do którego użytkownik wprowadza nazwę szukanej postaci. Postać szukana jest po imieniu, i wszystkie postacie dostępne w wybranej bazie danych oraz spełniające kryteria (wpisana fraza znajduje się w nazwie postaci) zostają wyświetlone i możliwe do wyboru po naciśnięciu na kafelek z nazwą postaci.
<div align="center">
  <img src="https://github.com/user-attachments/assets/14aa81bb-120a-44b3-8fb5-0eec2ba6868a" alt="Image description" />
</div>
Po próbie odgadnięcia postaci, ujawnione zostaną informacje o tym, na ile postać wybrana przez użytkownika jest podobna do poprawnej, zgodnie z instrukcją. W tym wypadku postać to nie Diego, nie należy ani do Cieni ani Obywateli, występuje w jednej lub więcej części z podanych, posiada jedną lub więcej z podanych broni, nie nosi żadnej z podanych zbroi.
<div align="center">
  <img src="https://github.com/user-attachments/assets/f3d3d51b-9944-49bf-9596-9ed8d7efcd9e" alt="Image description" />
</div>

Po poprawnym odgadnięciu postaci użytkownik zostanie o tym poinformowany i dostanie możliwość pochwalenia się wynikiem za pomocą skopiowania krótkiej wiadomości.
![image](https://github.com/user-attachments/assets/d5c5bc14-f40d-4ef8-abb5-2a11292ff4ba)

Tryb endless działa na takiej samej zasadzie, ale po poprawnym odgadnięciu postaci umożliwione jest losowanie kolejnej.

# Instrukcja obsługi ze strony developera

Aby pobraną aplikację uruchomić, należy najpierw pobrać potrzebne biblioteki za pomocą npm:

```bash
npm i
```

Po pobraniu, aby włączyć aplikację należy w konsoli włączyć serwer:

```bash
npm run dev
```
I udać się do adresu  [http://localhost:3000](http://localhost:3000).

Należy wspomnieć, że aby aplikacja miała dostęp do bazy danych potrzebny jest sekretny klucz, który nie jest udostępniony w projekcie ze względów bezpieczeństwa.


# Technologie użyte w tworzeniu aplikacji

Do uzyskania warstwy frontendowej użyty został Next.js na Reactcie. Zamiast Javascripta użyty został Typescript do uzyskania większej pewności co do typów zmiennych. Aplikacja stylizowana była za pomocą TailwindCSS.

Za backend odpowiada serwis Supabase, umożliwiający proste stworzenie bazy danych i wykonywanie operacji na niej. Sam dostęp do bazy danych uzyskiwany jest w języku Javascript. Baza danych jest relacyjną bazą danych, a operacje wprost na niej wprowadzane są poprzez SQL.

Baza danych uzyskana została poprzez web scraping danych ze strony [https://gothic.fandom.com/pl](https://gothic.fandom.com/pl) za pomocą Pythona. Ze względu na wiele braków i nieścisłości na wiki baza wymagała wielu ręcznych poprawek.

# Wyzwania podczas tworzenia aplikacji

Pierwszym napotkanym problemem były nieścisłości oraz błędy w bazie danych, spowodowane brakami na stronie, z której dane są pobierane i zapisywane w bazie danych aplikacji. W wielu przypadkach pojedyncze postacie ten sam ubiór miały zapisywany na różne sposoby, na przykład "Zbroja najemnika" i "Zbroja najemników".
Ze względu na dużą ilość takich neiścisłości, udostępniona do odczytu została cała baza danych z możliwością dodawania komentarzy przez użytkowników. Dzięki temu, gdy użytkownik podczas korzystania z aplikacji zauważył jakiś błąd, mógł zostawić komentarz w bazie danych, co sprawiło, że baza danych z biegem czasu została poprawiana.

Kolejnym problemem była zmiana poprawnej postaci codziennie o północy. Rozwiązaniem było ustawienie cron jobów w bazie danych za pomocą SQLa. Sama kolejność postaci w bazie danych jest losowa, a ustawiony cron job codziennie o północy CET przesuwa id aktualnie poprawnej postaci o 1 w górę. Zapewnione jest także, że gdy następnego id nie będzie, kolejna postać i tak zostanie wylosowana.

Wynik w trybie klasycznym jest zapisywany w local storage przeglądarki użytkownika. Dzięki temu, przy codziennej zmianie poprawnej postaci, dane z local storage porównywane są z tymi, które znajdują się w bazie danych. Jeśli się nie pokrywają, local storage jest resetowane i nadawana jest nowa poprawna postać.

# Możliwe dalsze prace nad aplikacją

Baza danych w dalszym ciągu może zostać poprawiana.

Możliwym jest też utworzenie podsumowania wyników gracza - ile dni pod rząd grał, w ilu próbach średnio zgadywał postać.

Udostępnienie ogólnych statystyk gry - ile osób poprawnie zgadło dzisiaj postać, w ilu średnio próbach postacie zostały zgadywane. 

