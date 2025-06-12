**📜 DevVoted - The knowlegde ladder to mastery -- Casino of Mastery! — gained knowledge always pays off**

---

## **💡 What DevVoted Embodies**

**DevVoted** is more than just a game — it represents:

-   **A Commitment to Mastery** → Players must dedicate themselves to learning, improving, and taking calculated risks.
-   **The Balance of Confidence & Knowledge** → Betting on answers forces players to assess their true understanding.
-   **The Ultimate Test of Devotion** → The DevVoted Challenge is not just a high-stakes moment but a defining milestone proving dedication to growth.
-   **A Celebration of Risk & Reward** → Knowledge is power, but only those who commit and take strategic risks can truly excel.
-   **An Identity Beyond Just Trivia** → "DevVoted" reflects both **developers** and **devotion**, blending skill-building with the thrill of staking XP on what you truly believe.

### **DevVoted feels personal**

🔥 **This is the most important insight.**

-   **DevVoted = Betting on knowledge = Betting on yourself.**
-   **It’s about growth, trust, and proving what you know.**
-   **That’s deeply personal, expresses who I am, and it will resonate/inspire others.**
-   **Betting on yourself, dare to take risks, learn something, mastery through experience and personal journey**

This isn’t just a quiz game. **It’s a philosophy about self-confidence, self-improvement, adaptability and tech!**

---

## **🔧 Core Gameplay Mechanics**

-   **Configs (or “Decks”)** → Slight strategic tweaks, unlocked over time, are chosen on each run.
-   **Runs = Streaks** → Runs are defined by **correct answer streaks**, independent of seasons.
-   **XP is pure** → Only mastery-based, only slightly increased by multipliers/configs but mainly on **knowlegde betting. Run XP is better with**
-   **Knowledge score is pure** — The long-term mastery metric
-   **Betting your run XP** → "How well do you know your stuff?" mechanic, with the option to pass.
-   **Streak mults** → Every correctly answered poll grants **streak mult** per category
-   **DevVoted Challenge (”final boss” polls)** → The ultimate knowledge test where players must risk XP for mastery.
-   **Seasons** → Introduce new configs, themes, and long-term progression elements.
-   **Single/multiple choice** — polls are either one of them, but which one is not shown by default as design choice
-   **Community-Driven Poll Selection** → Players vote for the next day’s category after submitting their poll.
-   **Speed bonus →** Each poll has a bonus when answering faster
-   **Stages — Preventing people from going ahead too much:** After beating a final boss, non-final boss polls will become harder aswell

### **🛠 What does a player have in the long-term?**

-   **Unlocked Configs** → More unique play styles for future runs
-   **Best score in Run XP** → Display record of Run XP
-   **~~Best permanent XP Ever** → Highest XP achieved in a single run (locked-in)~~
-   **Knowledge score —** A score that is based on a formula, measuring the ultimate skill in various categories
-   **Best Streak** → Longest correct answer streak recorded (locked-in)
-   **Earned Titles** → Awarded based on seasonal performance or exceptional skill
-   **Cosmetics** → Like certain styles for dev cards
-   **Display total correct polls** →
    -   In each category
    -   Overall
-   **Display total polls answered (participation)** →
    -   In each category
    -   Overall
-   **Overcome DevVoted Challenges** → Number of DevVoted Challenges successfully completed
-   **Show amount of runs used** → Display amount of runs used
-   **Custom poll creation** → Allow ‘trusted’ users to create polls. Incentivise them for it because it’s a hard process

### 📐 Metrics

-   DevVoted Score (knowlegde score) → Consider naming this “Confidence Score”
-   Accuracy (total / correct) as %
-   Betting XP
-   Streak multiplier
-   Current streak
-   Average bet
-   **Average Time per Correct Poll**
-   **Most Frequent Bet Percentage**
-   **Category Strength/Weakness Analysis**

### ⚙️ Configs (mechanic)

