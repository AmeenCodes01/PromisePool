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




----optimisation--
[] useShallow 


Your production config files are generated in directory: livekit.promise-pool.com

Please point update DNS for the following domains to the IP address of your server.
 * livekit.promise-pool.com
 * turn.promis-pool.com
 * livekit-whip.promise-pool.com
Once started, Caddy will automatically acquire TLS certificates for the domains.

The file "cloud_init.ubuntu.yaml" is a script that can be used in the "user-data" field when starting a new VM.

Since you've enabled Egress/Ingress, we recommend running it on a machine with at least 4 cores

Please ensure the following ports are accessible on the server
 * 443 - primary HTTPS and TURN/TLS
 * 80 - for TLS issuance
 * 7881 - for WebRTC over TCP
 * 3478/UDP - for TURN/UDP
 * 50000-60000/UDP - for WebRTC over UDP
 * 1935 - for RTMP Ingress
 * 7885/UDP - for WHIP Ingress WebRTC


Server URL: wss://livekit.promise-pool.com
RTMP Ingress URL: rtmp://livekit.promise-pool.com/x
WHIP Ingress URL: https://livekit-whip.promise-pool.com/w
API Key: APIaRm5nNeeCTsN
API Secret: 8p00dEO4HRvZMeNbw323eiZXB5YfDxHGbXWf50LiE0cD


    Here's a test token generated with your keys: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTEwMDI3NDAsImlzcyI6IkFQSVp6V1QyWkxhNllHVyIsIm5hbWUiOiJUZXN0IFVzZXIiLCJuYmYiOjE3NTUwMDI3NDAsInN1YiI6InRlc3QtdXNlciIsInZpZGVvIjp7InJvb20iOiJteS1maXJzdC1yb29tIiwicm9vbUpvaW4iOnRydWV9fQ.HFKWO2W3KjF0fgyu18xm3m4lOpU9PV-LXRS9bADqSa0


