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

This is not strictly true - __we can generate prime numbers using closed form formulae__. The primary issue faced with these algorithms is their efficiency. The formula that I present below suffers this fate. It is a beautiful formula involving some elegant pieces of mathematics, but the most powerful modern supercomputers are not yet fast enough to compute large primes. Nevertheless, the mere existance of this formula is interesting enough to warrent some further investigation (if you're enough of a maths geek).

The aforementioned magic formula, known as Willans’ Formula, is stated below, in all its glory.

The $$n^{th}$$ prime $$= 1 + \sum_{i=1}^{2^n} {\lfloor ({\frac{n}{\sum_{j=1}^{i} {\lfloor {\cos ^2(\pi \frac{(j-1)!+1}{j})} \rfloor}})^{\frac{1}{n}}\rfloor}}$$

There is quite a lot to unpack here. At first glance, it would seem that this strange sum has nothing to do with primes. We will investigate this formula from the inside out, starting at that strange argument to the cosine function.

### Wilson's Theorem

The argument to the cosine function is $$\frac{(j-1)!+1}{j}$$. This strange functorial function is in fact closely linked with the primes. The below table shows some values of this function.

j     | $$\frac{(j-1)!+1}{j}$$  
:---: | :----------:|
1     | 2           |
2     | 1           |
3     | 1           |
4     | 1.75        |
5     | 5           |
6     | 20.1666...  |
7     | 103         |
8     | 630.125     |
9     | 4480.111... |
10    | 36288.1     |
11    | 329891      |

An interesting pattern emerges. We claim that this function spits out an integer for prime values of $$j$$ above $$1$$. This is actually equivalent to [Wilson's Theorem](https://en.wikipedia.org/wiki/Wilson%27s_theorem), which states the following:

>$$p$$ is prime if and only if $$(p-1)! \equiv -1 \pmod p$$

This theorem was actually first discovered by Ibn al-Haytham in around 1000 AD, but in true mathematical fashion John Wilson found this theorem in the 18th century, and he is who we get the name from. Wilson was never able to prove his theorem, and it wasn't until 1771 when Lagrange gifted us a proof. Supposedly, Leibniz knew of this theorem a century before Wilson, but it was never published.

We now prove Wilson's Theorem.

It is known that the the integers modulo a prime, $$\Bbb{Z}_p$$ forms a field. In particular, each non-zero element $$a \in \Bbb{Z}_p^* = \{1,2,...,p-1\}$$ has a unique multiplicative inverse $$a^{-1} \in \Bbb{Z}_p$$, with $$aa^{-1} \equiv -1 \pmod p$$.

We claim that $$a = a^{-1}$$ if and only if $$a=1$$ or $$a=p-1$$. To see this, note that $$a=a^{-1}$$ iff $$1 \equiv aa^{-1} = a^2 \pmod p$$ iff $$a \equiv \pm{1} \pmod p$$ iff $$a=1$$ or $$a=p-1$$.

We then have that all elements in $$\Bbb{Z}_p - \{1, p-1\}$$ not equal to their own inverse have a different inverse in $$\Bbb{Z}_p$$. Consider the calculation of $$(p-1)! = (p-1)(p-2)... * 3 * 2 * 1$$. We can pair off each element that is not $$1$$ or $$p-1$$ with its inverse, so that they multiply to give $$1$$.

We therefore have $$(p-1)! \equiv (p-1) * 1 * 1 * ... * 1 * 1 \equiv -1 \pmod p$$. This proves Wilson's Theorem.

As an example, consider $$p=11$$.
$$(11-1)! = 10 * (7 * 8) * (5 * 9) * (3 * 4) * (2 * 6) * 1$$
$$\equiv 10 * 1 * 1 * 1 * 1 * 1 \pmod {11}$$
$$\equiv -1 \pmod {11}$$.

For more interesting proofs of Wilson's Theorem, [read here](https://empslocal.ex.ac.uk/people/staff/rjchapma/courses/nt13/Wilson.pdf).

We now have a mechanism for testing for primes. This can be summarised as follows:

For $$j \gt 1$$, $$\frac{(j-1)!+1}{j}$$ is

$$\begin{cases}
\text{an integer}, & \text{if $j$ is prime} \\
\text{not an integer}, & \text{if $j$ is not a prime}
\end{cases}$$

We can already begin to see how this formula might actually have something to do with primes.

>It is worth noting that whilst Wilson's Theorem gives a nice method of primality testing, computing $$(p-1)!$$ is computationally difficult. It is far easier to compute $$a^{p-1}$$, and use Fermat's Little Theorem for elementary primality testing.

With modern programming languages, it is trivial to now build a prime number generator using Wilson's Theorem. To find the $$n^{th}$$ prime, we could simply compute values of $$\frac{(j-1)!+1}{j}$$, and count the number of integer results. This can all be acomplished with a simple ```while``` loop and an ```if``` statement. But what if we are stuck on a desert island with no computer, and only a pen and paper? How are we supposed to generate our primes? The beauty of this formula lies in the elementary methods in use.

### What is Cosine Doing?

Now that we have a primality detection mechanism, we need something more mathematically useful to work with than 'an integer' and 'not an integer'. It would be handy if we could encode 'not an integer' as $$0$$, and 'an integer' with $$1$$. This is where our hero, the cosine function, comes into play.

### List of External Links

[Wilson's Theorem](https://en.wikipedia.org/wiki/Wilson%27s_theorem)

[Proofs of Wilson's Theorem](https://empslocal.ex.ac.uk/people/staff/rjchapma/courses/nt13/Wilson.pdf)