Configs are “decks” in roguelikes that can be used to influence your current run. Configs can be unlocked the more you play. You can unlock “titles” if you at least won a final boss with one of the configs.

-   Can be unlocked the more you play
-   Allows to unlock titles, for instance if you won a run with a config (like Balatro)
    -   **Unlock Requirements**: Clear criteria to unlock or level configs (e.g., "Win 5 DevVoted Challenges with 'Async/Await'").
-   Configs are chosen at the start of each run
-   Configs can be leveled up, and will level up faster when your betting habit is higher, improving the config:
    -   (e.g., "Tree Shake Lv. 3 hides 3 answers, reduces XP by only 5%").

**Types of configs**

-   **Vanilla config** — no upsides, no downsides — _if you don’t want fuss_
-   **Tree shake config** — hides 2 answers but reduces 10% of XP gain
-   **Vite config** — allows more time for the speedbonus (5s > 8s) but must at least bet 25%
-   **LTS config** — \***\*allows **one** streak shield per run, but XP betting is **reduced by 25%\** after it’s use — *good for safe players\*
-   **No name yet** — must always go all-in (100%), but get **double** streak increase _Perfect for confident players!_
-   **Hot module replacement** — can **reroll** a DevVoted poll challenge
-   **The Lens (possibly look for a more tech term?)** — See voted answers upfront from other people before submitting, but betting is halved
-   **No name yet** — Start with a double amount of XP than usual (50 is default per category)
-   **Async/Await** — Skip one poll per run without losing streak but reduces XP gain slightly.
-   **Code split —** Splits bets into two smaller bets, safer but slightly reduces multiplier.
-   **ESLint —**
-   **Strict mode —**

### 🎤 Stages

Stages are a mechanic to make it run out of your opponents who are behind. It’s a bit like Mario Kart: The first player gets weak items, the last stronger to climb up in place. This stage resets when the run is reset, or when you answer wrong in a given category, only for the given category.

Stage effects are applied on every poll.

**Stages effect may impact**

-   Hiding if the poll is multiple choice or single choice
-   Showing fake scores from opponents

### 🏃 When a run ends

-   ~~When the player decides to **lock in**~~
-   When the player's XP bar is empty
-   After 10 devvoted (or stages) challenges you won the run (but is **not** **reset** perse)

### **➕ XP System, Knowledge score & formula**

-   **Run XP** → \*\*\*\*XP is gained per run and influenced by your betting strategy
-   **XP Decay** → Players that are inactive will decay scores. **Mult** will decrease by **0.1** and **current streak** will be reset. Automatically, because **polls answered** will not increase, decay also happens on knowledge metric
-   **Soft cap mega streaks** → to prevent snowballing effects in crazy streaks
-   Players bet from their **run category XP**
    -   Player has 1,000 XP in React
    -   They bet 200 XP on a React poll
    -   If correct — XP formula calculates and adds to current run XP in the current category
    -   If wrong — 1,000 is removed from category XP. Current streak is reset, mult is reset

### 🤔 Knowlegde score

-   Applies **scale based on risk-taking**, **accuracy**, and **consistency as core**
-   F.i players who use lower bets (or passing) will gain much slower than risk takers
-   Players who bet aggressively **should see a bigger score boost**
-   Accuracy is the amount of polls / correct polls. This metric is also shown for players

### **Formula Knowlegde Metric**

`Knowledge Score = Accuracy × Streak Multiplier × Betting Multiplier`

| Factor                 | Explanation and Example                                                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Accuracy**           | `(correct - incorrect) ÷ total_polls`E.g. `(90 - 10) ÷ 100 = 0.8` (80%)                                                                                  |
| **Streak Multiplier**  | A fixed numeric multiplier reflecting your best streak in the runE.g. 10                                                                                 |
| **Betting Multiplier** | Reflects your risk-taking average in bets: • Conservative (average bet ~10–25%): ×1.2 • Moderate Risk (~25–50%): ×1.5 • Aggressive Risk (~75–100%): ×2.0 |

