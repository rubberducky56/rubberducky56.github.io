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

In this article, we will be exploring one of those proofs that proves a simple concept, with completely overpowered mathematics. There are some mathematical statements that seem to have a multitude of different proofs. The statement we will be proving is that there are an infinite number of prime numbers. The overpowered mathematics we will be using comes from topology - namely Furstenberg's topology on the integers.

[Hillel Furstenberg](https://en.wikipedia.org/wiki/Hillel_Furstenberg) is a German mathematician who cooked up a topology on the integers, and used this to prove the infinitude of the primes - all whilst he was an undergraduate at Yeshiva University in New York.

We start by exploring arithmetic progressions of integers.

### Arithmetic Progressions

Arithmetic progressions are sets of integers that differ by a fixed amount. That is:

>$$ a\Bbb{Z} + b := \{an+b : n \in \Bbb{Z} \}$$ where $$a,b \in \Bbb{Z}$$ and $$a > 0$$

Consider the intersection of two arithmetic progressions. This intersection will either be empty, or it will form another arithmetic progression:

>$$ (a\Bbb{Z}+b) \cap (c\Bbb{Z}+b) = lcm(a,c)\Bbb{Z} + b$$, where $$lcm(a,c)$$ is the lowest common multiple of $$a$$ and $$c$$.

This is a non-empty intersection of finitely many arithmetic progressions - a useful property to generate a topology.

### Furstenberg's Topology

Furstenberg's Topology is defined as follows:

> A set $$U\subset \Bbb{Z}$$ is open $$iff$$ for all $$a \in U$$, there exists  $$d \in \Bbb{Z}, d \neq 0$$, with $$a + d\Bbb{Z} \subset U$$.

In other words, for any element in our open set, there is an arithmetic progression of that element within the open set. Alternatively, one can think of an open set in this topology as being a union of arithmetic progressions.

We now verify that this construction is indeed a topology.

The properties of a topology $$\tau$$ on a set $$X$$ are:
>1. $$\emptyset$$ and $$X$$ are in $$\tau$$
2. If $$U_i \in \tau$$ for all $$i \in I$$ (where $$I$$ is some index set), then $$\bigcup\limits_{i=1} U_i \in \tau $$
3. If $$U_1, U_2 \in \tau$$, then $$U_1 \cap U_2 \in \tau$$

We check that all three of these properties are satisfied by Furstenberg's topology on $$\Bbb{Z}$$.
