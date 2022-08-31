---
layout: post
title: "Defining Geometric Shapes using Group Theory"
author: "Rubber Ducky"
categories: maths
tags: [group-theory, maths]
image: torus.jpg
---

Today we will go through a nice application of group theory - defining geometric shapes through the language of group isomorphisms. This article is based off [this video](https://www.youtube.com/watch?v=iBNJE2922V0&ab_channel=MichaelPenn) by Michael Penn.

### Preliminary Definitions
If you do not have a basic understanding of group theory, I'd recommend you learn the basics before embarking on this article. A great introductory video can be found [here](https://www.youtube.com/watch?v=KufsL2VgELo&ab_channel=Nemean) and a fantastic series with a focus on intuition can be found [here](https://www.youtube.com/playlist?list=PLDcSwjT2BF_VuNbn8HiHZKKy59SgnIAeO).

A group is simply a collection, or set, of objects equipped with some operation between each object. This operation must:
* Take in two objects in the set and return a third object in the set **(closure)**
* If you perform the operation on three (or more) objects, the order in which you do it does not matter **(associativity)**
* There is a special object in the set, say $$\mathit{e}$$, such that when you perform the operation with this object and another, say $$\mathit{g}$$ you get $$\mathit{g}$$ back. $$\mathit{e}$$ is called the **identity** of $$\mathit{G}$$.
* For each object in the set $$\mathit{g}$$, there exists another object in the set $$\mathit{g^{-1}}$$ such that when you perform the operation on $$\mathit{g}$$ and $$\mathit{g^{-1}}$$, you get that special element $$\mathit{e}$$ back. $$\mathit{g^{-1}}$$ is called the **inverse** of $$\mathit{g}$$.

More formally, a set $$\mathit{G}$$ and an operation **$$\cdot$$** form a group $$(\mathit{G},  \cdot)$$ if it satisfies the following:

>
For all $$g, h \in G, g \cdot h \in G$$ **(closure)**<br>
For all $$g, h, k \in G, (g \cdot h) \cdot k = g \cdot (h \cdot k)$$ **(associativity)**<br>
There exists $$e \in G$$ such that for all $$g \in G, g \cdot e = e \cdot g = g $$ **(identity)**<br>
For all $$g \in G$$, there exists $$g^{-1} \in G$$ such that $$g \cdot g^{-1} = e$$ **(inverse)**

A subgroup $$H$$ of a group $$G$$ is, as the name suggests, a subset of the group $$G$$ that follows the group definition in its own right.

A handy criterion we have for determining subgroups is as follows:

>$$H$$ is a subgroup of $$G$$ (written $$H \le G$$) if and only if for all $$x,y \in G$$, if $$ x \cdot y \in G$$, then $$ x \cdot y^{-1} \in G$$.

This criterion will come in handy later.

Another incredibly useful (and beautiful) theorem in group theory is the first isomorphism theorem. Unfortnately, from this point onwards you'll probably want a basic understanding of group homomorphims, quotient groups, images and kernels. If I try to explain everything, this post will be of infinite length.

The first isomorphism theorem states:

>If $$\phi : G \to H$$ is a group homomorphism between groups $$G$$ and $$H$$, then $$ G/Ker(\phi) \cong Im(\phi)$$

### Isomorphisms To Circles

Let us define the surface of a sphere, $$S^1$$ as the collection of complex numbers $$\Bbb{C}$$ at a distance of 1 from the origin - our good friend, the unit sphere.

$$ S^1 := \{z \in \Bbb{C} : |z| = 1\}$$

![alt text](\assets\img\maths\shapes_group_theory\unit_circle.PNG){:height="350px" width="350px"}.

Note that even though this is 2-dimensional shape - the circle - the boundary of the circle is what we are interested in. In this case, it is the 1-dimensional line that borders the circle. Hence the name $$S^1$$ for our surface.
