---
layout: post
title: "Deobfuscating JavaScript, Part 2 - Locky Ransomware"
author: "Mouse"
categories: cybersecurity
tags: [cybersecurity, programming, malware, reverse-engineering]
image: locky_ransomware.png
permalink: /cybersecurity/deobfuscating-javascript-2-locky
---

In this article, a JavaScript dropper for the Locky ransomware is deobfuscated. I have previously written an article on the [general principles of code obfuscation](https://cybermouse.xyz/cybersecurity/code-obfuscation), and another article on [JavaScript deobfuscation](https://cybermouse.xyz/cybersecurity/deobfuscating-javascript-1) (part 1 of this article), so check those out. Deobfuscation is more of an art than an exact science - every malware will use different techniques and tricks to hide their code. By unravelling obfuscated code, security experts can gain valuable insights into the inner workings of malware, enabling the cybersecurity community to develop effective countermeasures and protect systems against current threats.

[Locky](https://en.wikipedia.org/wiki/Locky) is a nasty piece of ransomware, and is usually sent as an attachment to malicious phishing emails. If the user runs the attachment, ransomware is installed onto the system, and all files matching certain extensions are locked behind a paywall. Instructions are given to the victim to visit a Tor .onion website, and send over bitcoins to the criminals. Locky has been around since 2016, and continues to infect systems. An analysis and IOCs (Indicators of Compromise) can be found [on VirusTotal](https://www.virustotal.com/gui/file/03f6ab1b482eac4acfb793c3e8d0656d7c33cddb5fc38416019d526f43577761/detection).

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\locky.PNG)

I have obtained a sample of the Locky JavaScript dropper file from [here](https://www.uperesia.com/deobfuscating-a-locky-dropper). This file is heavily obfuscated, as shown in the snippet below. In this article, I will deobfuscate this code, layer by layer, until we reach a final version that is comprehendible.

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\original.PNG)

The first thing to notice is the many redundant variables in the code. For example, lines 1, 4, 6, among others.

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\redundant_vars.PNG)

They seem to be random snippets of JavaScript enclosed within a string. Line 51 sounds like someone answering a question on a forum. Upon searching Google for these strings, we find some exact matches from [this StackOverflow thread](https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery), with many random strings being taken from [this solution](https://stackoverflow.com/a/7053197). We can see an exact string match in the highlighted image below, and on line 51 of the JavaScript sample.

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\stackoverflow.PNG)

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\line51.PNG)

This is a demonstration of a common obfuscation tactic - introducing redundant data. Line 6 declares a variable ```VbfwCF``` to be equal to a random string ```dCXmzN```. If we count the number of instances of ```VbfwCF``` in the code, there is only a single instance - this variable is not used at all throughout the script’s execution. This can be removed without affecting the code's functionality.

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\instances.PNG)

The malware developers took this technique a step further by adding legitimate JavaScript code from StackOverflow in a string, serving to confuse any poor analysts and automated tools even further.

We can safely remove all redundant lines from the script.

The first line introduces a function on strings called ```important```. The function definition contains an expression ```(1024-768)*0``` which clearly evaluates to ```0```.  Given a string, ```important``` will return ```charAt(0) ``` - the first character of the string. ```charAt()``` is a string function which [returns the UTF-16 code unit at the given index](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt). Using the find and replace function on the text editor, we can replace every call of ```important()``` with ```charAt(0)```, and remove the first line. The malware developers used this function to add more confusion and redundancy to the code.

Next, we notice the usage of the obscure [comma operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_operator), which evaluates each of its operands from left to right, and returns the value of the last operand. The comma operator is commonly coupled with string concatenation, denoted by ```+```. This can be seen in lines 1, 3 and 4 below.

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\comma.PNG)

Since all operands are strings, there is nothing to evaluate - only the final value will be used at runtime. For instance, in line 3 in the first expression before the ```+``` operator, the only string that will remain is ```pPArPzIgCf```. Many of the other expressions within the comma operator are random words which add nothing to the code but confusion. Interestingly, many of the random words are the names of countries and cities - the malware developer must have been looking at a map. If we evaluate all the comma, concatenation, and ```.charAt(0)``` operations, we get a much clearer picture of the code:

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\strings.PNG)

