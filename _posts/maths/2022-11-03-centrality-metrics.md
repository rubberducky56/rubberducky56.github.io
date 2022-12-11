---
layout: post
title: "Disruping Drug Cartels Using Graph Theory"
author: "Mouse"
categories: maths
tags: [maths, graph-theory, sna]
image: centrality_metrics.jpg
permalink: /maths/centrality-metrics
---

### Introduction
It goes without saying that drug cartels are a major issue. They supply the world with illicit substances through criminal and violent means. So why haven't we been able to stop them?

Drug cartels are large and complex networks, often involving thousands of members, all connected in different ways. The naive solution is to go for the leader of a cartel. But when you cut off the head, three more grow in its place. For example, when Heriberto Lazcano, the leader of the Los Zetas cartel in Mexico, was killed [a new leader](http://www.stratfor.com/sample/analysis/mexico-security-memo-new-leadership-los-zetas) was chosen quickly after. The Columbian government has used the work of the [Vortex Foundaion](https://www.scivortex.org/), who used __graph theory__ to model drug cartels. For more on the Vortex Foundation's work on modelling drug cartels, NewScientist has an [article](https://www.newscientist.com/article/mg21628874-200-destroying-drug-cartels-the-mathematical-way/) describing the methods used and the importance of this work.

Law enforcement agencies may have intelligence on many individuals within a cartel and the connections between them, but they simply do not have enough resources to arrest all those that are known to be involved in cartels. Therefore, law enforcement must determine who are the most important indiividuals to the functioning of the cartel. Once these people are determined, they can be arrested and the cartel will be disrupted. But how do we find the most important individuals?

### Cartel Graphs

We answer this difficult question using the tools of __graph theory__. Graph theory is the mathematical study of connected networks. We define a structure called a graph $$G=(V,E)$$ which is a 2-tuple of sets. The set $$V$$ contains the __nodes__ (or vertices) of the graph, and $$E$$ contains the __edges__ connecting them. The below image shows an examle of a graph.

![basic graph](\assets\img\maths\centrality_measures\basic_graph.jpg)

The above graph will have the node set $$V=(A, B, C, D, E, F)$$, and the edge set $$E=((A,B), (A,D), (A,E), (B,C), (C,E), (C,F), (D,E), (E,F))$$.

We model drug cartels as follows. We let $$G=(V,E)$$ be a graph, where $$V$$ represents each individual in the network. Two nodes are connected (that is, there is an edge between them) if the corresponding individuals are connected in real life.

>Note that the definition of 'connected' depends on the type of intelligence that has been gathered. For instance, this could be individuals that are in frequent contact, individuals who trade supplies, or if one of the individuals reports to the other.

Now that we have modelled our cartel as a graph, we turn to the field of __Social Network Analysis__. This is the process of investigating social structures with tools of graph theory. We can use social network analysis to determine the structure of social networks and the relationships between individuals or organizations within those networks. In particular, we turn our attention to __centrality metrics__. Centrality metrics are functions that take in a node, and tell you how 'important' that node is. More precisely, a centrality measure $$C$$ is a function:
$$ C: V \rightarrow \Bbb{R} $$

There are countless examples of centrality measures, which differ based upon how a node's 'importance' is defined. For the remainder of this article, we will examine a few centrality metrics. Throughout the remainder of this article, we denote by $$G=(V,E)$$ a graph with nodes $$V$$, and edges $$E$$.

### Degree Centrality
The first centrality metric we will investigate is __degree centrality__. In this instance, a node is considered important if it has many connections to other nodes. The degree centrality is defined as the __number of connections__ a given node has. More precisely:
For $$x,y \in V$$, set
$$
e_{xy} = \begin{cases}
1 & \text{if } xy \in E \\
0 & \text{if } xy \not\in E
\end{cases}
$$

The degree centrality of a node $$x \in V$$ is then defined as:
$$
D(x) := \sum_{y \in V} e_{xy}
$$

This quantity is more commonly known as the __degree__ of a node.

We can use degree centrality to calculate a similar metric - the porportion of the entire graph that a given node is connected to. This can be computed by dividing the degreee (or degree centrality) of a node by the total number of nodes in the graph. For a node $$x \in V$$, this is:
$$
\frac{D(x)}{|V|} = \frac{\sum_{y \in V} e_{xy}}{|V|}
$$

This metric simply counts how many edges connect to a given node, indiciating how many nodes can be reached. If we observe the image on the top, we see that the central node has the highest centrality of $$5$$, whereas all others have centralities of $$1$$. If we observe the image on the bottom, we see that the degree centrality has identified __clusters__ within the network.

![degree centrality](\assets\img\maths\centrality_measures\degree_small.PNG)![degree centrality](\assets\img\maths\centrality_measures\degree_big.PNG)

If we calculate the degree centralities of nodes within a drug cartel network, we can identify __hubs__ or __clusters__ within a cartel. We could also find individuals who are in contact with many others.

### Closeness Centrality
Next, we will investigate the notion of __closeness centrality__. Closeness centrality defines the importance of a node by how __close__ it is to other nodes. It is worth noting that it can be proven that for all connected nodes, there always exists at least one shortest path between them. The closeness centrality can be calculated as the recirpocal of the sum of the lengths of all shortest paths to a node. More precisely:

Given $$x,y \in V$$, let
$$
d(x,y) = \begin{cases}
0 & \text{if } x = y \\
\infty & \text{if } xy \not\in E \\
\text{number of edges on shortest path from x to y} & \text{otherwise}
\end{cases}
$$

$$d(x,y)$$ measures the number of edges on the shortest path between $$x$$ and $$y$$. The closeness centrality of $$x \in V$$ is then defined as:

$$ C(x) := \frac{1}{\sum_{y \in V, y \neq x} d(x,y)} $$

A node has high closeness centrality if it can be reached from all other nodes quickly. Higher distances to nodes will result in a lower centrality score. If we observe the image on the top, we see the nodes on the corners have low closeness centralities of $$0.4$$, whereas the node in the centre has a higher centrality of $$0.6$$. If we observe the image on the bottom, we see that closeness centrality can help identify a __central cluster__.

![closeness centrality](\assets\img\maths\centrality_measures\closeness_small.PNG)![closeness centrality](\assets\img\maths\centrality_measures\closeness_big.PNG)

Tying this back to drug cartels, the closeness centrality could reveal individuals who are able to __spread information/resources__ to many others within the network.


### Betweenness Centrality
Next, we examine the notion of __betweenness centrality__. In this metric, the importance of a node is defined by the number of __shortest paths__ that pass through that node. More precisely:

Let $$sigma_{st}$$ denote the number of shortest paths between $$s,t \in V$$, and let $$\sigma_{st}(x)$$ denote the number of shortest paths between $$s,t \in V$$, which pass through $$x \in V$$. Then the betweenness centrality of a node $$x \in V$$ can be computed by summing over all node pairs $$s,t$$ the ratio of shortest paths from $$s$$ to $$t$$ passing through $$x$$, and the total number of shortest paths $$s$$ to $$t$$. More precisely:

$$
B(x) := \sum_{s,t \in V, s \neq x \neq t} \frac{\sigma_{st}(x)}{\sigma_{st}}
$$

If we observe the image on the top, node $$4$$ has been identified as having the highest betweenness centrality, measuring in at $$15$$. This matches our intuition, since we can clearly see that many shortest paths must pass through node $$4$$. Node $$4$$ can be consdered a __'bridge' node__ - it connects multiple components of the graph together. In this case, removing node $$4$$ would result in the graph becoming __disconnected__.


![betweenness centrality](\assets\img\maths\centrality_measures\betweeness_small.PNG)![betweenness centrality](\assets\img\maths\centrality_measures\betweeness_big.PNG)

When we calculate betweenness centralities of cartel networks, we can identify 'bridges' between different subnetworks. These 'bridge' nodes could represent individuals with the ability to control the __flow of information/resources__ through the cartel. Removing these nodes would severely disrupt the operations of the cartel.

### Eigenvector Centrality
The final centrality metric we will examine is __eigenvector centrality__, also known as __eigencentrality__ where a node is consdered important if it is connected to other nodes of high importance. The formulation of this metric is slightly more involved than the previous metrics. We construct it as follows:
Let $$A = (a)_{v,t}$$ be the graph's adjacency matrix, where $$a_{v,t} = 1$$ if $$vt \in V$$, and $$a_{v,t} = 0$$ if $$vt \not\in V$$. Let $$x \in \Bbb{R}^{|V|}$$ be a vector containing the centrality of each node. The eigenvector centrality $$x_i$$ can be described with
$$
x_i = \lambda\sum_{j=1}^{|V|} a_{i,j}x_j
$$

where $$\lambda$$ is a positive constant. When we rewrite this equation in vector notation, we see that this is equivalent to $$\lambda x=Ax$$, an eigenvector problem. The centrality of a node $$v$$ is the $$v^{th}$$ component of the unique eigenvector corresponding to the largest eigenvalue. Existence of this unique largest eigenvalue is garanteed by the positive constant $$\lambda$$, and by the [Perron-Frobenius theorem](https://en.wikipedia.org/wiki/Perron%E2%80%93Frobenius_theorem). In practice, these eigenvalues can be calculated using a method such as the [Power-Iteration algorithm](https://en.wikipedia.org/wiki/Power_iteration), or other such [eigenvector algorithms](https://en.wikipedia.org/wiki/Eigenvalue_algorithm).

If we observe the below example on the top, we see that nodes which are connected to the central nodes have high eigencentrality scores, since the central nodes have the highest score.

![eigenvector centrality](\assets\img\maths\centrality_measures\eigenvector_small.PNG)![eigenvector centrality](\assets\img\maths\centrality_measures\eigenvector_big.PNG)

Eigencentrality measures the __relative influence__ of a node. If a node is well connected, it will result in a high eigencentrality score.
>It's not what you know, it's who you know

This centrality metric is what __Google's PageRank algorithm__ is based off. This is Google's magic formula which determines which pages on the web are most 'important', and should be shown higher on Google search results. For more on how eigenvector centrality is used in PageRank, Cambridge Intelligence have an [article](https://cambridge-intelligence.com/eigencentrality-pagerank/#:~:text=PageRank%20centrality%3A%20the%20Google%20algorithm,any%20kind%20of%20network%2C%20though.) that goes into further detail. This goes to show than graph centrality measures have far reaching applications - from disrupting drug cartels to ranking pages on the internet.

Tying eigenvector centrality back to drug cartels, we can use this centrality metric to identify individuals with a high level of __influence__ over the cartel. This could be bosses, underbosses, and others with many influential connections.

### Conclusion
It's amazing that we can identify these individuals using nothing but tools from graph theory. As we have seen, graph centrality metrics - and the wider field of social network analysis - can be used to identify leaders, enforcers, and other key roles within an organization. Although we have focused on drug cartels, the methods described above can be applied to any type of network. There are also countless other centrality metrics - this article has barely scratched the surface. For more centrality metrics, [Periodic Table of Network Centrality](http://www.schochastics.net/sna/periodic.html) catagorises various metrics, and provides further links to each metric.

### External Links

[New Leader of Los Zetas](http://www.stratfor.com/sample/analysis/mexico-security-memo-new-leadership-los-zetas)

[Vortex Foundaion](https://www.scivortex.org/)

[Destroying Drug Cartels the Mathematical Way](https://www.newscientist.com/article/mg21628874-200-destroying-drug-cartels-the-mathematical-way/)

[Perron-Frobenius Theorem](https://en.wikipedia.org/wiki/Perron%E2%80%93Frobenius_theorem)

[Power-Iteration Algorithm](https://en.wikipedia.org/wiki/Power_iteration)

[Eigenvector Algorithms](https://en.wikipedia.org/wiki/Eigenvalue_algorithm)

[PageRank Centrality & EigenCentrality](https://cambridge-intelligence.com/eigencentrality-pagerank/#:~:text=PageRank%20centrality%3A%20the%20Google%20algorithm,any%20kind%20of%20network%2C%20though.)

[Periodic Table of Network Centrality](http://www.schochastics.net/sna/periodic.html)
