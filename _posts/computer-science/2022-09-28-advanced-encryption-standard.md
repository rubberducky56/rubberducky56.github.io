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

As an example, the phrase ```incoming troops!``` can be represented as the byte array ```105 110 99 111 109 105 110 103 32 116 114 111 111 112 115 33```, using the text’s ASCII representation. The ```bytes2matrix()``` function above will convert this to the matrix:

$$ \begin{bmatrix}105 & 110 & 99 & 111 \\ 109 & 105 & 110 & 103 \\ 32 & 116 & 114 & 111 \\ 111 & 112 & 115 & 32\end{bmatrix} $$

The ```matrix2bytes()``` function would convert this back to the text ```incoming troops!```.

Throughout AES, various rounds of operations are applied to the byte matrix. At each stage, the current state of the matrix is referred to as the ‘state matrix’.
1. The first step of AES is the Key Schedule, or __KeyExpansion__ This step derives 11 separate ‘round keys’ from the original 128 bit key. These round keys will be used in later steps.
2. __AddRoundKey__ operation - the first round key is XORed with the state.
3. This phase occurs ten times. The first nine are the same, and the final round is slightly different. This is where the main operations of AES occur.
  * __SubBytes__ operation - each byte in the state is substituted using a lookup table, the S-box. The S-Box is also used in the key schedule.
  * __ShiftRows__ operation - the rows of the state matrix are shifted to the right
  * __MixColumns__ operation - a mathematical function transforms each column of the state. This stage is skipped in the tenth round/
  * __AddRoundKey__ operation - the current round key is XORed with the state

The AES algorithm can be summarised in the below diagram.

![alt text](\assets\img\compsci\aes\aes.png)

To decrypt AES-encrypted data, we simply compute the encryption function in reverse order - __AddRoundKey__ __MixColumns__ __ShiftRows__ __SubBytes__ It is worth noting that the only step that actually uses the key is the __AddRoundKey__ operation. All other operations are simply shifts, substitutions and other mathematical functions.

#### Key Expansion

The supplied key will be a (hopefully) random sequence of 128 bits. However, this needs to be expanded to 11 other round keys, derived from the original. AES includes a mechanism for doing so, called the key schedule. The below diagram summarises the key schedule.

![alt text](\assets\img\compsci\aes\key_schedule.png)

The key is first split into four columns of four bytes each. In the diagram, these are the top four columns. The fourth column is transformed by three operations - __RotWord__ __SubWord__ and __Rcon__

* __RotWord__ rotates the bytes. This is accomplished by shifting each byte down one space, and putting the bottom byte to the top.
* The __SubWord__ operation consists of substituting bytes using the S-box. This will be detailed in the SubBytes section.
* The __Rcon__ operation, or Round Constant, consists of XORing the column to a predefined column corresponding to the current round. When using a 128-bit key, these columns are

$$\begin{bmatrix}
01 \\
00 \\
00 \\
00 \\
\end{bmatrix}
\begin{bmatrix}
02 \\
00 \\
00 \\
00 \\
\end{bmatrix}
\begin{bmatrix}
04 \\
00 \\
00 \\
00 \\
\end{bmatrix}
\begin{bmatrix}
08 \\
00 \\
00 \\
00 \\
\end{bmatrix}
\begin{bmatrix}
10 \\
00 \\
00 \\
00 \\
\end{bmatrix}
\begin{bmatrix}
20 \\
00 \\
00 \\
00 \\
\end{bmatrix}
\begin{bmatrix}
40 \\
00 \\
00 \\
00 \\
\end{bmatrix}
\begin{bmatrix}
80 \\
00 \\
00 \\
00 \\
\end{bmatrix}
\begin{bmatrix}
1b \\
00 \\
00 \\
00 \\
\end{bmatrix}
\begin{bmatrix}
36 \\
00 \\
00 \\
00 \\
\end{bmatrix}$$