There are a few string and array operations at play here, further obfuscating the true strings. These are shown above underlined in red. The string and array operations being executed are:
* ```STRING.replace(str1, str2)``` - replaces all instances of ```str1``` with ```str2``` in ```STRING``` ([reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace))
* ```ARRAY.shift()``` - removes the first item from the array and returns it ([reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift))
* ```ARRAY.pop()``` - removes the last item from the array and returns it ([reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop))
* ```STRING.split(str1)``` - takes a pattern and divides this string into an ordered list of substrings by searching for the pattern, puts these substrings into an array, and returns the array ([reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split))
* ```ARRAY.join(str1)``` -  creates and returns a new string by concatenating all of the elements in the array, separated by commas or a specified separator string ([reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join))

These operations add more redundancy to the code, and make it difficult for an automated tool to detect specific strings. These types of expressions can easily be evaluated.

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\removed_str.PNG)

The malware developer has made the execution structure more complex with useless variables and arrays. For instance, the variables ```refine```, ```unexpecteds``` and ```classmatee``` are single characters. Using the find and replace function of the text editor, we can replace all instances of these variables with their values.

The array ```EMwIiLQm``` defined on line 1 is repeatedly used in conjunction with ```shift()``` and ```pop()``` to extract out different strings. We can replace all instances of ```EMwIiLQm``` and ```shift()```/```pop()``` operations with their actual values.

Furthermore, on line 22 the malware developer has used another numerical expression, which just evaluates to ```1```.  There is also a bogus control flow expression on line 27, which always evaluates to ```False```, or ```0```.

An interesting technique to note is used on line 15 - a ```split()```/```join()``` operation pair is used to changed the string ```.txt``` to ```.exe```. This is a clever way of evading tools or analysts specifically searching for executable files.

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\control_flow.PNG)

Now that the code is cleaned up a little, we can clearly see the control flow and general structure of the script. The script contains a function ```hermes()```, taking in two parameters ```automobile``` and ```average```. This function is called with a URL to ```hXXX://cheapairticketindia(.)net``` and a string ```CGvMIoL```. We can replace these non-descriptive names with their values.

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\vars.PNG)

The final step is to rename some of the variables with more descriptive names, to give us a better feel of the purpose of this script.
* We see that ```qsBoGjnAF``` is some sort of ActiveXObject, so we will call it ```ActiveXObject```
* ```EWqJMnTg``` is a shell script, so we call it ```shellScript```.
* ```EBfoDea``` is an XMLHTTP object, so we call it ```HTTPObject```
* ```kXgxSCcbB``` is an ActiveX stream, so we call it ```stream```

![alt text](\assets\img\cybersecurity\deobfuscating-javascript-2\final.PNG)

Now the script is fully deobfuscated, we can see exactly what it does. It looks a lot less intimidating than the original, right? This script creates an XMLHTTP object, and uses that to download an executable from ```hXXX://cheapairticketindia(.)net```, using an HTTP GET request. Once this is successfully downloaded (HTTP status code ```200``` is received), the script is written to the ```TEMP``` directory, and executed with a shell object. The executable that is downloaded is none other than the Locky Ransomware. 

### List of External Links

[General Principles of Code Obfuscation](https://cybermouse.xyz/cybersecurity/code-obfuscation)

[JavaScript Eeobfuscation](https://cybermouse.xyz/cybersecurity/deobfuscating-javascript-1)

[Locky Ransomware](https://en.wikipedia.org/wiki/Locky)

[VirusTotal - Locky Ransomware](https://www.virustotal.com/gui/file/03f6ab1b482eac4acfb793c3e8d0656d7c33cddb5fc38416019d526f43577761/detection)

[StackOverflow Thread](https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery)

[JavaScript charAt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt)

[JavaScript Comma Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_operator)

[JavaScript replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace))

[JavaScript shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)

[JavaScript pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)

[JavaScript split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)

[JavaScript join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
