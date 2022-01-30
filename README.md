# WordleSolver

A solver for the [wordle](https://www.powerlanguage.co.uk/wordle/) game.

## How to use

1. Clone this repo
1. Run `python3 solver.py`
1. Use the suggested guess presented
1. Provide the resulting tile colors in the verdict prompt, using `B` for black, `Y` for yellow, `G` for green, or `bad` if the suggested guess was not a valid wordle word
1. goto 3 until you win

## How it works

### word_scorer.py

`word_scorer.py` generates a "score" for each word in `five_letter_words.txt` that 
represents the average information gain that word provides as a guess. The
information gain is calculated by simulating using the word as a guess for every
possible secret word.

### solver.py

`solver.py` uses the information gained from each guess to build a list of
constraints that the secret word must conform to, and then selects the highest
scoring word which meets those constraints as the suggested guess.