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
[ ] shareable link


-- timer -- 
[] group timer start 
[] session status updates
[] diamond animation
[] turn animation on/off
[] stopwatch
 
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


PHASE 1 
[] create room.
[] join room.
[] share room. 
[] start/stop sessions with rating
[] start/stop group session 
[] stopwatch + countdown
[] use shop for rewards & promises.
