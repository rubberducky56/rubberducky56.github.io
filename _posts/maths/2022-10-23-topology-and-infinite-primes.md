---
layout: post
title: "Topology and Infinite Primes"
author: "Mouse"
categories: maths
tags: [number-theory, maths, topology]
image: topology_primes.jpg
permalink: /maths/topology-and-infinite-primes
---

### Introduction

In this article, we will be exploring one of those proofs that proves a simple concept, with completely overpowered mathematics. There are some simple mathematical statements that seem to have a multitude of different proofs, for example Pythogoras' Thoerem, and the infinitude of the prime numbers. The statement we will be proving is that there are an infinite number of prime numbers. The overpowered mathematics we will be using comes from topology - namely Furstenberg's topology on the integers.

[Hillel Furstenberg](https://en.wikipedia.org/wiki/Hillel_Furstenberg) is a German mathematician who cooked up a topology on the integers, and used this to prove the infinitude of the primes - all whilst he was an undergraduate at Yeshiva University in New York. Furstenberg's paper is possibly the shortest mathematical paper I have come across - it is only a page long. Check out the [full paper here](https://www.math.auckland.ac.nz/~gauld/750-05/inftlymanyprimes.pdf).

We start by exploring arithmetic progressions of integers.

### Arithmetic Progressions

Arithmetic progressions are sets of integers that differ by a fixed amount. That is:

>$$ a\Bbb{Z} + b := \{an+b : n \in \Bbb{Z} \}$$ where $$a,b \in \Bbb{Z}$$ and $$a > 0$$

Consider the intersection of two arithmetic progressions. This intersection will either be empty, or it will form another arithmetic progression:

>$$ (a\Bbb{Z}+b) \cap (c\Bbb{Z}+b) = lcm(a,c)\Bbb{Z} + b$$, where $$lcm(a,c)$$ is the lowest common multiple of $$a$$ and $$c$$.

This is a non-empty intersection of finitely many arithmetic progressions - a useful property to generate a topology.

### Furstenberg's Topology

Furstenberg's Topology is defined as follows:

> A set $$U\subset \Bbb{Z}$$ is open if and only if for all $$a \in U$$, there exists  $$d \in \Bbb{Z}, d \neq 0$$, with $$a + d\Bbb{Z} \subset U$$.

In other words, for any element in our open set, there is an arithmetic progression of that element within the open set. Alternatively, one can think of an open set in this topology as being a union of arithmetic progressions.

Open sets can also be considered the sets of all integers $$n$$, which are equivalent to $$b$$ modulo $$a$$, i.e:

$$\{n \in \Bbb{Z} : n\equiv a \pmod b\}$$

We now verify that this construction is indeed a topology.

The properties of a topology $$\tau$$ on a set $$X$$ are:
>1. $$\emptyset$$ and $$X$$ are in $$\tau$$
2. If $$U_i \in \tau$$ for all $$i \in I$$ (where $$I$$ is some index set), then $$\bigcup\limits_{i=1} U_i \in \tau $$
3. If $$U_1, U_2 \in \tau$$, then $$U_1 \cap U_2 \in \tau$$

We check that all three of these properties are satisfied by Furstenberg's topology on $$\Bbb{Z}$$.

>1. The empty set $$\emptyset$$ is vacuously an open set, since it contains no elements. $$\Bbb{Z} = 0 + 1\Bbb{Z}$$ is also clearly open.
>2. Suppose $$U_i$$ is a collection of open sets, where $$i \in I$$ for some index set $$I$$. If $$a \in \bigcup\limits_{i=1} U_i$$, then there exists $$j \in I$$ with $$a \in U_j$$. But then there exists a $$d$$ with $$a + d\Bbb{Z} \subset U_j \subset \bigcup\limits_{i=1} U_i$$, so $$\bigcup\limits_{i=1} U_i$$ must be open.
>3. The third property is slightly more involved. Suppose $$U_1, ..., U_k$$ are open sets in $$\Bbb{Z}$$. Without loss of generality, assume that $$ \bigcap\limits_{i=1}^{\infty} U_i \neq \emptyset$$. Suppose that $$a \in \bigcap\limits_{i=1}^{\infty} U_i$$. Then there exist arithmetic progressions $$a + m_i\Bbb{Z} \subset U_i$$. We then have that $$a + m_1...m_k\Bbb{Z} \subset \bigcap\limits_{i=1}^{\infty} U_i$$. But then each $$a \in \bigcap\limits_{i=1}^{\infty} U_i$$ is contained in an arithmetic progression contained in $$\bigcap\limits_{i=1}^{\infty} U_i$$, so $$\bigcap\limits_{i=1}^{\infty} U_i$$ is open.

Thus we have proven that the Furstenberg topology on the integers is indeed a topology.

### Interesting Properties

It can be shown that the Furstenberg topology is interestingly Hausdorff. That is, each integer can be seperated by disjoint open sets. More precisely, we claim that:
>For all $$a,b \in \Bbb{Z}$$, with $$a \neq b$$, there exist open sets $$U$$ and $$V$$ with $$a \in U$$ and $$b \in V$$, where $$U \cap V = \emptyset$$.

The proof goes as follows:
>Take any $$a,b \in \Bbb{Z}, a \neq b$$, so we have $$b-a \neq 0$$.
Let $$U = a + 2(b-a)\Bbb{Z}$$, and let $$V = b + 2(b-a)\Bbb{Z}$$. Clearly $$a \in U$$ and $$b \in V$$, so we now need to show that $$U$$ and $$V$$ are disjoint.
Suppose that $$U$$ and $$V$$ are not disjoint, so there exists $$z \in U \cap V$$. Then $$z = a + 2(b-a)n = b + 2(b-a)m$$ for some $$n \neq m \in \Bbb{Z}$$. But then some simple algebraic manipulation reveals that $$n - m = \frac{1}{2}$$, a contradiction.
Hence, the Furstenberg topology is Hausdorff.

We remark that every non-empty open subset of $$\Bbb{Z}$$ is infinite, since each open subset will contain an infinite arithmetic progression.

We also note that every arithmetic progression $$a + m\Bbb{Z}$$ is clopen - both open and closed.

To see that arithmetic progressions are open, note that for each $$a + mb \in a + m\Bbb{Z}$$, we have $$a + mb + m\Bbb{Z} = a + m\Bbb{Z}$$.

To show that each arithmetic progression is closed, we must show that its complement is open. The complement of an arithmetic progression in $$\Bbb{Z}$$ will be the union of other arithmetic progressions $$r + m\Bbb{Z}$$, where $$0 \le r \le m-1$$, and $$ r \not\equiv a \pmod m$$. By the above, each of these arithmetic progressions is open, so their union is also open.

### Infinite Primes

We finally go on to prove that there are an infinite amount of prime numbers.

Fix a prime number $$p \in \Bbb{Z}$$. Note that all the integers $$\Bbb{Z}$$ form a finite union of residue classes modulo $$p$$ - we are simply partitioning the integers on their remainder when divided by $$p$$. Each of these residue classes is an arithmetic progression. Moreover, each of these residue classes is clopen - both closed and open - in Furstenberg's Topology. They are open by definition of open sets. By the remark made above, these arithmetic progressions are also closed.

Consider the multiples of each prime. Each forms a residue class, so are all closed by the above. The union of these multiples of primes $$p$$, $$\bigcup\limits_{p} p\Bbb{Z}$$ can be written as $$\bigcup\limits_{p} p\Bbb{Z} = \Bbb{Z}/\{+1, -1\}$$ since every integer will have prime factors, except $$1$$ and $$-1$$.

In Furstenberg's Topology, $$\{+1, -1\}$$ is not open, since it is finite, and clearly not an arithmetic progression. Hence, its complement $$\Bbb{Z}/\{+1, -1\} = \bigcup\limits_{p} p\Bbb{Z}$$ cannot be closed. Since only finite unions of closed sets are closed, if we can show that each $$p\Bbb{Z}$$ is closed we must have that $$\bigcup\limits_{p} p\Bbb{Z}$$ is infinite, so there must be infinite primes.

If $$p \not | a$$, then no integer in the arithmetic progression $$a + p\Bbb{Z}$$ is divisible by $$p$$. So we therefore have that $$a + p\Bbb{Z} \subset \Bbb{Z} - p\Bbb{Z}$$. Since we now have an arithmetic progression in $$\Bbb{Z} - p\Bbb{Z}$$, $$\Bbb{Z} - p\Bbb{Z}$$ is open, so its complement $$p\Bbb{Z}$$ must be closed. By the above, $$\bigcup\limits_{p} p\Bbb{Z}$$ is infinite, so there are infinite prime numbers. Thus concludes Furstenberg's proof.

### Conclusion

Whilst this proof does not involve too much topological heavy lifting, it still involves the important concepts of openness and closedness in topological spaces. This proof indicates that number theory and topology 'connect up' as they should. I enjoy this proof because it demonstrates a beautiful connection between two seemingly unrelated corners of mathematics - topology and number theory. 
