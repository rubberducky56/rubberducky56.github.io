---
layout: post
title: "Deobfuscating JavaScript"
author: "Mouse"
categories: cybersecurity
tags: [cybersecurity, programming, malware, reverse-engineering]
image: javascript_deobfuscation.png
permalink: /cybersecurity/deobfuscating-javascript
---
### Introduction
Code obfuscation is the process of deliberately writing code in a way that makes it difficult to understand and read, to ensure that it cannot be reverse-engineered or modified. Some basic techniques include making the code structure more complex with redundant code, and making code less human-readable by renaming variables and functions to random character strings. There are multiple reasons for doing this - both innocent and malicious. Code obfuscation can be used to protect a company’s intellectual property, but is also used by malware developers to evade detection. For more on the general principles of code obfuscation, see [my previous article](https://cybermouse.xyz/cybersecurity/code-obfuscation) on it. This article can be considered a “part 2”.

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

![alt text](\assets\img\cybersecurity\js_deobfuscation\unobf_js.PNG)

Running this through the above JavaScript obfuscation tool, we get the following mess:
{% highlight js %}
function _0x53f6(_0x35ae1c,_0x119451){var _0x78b51=_0x78b5();return _0x53f6=function(_0x53f6e9,_0xc3e4ce){_0x53f6e9=_0x53f6e9-0x179;var _0x46b39e=_0x78b51[_0x53f6e9];return _0x46b39e;},_0x53f6(_0x35ae1c,_0x119451);}(function(_0x25d61e,_0x4468f8){var _0x2b3737=_0x53f6,_0x48c6ba=_0x25d61e();while(!![]){try{var _0x1f6b76=parseInt(_0x2b3737(0x179))/0x1+-parseInt(_0x2b3737(0x17f))/0x2*(-parseInt(_0x2b3737(0x183))/0x3)+parseInt(_0x2b3737(0x17b))/0x4*(parseInt(_0x2b3737(0x17d))/0x5)+-parseInt(_0x2b3737(0x17a))/0x6+parseInt(_0x2b3737(0x182))/0x7+parseInt(_0x2b3737(0x17c))/0x8+-parseInt(_0x2b3737(0x181))/0x9;if(_0x1f6b76===_0x4468f8)break;else _0x48c6ba['push'](_0x48c6ba['shift']());}catch(_0x148b78){_0x48c6ba['push'](_0x48c6ba['shift']());}}}(_0x78b5,0x59f6f));function test(){var _0x3dd5d6=_0x53f6;console[_0x3dd5d6(0x180)](_0x3dd5d6(0x17e));}test();function _0x78b5(){var _0x1d8bf4=['180445CnSQNc','3749454aOPpcw','196276vGYEAo','412816ySjJIx','60zuxpCv','This\x20is\x20my\x20un-obfuscated\x20JavaScript','236820pLhJeO','log','957555BXNqhK','1123598pLqsdW','3PKFeel'];_0x78b5=function(){return _0x1d8bf4;};return _0x78b5();}
{% endhighlight %}

Running this on the console, we get the exact same output:

![alt text](\assets\img\cybersecurity\js_deobfuscation\obf_js.PNG)

To most people, even experienced programmers, this code is incomprehensible. After looking at it carefully we see the encoded text, but only after a jumble of garbage code.

>Recently, in March 2023, the Emotet malware was [reverse engineered by Trustwave](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/deobfuscating-the-recent-emotet-epoch-4-macro/) and was found to contain highly-obfuscated code. It contained many random-seeming functions and variable names. When the malware analysts read this code, they found a recognizable macro name, unobfuscated - ```AutoOpen```. This is a reference to the event of opening a document file - so this function was the entry point. The article listed goes further in depth on the obfuscation methods used in this malware.

This article will focus on ways of deobfuscating JavaScript code. Code deobfuscation is an important skill in code analysis and reverse engineering. Security researchers will often come across malware that uses obfuscated JavaScript to deliver a malicious payload - the ability to understand and reverse this code is of paramount importance to understanding the malware.

### JavaScript Obfuscation

In order to deobfuscate JavaScript, we need to know some common methods used for obfuscating it in the first place.

Code minification is a way of reducing the readability of code by compressing it all into a single line. This includes the removal of whitespace, comments, and other unnecessary characters.  Many websites use this technique, so much so that many Browser developer tools include a “beautify” or “pretty print”  feature, which expands minified JavaScript into its full form. [This](https://www.toptal.com/developers/javascript-minifier) is a simple online tool for JavaScript minification.

JavaScript packing is another obfuscation technique. Packers are tools which take in a binary, and transform it using compression, encryption, and anti-debugging tricks to create a smaller file, whilst retaining the original functionality. Packing can be used benignly to help pages load faster and keep web pages more efficiently, but can also be used to obfuscate code for malicious purposes. The same ideas can be used to obfuscate JavaScript. Typically, JavaScript packing has two stages:
1. Transforming the code into a new reduced form, hardcoded into the output
2. Introducing some helper code which will unpack and evaluate the original code

The simplest way to pack JavaScript is by using the built-in ```eval(unescape())``` function. The original code is URL-encoded, and used as an argument to ```eval(unescape())```. If we search PublicWWW (a search engine for HTML, CSS and JS snippets on the web) for ```eval(unescape())``` we quickly find [an example in the wild](https://publicwww.com/websites/%22eval%28unescape%28%22/).

![alt text](\assets\img\cybersecurity\js_deobfuscation\publicwww.PNG)

The second result shows a positive result on the [OSHA (the USA’s Occupational Safety and Health Administration) website](https://www.osha.gov/).

![alt text](\assets\img\cybersecurity\js_deobfuscation\osha.PNG)

From line 110, we see the ```eval(unescape())``` method in use. If we URL-decode the first few lines of this code:

```
eval%28function%28p%2Ca%2Cc%2Ck%2Ce%2Cr%29%7Be%3D
function%28c%29%7Breturn%28c%3Ca%3F%27%27%3Ae%28parseInt%28c/a%29%29%29
+%28%28c%3Dc%25a%29%3E35%3FString.fromCharCode%28c+29%29%3Ac.
```

we get:

{% highlight js %}
eval(function(p,a,c,k,e,r){e=
function(c){return(c<a?'':e(parseInt(c/a)))
+((c=c%a)>35?String.fromCharCode(c+29):c
{% endhighlight %}

We see that this was just one layer of packing - another packer program has been used on this software. The inner packer has also used the ```eval()``` function. The variables ```p```, ```a```, ```c```, ```k```, ```e``` and ```r``` are being used as pointers to other functions or variables in the code, but these undescriptive names hide their true purpose. These pointers are used by the interpreter to rebuild the original code. The line ```eval(function(p,a,c,k,e,r))``` is typical of packed JavaScript code.

>Note that the [```eval()``` function](https://www.w3schools.com/jsref/jsref_eval.asp) should never be used in JavaScript, as it is a [known security risk](https://www.codiga.io/blog/javascript-eval-best-practices/). If ```eval()``` is used, there is likely some obfuscation going on.

[Research by Or Katz](https://www.darkreading.com/application-security/javascript-packing-found-in-more-than-25-of-malicious-sites) of Akami in 2021 showed that 26% of malicious websites use some form of JavaScript packing. His full talk can be found [here](https://www.youtube.com/watch?v=NYTgXB9o0Gs&ab_channel=OWASPFoundation). For more on JavaScript packing, see [this blog post](https://www.trickster.dev/post/javascript-obfuscation-techniques-by-example/) by rl1987.



### List of External Links

[My Code Obfuscation Article](https://cybermouse.xyz/cybersecurity/code-obfuscation)

[Online JavaScript Obfuscation Tool](https://obfuscator.io/)

[Emotet Reverse Engineering](https://www.trustwave.com/en-us/resources/blogs/spiderlabs-blog/deobfuscating-the-recent-emotet-epoch-4-macro/)
[JavaScript Minification](https://www.toptal.com/developers/javascript-minifier)

[PublicWWW Results for eval(unescape())](https://publicwww.com/websites/%22eval%28unescape%28%22/)

[OSHA Homepage](https://www.osha.gov/)

[JavaScript eval() Function](https://www.w3schools.com/jsref/jsref_eval.asp)

[JavaScript eval() Best Practices](https://www.codiga.io/blog/javascript-eval-best-practices/)

[Prevalence of JavaScript Packing](https://www.darkreading.com/application-security/javascript-packing-found-in-more-than-25-of-malicious-sites)

[Talk on JavaScript Packing by Or Katz](https://www.youtube.com/watch?v=NYTgXB9o0Gs&ab_channel=OWASPFoundation)

[JavaScript Packing](https://www.trickster.dev/post/javascript-obfuscation-techniques-by-example/)
