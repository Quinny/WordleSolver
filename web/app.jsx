function zipString(a, b) {
  return a.split("").map((e, i) => {
    return [e, b[i]];
  });
}

class WordRow extends React.Component {
  constructor(props) {
    super(props);
  }

  verdictClass(verdict) {
    return {
      Y: "warning",
      G: "success",
      B: "secondary",
    }[verdict];
  }

  render() {
    const columns = zipString(this.props.guess, this.props.verdict).map(
      (letters, index) => {
        const [guessLetter, verdictLetter] = letters;
        return (
          <td
            class={"table-" + this.verdictClass(verdictLetter)}
            onClick={(e) => this.props.onClick(index)}
          >
            {guessLetter.toUpperCase()}
          </td>
        );
      }
    );
    return <tr>{columns}</tr>
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    document.onkeydown = this.handleKeyDown.bind(this);
  }

  getConstraints(guess, verdict) {
    return zipString(guess, verdict).map((letters, index) => {
      const [letter, v] = letters;
      if (v == "B") {
        return (word) => !word.includes(letter);
      }
      if (v == "Y") {
        return (word) => word[index] != letter && word.includes(letter);
      }
      if (v == "G") {
        return (word) => word[index] == letter;
      }
    });
  }

  bestGuess(constraints) {
    const matchesAll = (word) =>
      constraints.every((constraint) => constraint(word));
    return scoredWords.find(matchesAll);
  }

  getInitialState() {
    return {
      pastGuesses: [],
      pendingGuess: {
        guess: this.bestGuess([]),
        verdict: "BBBBB",
      },
      constraints: [],
      failed: false
    };
  }

  cycleVerdict(index) {
    const nextMap = {
      B: "Y",
      Y: "G",
      G: "B",
    };
    const verdict = this.state.pendingGuess.verdict;
    const next = nextMap[verdict[index]];
    const newVerdict = verdict.substr(0, index) + next + verdict.substr(index + 1);

    this.setState((prevState) => ({
      pendingGuess: {
        guess: prevState.pendingGuess.guess,
        verdict: newVerdict
      },
    }));
  }

  submit() {
    const newConstraints = this.state.constraints.concat(
      this.getConstraints(
        this.state.pendingGuess.guess,
        this.state.pendingGuess.verdict
      )
    );
    const newGuess = this.bestGuess(newConstraints);
    this.setState((prevState) => ({
      pastGuesses: prevState.pastGuesses.concat([this.state.pendingGuess]),
      constraints: newConstraints,
      pendingGuess: {
        guess: newGuess,
        verdict: "BBBBB",
      },
      failed: !newGuess
    }));
  }

  handleKeyDown(e) {
    // Enter
    if (e.keyCode == 13) {
      this.submit();
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <div align="center">
          <div class="alert alert-danger">
            No words matched the set of verdicts you input. This either means
            you entered invalid verdicts or Wordle changed their word list.
          </div>
          <button
            class="btn btn-primary"
            onClick={e => this.setState(this.getInitialState())}
          >
            Restart
          </button>
        </div>
      );
    }
    const allGuesses = this.state.pastGuesses.concat([this.state.pendingGuess]);
    const rows = allGuesses.map((guess, index) =>
      <WordRow
        guess={guess.guess}
        verdict={guess.verdict}
        onClick= {this.cycleVerdict.bind(this)}
      />
    );

