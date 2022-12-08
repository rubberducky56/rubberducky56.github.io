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

Drug cartels are large and complex networks, often involving thousands of members, all connected in different ways. The naive solution is to go for the leader of a cartel. But when you cut off the head, three more grow in its place.  ... (find E.Gs from past)

Law enforcement agencies may have intelligence on many individuals within a cartel and the connections between them, but they simply do not have enough resources to arrest all those that are known to be involved in cartels. Therefore, law enforcement must determine who are the most important indiividuals to the functioning of the cartel. Once these people are determined, they can be arrested and fthe cartel will be disrupted. But how do we find the most important individuals?

### Cartel Graphs
We answer this difficult question using the tools of graph theory. Graph theory is the mathematical study of connected networks. We define a structure called a graph $$G=(V,E)$$ which is a 2-tuple of sets. The set $$V$$ contains the nodes (or vertices) of the graph, and $$E$$ contains the edges between them. The below image shows an examle of a graph.

![basic graph](\assets\img\maths\centrality_measures\basic_graph.jpg)

The above graph will have the node set $$V=(A, B, C, D, E, F)$$, and the edge set $$E=((A,B), (A,D), (A,E), (B,C), (C,E), (C,F), (D,E), (E,F))$$.

We model drug cartels as follows. We let $$G=(V,E)$$ be a graph, where $$V$$ represents each individual in the network. Two nodes are connected (that is, there is an edge between them) if the corresponding individuals are connected in real life.

>Note that the definition of 'connected' depends on the type of intelligence that has been gathered. For instance, this could be individuals that are in frequent contact, individuals who trade supplies, or if one of the individuals reports to the other.

Now that we have modelled our cartel as a graph, we turn to the field of Social Network Analysis. This is the process of investigating social structures with tools of graph theory. In particular, we turn our attention to centrality metrics. Centrality metrics are functions that take in a node, and tell you how 'imporotant' that node is. More precisely a centrality measure $$C$$ is a function:
$$ C: V -> \Bbb{R} $$

There are countless examples of centrality measures, which vary based upon how a node's 'importance' is defined. For the remainder of this article, we will examine a few centrality metrics.

### Degree Centrality
The first centrality metric we will investigate is degree centrality. In this instance, a node is considered important if it has many connections to other nodes. The degree centrality is defined as the number of connections a given node has. More precisely:
For a graph $$G=(V,E)$$ and $$x,y \in V$$, set $$e_{xy} =$$
