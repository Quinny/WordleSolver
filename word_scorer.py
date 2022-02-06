from collections import Counter
from multiprocessing import Pool

words = eval(open("five_letter_words.txt").read())

def wordle_score(a, b):
    score = 0
    b_hist = Counter(b)

    for i in range(len(a)):
        if a[i] == b[i]:
            b_hist[a[i]] -= 1
            score += 2
        elif b_hist[a[i]] > 0:
            b_hist[a[i]] -= 1
            score += 1

    return score

def average(iterable):
    n = 0
    s = 0
    for e in iterable:
        s += e
        n += 1
    return s / n

def average_score(candidate):
    return (average(wordle_score(candidate, word) for word in words), candidate)

if __name__ == "__main__":
    with Pool() as p:
        scored_words = p.map(average_score, words)
        print([word for _, word in sorted(scored_words, reverse=True)])
