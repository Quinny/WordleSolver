from multiprocessing import Pool
from pprint import pprint
from collections import Counter
import math

scored_words = eval(open("./scored_words.txt").read())

def best_guess(constraints):
    best_word = None
    viable_candidates = 0
    for word in scored_words:
        passes = all(constraint(word) for constraint in constraints)
        if not passes:
            continue
        best_word = best_word or word
        viable_candidates += 1

    return best_word, viable_candidates

def not_contains(letter):
    def apply(word):
        return letter not in word
    return apply

def not_at(letter, index):
    def apply(word):
        return word[index] != letter
    return apply

def at(letter, index):
    def apply(word):
        return word[index] == letter
    return apply

def contains(letter):
    def apply(word):
        return letter in word
    return apply

def not_word(bad_word):
    def apply(word):
        return word != bad_word
    return apply

def get_constraints(guess, verdict):
    if verdict == "bad":
        return [not_word(guess)]

    constraints = []
    for index, (letter, v) in enumerate(zip(guess, verdict)):
        if v == 'B':
            constraints.append(not_contains(letter))
        if v == 'Y':
            constraints.append(not_at(letter, index))
            constraints.append(contains(letter))
        if v == 'G':
            constraints.append(at(letter, index))
    return constraints

def get_verdict(guess, secret):
    def verdict_char(gs):
        g, s = gs
        if g == s:
            return "G"
        elif g in secret:
            return "Y"
        else:
            return "B"
    return ''.join(map(verdict_char, zip(guess, secret)))

def solve(secret):
    constraints = []
    verdict = "BBBBB"
    guesses = 0
    while verdict != "GGGGG":
        guess, viable_candidates = best_guess(constraints)
        if secret is None:
            print("Viable candidates:", viable_candidates)
            print("Suggested guess:", guess)
            verdict = input("Verdict: ")
        else:
            verdict = get_verdict(guess, secret)
        constraints += get_constraints(guess, verdict)
        guesses += 1
    return guesses

def benchmark():
    with Pool() as p:
        n = len(scored_words)
        solved = sorted(p.map(solve, scored_words))
        avg = sum(solved) / n
        histogram = Counter(solved)

        return {
            "n": n,
            "average": avg,
            "p50": solved[int(n * 0.5)],
            "p95": solved[int(n * 0.95)],
            "p99": solved[int(n * 0.99)],
            "max": max(solved),
            "min": min(solved),
            "stddev": math.sqrt(sum((xi - avg) ** 2 for xi in solved) / n),
            "histogram": histogram.items()
        }

def main():
    solve(secret = None)

if __name__ == "__main__":
    main()
    #pprint(benchmark())