    return (
      <div class="row">
        <div class="col-md-8 offset-md-2 col-xs-12">
          <table class="table">{rows}</table>
          <div align="center">
            <button onClick={this.submit.bind(this)} class="btn btn-success">
              Get Next Guess
            </button>
          </div>
          <div>
            <br />
            <ol>
              <li>Use the word which appears as your guess in Wordle</li>
              <li>Tap each letter to reflect the verdict returned</li>
              <ul>
                <li>
                  If Wordle flagged a letter as both yellow and black, key both
                  instances as yellow
                </li>
              </ul>
              <li>Press "Get Next Guess" and go back to step 1</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

// Fetch the feed from the API and render it.
$(document).ready(() => {
  ReactDOM.render(<App />, document.getElementById("solver"));
});

const scoredWords = ['stare', 'arose', 'raise', 'arise', 'slate', 'saner', 'snare', 'irate', 'crate', 'stale', 'trace', 'share', 'erase', 'crane', 'scare', 'later', 'store', 'saute', 'teary', 'alter', 'spare', 'tease', 'cater', 'trade', 'alert', 'alone', 'grate', 'shale', 'snore', 'lease', 'scale', 'react', 'blare', 'parse', 'least', 'glare', 'elate', 'stole', 'early', 'atone', 'learn', 'trice', 'leant', 'sauce', 'cease', 'shore', 'shire', 'eater', 'siren', 'aisle', 'paler', 'crone', 'flare', 'heart', 'alien', 'hater', 'shear', 'score', 'stone', 'taper', 'relay', 'safer', 'clear', 'terse', 'caste', 'brace', 'plate', 'steal', 'baler', 'canoe', 'suite', 'slice', 'adore', 'roast', 'layer', 'solar', 'grace', 'tamer', 'loser', 'renal', 'large', 'route', 'stage', 'stair', 'pearl', 'scree', 'rouse', 'prose', 'spore', 'spire', 'treat', 'aider', 'plane', 'saint', 'cause', 'rinse', 'sonar', 'trail', 'spear', 'great', 'lager', 'state', 'steer', 'dealt', 'slave', 'prone', 'noise', 'cleat', 'urine', 'lance', 'drone', 'trope', 'tread', 'spree', 'tripe', 'trial', 'sleet', 'slant', 'range', 'skate', 'liner', 'tried', 'crest', 'water', 'space', 'caper', 'paste', 'sober', 'stake', 'close', 'agree', 'drape', 'ready', 'smear', 'plier', 'horse', 'brine', 'taker', 'slide', 'earth', 'beast', 'three', 'tenor', 'grade', 'chase', 'afire', 'yeast', 'haste', 'table', 'shade', 'elite', 'crave', 'baste', 'shone', 'farce', 'place', 'shine', 'salve', 'stern', 'snarl', 'slope', 'trite', 'clone', 'sneer', 'truce', 'poise', 'lapse', 'train', 'stave', 'lathe', 'grape', 'swore', 'yearn', 'realm', 'tribe', 'borne', 'since', 'scone', 'shape', 'cadet', 'reuse', 'slime', 'pause', 'spite', 'price', 'false', 'wrote', 'stray', 'rainy', 'forte', 'write', 'sower', 'louse', 'reset', 'swear', 'snake', 'reach', 'meant', 'payer', 'shame', 'haute', 'ramen', 'panel', 'leapt', 'feast', 'agile', 'easel', 'pleat', 'weary', 'poser', 'outer', 'curse', 'leash', 'chore', 'matey', 'cruel', 'alike', 'peace', 'salty', 'risen', 'argue', 'drake', 'tense', 'slain', 'carve', 'erode', 'skier', 'flier', 'spade', 'those', 'cried', 'smote', 'smile', 'coast', 'anode', 'stead', 'parer', 'smite', 'inter', 'eaten', 'taste', 'suave', 'latte', 'feral', 'spine', 'aside', 'bleat', 'trove', 'mealy', 'cedar', 'sheer', 'frame', 'crime', 'barge', 'there', 'meaty', 'artsy', 'enact', 'craze', 'nurse', 'worse', 'repay', 'gayer', 'brake', 'phase', 'alive', 'steel', 'trait', 'surge', 'regal', 'crier', 'spiel', 'clean', 'sedan', 'racer', 'goner', 'eager', 'anger', 'start', 'waste', 'coral', 'cable', 'ratio', 'carol', 'loose', 'payee', 'after', 'style', 'sepia', 'eagle', 'dance', 'shake', 'satin', 'inert', 'valet', 'scary', 'tiger', 'super', 'snide', 'shalt', 'brute', 'puree', 'teach', 'laden', 'timer', 'sweat', 'surer', 'snort', 'stein', 'snail', 'anime', 'acute', 'smart', 'satyr', 'trash', 'salon', 'diner', 'cairn', 'petal', 'heard', 'utile', 'brave', 'terra', 'older', 'beard', 'stain', 'merit', 'their', 'prune', 'pride', 'blade', 'resin', 'serve', 'corer', 'aware', 'story', 'tower', 'snipe', 'grave', 'gamer', 'raven', 'purse', 'glade', 'shave', 'camel', 'peril', 'cream', 'cheat', 'triad', 'nosey', 'greet', 'delay', 'inane', 'leave', 'naive', 'siege', 'grant', 'spice', 'stoke', 'slept', 'scene', 'cagey', 'sheet', 'ovate', 'singe', 'beret', 'tarot', 'dairy', 'bride', 'miser', 'harem', 'force', 'filer', 'trend', 'steam', 'rouge', 'inlet', 'solve', 'creak', 'islet', 'leach', 'heist', 'eclat', 'pried', 'miner', 'nicer', 'cider', 'truer', 'eerie', 'scent', 'metal', 'hotel', 'avert', 'chose', 'spelt', 'facet', 'cutie', 'prime', 'penal', 'blame', 'steak', 'swine', 'voter', 'tilde', 'hairy', 'grail', 'angle', 'onset', 'scant', 'bread', 'arson', 'genre', 'bluer', 'tonal', 'short', 'lower', 'soapy', 'shirt', 'unite', 'deter', 'remit', 'crepe', 'wrest', 'cameo', 'polar', 'stove', 'serif', 'horde', 'gruel', 'death', 'noose', 'drier', 'delta', 'bathe', 'boast', 'toast', 'opera', 'diary', 'alley', 'rifle', 'motel', 'entry', 'rarer', 'maple', 'grope', 'enter', 'riser', 'lover', 'ester', 'rupee', 'gripe', 'agate', 'whale', 'these', 'finer', 'boule', 'shoal', 'crept', 'taken', 'fetal', 'creme', 'chart', 'house', 'crude', 'arena', 'baker', 'email', 'party', 'leaky', 'tapir', 'drain', 'relic', 'smelt', 'rivet', 'shied', 'wager', 'rogue', 'probe', 'tract', 'scaly', 'deity', 'abate', 'plait', 'grime', 'amuse', 'spent', 'talon', 'elide', 'leafy', 'crash', 'frail', 'sewer', 'copse', 'graze', 'other', 'ulcer', 'paint', 'scope', 'sense', 'flair', 'abase', 'guile', 'leery', 'maker', 'idler', 'flame', 'comet', 'meter', 'lithe', 'tardy', 'sever', 'savor', 'ripen', 'glean', 'stark', 'mouse', 'belie', 'wiser', 'agent', 'opine', 'filet', 'brain', 'spray', 'honey', 'poesy', 'paper', 'sneak', 'cower', 'guise', 'fairy', 'chair', 'molar', 'staid', 'boney', 'reply', 'elope', 'sadly', 'moral', 'angel', 'heron', 'dream', 'roach', 'loath', 'droit', 'preen', 'verse', 'debar', 'abuse', 'fried', 'grain', 'cover', 'surly', 'recap', 'taint', 'sport', 'royal', 'irony', 'niece', 'blast', 'ladle', 'title', 'reign', 'leper', 'erect', 'tuber', 'sieve', 'liver', 'plant', 'recut', 'strap', 'dense', 'money', 'metro', 'shard', 'saucy', 'daily', 'broke', 'bloat', 'bagel', 'refit', 'usage', 'seize', 'oaken', 'fiery', 'elder', 'creed', 'ankle', 'untie', 'lunar', 'sleep', 'groan', 'ocean', 'dirge', 'value', 'prove', 'homer', 'heady', 'piney', 'ideal', 'crony', 'twine', 'azure', 'drove', 'daisy', 'navel', 'beady', 'gloat', 'drive', 'cheer', 'fable', 'erupt', 'asset', 'actor', 'steed', 'abode', 'repel', 'towel', 'spied', 'ruler', 'abide', 'stand', 'foyer', 'break', 'mange', 'wooer', 'serum', 'manor', 'pulse', 'trawl', 'decal', 'abort', 'stony', 'print', 'piety', 'noble', 'credo', 'green', 'genie', 'olive', 'forge', 'carat', 'foray', 'goose', 'wafer', 'retry', 'flake', 'masse', 'dread', 'splat', 'rearm', 'sheen', 'phone', 'liege', 'baron', 'voice', 'decor', 'retch', 'radio', 'otter', 'moose', 'decay', 'truly', 'segue', 'prude', 'amber', 'giant', 'gaily', 'plead', 'court', 'craft', 'adobe', 'labor', 'ounce', 'dried', 'ashen', 'exalt', 'acorn', 'slang', 'faint', 'peach', 'unset', 'relax', 'algae', 'sugar', 'piece', 'sharp', 'roost', 'waist', 'plied', 'waver', 'grove', 'corny', 'chest', 'sinew', 'pedal', 'chafe', 'sandy', 'nerdy', 'creep', 'stall', 'heave', 'sleek', 'float', 'flute', 'shove', 'nadir', 'gazer', 'begat', 'halve', 'glide', 'coupe', 'altar', 'sweet', 'retro', 'shorn', 'hoard', 'shrew', 'ridge', 'covet', 'image', 'rebel', 'clove', 'tepee', 'rayon', 'nasty', 'board', 'mercy', 'steep', 'power', 'order', 'rebar', 'roger', 'crust', 'egret', 'ample', 'ultra', 'waive', 'warty', 'sally', 'poker', 'lapel', 'chute', 'beset', 'sloth', 'frost', 'beach', 'flora', 'broil', 'stalk', 'freak', 'brash', 'today', 'tenet', 'maize', 'fleet', 'randy', 'owner', 'brief', 'sorry', 'olden', 'berth', 'flyer', 'scorn', 'screw', 'rider', 'croak', 'decry', 'braid', 'biome', 'track', 'loamy', 'patsy', 'twice', 'heath', 'spoke', 'tiara', 'pecan', 'spike', 'semen', 'prize', 'blaze', 'betel', 'grief', 'tulle', 'plain', 'chant', 'token', 'rally', 'spilt', 'sooty', 'gooey', 'clerk', 'palsy', 'melee', 'raspy', 'ether', 'shark', 'apart', 'adorn', 'wheat', 'ratty', 'nerve', 'merge', 'medal', 'inner', 'rebut', 'mince', 'noisy', 'hoist', 'pesto', 'hover', 'fecal', 'broad', 'pence', 'overt', 'valor', 'skirt', 'creek', 'clash', 'piano', 'front', 'riper', 'patio', 'glaze', 'flirt', 'crank', 'straw', 'speak', 'verso', 'whole', 'point', 'gavel', 'wrist', 'while', 'ovine', 'wreak', 'setup', 'lever', 'gorge', 'chide', 'mower', 'guest', 'amble', 'white', 'troll', 'snout', 'label', 'under', 'wider', 'stilt', 'dopey', 'stank', 'bribe', 'solid', 'lodge', 'dicey', 'crawl', 'adept', 'purge', 'fresh', 'whose', 'tidal', 'scald', 'pasty', 'carry', 'fibre', 'breed', 'elude', 'cigar', 'savoy', 'lemur', 'model', 'hence', 'brand', 'aorta', 'moist', 'clued', 'rehab', 'mover', 'aloft', 'scour', 'briar', 'storm', 'smoke', 'infer', 'briny', 'aunty', 'daunt', 'where', 'posse', 'cargo', 'weird', 'slack', 'obese', 'curve', 'draft', 'revel', 'ranch', 'torus', 'pansy', 'greed', 'basil', 'seedy', 'adage', 'grand', 'abled', 'badge', 'sperm', 'globe', 'elect', 'buyer', 'purer', 'glory', 'edict', 'diver', 'covey', 'stork', 'melon', 'ensue', 'scrap', 'hasty', 'deuce', 'shady', 'bloke', 'awoke', 'apron', 'choir', 'fiber', 'worst', 'heavy', 'organ', 'usher', 'strip', 'haunt', 'rower', 'shiny', 'weave', 'inlay', 'stoic', 'swirl', 'chime', 'taunt', 'media', 'grasp', 'whine', 'thorn', 'marsh', 'linen', 'above', 'threw', 'mural', 'lunge', 'spurt', 'revue', 'wrath', 'uncle', 'groin', 'trout', 'extra', 'mayor', 'viral', 'spoil', 'foist', 'dirty', 'stint', 'baton', 'slash', 'reedy', 'novel', 'mauve', 'exact', 'horny', 'haven', 'ascot', 'utter', 'rover', 'spark', 'scarf', 'tally', 'sonic', 'gleam', 'bleak', 'fault', 'depot', 'bilge', 'tramp', 'testy', 'perch', 'quiet', 'gaunt', 'clasp', 'first', 'shell', 'scalp', 'total', 'froze', 'rodeo', 'quote', 'manly', 'agape', 'octet', 'graft', 'wince', 'grout', 'quite', 'slimy', 'dunce', 'evade', 'guide', 'cleft', 'upset', 'along', 'freed', 'alarm', 'torch', 'felon', 'amity', 'shaft', 'hazel', 'giver', 'allot', 'scram', 'gauge', 'cobra', 'theme', 'shout', 'shall', 'salvo', 'south', 'forty', 'tacit', 'hardy', 'seven', 'lousy', 'curly', 'cache', 'piper', 'lemon', 'friar', 'etude', 'split', 'cheap', 'tangy', 'snaky', 'fence', 'trust', 'newer', 'diode', 'count', 'cress', 'clout', 'atoll', 'scion', 'rusty', 'chain', 'decoy', 'viper', 'align', 'orbit', 'inept', 'apple', 'rival', 'berry', 'ovary', 'boxer', 'posit', 'north', 'audit', 'sheep', 'chard', 'sheik', 'renew', 'thief', 'stack', 'began', 'theta', 'octal', 'glove', 'claim', 'prank', 'girly', 'crisp', 'crass', 'liken', 'lefty', 'rapid', 'never', 'dryer', 'derby', 'ruder', 'coven', 'ardor', 'scout', 'drank', 'exile', 'slurp', 'plaid', 'freer', 'latch', 'spend', 'chaos', 'ombre', 'aloud', 'macro', 'hinge', 'rhino', 'golem', 'ebony', 'voila', 'movie', 'amend', 'harpy', 'basin', 'maybe', 'binge', 'cyber', 'speed', 'dowel', 'acrid', 'merry', 'ralph', 'glint', 'parry', 'debit', 'niche', 'hyena', 'aptly', 'tango', 'curio', 'perky', 'drawl', 'angry', 'legal', 'choke', 'pilot', 'knelt', 'rural', 'quart', 'error', 'blurt', 'tasty', 'sling', 'rerun', 'brunt', 'spiny', 'intro', 'salad', 'lorry', 'gnome', 'verge', 'tepid', 'strut', 'stash', 'river', 'sworn', 'tithe', 'essay', 'tonga', 'plume', 'geese', 'yield', 'crazy', 'still', 'mason', 'exist', 'ledge', 'cloak', 'penne', 'minor', 'fruit', 'slink', 'grunt', 'faith', 'lumen', 'burst', 'agony', 'adult', 'vague', 'bowel', 'harry', 'china', 'gauze', 'broth', 'spell', 'clang', 'shelf', 'circa', 'brawl', 'belle', 'shunt', 'unmet', 'defer', 'sound', 'hovel', 'cello', 'rabid', 'swept', 'sooth', 'shank', 'hotly', 'ferry', 'candy', 'swarm', 'spout', 'armor', 'angst', 'tawny', 'swath', 'shaky', 'often', 'twirl', 'clank', 'vault', 'rhyme', 'rebus', 'flint', 'final', 'prior', 'snack', 'natal', 'guard', 'stool', 'knave', 'antic', 'trick', 'deign', 'shawl', 'alloy', 'marry', 'beget', 'torso', 'blend', 'viola', 'tonic', 'bugle', 'valve', 'totem', 'round', 'march', 'cloth', 'burnt', 'cramp', 'flesh', 'bleed', 'third', 'recur', 'catty', 'arbor', 'harsh', 'stout', 'lasso', 'demur', 'built', 'evict', 'bland', 'shirk', 'being', 'sauna', 'field', 'caput', 'canal', 'ethos', 'hyper', 'flash', 'sting', 'charm', 'smell', 'silly', 'press', 'fella', 'stamp', 'fetid', 'gravy', 'habit', 'frank', 'moult', 'about', 'color', 'prawn', 'dress', 'canny', 'robin', 'guilt', 'gland', 'drawn', 'bulge', 'tryst', 'query', 'queer', 'flour', 'small', 'newly', 'bible', 'vital', 'befit', 'elfin', 'neigh', 'apnea', 'fraud', 'chief', 'badly', 'stink', 'froth', 'scold', 'bravo', 'spicy', 'awake', 'odder', 'juice', 'spurn', 'dwelt', 'vaunt', 'delve', 'crush', 'modal', 'lanky', 'focal', 'tweak', 'panic', 'burly', 'audio', 'await', 'adopt', 'tumor', 'titan', 'nasal', 'lurid', 'eight', 'urban', 'cabin', 'vicar', 'cavil', 'lusty', 'fixer', 'array', 'ahead', 'venue', 'vapor', 'droll', 'slick', 'flume', 'equal', 'drift', 'tubal', 'brawn', 'foamy', 'drill', 'wield', 'petty', 'spank', 'madly', 'knead', 'grind', 'butte', 'pouty', 'graph', 'quake', 'mourn', 'brass', 'coach', 'shoot', 'fiend', 'bleep', 'bused', 'women', 'welsh', 'bacon', 'tipsy', 'shack', 'refer', 'quest', 'joker', 'basic', 'prism', 'penny', 'libel', 'tenth', 'squat', 'omega', 'thyme', 'silky', 'mount', 'iliac', 'fewer', 'canon', 'unity', 'fancy', 'widen', 'stunt', 'grass', 'gouge', 'demon', 'zebra', 'zesty', 'joist', 'forth', 'belly', 'sword', 'slosh', 'kneel', 'gonad', 'duvet', 'belch', 'swell', 'local', 'suing', 'denim', 'birth', 'unlit', 'gayly', 'fetus', 'boost', 'feign', 'vegan', 'aroma', 'fever', 'favor', 'croup', 'leech', 'drool', 'caulk', 'abbey', 'thank', 'primo', 'tempo', 'plank', 'impel', 'class', 'patch', 'oxide', 'crack', 'waxen', 'visor', 'grill', 'video', 'manic', 'begin', 'trunk', 'elegy', 'girth', 'femur', 'devil', 'frond', 'shift', 'prong', 'coyly', 'donut', 'amaze', 'grimy', 'mirth', 'sweep', 'hello', 'gnash', 'abhor', 'dally', 'tacky', 'patty', 'study', 'handy', 'epoch', 'dryly', 'bicep', 'tutor', 'flout', 'extol', 'crown', 'hefty', 'pixel', 'joint', 'ghost', 'pinto', 'flail', 'chord', 'blunt', 'debut', 'brisk', 'stock', 'needy', 'balmy', 'enema', 'porch', 'wheel', 'smith', 'ember', 'stick', 'loyal', 'annoy', 'zonal', 'midge', 'cross', 'eying', 'worth', 'blank', 'roomy', 'fluke', 'tweet', 'envoy', 'batch', 'drink', 'bench', 'ethic', 'exert', 'vowel', 'troop', 'login', 'speck', 'sigma', 'snowy', 'sumac', 'sprig', 'smirk', 'fetch', 'proud', 'emcee', 'jaunt', 'dozen', 'prowl', 'ivory', 'nudge', 'exult', 'vogue', 'minty', 'bring', 'wreck', 'arrow', 'verve', 'slung', 'world', 'sight', 'risky', 'issue', 'basal', 'afoul', 'vocal', 'admit', 'batty', 'pesky', 'quail', 'frill', 'vista', 'could', 'every', 'given', 'banal', 'until', 'match', 'chasm', 'below', 'wrack', 'sassy', 'hedge', 'flask', 'crypt', 'cycle', 'chalk', 'borax', 'touch', 'fatal', 'sully', 'lofty', 'depth', 'again', 'whirl', 'spawn', 'brink', 'slunk', 'major', 'axion', 'woken', 'lurch', 'tweed', 'mecca', 'knife', 'anvil', 'sappy', 'shyly', 'booty', 'psalm', 'teddy', 'right', 'motor', 'avail', 'askew', 'woven', 'turbo', 'privy', 'cling', 'clamp', 'micro', 'salsa', 'sunny', 'ozone', 'chirp', 'brush', 'donor', 'bison', 'gaudy', 'catch', 'sixty', 'yacht', 'gourd', 'laugh', 'spill', 'mangy', 'frisk', 'swami', 'lyric', 'churn', 'bevel', 'udder', 'growl', 'floor', 'valid', 'nomad', 'truck', 'cacti', 'topic', 'scamp', 'gassy', 'flank', 'empty', 'clink', 'nobly', 'edify', 'welch', 'sloop', 'razor', 'smack', 'wordy', 'radii', 'gamut', 'flaky', 'dodge', 'aping', 'phony', 'agora', 'upper', 'robot', 'honor', 'cloud', 'cheek', 'booze', 'rocky', 'notch', 'stood', 'tunic', 'medic', 'crimp', 'truss', 'polka', 'tulip', 'fatty', 'blond', 'sulky', 'award', 'showy', 'avoid', 'stung', 'dowry', 'throb', 'blind', 'prick', 'black', 'rotor', 'doing', 'radar', 'curry', 'adapt', 'offer', 'gaffe', 'mango', 'stomp', 'spool', 'scowl', 'evoke', 'rough', 'ingot', 'incur', 'bless', 'rigor', 'dusty', 'midst', 'detox', 'birch', 'synod', 'godly', 'fanny', 'afoot', 'smash', 'drown', 'krill', 'event', 'teeth', 'stunk', 'lilac', 'quota', 'dross', 'annex', 'shrug', 'watch', 'pique', 'locus', 'budge', 'jerky', 'wench', 'weigh', 'lingo', 'enjoy', 'bigot', 'amply', 'child', 'pasta', 'group', 'among', 'loopy', 'crowd', 'koala', 'brick', 'wrong', 'truth', 'month', 'glass', 'wring', 'enemy', 'wryly', 'syrup', 'bayou', 'imbue', 'brown', 'disco', 'scuba', 'quasi', 'theft', 'cabal', 'worry', 'helix', 'throw', 'scrum', 'datum', 'aloof', 'stoop', 'slyly', 'idiot', 'twang', 'tatty', 'taboo', 'gusty', 'wagon', 'spiky', 'wedge', 'clack', 'woman', 'fleck', 'shock', 'logic', 'drama', 'colon', 'usual', 'quilt', 'moron', 'moldy', 'leggy', 'grown', 'rowdy', 'musty', 'attic', 'wooly', 'proxy', 'joust', 'thong', 'queen', 'eking', 'thing', 'venom', 'shrub', 'gross', 'begun', 'shown', 'flack', 'youth', 'slush', 'hatch', 'elbow', 'larva', 'dolly', 'annul', 'dandy', 'clown', 'beech', 'allay', 'trump', 'icily', 'bezel', 'swash', 'humor', 'pithy', 'mouth', 'toxin', 'level', 'hymen', 'kneed', 'twist', 'think', 'swift', 'crock', 'swill', 'spasm', 'build', 'gusto', 'crick', 'chess', 'spoon', 'scrub', 'botch', 'fudge', 'tibia', 'tough', 'mania', 'admin', 'topaz', 'crook', 'pound', 'holly', 'dimly', 'light', 'frock', 'filth', 'smoky', 'augur', 'bonus', 'epoxy', 'morph', 'modem', 'skill', 'savvy', 'magic', 'guild', 'plush', 'druid', 'doubt', 'stuck', 'curvy', 'frown', 'vigor', 'pivot', 'macho', 'basis', 'awash', 'drunk', 'weedy', 'brood', 'blink', 'staff', 'golly', 'whelp', 'ennui', 'tying', 'hound', 'chill', 'snoop', 'mocha', 'wharf', 'soggy', 'gipsy', 'furor', 'virus', 'bound', 'pitch', 'caddy', 'vomit', 'nanny', 'whiny', 'endow', 'ditch', 'booth', 'jelly', 'slump', 'unfed', 'bossy', 'undue', 'thrum', 'quash', 'hurry', 'blush', 'beefy', 'quark', 'jetty', 'dilly', 'unwed', 'swing', 'rumba', 'excel', 'swamp', 'sixth', 'geeky', 'gecko', 'fritz', 'droop', 'human', 'squad', 'ditty', 'mound', 'ghoul', 'rumor', 'rabbi', 'clung', 'pixie', 'axial', 'tabby', 'limit', 'amiss', 'lunch', 'mossy', 'optic', 'index', 'input', 'pouch', 'guess', 'fling', 'conic', 'hilly', 'avian', 'lucid', 'dingy', 'allow', 'folly', 'abbot', 'forum', 'motif', 'naval', 'billy', 'thick', 'apply', 'downy', 'lying', 'bitty', 'axiom', 'snuck', 'junta', 'dwarf', 'champ', 'smock', 'ditto', 'would', 'sissy', 'alibi', 'vixen', 'pinch', 'havoc', 'toddy', 'crump', 'dogma', 'aphid', 'aglow', 'found', 'minus', 'cumin', 'eject', 'parka', 'night', 'pupal', 'dingo', 'ionic', 'union', 'flush', 'block', 'swoon', 'conch', 'stump', 'pagan', 'taffy', 'itchy', 'cough', 'villa', 'furry', 'umbra', 'dwell', 'using', 'tooth', 'fluid', 'expel', 'blown', 'going', 'vapid', 'broom', 'banjo', 'album', 'toxic', 'nutty', 'filmy', 'aging', 'goody', 'waltz', 'cacao', 'bawdy', 'scoop', 'bliss', 'jewel', 'quell', 'moody', 'femme', 'murky', 'bingo', 'unfit', 'fauna', 'missy', 'fishy', 'groom', 'brook', 'wrung', 'paddy', 'rajah', 'filly', 'comma', 'wound', 'young', 'gloss', 'pooch', 'mogul', 'pinky', 'unify', 'qualm', 'spunk', 'hydro', 'couch', 'milky', 'climb', 'ought', 'blitz', 'folio', 'shuck', 'proof', 'ninth', 'clock', 'shook', 'queue', 'click', 'windy', 'wacky', 'check', 'music', 'lowly', 'assay', 'rugby', 'flock', 'witch', 'flick', 'dutch', 'pushy', 'cinch', 'cabby', 'crumb', 'imply', 'flown', 'willy', 'plunk', 'cocoa', 'kiosk', 'dully', 'wispy', 'swish', 'putty', 'fugue', 'finch', 'floss', 'witty', 'embed', 'blood', 'papal', 'focus', 'judge', 'equip', 'juicy', 'lynch', 'debug', 'visit', 'tight', 'comfy', 'butch', 'skull', 'karma', 'blimp', 'rigid', 'bushy', 'limbo', 'bully', 'woody', 'ruddy', 'happy', 'llama', 'baggy', 'vinyl', 'hitch', 'kebab', 'dough', 'might', 'stiff', 'kitty', 'juror', 'digit', 'punch', 'owing', 'gully', 'quoth', 'knoll', 'gulch', 'chili', 'mushy', 'amass', 'winch', 'blurb', 'whack', 'bunny', 'mulch', 'spook', 'occur', 'bylaw', 'lucky', 'photo', 'hussy', 'swung', 'junto', 'lumpy', 'opium', 'quirk', 'condo', 'bough', 'aback', 'dying', 'thigh', 'knack', 'goofy', 'flood', 'width', 'bunch', 'ficus', 'flung', 'gawky', 'fight', 'clump', 'vouch', 'sushi', 'alpha', 'bulky', 'picky', 'jolly', 'skimp', 'pluck', 'nylon', 'offal', 'fully', 'ninny', 'awful', 'flunk', 'dusky', 'pupil', 'skulk', 'forgo', 'munch', 'manga', 'usurp', 'oddly', 'comic', 'bloom', 'lobby', 'swoop', 'spoof', 'onion', 'fifty', 'howdy', 'chunk', 'sniff', 'timid', 'funny', 'mafia', 'husky', 'quack', 'gloom', 'wight', 'civil', 'vodka', 'hunky', 'whisk', 'duchy', 'fussy', 'lipid', 'icing', 'musky', 'pulpy', 'plaza', 'skunk', 'gypsy', 'daddy', 'quill', 'mambo', 'fjord', 'idiom', 'outdo', 'shush', 'polyp', 'hutch', 'cluck', 'dodgy', 'igloo', 'humid', 'pubic', 'boozy', 'booby', 'khaki', 'pudgy', 'bosom', 'thump', 'squib', 'ninja', 'uncut', 'chock', 'funky', 'chick', 'cliff', 'myrrh', 'fungi', 'macaw', 'outgo', 'scoff', 'chaff', 'ovoid', 'idyll', 'abyss', 'cynic', 'wimpy', 'mammy', 'biddy', 'dumpy', 'hunch', 'kinky', 'stuff', 'bongo', 'guava', 'piggy', 'giddy', 'undid', 'motto', 'glyph', 'vying', 'thumb', 'knock', 'plumb', 'lupus', 'foggy', 'livid', 'hippy', 'which', 'mucky', 'dowdy', 'fifth', 'woozy', 'maxim', 'chump', 'hobby', 'twixt', 'snuff', 'hippo', 'vigil', 'madam', 'quick', 'cubic', 'inbox', 'kayak', 'buddy', 'plump', 'lymph', 'gruff', 'poppy', 'gumbo', 'muddy', 'chuck', 'whoop', 'skiff', 'widow', 'dummy', 'pizza', 'pygmy', 'buggy', 'unzip', 'mucus', 'minim', 'guppy', 'gummy', 'bobby', 'gamma', 'nymph', 'magma', 'buxom', 'known', 'humus', 'jumpy', 'puffy', 'bluff', 'dizzy', 'mimic', 'affix', 'puppy', 'jazzy', 'humph', 'kappa', 'civic', 'mummy', 'jumbo', 'fizzy', 'mamma', 'whiff', 'jiffy', 'vivid', 'fluff', 'fuzzy'];
