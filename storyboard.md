-- private room--
[X] on sign up, private room should be created.
[X] private room is just their username.
[X] User should be routed to their private room timer on entry.
[X] only User can enter their private room.

-- room creation -- 
[X] create room with password
[X] unique room name
[X] enter room by giving room name, then password. 
[X] room shows in list of owner only. 
[X] shows user in rooms.
[ ] shareable link
[ ] enter group name in dropdown to enter. 


-- timer -- 
[X] group timer start 
[X] session status updates 
[X] group timer end & shows participants
[] diamond animation
[] turn animation on/off
[] stopwatch
[] timer overlay
 

-- history --
[X] show weekly total time per day
[X] show timeline of current day
[X] show  pie chart ratings of sessions  


-- leaderboard --
[X] global leaderboard of all rooms, since start. 


-- additional features --
[X] show session numbers
[] pixel cam
[] breathers 
[] build animation
[X] ticking sound
[] Activity
[X]showed prev Week total time
[ ] Video/lives
[] through extension, get the url/tab users are in as a accountability feature.


 // thinking
 user1: starts session 
 user2: recieves session duration + option to join in
 user2: opts in
 user1: starts session (startSesh in db() too)
 user2: recieves start time. calc remaining time & display. 
 time ends
 user2: sesh end (endSesh() in db + rating activated.)
    does something change in db on invidual side ? No. 
    but we need to store group session for stats ig. 

//implement cancel session. no drop outs, pure cancel for everyone.

PHASE 1 
[] create room.
[] join room.
[] share room. 
[] start/stop sessions with rating
[] start/stop group session 
[] countdown
[] use shop for rewards & promises.



-----brainstorming for history section------

weekly bar chart showing total duration of each day 

pie chart showing ratings

list of sessions done today (A list. )

so I should get total sessionDatas. then derive datas for pie & bar chart eh. 

I should ponder on how offline sessions are added




----bugs---- 
[X] roomdropdown phone responsiveness issue 

[X] secLeft show same in each room, make secLeft a object in zustand store. 

[X] add dash to empty spaces while creating room

[X] styling of goal. 

[X] user starts a sesh & leaves room. then others won't be able to start sesh. keep a time limit or del sesh if user leaves room.

[X] dropdown issue

[X] if group timer played after timer playing, it doesn't work. 

[X] Timeline

[X] Show sidebar other options in break mode

[X] Timeline styling, overflow. 

[X] Pie chart labels overflow

[X] Sessioncount auto update after each sesh#  (tobetestes)

[X] Shop not enough coins error

[X] rating doesn't go up to 10

[X] reset rating coins. 

[X] reminder after every 15.

[X] leaving mid sesh 

[X] weird behaviour after group sesh ends

[X] timer playing false issue


[X] ongoing timer gets paused

[X] joining group timer when session ongoing, weird behaviour. Also need to check seshReset functionality

[X] disable opening settings during timer play

[] timer resets if anything changed in settings, even when paused

[] Hide Video button overlaps with play/pause btn of video.

[] delete storyboard from commit histories.

[] Session time shouldn't be 0m. 

[]   goaldialog doesn't open w stopwatch

----optimisation--
[] useShallow 





### should use roomIds instead of room names. 
 with sessions, I'm adding roomIds.
 [] backfill all the sessions with roomIds by getting names => getting id => roomId:id 
 
 [] start from /page, get user default roomId & redirect user to there.
  -----when backfill done, remove index on name of rooms doc-----------

 [] i added roomId to users which will be their priv room Id. 