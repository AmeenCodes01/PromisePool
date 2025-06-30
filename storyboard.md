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
[] pixel cam
[] breathers 
[] build animation




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

[] add dash to empty spaces while creating room

[X] styling of goal. 

[] user starts a sesh & leaves room. then others won't be able to start sesh. keep a time limit or del sesh if user leaves room.

[] dropdown issue