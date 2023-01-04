---
layout: post
title: "MemLabs Lab 1 Writeup"
author: "Mouse"
categories: other-writeups
tags: [cybersecurity, forensics, writeup]
image: memlabs1.png
permalink: /other-writeups/memlabs1
---

### Lab 1 - Beginner’s Luck

This is a writeup of the [first](https://github.com/stuxnet999/MemLabs/tree/master/Lab%201) of a series of CTF-style challenges in memory forensics, created by [P. Abhiram Kumar](https://stuxnet999.github.io/). The repository containing these challenges can be found [here](https://github.com/stuxnet999/MemLabs). This challenge was completed using Volatility. A reference for Volatility commands can be found [here](https://github.com/volatilityfoundation/volatility/wiki/Command-Reference).

The description of the challenge is as follows:

>My sister's computer crashed. We were very fortunate to recover this memory dump. Your job is get all her important files from the system. From what we remember, we suddenly saw a black window pop up with some thing being executed. When the crash happened, she was trying to draw something. Thats all we remember from the time of crash.

There are three flags to find. From the hint, it sounds like the ‘black window’ is likely to be the command prompt, and it seems like MS Paint was being used.

### Profiles

Once the challenge file has been extracted, we start by determining the profile.

##### Command:
> volatility -f MemoryDummp_Lab1.raw imageinfo

```
Volatility Foundation Volatility Framework 2.6
INFO	: volatility.debug	: Determining profile based on KDBG search...
Suggested Profile(s) : Win7SP1x64, Win7SP0x64, Win2008R2SP0x64, Win2008R2SP1x64_23418, Win2008R2SP1x64, Win7SP1x64_23418
AS Layer1 : WindowsAMD64PagedMemory (Kernel AS)
AS Layer2 : FileAddressSpace (/home/kali/Downloads/forensics/memlabs/lab1/MemoryDump_Lab1.raw)
PAE type : No PAE
DTB : 0x187000L
KDBG : 0xf800028100a0L
Number of Processors : 1
Image Type (Service Pack) : 1
KPCR for CPU 0 : 0xfffff80002811d00L
KUSER_SHARED_DATA : 0xfffff78000000000L
Image date and time : 2019-12-11 14:38:00 UTC+0000
Image local date and time : 2019-12-11 20:08:00 +0530
```

We see a number of different potential profiles. To determine which profile to use, we use the ```kdbgscan``` command, using each profile, and checking the number of processes identified.

When ```kdbgscan``` is run with the ```Win7SP0x64``` profile, we see 48 processes running. It is likely that this is the correct profile to use.

##### Command:
> volatility -f MemoryDump_Lab1.raw --profile=Win7SP0x64 kdbgscan

```
Volatility Foundation Volatility Framework 2.6
**************************************************
Instantiating KDBG using: Kernel AS Win7SP0x64 (6.1.7600 64bit)
Offset (V)                	: 0xf800028100a0
Offset (P)                	: 0x28100a0
KDBG owner tag check      	: True
Profile suggestion (KDBGHeader): Win7SP1x64
Version64                 	: 0xf80002810068 (Major: 15, Minor: 7601)
Service Pack (CmNtCSDVersion) : 1
Build string (NtBuildLab) 	: 7601.17514.amd64fre.win7sp1_rtm.
PsActiveProcessHead       	: 0xfffff80002846b90 (48 processes)
PsLoadedModuleList        	: 0xfffff80002864e90 (140 modules)
KernelBase                	: 0xfffff8000261f000 (Matches MZ: True)
Major (OptionalHeader)    	: 6
Minor (OptionalHeader)    	: 1
KPCR                      	: 0xfffff80002811d00 (CPU 0)
```

Now that we know the profile, I created an alias to make typing out commands more efficient.

##### Command:

> alias vol='vol2 -f MemoryDump_Lab1.raw --profile=Win7SP0x64'

### Running Processes
We now check the running processes.

##### Command:
> vol pslist

The following lines stand out:

```
Offset(V)      	Name                	PID   PPID   Thds 	Hnds   Sess  Wow64 Start                      	Exit                     	 

------------------ -------------------- ------ ------ ------ -------- ------ ------ ------------------------------

0xfffffa8001048060 DumpIt.exe          	796	    604  	2   	45  	1  	1        2019-12-11 14:37:54 UTC+0000

0xfffffa8000f4c670 explorer.exe       	2504    3000 	34  	825  	2  	0        2019-12-11 14:37:14 UTC+0000

0xfffffa80022bab30 mspaint.exe        	2424	604  	6  	    128  	1  	0        2019-12-11 14:35:14 UTC+0000

0xfffffa8002222780 cmd.exe            	1984	604  	1   	21  	1  	0        2019-12-11 14:34:54 UTC+0000

0xfffffa8001010b30 WinRAR.exe         	1512    2504  	6  	    207  	2  	0        2019-12-11 14:37:23 UTC+0000
```

The software used to create this memory image is ```DumpIt.exe```. ```explorer.exe``` is the Windows file explorer program. As suspected, ```mspaint.exe``` and ```cmd.exe``` were both also running. We also see that ```WinRAR.exe```, a file compressor, was running.

### CMD.exe
Let’s examine the commands that were run on command prompt.

##### Command:
> vol cmdscan

```
Volatility Foundation Volatility Framework 2.6
**************************************************
CommandProcess: conhost.exe Pid: 2692
CommandHistory: 0x1fe9c0 Application: cmd.exe Flags: Allocated, Reset
CommandCount: 1 LastAdded: 0 LastDisplayed: 0
FirstCommand: 0 CommandCountMax: 50
ProcessHandle: 0x60
Cmd #0 @ 0x1de3c0: St4G3$1
Cmd #15 @ 0x1c0158:
Cmd #16 @ 0x1fdb30:
**************************************************
CommandProcess: conhost.exe Pid: 2260
CommandHistory: 0x38ea90 Application: DumpIt.exe Flags: Allocated
CommandCount: 0 LastAdded: -1 LastDisplayed: -1
FirstCommand: 0 CommandCountMax: 50
ProcessHandle: 0x60
Cmd #15 @ 0x350158: 8
Cmd #16 @ 0x38dc00: 8
```

This was not very enlightening. We see that a command ```St4G3$1``` was run - this appears to say ‘Stage 1’. We can examine the command prompt further with the ```consoles``` command. The advantage of using ```consoles``` is it gives us the whole STDOUT, as opposed to just the user inputs. Moreover, it will translate any aliases for us.

##### Command:
> vol consoles

```
Volatility Foundation Volatility Framework 2.6
**************************************************
ConsoleProcess: conhost.exe Pid: 2692
Console: 0xff756200 CommandHistorySize: 50
HistoryBufferCount: 1 HistoryBufferMax: 4
OriginalTitle: %SystemRoot%\system32\cmd.exe
Title: C:\Windows\system32\cmd.exe - St4G3$1
AttachedProcess: cmd.exe Pid: 1984 Handle: 0x60
----
CommandHistory: 0x1fe9c0 Application: cmd.exe Flags: Allocated, Reset
CommandCount: 1 LastAdded: 0 LastDisplayed: 0
FirstCommand: 0 CommandCountMax: 50
ProcessHandle: 0x60
Cmd #0 at 0x1de3c0: St4G3$1
----
Screen 0x1e0f70 X:80 Y:300
Dump:
Microsoft Windows [Version 6.1.7601]                                       	 
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.            	 

C:\Users\SmartNet>St4G3$1                                                  	 
ZmxhZ3t0aDFzXzFzX3RoM18xc3Rfc3Q0ZzMhIX0=                                   	 
Press any key to continue . . .                                            	 
**************************************************
ConsoleProcess: conhost.exe Pid: 2260
Console: 0xff756200 CommandHistorySize: 50
HistoryBufferCount: 1 HistoryBufferMax: 4
OriginalTitle: C:\Users\SmartNet\Downloads\DumpIt\DumpIt.exe
Title: C:\Users\SmartNet\Downloads\DumpIt\DumpIt.exe
AttachedProcess: DumpIt.exe Pid: 796 Handle: 0x60
----
CommandHistory: 0x38ea90 Application: DumpIt.exe Flags: Allocated
CommandCount: 0 LastAdded: -1 LastDisplayed: -1
FirstCommand: 0 CommandCountMax: 50
ProcessHandle: 0x60
----
Screen 0x371050 X:80 Y:300
Dump:
DumpIt - v1.3.2.20110401 - One click memory memory dumper                	 
Copyright (c) 2007 - 2011, Matthieu Suiche <http://www.msuiche.net>      	 
Copyright (c) 2010 - 2011, MoonSols <http://www.moonsols.com>            	 


Address space size:    	1073676288 bytes (   1023 Mb)               	 
Free space size:      	24185389056 bytes (  23064 Mb)               	 

* Destination = \??\C:\Users\SmartNet\Downloads\DumpIt\SMARTNET-PC-20191211-
143755.raw                                                                 	 

--> Are you sure you want to continue? [y/n] y                         	 
+ Processing...                                 	
```

The following lines are of particular interest:

```
Cmd #0 at 0x1de3c0: St4G3$1
----
Screen 0x1e0f70 X:80 Y:300
Dump:
Microsoft Windows [Version 6.1.7601]                                       	 
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.            	 

C:\Users\SmartNet>St4G3$1                                                  	 
ZmxhZ3t0aDFzXzFzX3RoM18xc3Rfc3Q0ZzMhIX0=                                   	 
Press any key to continue . . .                                            	 
**************************************************
```

We can now see that after the mystical ‘stage 1’ command, we see an encoded message ```ZmxhZ3t0aDFzXzFzX3RoM18xc3Rfc3Q0ZzMhIX0=```, run under the ```SmartNet``` user directory. The equal sign at the end of this string indicate that this is Base64 encoded (Base64 pads the end of messages with equals signs). After decoding this with [CyberChef](https://gchq.github.io/CyberChef/), we get the first flag ```flag{th1s_1s_th3_1st_st4g3!!}```!

I am not yet sure if this is a coincidence or not, but a quick Google search of SmartNet reveals that it is a [‘Global Navigation Satellite System’ by Hexagon](https://hexagon.com/products/hxgn-smartnet). Worth keeping in the back of our heads…

### NTLM Hashes
At this point I was a little stuck. I decided to dump the NTLM hashes, and attempt to crack them.

##### Command:
> vol hashdump

```
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SmartNet:1001:aad3b435b51404eeaad3b435b51404ee:4943abb39473a6f32c11301f4987e7e0:::
HomeGroupUser$:1002:aad3b435b51404eeaad3b435b51404ee:f0fc3d257814e08fea06e63c5762ebd5:::
Alissa Simpson:1003:aad3b435b51404eeaad3b435b51404ee:f4ff64c8baac57d22f22edc681055ba6:::
```

We see that there are three users of interest - ```SmartNet```, ```HomeGroupUser```, and ```Alissa Simpson```. The Admin and Guest passwords are the same. When these hashes were put into [CrackStation](https://crackstation.net/), we were able to get three of the four hashes! The admin and guest passwords are blank, the ```SmartNet``` password is ```smartnet123```, and Alissa Simpson’s password is ```goodmorningindia```. This is certainly information worth keeping an eye on.

![alt text](\assets\img\other-writeups\memlabs1\crackstation.PNG)

### Process CMD Commands

We now examine process command line commands with ```cmdline```. We will examine this for the ```cmd.exe```, ```mspaint.exe```, ```explorer.exe```, and ```WinRAR.exe``` processes. The PIDs of each of these processes is taken from the ```pslist``` command.

##### Command:
> vol cmdline -p 2504,2424,1984,1512

```
Volatility Foundation Volatility Framework 2.6
************************************************************************
cmd.exe pid:   1984
Command line : "C:\Windows\system32\cmd.exe"
************************************************************************
mspaint.exe pid:   2424
Command line : "C:\Windows\system32\mspaint.exe"
************************************************************************
explorer.exe pid:   2504
Command line : C:\Windows\Explorer.EXE
************************************************************************
WinRAR.exe pid:   1512
Command line : "C:\Program Files\WinRAR\WinRAR.exe" "C:\Users\Alissa Simpson\Documents\Important.rar"
```

The ```WinRAR``` command was interesting. We can see that the file ```Important.rar``` has been compressed. We now try to extract this file. If it has been cached, we should be able to recover it.

##### Command:
> vol filescan > grep ‘Important’

```
Volatility Foundation Volatility Framework 2.6
0x000000003fa3ebc0  	1  	0 R--r-- \Device\HarddiskVolume2\Users\Alissa Simpson\Documents\Important.rar
0x000000003fac3bc0  	1  	0 R--r-- \Device\HarddiskVolume2\Users\Alissa Simpson\Documents\Important.rar
0x000000003fb48bc0  	1  	0 R--r-- \Device\HarddiskVolume2\Users\Alissa Simpson\Documents\Important.rar
```

Now we have the offsets, we can try dump these files. We make a directory ```file_dump``` to dump the files into, then dump the files with offsets ```0x000000003fa3ebc0```, ```0x000000003fac3bc0```, and ```0x000000003fb48bc0```

##### Command:

> vol dumpfiles -D file_dump -Q '0x000000003fa3ebc0','0x000000003fac3bc0','0x000000003fb48bc0'

```
Volatility Foundation Volatility Framework 2.6
DataSectionObject 0x3fa3ebc0   None   \Device\HarddiskVolume2\Users\Alissa Simpson\Documents\Important.rar
```

This was successful. In the ```file_dump``` directory, we now have one ```.dmp``` file. Let’s rename this to ```Important.rar```, and try extracting it.

##### Command:
> unrar e important.rar

```
UNRAR 6.00 freeware  	Copyright (c) 1993-2020 Alexander Roshal

Extracting from Important.rar
Password is NTLM hash(in uppercase) of Alissa's account passwd.
Enter password (will not be echoed) for flag3.png:

Extracting  flag3.png                   
All OK
```

A password was required to extract the file ```flag3.png```. We are told that this is the upper case version of Alissa’s NTLM hash. Luckily, we have already found this. I used the Python command ```.upper()``` to convert this hash to upper case, and used it as the password. This was successful.