-   AccuracyFactor: `(correct / total)` — 90 correct / 100 total → 0.9 (great accuracy)
-   scalingFactor = 1000 (a simple number)

(100 - 18) _ (82 _ 100) _ 4,7 _ (2456 / 1000)

## 🎲 **Example (Balanced Scenario):**

| Name             | Accuracy (correct-incorrect/total) | Streak Mult | Betting Mult | Knowledge Score |
| ---------------- | ---------------------------------- | ----------- | ------------ | --------------- |
| Conservative     | 0.85 (85%)                         | 8           | 1.2          | **8.16**        |
| Moderate Risk    | 0.7 (70%)                          | 10          | 1.5          | **10.20**       |
| Risky/Aggressive | 0.60 (60%)                         | 15          | 2.0          | **18.00**       |

**XP is calculated based on three main factors:**

```
XP Earned = Base XP + Streak Bonus + Betting Reward
```

### **XP Breakdown per poll**

| **Factor**         | **Description**                                                          | **Influence** |
| ------------------ | ------------------------------------------------------------------------ | ------------- |
| **Base XP**        | Small XP for answering (even if passing) + extra mult if multiple choice | **Lowest**    |
| **Streak Bonus**   | Increases XP as streak gets longer.                                      | **Medium**    |
| **Betting Reward** | Multiplies XP based on how much the player bets.                         | **Highest**   |

### **🃏 Betting & XP at risk**

-   **Run XP** → Players bet with run XP **only within a run in the given category**, ~~not from their **permanent** XP~~
-   **If correct** → The bet is used to add to the run XP
-   **If incorrect** → You lose the XP, streak/mult and the bet XP of that category is lost
-   **XP gauge per run —** When reaching zero \***\*entire **streak for all categories\*\* is reset
-   **Passing a poll** → grants little XP out of participation which is encouraged (learning bonus)
-   **Start** — Players start with **50 XP** each run
-   **Bet choices —** Fixed Percentages (Pre-set chips). The higher the bet the higher XP is granted. XP calc will not be shown to make selection quicker and less of a mental burden. Based on betting options, the `mult` you gain varies if the answer is correct.
    -   **Pass (1%)** → `+0` `mult`
    -   **10% bet** → `+0.1` `mult`
    -   **25% bet** → `+0.25` `mult`
    -   **50% bet** → `+0.5` `mult`
    -   **75% bet** → `+0.75` `mult`
    -   **All-in (100%)** → `+1.0` `mult`

| **Action**           | **XP Gain?**                  | **Affects Streak Multiplier?** | **Affects Knowledge Score?** |
| -------------------- | ----------------------------- | ------------------------------ | ---------------------------- |
| **Correct Answer**   | ✅ Yes (based on bet)         | ✅ Yes (streak increases)      | ✅ Yes                       |
| **Incorrect Answer** | ✅ Small XP for participation | ❌ No                          | ✅ Yes (penalty)             |
| **Pass (1%)**        | ✅ Tiny XP (1%)               | ❌ No                          | ❌ No                        |

### Single/Multiple Choice

**Single choice**

-   Incorrect: You lose XP, streak/mult and the bet XP of that category is lost
-   Correct: You gain the bet XP and the streak/mult is increased the regular way.

**Multiple choice**

-   All incorrect: The regular approach. You lose XP, streak/mult and the bet XP of that category is lost
-   Partial correct: You gain the bet XP based on the number of correct answers. Streak/mult stays the same.
-   Full correct: You gain the bet XP and the streak/mult is increased the regular way, plus you get 0.1 `mult` for each correct answer.

---

### 🃏“Dev” cards

**Dev cards** are ways to show-off to other players what you achieved. They customizable for each player based on their earnings.

