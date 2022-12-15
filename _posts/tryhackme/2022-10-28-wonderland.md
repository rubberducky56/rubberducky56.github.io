---
layout: post
title: "Wonderland Writeup"
author: "Mouse"
categories: tryhackme
tags: [writeup]
image: thm_wonderland.jpg
permalink: /tryhackme/wonderland-writeup
---

“Fall down the rabbit hole and enter wonderland”

### Enumeration
We know that there is a flag in a file called ```user.txt```, and a root flag in ```root.txt```. We start with an nmap scan, to see which ports are open and what services are running. We scan for service versions, operating systems, and utilise common scripts.

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

It appears we are told to ‘follow the white rabbit’, of which there is an image. We are also presented with a quote from Alice in Wonderland. At first I considered the possibility of a hidden message steganographically embedded into this image. However, it is wiser to investigate some more conventional avenues before resorting to steganography. Upon inspection of the source code, nothing new is revealed. However, we note that the image comes from a directory called ```/img```.

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

We snoop around alice’s home directory. We find out that this is an Ubuntu machine using the command ```uname -a```. We find two interesting files - ```root.txt``` and ```walrus_and_the_carpenter.py``` - a python script. When we examine the python script, we find this:

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

The Python script runs as root! We now check what the ```alice``` user can do with ```sudo```…
Command:
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

Alice can run ```python3.6```, and the poem script, as the ```rabbit``` user!
