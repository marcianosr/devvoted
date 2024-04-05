# New application flow

This document will describe the new 'Poll' Flow and mechanics.

## 1. Submit content

Content can be submitted by everyone. A question/challenge can be for any 'content subject'

### What is a content subject?

A content subject is a collection of tags on a question
e.g. 'Frontend, TypeScript' or 'Cloud, AWS, Docker' if the question is related to all these topics.

## 2. One question a day

The original idea was a 'channel' per guild. This means if you are in multiple guilds, you get multiple questions a day. This also meant that rankings would be separated from each-other.
To get a stronger sense of community, we want everybody playing in the same pool, so that team-ups and rankings can also happen over guilds across the entirety of Kabisa.

## 3. Determining the question of the day

The Main game master ('Marciano?') can steer in content of the day. Not on theme, but on difficulty, modifiers or question type (poll, challenge, etc)

This means that difficulty or doing a challenge is done for everyone on the same day.

1. Check for matches on daily rules (question / poll, modifiable, difficulty)
2. Check which content is not been served in the last 'x' time
3. Check the interests of the player.

Rules for a day can be:

- Question is not been done in the last 'x' time
- Question matches interest of player
- Question is a poll question

For another day it could be:

- Question has been done in the last 'x' time
- Question is a poll question

Modifiers: Time limit 'x', select inverse

or: 'Out your comfort zone day!'

- Question has not been done in the last 'x' time
- Question does not match interest of player
- Question is a poll question

## 4. Scoring for questions

Since everyone gets a different (more tailored to their interests) question, it would not be fair if some people get questions that only awards 3 points, and others get questions awarding them 10 points.

To make things more equal, we can make every question just score 100%, and having items wrong or to many answers ticked till lower this percentage.

This percentage then gets multiplied with a score based on a difficulty level.

(Points, coins, stats, etc)

## 5. Seasons and team play

(themes, seasons, extra ranking systems, team selections, etc)

# A DSL For questions and results?

We want a lot of freedom in selecting a question

We also want freedom in the scoring mechanic

- sometimes scoring in a team
- scoring for a season (group bucket)
- inverting scores
- modify based on past 'streak'
- modify based on time taken to answer

this logic we would like to have differently based on time

so that means:

Scheduling rules. The most specific schedule wins.

- A non-repeating schedule wins over a repeating schedule

By having the scheduling of question selected and scheduling of scoring separated,
We can more easily having a 'Double points week!' without changing question selection.

Even more, scoring we probably want as separate modifiers that act on the outcome of earlier modifiers, in a chain, and committing the final outcome in the end.

So you could have:

1. Base score calculation
2. Double points week! (modifier over base score)
3. Eurovision Season (does some team scoring as well)
4. Apply user effects

The order in which these mutations are applied matters, and should be maintained in some admin.

A DSL to specify all these things would be nice, but does not necessary be an online DSL. It can also be a TS regulated small content files in the codebase, that can be configured in an admin. (plugin model)

# 6. Items

Items can be earned or bought. Items can be used for:

- Extra currency: When answering a poll you get currency. Double the currency for instance
- Extra time: When answering a poll you get a time limit. Double the time limit for instance
- Hints: When answering a poll you get hints
- Stay unscathed when answering a question wrong (joker card)
- Double or Nothing Dice: Gambling before answering a question, players can choose to roll the dice to potentially double their earnings for that question or, if unlucky, earn the default amount of currency.
  Twist: Include a rare triple or nothing variant, but with a higher risk of losing the wagered earnings.

To thwart others:

- Limit the time of another player
- Limit score gain
- Invert answer options
- Make sure someone has to answer an 'out of comfort zone' question
- Fake coins for everyone: Thwart all players by make them not earn any coins for a question
- Add a fake answer to a poll question. If someone picks this answer, they lose points or currencies.
