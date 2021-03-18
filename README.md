# NHL
Site that live tracks themed NHL stats

HOME PAGE
Will likely have a nav bar, but also three side by side clickable pictures in the body - one for each of the three main categories. May have a page for each category, simply listing the subcategories, with video or picture highlight embedded, or news stories related to the main categories. I don't like the idea of having all subcategories rendered on the same page - if you minimize the record setter, the top 5 will now be to the same scale as the other record setters on the page. May be confusing visually.

FIGHT STATS
-PIM by player
-PIM by game/matchup
-PIM by team
-Hits (Can combine with PIM?)
-Drop the gloves (5 min fighting penalty) & Next time 2 players/teams face
-Other unusual incidents (majors, game misconducts, injuries, etc) & Next time 2 players/teams face

SCORING STATS BY PLAYER
All by League/Division/Team
Show games played?
-Goals
-Assists
-Points
-PP Goals
-SH Goals
-Plus/Minus

GOALIE STATS
-Save %
-GAA
-Shutouts
-# of times pulled
-Most minutes without a goal


FOR ALL PAGES
For each stat, the page will show the record keeper for that stat followed by the top 5 current players for this season. They will be displayed with a thumbnail picture, a progress bar to the left, and their name above that. Will possibly use CSS Gridbox. The top 5 progress bar lengths will be relative to the record setter. The record setter info can be minimized - at which point the top 5 will expand to fill the width of the screen. Will use CSS Transform to have the bars extend to the right when the page is loaded.

Will link players and team names to either Wikipedia or NHL.com.


STAT RESOURCES
NHL has their own public-accessible api for this info. I will be using their endpoints but with the help of Drew Hynes', Kevin Sidwar's, and Jon Ursenbach's documentation. Here are the links:
https://gitlab.com/dword4/nhlapi
https://www.kevinsidwar.com/iot/2017/7/1/the-undocumented-nhl-stats-api
https://github.com/erunion/sport-api-specifications/tree/master/nhl
