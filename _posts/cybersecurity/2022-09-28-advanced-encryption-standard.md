---
layout: post
title: "Advanced Encryption Standard"
author: "Mouse"
categories: cybersecurity
tags: [cybersecurity, cryptography, computer-science, algebra]
image: aes.jpg
permalink: /cybersecurity/aes
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

XOR is an easily invertible Boolean operation. If you want to learn more about the XOR function and its algebraic structure, check out my [previous post on the XOR function](https://cybermouse.xyz/maths/xor-through-algebra). As discussed in the AES overview, __AddRoundKey__ will occur once at the start of the algorithm, and then at the end of each round. Below is a Python implementation of the __AddRoundKey__ operation.

{% highlight python %}
## XORs each component in s matrix with k matrix, stores in s
def add_round_key(s, k):
    for i in range(len(s)):
        for j in range(len(s[i])):
            s[i][j] = s[i][j] ^ k[i][j]

    return s
{% endhighlight %}

As described above, this code will take in a state matrix ```s``` and a key matrix ```k```, perform the XOR operation component-wise, and store the result back in the state matrix ```s```.


#### SubBytes

The __SubBytes__ operation involves substituting each byte in the current state with its corresponding byte in a lookup table known as an S-box, or substitution box. The S-box used in each round of AES is given below.

![alt text](\assets\img\compsci\aes\sbox.PNG)

To use the S-box, the value of each byte in the state is used as an index for S-box. For example, the byte ```c5``` corresponds to the 12th row and 5th column - the value ```a6```. Below is a Python implementation of the __SubBytes__ operation.

{% highlight python %}
## Substitutes values in the state matrix with corresponding s-box values
def sub_bytes(s, sbox):
    for i in range(len(s)):
        for j in range(len(s[i])):
	## Get index to lookup in s-box
            index = s[i][j]
	## Make substitution
            s[i][j] = sbox[index]

    return s
{% endhighlight %}

The above code will iterate through the state matrix, use the value of the state matrix as an index, lookup the corresponding value in the S-box, before substituting the value in the state matrix. The new state matrix ```s``` is then returned.


#### S-Boxes

If you are like me, you are probably wondering where these strange numbers come from. These values have been calculated by the creators of AES, Joan Daemen and Vincent Rijmen. They are carefully chosen to ensure the security of AES. Different values could result in the weakening of AES.

>However, some sceptics believe that the creators, or the NSA, have left a backdoor in these values, so choose to use their own S-boxes.

So where do these values come from? When Claude Shannon published his revolutionary paper in 1945, [A Mathematical Theory of Cryptography](https://www.iacr.org/museum/shannon/shannon45.pdf), he defined properties of a secure cryptographic cipher. One of these properties is _confusion_. The confusion property essentially states that the relationship between ciphertext and the key should be as complex as possible. Given the ciphertext, an attacker should not be able to determine anything about the key.

To take an example, consider a Caesar Cipher. If you are unfamiliar, a Caesar Cipher shifts each letter of the alphabet by a shift amount, which is the secret key. For example, if the secret key is ```3```, and the plaintext is ```no one told you when to run, you missed the starting gun```, the ciphertext will be ```qr rqh wrog brx zkhq wr uxq, brx plvvhg wkh vwduwlqj jxq```. Caesar Ciphers are notoriously weak, and have low confusion - we have ```ciphertext = plaintext + key```, a simple relation.

Taking a slightly more complicated example, a complicated-looking polynomial equation such as $$321x^4 + 123x^3 - 879x^2 - 9791x + 7$$ can be solved via a formula. However, for degree 5 and higher polynomials, there is no formula involving addition, subtraction, multiplication, division and nth roots to find the solutions - there is no solution by radicals. This is the Abel-Ruffini Theorem, and one of the main topics of Galois Theory. This means that higher-order polynomials have a higher level of confusion when used in cryptographic ciphers.

The S-box of AES aims to substitute values in such a way that is resistant to attacks with linear functions, unlike the Caesar Cipher example. The S-box values for AES are calculated from taking the modular inverse of the Galois Field $$GF(2^8)$$, and then applying an affine transformation for some extra non-linearity. In the future, I plan on doing an article series on Galois Fields. [This article](https://www.johndcook.com/blog/2019/05/25/aes-s-box/) goes more in depth into the calculation of the AES S-box, and [this article](https://www.samiam.org/galois.html) gives an overview of the Galois Field used in AES.

#### Diffusion

The other property that Shannon proposed in his 1945 paper is _diffusion_. This principle states that a cipher should disperse a part of the input across every part of the output. As Shannon puts it
>The effect here is that the enemy must intercept a tremendous amount of material to tie down this structure, since the structure is evident only in blocks of very small individual probability.

If we didn’t have a diffusion property, if a byte is in the same position in the state it would have the same transformations applied to it each round. The state should be scrambled up so that each substitution affects all bytes in the state. Diffusion helps to achieve the [avalanche effect](https://en.wikipedia.org/wiki/Avalanche_effect), a property of cryptographic systems stating that if the input is changed slightly, the output varies dramatically. The __ShiftRows__ and __MixColumns__ operations in AES are designed to introduce diffusion to the system.

#### ShiftRows

The next operation in each AES round is __ShiftRows__. The state matrix is transformed as follows:
* The first row is kept the same.
* The second row is shifted one column to the left.
* The third row is shifted two columns to the left.
* Finally, the fourth row is shifted three columns to the left.

In each shift, the left-most bytes wrap around back to the right. This step ensures that columns are not encrypted independently of each other, ensuring the encryption is not carried out on a column alone. If this were to occur, a cryptanalyst could analyse each column separately.

The below diagram encapsulates the __ShiftRows__ operation.

![alt text](\assets\img\compsci\aes\shiftrows.png)

Below is a Python implementation of the __ShiftRows__ operation, and its inverse function.

{% highlight python %}
## Performs ShiftRows operation
def shift_rows(s):
    s[0][1], s[1][1], s[2][1], s[3][1] = s[1][1], s[2][1], s[3][1], s[0][1]
    s[0][2], s[1][2], s[2][2], s[3][2] = s[2][2], s[3][2], s[0][2], s[1][2]
    s[0][3], s[1][3], s[2][3], s[3][3] = s[3][3], s[0][3], s[1][3], s[2][3]

    return s

## Reverses ShiftRows operation
def inv_shift_rows(s):
    s[1][1], s[2][1], s[3][1], s[0][1] = s[0][1], s[1][1], s[2][1], s[3][1]
    s[2][2], s[3][2], s[0][2], s[1][2] = s[0][2], s[1][2], s[2][2], s[3][2]
    s[3][3], s[0][3], s[1][3], s[2][3] = s[0][3], s[1][3], s[2][3], s[3][3]

    return s
{% endhighlight %}

The ```shift_rows()``` function performs the operation as described above, and the ```inv_shift_rows()``` function reverses the operation.

#### MixColumns

The __MixColumns__ operation is more complex. It also has the desired diffusion effect described by Shannon - it further scrambles up the state matrix in a reversible manner. __MixColumns__, as the name helpfully suggests, transforms the columns of the state matrix. This is best understood as matrix multiplication by a vector, where the vector is each column of the state matrix, and the matrix has carefully calculated predetermined values.

The matrix multiplication occurs in Rijndael's Galois Field $$GF(2^8)$$, and the matrix used is shown below. It is multiplied by each column in the state matrix. For more details on this operation, see [this Wikipedia page](https://en.wikipedia.org/wiki/Rijndael_MixColumns) and [this article](https://www.samiam.org/mix-column.html).

$$
\begin{bmatrix}
02 & 03 & 01 & 01 \\
01 & 02 & 03 & 01 \\
01 & 01 & 02 & 03 \\
03 & 01 & 01 & 02 \\
\end{bmatrix}
$$

Below is the Python implementation of the __MixColumns__ operation. This implementation is taken from the textbook linked above, [The Design of Rijndael](https://cs.ru.nl/~joan/papers/JDA_VRI_Rijndael_2002.pdf).

{% highlight python %}
## Helper variable to compute and store the pre-determined values
xtime = lambda a: (((a << 1) ^ 0x1B) & 0xFF) if (a & 0x80) else (a << 1)

## Perform MixColumns on single column
def mix_single_column(a):
    # Sec 4.1.2 in The Design of Rijndael
    t = a[0] ^ a[1] ^ a[2] ^ a[3]
    u = a[0]
    a[0] ^= t ^ xtime(a[0] ^ a[1])
    a[1] ^= t ^ xtime(a[1] ^ a[2])
    a[2] ^= t ^ xtime(a[2] ^ a[3])
    a[3] ^= t ^ xtime(a[3] ^ u)

## MixColumns operation
def mix_columns(s):
    for i in range(4):
        mix_single_column(s[i])

## Reverse the MixColumns operation
def inv_mix_columns(s):
    # see Sec 4.1.3 in The Design of Rijndael
    for i in range(4):
        u = xtime(xtime(s[i][0] ^ s[i][2]))
        v = xtime(xtime(s[i][1] ^ s[i][3]))
        s[i][0] ^= u
        s[i][1] ^= v
        s[i][2] ^= u
        s[i][3] ^= v

    mix_columns(s)
{% endhighlight %}

This code snippet has four main components. The first line will compute the pre-determined values used in the __MixColumns__ operation. The function ```mix_single_column()``` takes in a single column of the state matrix and transform it. This is equivalent to the matrix multiplication discussed above, but uses the implementaton discussed in the textbook. The next function ```mix_columns()``` simply iterates through each column in the state matrix, and runs ```mix_single_column()``` on it. The final function ```inv_mix_columns()``` reverses the operation.

### Conclusion
We have now seen the entire AES algorithm in all its glory. We have seen how each operation introduces confusion, diffusion, and ensures non-linearity. The place where implementations can vary is the mode of operation used to operate on multiple blocks of data, as discussed at the start. AES uses many components, but it is not difficult for anyone to implement the core of the algorithm.

### List of External Links

[Block cipher modes of operation](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)

[DES algorithm](https://page.math.tu-berlin.de/~kant/teaching/hess/krypto-ws2006/des.htm)

[Methods of breaking DES](https://lasec.epfl.ch/memo/memo_des.shtml)

[Group-theoretic look at XOR](https://cybermouse.xyz/maths/xor-through-algebra)

[A Mathematical Theory of Cryptography by Claude Shannon](https://www.iacr.org/museum/shannon/shannon45.pdf)

[AES S-Boxes](https://www.johndcook.com/blog/2019/05/25/aes-s-box/)

[AES Galois Field](https://www.samiam.org/galois.html)

[Avalanche effect](https://en.wikipedia.org/wiki/Avalanche_effect)

[MixColumns Wikipedia page](https://en.wikipedia.org/wiki/Rijndael_MixColumns)

[MixColumns description](https://www.samiam.org/mix-column.html)

[Design of Rijndael](https://cs.ru.nl/~joan/papers/JDA_VRI_Rijndael_2002.pdf)
