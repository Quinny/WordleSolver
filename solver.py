scored_words = [word for score, word in eval(open("./scored_words.txt").read())]

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

def main():
    constraints = []
    while True:
        last_guess, viable_candidates = best_guess(constraints)
        print("Viable candidates:", viable_candidates)
        print("Suggested guess:", last_guess)
        verdict = input("Verdict: ")
        constraints += get_constraints(last_guess, verdict)

if __name__ == "__main__":
    main()