After these transformations have occurred on the fourth column, the next round key is derived as follows:
* _Column 1_ - XOR the transformed column to the first column of the previous round key
* _Column 2_ - XOR the new first column with the second column of the previous round key
* _Column 3_ - XOR the new second column with the third column of the previous round key
* _Column 4_ - XOR the new third column with the fourth column of the previous round key.

After this algorithm, we will have a new round key. This process is iterated 10 times, yielding 11 keys. The original key is used as the first round key. The process of key expansion allows the AES algorithm to get some extra mileage out of the input key.

#### AddRoundKey

This step is fairly straightforward. It consists of using the XOR operation on the current state and the current round key. Note that the operation is component-wise - each component of the state matrix is XORed with the corresponding component of the round key matrix.

![alt text](\assets\img\compsci\aes\AddRoundKey.png)

XOR is an easily invertible Boolean operation. If you want to learn more about the XOR function and its algebraic structure, check out my [previous post on the XOR function](https://cybermouse.xyz/maths/xor-through-algebra). As discussed in the AES overview, __AddRoundKey__ will occur once at the start of the algorithm, and then at the end of each round.

#### SubBytes

The __SubBytes__ operation involves substituting each byte in the current state with its corresponding byte in a lookup table known as an S-box, or substitution box. The S-box used in each round of AES is given below.

![alt text](\assets\img\compsci\aes\sbox.PNG)

To use the S-box, the value of each byte in the state is used as an index for S-box. For example, the byte ```c5``` corresponds to the 12th row and 5th column - the value ```a6```.

#### Where Does the S-Box Come From?

If you are like me, you are probably wondering where these strange numbers come from. These values have been calculated by the creators of AES, Joan Daemen and Vincent Rijmen. They are carefully chosen to ensure the security of AES. Different values could result in the weakening of AES.

>However, some sceptics believe that the creators, or the NSA, have left a backdoor in these values, so choose to use their own S-boxes.

So where do these values come from? When Claude Shannon published his revolutionary paper in 1945, [A Mathematical Theory of Cryptography](https://www.iacr.org/museum/shannon/shannon45.pdf), he defined properties of a secure cryptographic cipher. One of these properties is ‘confusion’. The confusion property essentially states that the relationship between ciphertext and the key should be as complex as possible. Given the ciphertext, an attacker should not be able to determine anything about the key.

To take an example, consider a Caesar Cipher. If you are unfamiliar, a Caesar Cipher shifts each letter of the alphabet by a shift amount, which is the secret key. For example, if the secret key is ```3```, and the plaintext is ```no one told you when to run, you missed the starting gun```, the ciphertext will be ```qr rqh wrog brx zkhq wr uxq, brx plvvhg wkh vwduwlqj jxq```. Caesar Ciphers are notoriously weak, and have low confusion - we have ```ciphertext = plaintext + key```, a simple relation.

Taking a slightly more complicated example, a complicated-looking polynomial equation such as $$321x^4 + 123x^3 - 879x^2 - 9791x + 7$$ can be solved via a formula. However, for degree 5 and higher polynomials, there is no formula involving addition, subtraction, multiplication, division and nth roots to find the solutions - there is no solution by radicals. This is the Abel-Ruffini Theorem, and one of the main topics of Galois Theory. This means that higher-order polynomials have a higher level of confusion when used in cryptographic ciphers.

The S-box of AES aims to substitute values in such a way that is resistant to attacks with linear functions, unlike the Caesar Cipher example. The S-box values for AES are calculated from taking the modular inverse of the Galois Field $$2^8$$, and then applying an affine transformation for some extra non-linearity. In the future, I plan on doing an article series on Galois Fields. [This article](https://www.johndcook.com/blog/2019/05/25/aes-s-box/) goes more in depth into the calculation of the AES S-box, and [this article](https://www.samiam.org/galois.html) gives an overview of the Galois Field used in AES.
