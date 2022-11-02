---
layout: post
title: "Generating Prime Numbers"
author: "Mouse"
categories: maths
tags: [number-theory, maths]
image: generating_primes.jpg
permalink: /maths/generating-prime-numbers
---

### Introduction
Prime numbers have eluded mathematicians for millennia. They seem to follow no distribution, and it is commonly believed that there is no formula for generating prime numbers. In fact, our lack of understanding of the primes is the backbone of modern cryptography - large prime numbers are needed for many cryptographic hash functions and encryption methods. The lack of an _efficient_ algorithm to factor large numbers into their prime factors guarantees the security of algorithms such as RSA encryption.

After thousands of years of mathematical advances, can we really still not generate prime numbers?

This is not strictly true - __we can generate prime numbers using closed form formulae__. The primary issue faced with these algorithms is their efficiency. The formula that I present below suffers this fate. It is a beautiful formula involving some elegant pieces of mathematics, but the most powerful modern supercomputers are not yet fast enough to compute large primes. Nevertheless, the mere existance of this formula is interesting enough to warrent some further investigation (if you're enough of a maths nerd).

The aforementioned magic formula is stated below, in all its glory.

The $$nth$$ prime $$= 1 + \sum_{i=1}^{2^n} {\lfloor ({\frac{n}{\sum_{j=1}^{i} {\lfloor {\cos ^2(\pi * \frac{(j-1)!+1}{j})} \rfloor}})^{\frac{1}{n}} \rfloor}$$

There is quite a lot to unpack here. At first glance, it would seem that this strange sum has nothing to do with primes. We will investigate this formula from the inside out, starting at that strange argument to the cosine function.

### Wilson's Theorem
h