-   **Silver Frame** → Reached 5,000 run XP.
-   **Gold Frame** → Reached 10,000 XP or a knowledge score of ???
-   **"Master of CSS" Title** → Answered 100 CSS polls correctly.
-   **"The Phantom" Frame** → Completed a full run without locking in.
-   **Season-Exclusive Titles** → Some titles are only available for a limited time, rewarding active seasonal participation.

**Dev cards** ensure players have a unique identity on the leaderboard while keeping competition and personalization engaging.

### **🔥 DevVoted Challenge (Ultimate Knowledge Test)**

-   **Thematic representation of mastery and dedication (final boss)**
-   **Cannot be skipped (must always bet something).**
-   **Forces players to risk XP in the ultimate test of knowledge.**
-   **DevVoted challenges appear more the better you get:** if your knowledge score is high, it may for instance appear every 5 polls, but for newbies it will appear way less
-   Allows players to lock-in afterwards or to pursue their streak
-   The streak finishes after **10 DevVoted challenges**
-   **Rewards** are a little XP gain after 5 challenges if the same run is pursued
-   **Appears as a critical milestone in runs**
-   **Special Effects Applied:**
    -   **The Enigma** → Your config is disabled.
    -   **⚔️ The Rubicon** — Forced to go all-in. Mandatory 100% XP bet.
    -   **Reversed Deck Effect** → Your config applies in reverse.
    -   **Blind Bet** → Must bet XP before seeing the question.
    -   🌀 **Echo Chamber** → Wrong answer looks more visually convincing.
    -   **Confidence Check**  → Players must **confirm their answer** before locking it in.
    -   ⏳ **A Presto —** Drastically shortened timer (speed challenge)
    -   **No locking in allowed**
    -   **Egmont**
    -   **Jello, the colors of my soul**
    -   **Abide with me**
    -   **From Ancient Times**

###

### 🦄 Cosmetic titles

Cosmetic titles are earned by certain actions. These can be selected and are “shown-off” on your **dev card**. Titles are formerly known as awards.

-   **Lucky number 7** — broke the streak 7 times
-   **Flawless Victory** — 50+ streak without loss
-   **The Pollverizer —**
-   All current titles (**React 4 U: most answered React polls, TypeScript Tinkerer, CSS Connoisseur: Most correct answered CSS polls**, etc.)
-   All poll titles used to count the amount of polls answered by the player (**pollXtreme, poll-a-holic**)

### Profile pages

-   Show dev cards and a detailed list of achievements
-   Show run history
-   Show unlocks

### ☀️ Seasons

Seasons could be thematic elements.

-   **UI based**: e.g I had a Advent Calendar last winter
-   **Mechanic based;** e.g teams: also had this in the earlier version: get points by answering but gain the most points if all team members answered
-   Easter egg hunt: eggs had to be found, hidden on the page by each category

### 🆕 Catching up system

-   New players get a **1.2 XP mult**, only if they bet with atleast a **threshold, lasting one season or run.**

### **📊 Community-Driven Poll Selection**

-   **Manual Poll Selection Remains**
-   **Players vote for the next day’s category** after submitting their answer. I will make the final decision.

### **🔧 Handling Category Balance**

-   **Weight the vote based on available polls.** *(Example: If Git only has 11 polls, it appears as an option less often.)*
-   **Let a category "rest" after being selected too often.** *(Example: If "CSS" was chosen twice in a row, it’s temporarily removed from voting.)*
-   **Manually create more backend & tools questions over time** to even out the pool.

### 🎓 Tutorial

Show a tutorial the first 3 polls, or as regular tips.

-   💡 "You start with 50 XP in {{ category }}. Correct answers increase your XP, wrong answers lose it."
-   💡 "XP is stored per category. Want more React XP? Keep answering React polls!"
-   💡 "Locking in saves XP permanently. If you don’t lock in and lose, your XP disappears!"

### From old to new system

-   **Poll titles (like PollXtreme)** — are given to the player as “earned titles”
-   Player data from the previous version will earn **veteran title**

### Thematic elements

