---
layout: post
title: "Defining Geometric Shapes using Group Theory"
author: "Rubber Ducky"
categories: maths
tags: [group-theory, maths]
image: torus.jpg
permalink: /maths/defining-geometric-shapes-group-theory
---

Today we will go through a nice application of group theory - defining geometric shapes through the language of group isomorphisms. This article is based off [this video](https://www.youtube.com/watch?v=iBNJE2922V0&ab_channel=MichaelPenn) by Michael Penn.

### Preliminary Definitions
If you do not have a basic understanding of group theory, I'd recommend you learn the basics before embarking on this article. A great introductory video can be found [here](https://www.youtube.com/watch?v=KufsL2VgELo&ab_channel=Nemean) and a fantastic series with a focus on intuition can be found [here](https://www.youtube.com/playlist?list=PLDcSwjT2BF_VuNbn8HiHZKKy59SgnIAeO).

#### Groups

A group is simply a collection, or set, of objects equipped with some operation between each object. This operation must:
* Take in two objects in the set and return a third object in the set **(closure)**
* If you perform the operation on three (or more) objects, the order in which you do so does not matter **(associativity)**
* There is a special object in the set, say $$\mathit{e}$$, such that when you perform the operation with this object and another, say $$\mathit{g}$$, you get $$\mathit{g}$$ back. $$\mathit{e}$$ is called the **identity** of $$\mathit{G}$$.
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

Let us define the surface of a sphere, $$S^1$$, as the collection of complex numbers $$\Bbb{C}$$ at a distance of 1 from the origin - our good friend, the unit sphere.

$$ S^1 := \{z \in \Bbb{C} : |z| = 1\}$$

![alt text](\assets\img\maths\shapes_group_theory\unit_circle.PNG){:height="350px" width="350px"}

Note that even though this is 2-dimensional shape - the circle - the boundary of the circle is what we are interested in. In this case, it is the 1-dimensional line that borders the circle. Hence the name $$S^1$$ for our surface.

We consider the multiplicative group of $$S^1$$, that is the group operation of multiplication of complex numbers.

Next, we claim that $$S^1$$ is a subgroup of $$\Bbb{C}^+$$, the multiplicative group of the complex numbers, excluding $$0$$. This may seem a trivial fact, but can easily be proven.

To prove this, we will use the criterion listed above.

>Suppose that $$z,w \in S^1$$, so $$z \cdot w \in S^1$$. By the defining property of $$S^1$$,
$$|z| = |w| = 1$$. We have that $$ |z \cdot w^{-1}| = \frac {|z|}{|w|} = \frac 11 = 1$$, Hence we have that $$z \cdot w \in S^1$$ implies  $$ z \cdot w^{-1} \in S^1$$, so $$S^1 \le \Bbb{C^+} $$, as stated.

We finally get to our first big claim - that the quotient group of the additive real numbers by the integers, is isomorphic to the multiplicative unit circle. How cool is that! More precisely, we will show that

$$\Bbb{R}/\Bbb{Z} \cong S^1 $$

More intuitively, one can think of taking this quotient group as setting each integer within the reals to be 'equivalent'. So 0 gets 'identified' to 1, 1 gets 'identified' to 2, and so on. When you identify each of these elements, you 'wrap' them around to each other - 1 gets 'connected' to 0, 2 gets 'connected' to 1, etc. This forms a circle.

![alt text](\assets\img\maths\shapes_group_theory\number_line.PNG)

#### Proof of Isomorphism

Now for the proof. Our strategy will be to construct a group homomorphim having image $$S^1 \le \Bbb{C^+}$$ and kernel $$\Bbb{Z}$$. Then, by the first isomorphism theorem, we will have the desired result.

>Let $$\phi : \Bbb{R} \to \Bbb{C^+}$$ be a group homomorphim, with $$\phi(x) = e^{2 i \pi x}$$. Notice the jump of operation - the operation of the domain is addition, and the operation of the codomain is multiplication.<br>
We check that this is indeed a group homomorphism.<br>
Recall, to have a homomorphism, we must have that $$\phi(x \cdot y) = \phi(x) \cdot \phi(y) $$ for all $$x,y$$. For any $$x,y \in \Bbb{R}$$, we have that $$\phi(x y) = e^{2 i \pi (x+y)} = e^{2 i \pi x} e^{2 i \pi y} = \phi(x)\phi(y)$$ as required.<br>
Now we calculate the image of $$\phi$$, $$Im(\phi)$$. This will be the subgroup of $$\Bbb{C^+}$$ such that for all $$y \in Im(\phi)$$, there exists some $$x \in \Bbb{R}$$ with $$\phi(x) = y$$ <br>
Any complex number $$z$$ on the unit circle can be expressed as $$e^{2 i \pi x}$$ for some $$x \in \Bbb{R}$$. This is true by Euler's formula, which states that $$e^{2 i \pi x} = \cos(2 i \pi x) + i \sin(2 i \pi x)$$ for $$x \in \Bbb{R}$$. <br>
Hence, we see that $$Im(\phi) = S^1$$, the unit circle.<br>
Next, we calculate the kernel of $$\phi$$, $$Ker(\phi)$$. <br>
Note that the group $$S^1$$ has the multiplicative identity $$1$$. Recall that $$Ker(\phi) = \{x \in \Bbb{R} : e^{2 i \pi x} = 1\}$$.<br>
Since $$e^{2 i \pi x} = \cos(2 i \pi x) + i \sin(2 i \pi x)$$, we see that we must have $$x \in \Bbb{Z}$$ for $$e^{2 i \pi x}$$ to be $$1$$. In other words, the kernel of $$\phi$$ is precisely the integers.<br>
We now have all the components we need to apply the first isomorphism theorem. Since $$\phi$$ is a homomorphsm from $$\Bbb{R}$$ to $$\Bbb{C^+}$$, with kernel $$\Bbb{Z}$$ and image $$S^1$$, we have that $$\Bbb{R}/\Bbb{Z} \cong S^1 $$ - the desired result!

We have now shown that the quotient group of the reals by the integers is none other than the unit circle!

### Higher Dimensions

Let's consider a higher dimensional example. Recall that the Gaussian integers $$\Bbb{Z}[i]$$ is the set of 'integer' complex numbers. That is:

$$\Bbb{Z}[i] = \{a + bi : a,b \in \Bbb{Z}\}$$

![alt text](\assets\img\maths\shapes_group_theory\lattice.png){:height="350px" width="350px"}

This fascinating set forms a lattice of points within the complex plane (as shown above), and the set $$\Bbb{Z}[i]$$ clearly forms a subgroup of $$\Bbb{C}$$. So what happens when we take the quotient group of $$\Bbb{c}$$ by $$\Bbb{Z}[i]$$?

More precisely, what group $$G$$ satisfies the following:

$$\Bbb{C}/\Bbb{Z}[i] \cong G $$

I won't answer this question as rigourously as the previous example, but I will provide some geometric intuition.

When we take the quotient group $$\Bbb{C}/\Bbb{Z}[i]$$, we 'identify' all elements that differ by an element of $$\Bbb{Z}[i]$$. This can be seen more clearly if we zoom into the lattice of the Gaussian integers.

![alt text](\assets\img\maths\shapes_group_theory\small_lattice.png){:height="300px" width="300px"}

The red line segments between $$0$$ and $$1$$, and $$i$$ and $$1+i$$, are 'identified' with each other, and the blue line segments between $$0$$ and $$i$$, and $$1$$ and $$1+i$$ are 'identified' with each other. When we 'glue' the red identfied line segments, we get a cylinder. When we 'glue' the blue identified segments, we join the ends of the cylinder to form none other than a torus! This process repeats infinitely across all lattice points.

In other words, this quotient group is isomorphic to a torus! The surface of a torus can be described as $$S^1 \times S^1$$, so more precisely we have:

$$\Bbb{C}/\Bbb{Z}[i] \cong S^1 \times S^1$$

### Conclusion

In this article, we saw how we can describe the unit circle as the quotient group of the reals by the integers - an interesting result in its own right. We then saw how we can construct the torus using the Gaussian integers. These results help to build a bridge between the fields of geometry and number theory - cool stuff!
