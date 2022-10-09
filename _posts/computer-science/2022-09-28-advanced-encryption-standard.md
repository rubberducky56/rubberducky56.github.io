---
layout: post
title: "Advanced Encryption Standard"
author: "Mouse"
categories: computer-science
tags: [cybersecurity, cryptography, computer-science, algebra]
image: aes.jpg
permalink: /computer-science/aes
---

### What is AES?
AES, or Advanced Encryption Standard, is one of the most widely used symmetric-key ciphers. It is so widespread that some processors have special instruction sets built in that can perform AES encryption. Intel’s Skylake processors and AMD’s Zen processors are two examples of processors that support AES instruction sets.

AES is a symmetric-key block cipher. A symmetric-key cipher is a cryptographic algorithm that uses the same secret key to both encrypt and decrypt. In a block cipher, plaintext is broken up into blocks of a fixed length, and each block is encrypted and decrypted separately.

Not all implementations of AES are equal. Since AES is a block cipher, it requires specifying a mode of operation. This will describe how to apply each single-block operation repeatedly to amounts of data larger than a single block. There are many modes of operation out there, some more secure than others. [this Wikipedia page](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation) contains information on many modes of operation.

This article will take a deeper dive into the Advanced Encryption Standard.

### A Brief History

Back in 1974, the National Bureau of Standards (NBS, which would later become NIST) in the USA issued a public request for a new cryptosystem to create a new data security standard. A researcher at IBM, Horst Feistel, published the Lucifer algorithm - a block cipher. The NBS liked this submission, so went forward with it. Three years later in 1977, after a series of secret meetings between the NBS and NSA where the algorithm was modified and allowed for public evaluation, the Data Encryption Standard (DES) was born, and published as a standard.

>Interestingly, one of the changes proposed by the NSA was reducing the key size from $$64$$ bits to $$56$$. The NSA suggested that the final eight bits be used as parity bits, for error correction. It is worth noting that this reduces the cost of an exhaustive brute force search by a factor of $$ 2^8 = 256 $$. Perhaps this gave the NSA supercomputers a backdoor into cracking DES…

The US government mandated that DES be used for all unclassified US government applications and all financial transactions, and to be used on a case-by-case basis for classified documents. It also became the de-facto standard in the business and commercial sector - people wanted their corporate secrets to be as secure as the US government’s secrets. DES seemed to be secure - brute forcing the cipher required searching through $$2^56$$ different keys, which was considered impossible back in 1977. For more on how DES works, [this paper](https://page.math.tu-berlin.de/~kant/teaching/hess/krypto-ws2006/des.htm) gives a detailed explanation of its inner workings.

Traditionally, cryptography has been a secret science - up until the late 20th century, government agencies would not release cryptographic algorithms for public usage. It was only in the late 20th century that the cryptography used by the German and Japanese armies in the second world war was released to the public. DES sought to break the public barrier to cryptography - anyone with a computer was able to implement their own version of DES, and be as secure as the US government.

However, by the 1990s, things were not so hot for DES. In 1994, a researcher from Carleton University, Michael J. Weiner, published a paper demonstrating how to build a DES-cracking machine for about $1 million that could expect to find a DES key in 3.5 hours. This opened the floodgates for more and more methods of breaking the US government’s secure cryptosystem. [This article](https://lasec.epfl.ch/memo/memo_des.shtml) gives six different methods for breaking DES. A new cryptosystem was desperately needed.

NIST issued a public request for a new cryptosystem. By 1998, NIST had received about 15 different proposals. The Rijndael algorithm was chosen as the winner, and became the new AES, or Advanced Encryption Standard. Rijndael is an algorithm created by two Belgian researchers - John Daemen and Vincent Rijmen - and the name is a combination of their last names.

AES proved to be more secure than the outdated DES, and emphasizes hardware and software implementations. On May 26th 2002, AES became the US government standard for secure communications, and was approved by the NSA for top secret information. The rest of this article will go more in depth into the cryptographic methods used by AES.

### Algorithm Overview

It is assumed that the plaintext has already been encoded into a list of bytes through an encoding scheme. This means that the algorithm doesn’t care if the plaintext is just text, images, video, or any other form of data. This algorithm description will be for ```AES-128``` - AES using ```128-bit``` keys.

Before AES can begin, the plaintext must be broken down into blocks. Each block will contain 16 bytes, or 128 bits. These are represented in a ```4x4``` matrix of bytes. This can be simply implemented in Python, as shown below.

{% highlight python %}
## Converts a 16 byte array into a 4x4 matrix

def bytes2matrix(text):
    ## Returns matrix of bytes
    return [list(text[i:i+4]) for i in range(0, len(text), 4)]

## Converts a 4x4 matrix into a 16 byte array
def matrix2bytes(matrix):
    arr = []
    for i in matrix:
        for j in i:
            arr.append(j)

    ## Returns ASCII value of bytes matrix
    return ''.join(map(chr, arr))
{% endhighlight %}

The above code has two functions. The first function takes in an array of 16 bytes, and converts this into a ```4x4``` matrix. The second function takes in a ```4x4``` matrix of bytes, converts this to an array of bytes, and converts this to the byte array’s ASCII representation.

As an example, the phrase ```incoming troops!``` can be represented as the byte array ```105 110 99 111 109 105 110 103 32 116 114 111 111 112 115 33```, using the text’s ASCII representation. The ```bytes2matrix()``` function above will convert this to the matrix
$$ \begin{bmatrix}105 & 110 & 99 & 111 \\ 109 & 105 & 110 & 103 \\ 32 & 116 & 114 & 111 \\ 111 & 112 & 115 & 32\end{bmatrix} $$
The ```matrix2bytes()``` function would convert this back to the text ```incoming troops!```.
