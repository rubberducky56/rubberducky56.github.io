---
layout: post
title: "Crackme Reverse Engineering with Ghidra"
author: "Mouse"
categories: other-writeups
tags: [cybersecurity, programming, malware, reverse-engineering]
image: crackme_reverse_engineering.png
permalink: /other-writeups/crackme-reverse-engineering-ghidra
---

### Introduction
In this article I will be reverse engineering some challenges from [Crackme](https://crackmes.one/) using [Ghidra](https://ghidra-sre.org/). At the time of writing I have a basic understanding of Ghidra, reverse engineering, assembly and C, but I would like to improve my skills and knowledge in this fascinating discipline. I will start with some extremely simple challenges before moving on to more complex puzzles.

### easy_reverse
The first challenge I will complete is [easy_reverse](https://crackmes.one/crackme/5b8a37a433c5d45fc286ad83). This is written in C/C++, made for Unix. and uses x86-64 architecture.

The file given, ```rev50_linux64-bit```, is a 64-bit ELF executable, as found out using the ```file``` command:

```
rev50_linux64-bit: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 3.2.0, BuildID[sha1]=6db637ef1b479f1b821f45dfe2960e37880df4fe, not stripped
```

When the program is run, we are asked for a password as a parameter.

```
└─$ ./rev50_linux64-bit
USAGE: ./rev50_linux64-bit <password>
try again!
```

When this is loaded into the Ghidra CodeBrowser, we find the ```main``` entry function.

![alt text](\assets\img\other-writeups\crackme\main.PNG)

We can see the decompiled code more closely below:

![alt text](\assets\img\other-writeups\crackme\main_decomp.PNG)

The first thing we can do is change the ```main``` function signature. In C, a function signature is its name and parameter list. We can see that this function takes in two parameters - the first will be ```argc``` (argument count)  and the second will be ```argv``` (argument vector). This is just the default way of having parameters in a C function, so we can replace the current signature with the [default main function signature](https://c0x.shape-of-code.com/5.1.2.2.1.html) from the C Standard. This is ```int main(int argc, char *argv[])```. However, the square brackets are seen as a part of the function name, so we replace this signature with ```int main(int argc, char** argv)```.

![alt text](\assets\img\other-writeups\crackme\sig_changed.PNG)

We see that the function parameters have been cleaned up, and we get a better view of what the program is doing. Line 8 is assigning the length of the first argument to ```sVar1``` using the ```strlen``` function - ```sVar1``` can be renamed to something more descriptive, like ```arg1_length```. We can now see exactly what this program is doing.

![alt text](\assets\img\other-writeups\crackme\final.PNG)

If the user-supplied argument has a length of 10, and the fifth character is “@”, the flag is output to the console. We can now try running this program with this information. A password matching the above description is given.

```
└─$ ./rev50_linux64-bit qwer@tyuio
Nice Job!!
flag{[REDACTED]}
```

And we get the final flag.

### crackme0x00

This challenge is the first of a series of crackme challenges, taken [from here](https://github.com/Maijin/radare2-workshop-2015/tree/master/IOLI-crackme/bin-linux).

The first file is a 32-bit ELF executable, as found with the ```file``` command:

```
crackme0x00: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.9, not stripped
```

After running ```strings``` on this file, I found the suspicious number ```250382```. It is not the number that caught my eye, but its positioning between the strings ```Password:``` and ```Invalid Password!```:

```
─$ strings crackme0x00                                                           
(...)
strcmp
scanf
_IO_stdin_used
__libc_start_main
GLIBC_2.0
PTRh
IOLI Crackme Level 0x00
Password:
250382
Invalid Password!
Password OK :)
GCC: (GNU) 3.4.6 (Gentoo 3.4.6-r2, ssp-3.4.6-1.0, pie-8.7.10)
GCC: (GNU) 3.4.6 (Gentoo 3.4.6-r2, ssp-3.4.6-1.0, pie-8.7.10)
GCC: (GNU) 3.4.6 (Gentoo 3.4.6-r2, ssp-3.4.6-1.0, pie-8.7.10)
.symtab
(...)
```
Out of curiosity I tried this as the password, and it worked - the challenge is cracked.
```
└─$ ./crackme0x00      
IOLI Crackme Level 0x00
Password: 250382
Password OK :)
```
However, I want to try to gain a better understanding of how the code works. This is the ```main``` function from Ghidra:

![alt text](\assets\img\other-writeups\crackme\0x00_main.PNG)

On line 10 we see ```scanf(“%s”, local_lc)```. This is reading STDIN - taking in the user-supplied password and storing it in variable ```local_lc```. We then see the function ```strcmp()```. This will compare the strings ```local_lc``` and ```250382``` (the password we found with ```strings```), and return 0 if they are the same. In this case, ```”Password OK :)”``` is output. We have decompiled and understood this program, and I am more satisfied.

### crackme0x01

The next executable has the same ELF 32-bit file type as crackme0x00, and the same password prompt when run. This time, ```strings``` was less fruitful - I am not as lucky this time.

```
─$ strings crackme0x01
/lib/ld-linux.so.2
__gmon_start__
libc.so.6
printf
scanf
_IO_stdin_used
__libc_start_main
GLIBC_2.0
PTRh
IOLI Crackme Level 0x01
Password:
Invalid Password!
Password OK :)
GCC: (GNU) 3.4.6 (Gentoo 3.4.6-r2, ssp-3.4.6-1.0, pie-8.7.10)
GCC: (GNU) 3.4.6 (Gentoo 3.4.6-r2, ssp-3.4.6-1.0, pie-8.7.10)
```

Below is the ```main``` function Ghidra greets us with:

![alt text](\assets\img\other-writeups\crackme\0x01_main.PNG)

This is similar to the previous challenge. However, the ```scanf()``` function specifies the parameter ```%d``` - a decimal input. This is then compared to ```0x149a```. This is a hexadecimal string, which is the decimal number 5274:

```
└─$ echo $((16#149a))    
5274
```

Trying ```5274``` as the password is successful:

```
IOLI Crackme Level 0x01
Password: 5274
Password OK :)
```

### crackme0x02

This challenge has the same format as previously. It appears that the nifty ```strings``` trick will no longer work. Ghidra presents this ```main``` function:

![alt text](\assets\img\other-writeups\crackme\0x02_main.PNG)

This is exactly the same challenge as crackme0x01. Converting the hexadecimal number ```0x52b24``` into a decimal number yields 338724:
```
└─$ echo $((16#52b24))          
338724
```

And this password works perfectly:
```
└─$ ./crackme0x02       
IOLI Crackme Level 0x02
Password: 338724
Password OK :)
```

### crackme0x03

Let’s hope this challenge is more exciting. This is the ```main``` function:

![alt text](\assets\img\other-writeups\crackme\0x03_main.PNG)

We see that a decimal is read from STDIN and stored in ```local_8```, and a new function, ```test()``` is run, taking in the parameters ```local_8``` and the hexadecimal number ```0x52b24```. This is the same number as in crackme0x02, ```338724```.

From the symbol tree, we find the ```test()``` function.

![alt text](\assets\img\other-writeups\crackme\0x03_test.PNG)

We can clearly see that the equality of the provided arguments is tested. In either case, another function ```shift()``` is called, but with different parameters. If the parameters are equal, ```Sdvvzrug#RN$$$#=,``` is passed. Using the symbol tree, we find the ```shift()``` function.

![alt text](\assets\img\other-writeups\crackme\0x03_shift.PNG)

We rename the variables to get a better understanding of this program.
* We see a ```while``` loop, counting from 0 to the length of ```param1```. The variable ```local_80``` is the incremented counter controlling the loop, so we rename this to ```counter```.
* ```sVar1``` is the parameter length, so we call this ```param_length```
* ```local_7c``` appears to hold the results of the operation, so we rename it to ```shifted_result```

![alt text](\assets\img\other-writeups\crackme\0x03_renamed.PNG)

Now we can clearly see what this program is doing. It is shifting each character in the parameter string by 3, using an ASCII table. This is a ROT-3 cipher. Decrypting the string ```Sdvvzrug#RN$$$#=,``` with [this decrypter](https://www.dcode.fr/rot-cipher) yields ```”Password OK!!! :)”``` - the password is ```338724```, as previously. If we shift the other string from ```test()``` by -3, we get the string ```”Invalid Password!”```, as expected.

![alt text](\assets\img\other-writeups\crackme\rot3.PNG)

```
└─$ ./crackme0x03               
IOLI Crackme Level 0x03
Password: 338724
Password OK!!! :)
```

### crackme0x04

Below is the ```main``` function which Ghidra found:

![alt text](\assets\img\other-writeups\crackme\0x04_main.PNG)

On line 9 there is a ```scanf``` command, taking in a string from STDIN and storing it in variable ```local_7c```. This is then passed as a parameter to function ```check()```. The symbol table reveals the ```check()``` function:

![alt text](\assets\img\other-writeups\crackme\0x04_check.PNG)

The ```check()``` function has a little more going on. It appears that this program is adding the integers in the user input together, and checking if they are equal to ```0xf``` - 15 in decimal. Below is the ```check()``` function with variables renamed for clarity, and we go through how this program works:

![alt text](\assets\img\other-writeups\crackme\0x04_check_vars.PNG)

* We rename the function’s parameter ```user_pword```, as this is the password which the user inputs.
* ```sVar1``` is assigned with ```strlen(user_pword)```, which takes the length of ```user_pword```, so we rename this variable ```user_pword_length```
* ```local_10``` is used a counter variable to step through the characters of ```user_pword```, so we name this ```counter```
* This function steps through each character of the input, and the current character is  ```local_11```, assigned as ```user_pword[counter]```. So we name this variable ```current_char```
* ```local_8``` is the result of casting ```current_char``` to a decimal value, so we name this ```current_char_int```.
* The value of ```current_char_int``` is added to a running total, stored in ```local_c```. We rename ```local_c``` to  ```total```.

On line 22, we see that if the running total ```total``` reaches ```0xf```, or 15 in decimal, the loop breaks and the password is successful. We can deduce that the password is any integer where the digits add up to 15 - these are precisely the integers 69, 78, 87, and 96. These passwords are accepted.

```
└─$ ./crackme0x04
IOLI Crackme Level 0x04
Password: 69
Password OK!
```

```
IOLI Crackme Level 0x04
Password: 96
Password OK!
```

```
IOLI Crackme Level 0x04
Password: 78
Password OK!
```

```
IOLI Crackme Level 0x04
Password: 87
Password OK!
```

### crackme0x05

Below is the decompiled ```main``` function.

![alt text](\assets\img\other-writeups\crackme\0x05_main.PNG)

This is similar to crackme0x04. Below is the ```check()``` function, and below that is the ```check()``` function with renamed variables, in the same scheme as used in crackme0x04.

![alt text](\assets\img\other-writeups\crackme\0x05_check.PNG)

![alt text](\assets\img\other-writeups\crackme\0x05_check_vars.PNG)

This has almost the same functionality as ```check()``` in crackme0x04, except for some alterations. Instead of checking for the total ```0xf``` (15), this ```check()``` function checks for the total ```0x10```, 16 in decimal. However, if this total is matched, another function ```parell()``` is called, passing in the user input. Below is the ```parell()``` function.

![alt text](\assets\img\other-writeups\crackme\0x05_parell.PNG)

We can see the check this function carries out on line 8. If the bitwise AND of the input and ```1``` is ```0```, the password is accepted. For instance, the password ```79``` is rejected, as the bitwise AND of 79 and 1 is 1, not 0. The password ```790``` is accepted, as the bitwise AND of 790 and 1 is 0.

```
└─$ ./crackme0x05  
IOLI Crackme Level 0x05
Password: 79
Password Incorrect!
```

```
└─$ ./crackme0x05
IOLI Crackme Level 0x05
Password: 790
Password OK!
```
