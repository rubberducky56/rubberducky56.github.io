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

This behemoth of a script does exactly the same thing, and is near impossible for a human to understand.

### Methods of Code Obfuscation

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
    * This layer aims to obfuscate entire software packages or execuribles, like a Java library or ELF formats (executable file format - executable files often used on Linux systems)
* Inter-Component Layer
    * This layer aims to obfuscate interfaces between different software packages, for example library calls and resource encryption
* Application Layer
    * This layer is more specific to the application at hand, for example obscating neural networks, or DRM (digital rights management) systems. DRM systems are often used to prevent pirates from gaining cracked versions of movies and video games.
