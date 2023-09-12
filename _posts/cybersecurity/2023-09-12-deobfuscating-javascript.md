---
layout: post
title: "Deobfuscating JavaScript"
author: "Mouse"
categories: cybersecurity
tags: [cybersecurity, programming, malware, reverse-engineering]
image: javascript_deobfuscation.png
permalink: /cybersecurity/deobfuscating_javascript
---
### Introduction
Code obfuscation is the process of deliberately writing code in a way that makes it difficult to understand and read, to ensure that it cannot be reverse-engineered or modified. Some basic techniques include making the code structure more complex with redundant code, and making code less human-readable by renaming variables and functions to random character strings. There are multiple reasons for doing this - both innocent and malicious. Code obfuscation can be used to protect a company’s intellectual property, but is also used by malware developers to evade detection. For more on the general principles of code obfuscation, see [my previous article](https://cybermouse.xyz/cybersecurity/code-obfuscation) on it.

JavaScript is a scripting language used to implement dynamic and interactive elements to web pages, and it is widespread across the web. JavaScript can either be embedded into an HTML file:

{% highlight html %}
<script>
… JavaScript code …
</script>
{% endhighlight %}

Or externally linked to an HTML file:

{% highlight html %}
<script src=”myScript.js”></script>
{% endhighlight %}

To see some JavaScript obfuscation in practice, there are many available online tools. [This tool](https://obfuscator.io/) can be used to efficiently obfuscate JavaScript, and allows the user to fiddle with various obfuscation settings. As an example, consider the basic JavaScript code below:

{% highlight js %}
function test() {
console.log("This is my un-obfuscated JavaScript");
}
test();
{% endhighlight %}

Running this in the Chrome Developer Console, we see it works as intended:

![alt text](\assets\img\compsci\aes\unobf_js.PNG)

Running this through the above JavaScript obfuscation tool, we get the following mess:
{% highlight js %}
function _0x53f6(_0x35ae1c,_0x119451){var _0x78b51=_0x78b5();return _0x53f6=function(_0x53f6e9,_0xc3e4ce){_0x53f6e9=_0x53f6e9-0x179;var _0x46b39e=_0x78b51[_0x53f6e9];return _0x46b39e;},_0x53f6(_0x35ae1c,_0x119451);}(function(_0x25d61e,_0x4468f8){var _0x2b3737=_0x53f6,_0x48c6ba=_0x25d61e();while(!![]){try{var _0x1f6b76=parseInt(_0x2b3737(0x179))/0x1+-parseInt(_0x2b3737(0x17f))/0x2*(-parseInt(_0x2b3737(0x183))/0x3)+parseInt(_0x2b3737(0x17b))/0x4*(parseInt(_0x2b3737(0x17d))/0x5)+-parseInt(_0x2b3737(0x17a))/0x6+parseInt(_0x2b3737(0x182))/0x7+parseInt(_0x2b3737(0x17c))/0x8+-parseInt(_0x2b3737(0x181))/0x9;if(_0x1f6b76===_0x4468f8)break;else _0x48c6ba['push'](_0x48c6ba['shift']());}catch(_0x148b78){_0x48c6ba['push'](_0x48c6ba['shift']());}}}(_0x78b5,0x59f6f));function test(){var _0x3dd5d6=_0x53f6;console[_0x3dd5d6(0x180)](_0x3dd5d6(0x17e));}test();function _0x78b5(){var _0x1d8bf4=['180445CnSQNc','3749454aOPpcw','196276vGYEAo','412816ySjJIx','60zuxpCv','This\x20is\x20my\x20un-obfuscated\x20JavaScript','236820pLhJeO','log','957555BXNqhK','1123598pLqsdW','3PKFeel'];_0x78b5=function(){return _0x1d8bf4;};return _0x78b5();}
{% endhighlight %}

Running this on the console, we get the exact same output:

![alt text](\assets\img\compsci\aes\obf_js.PNG)

To most people, even experienced programmers, this code is incomprehensible. After looking at it carefully we see the encoded text, but only after a jumble of garbage code.

This article will focus on ways of deobfuscating JavaScript code. Code deobfuscation is an important skill in code analysis and reverse engineering. Security researchers will often come across malware that uses obfuscated JavaScript to deliver a malicious payload - the ability to understand and reverse this code is of paramount importance to understanding the malware.