-   Rhyming questions or fun prompts inspired by Banjo-Kazooie (Gruntilda and Furnace fun)
-   Quirky, light-hearted language to maintain a playful tone
-   A leaderboard that fuels friendly rivalry.

### Sharing answers and polls

-   In the old version, I posted the poll manually everyday in our slack channel
-   I also posted the selected and correct answers, mostly with a little description about the answer or why some answers weren’t right with a screenshot. This took some work in total.
-   I want to look at cron jobs to auto open/close polls
-   **Slack Bot Integration**: Automate posting poll results, with minimal effort, preserving community interaction.

### Poll selection

-   Show everyone the same poll
    -   Issue: new players miss earlier polls, unless a the pool is started at 0 agagit in
-   Allow users to select a category
    -   Allow users to select a category at the end of each poll, given by the system
    -   Given categories are random
    -   If all polls of categories are answered, category will not be shown anymore
    -   Show an indicator of how many polls there are left to play in each category
    -   issues: afraid answers might be spoiled and discussions are left out. Earlier we had discussions about the poll because everyone had the same. This caused community feeling and learning of each other

### Poll ratings

-   Players

### Extra

-   It should be possible to allow the player to select a streak length and gain greater rewards, e.g:
    -   Streak is 10, I can select a reward when I hit 15
    -   A bigger reward if I select 20
    -   Even bigger when I reach 30

### ❓ Open questions/todo’s

-   Considering leveling up your config: tree shake lv. 3 etc. How will they evolve?
-   Considering diverging polls for everyone:
    -   A cool mechanic would be to let players influence their own poll category for the next day based on categories the system gives you at the end of answering a poll
-   Can I slip in Banjo-Kazooie/top, Pokemon, Stardew Valley or Super Mario?
    -   Uniqueness of Tick Tock Clock?
    -   Mechanics like Wet Dry world (managing water levels), time control mechanic of Tick Tock Clock, Tiny Huge Island mechanic.
    -   Mostly the absurdity of the Banjo Kazooie / Super Mario 64 games
    -   More Nods to RareWare humor
    -   Easter eggs
-   Brainstorm more frames, titles for dev cards
-   Can I show more useful/ fun stats?
-   Create a logo for **DevVoted**
-   Handling 400 polls: people have seen them already. Not everyone. What to do? Is having 1000 polls the solution?
    -   Try coming up with more gradually
-   Consider Nintendo sounds (banjo kazooie sound pack) on certain interactions
-   Where to show results of incorrect or correct polls? A dialog feels weird
-   What to do with seasons?
    -   Seasons ends are a milestone, kinda like Balatro has “antes”. When players are still a streak while season ends, they might get bonusses
    -   Players keep XP permanent without any consequences (as a bonus). Or would this not good for balance
-   I don’t have a “complete” run since it’s endless. Could I have a milestone point to say you’ve completed a run?
    -   After 5 devvoted challenges
-   Multiple choice feels unfair because it's harder but you risk getting less points or losing streak

### Not doing:

-   **Adding currencies** — XP can be used already, adding another one will make it more (unnecessarily) complex
-   **Locking in/Banking mechanic** → Ends all runs for each category early while preserving earned XP and streak records.
    -   Reduces complexity significantly.
    -   Knowledge Score provides permanent mastery evidence, making permanent XP redundant.
    -   Removes player confusion (Why lock in? Why not continue a streak forever?).

[Not doing](https://www.notion.so/Not-doing-1b3073876297802ea776f82be881bd28?pvs=21)

### DevVoted is inspired by

-   ConcernedApe/Eric Barone — Stardew Valley
-   Rareware — Banjo-Kazooie / Tooie
-   LocalThunk — Balatro
-   Nintendo — F-zero 99, Mario Party games,
-   Gamefreak — Pokémon games
-   Chris Sawyer — Roller coaster tycoon
-   Inazuma Eleven
-   Calculate it roguelike

[User stories](https://www.notion.so/User-stories-1a7073876297803f9162fccce098e04f?pvs=21)
