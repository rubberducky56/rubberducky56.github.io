---
layout: post
title: "Introduction to Digital Forensics"
author: "Mouse"
categories: cybersecurity
tags: [cybersecurity, reverse-engineering, forensics]
image: forensics.jpg
permalink: /cybersecurity/intro-to-digital-forensics
---

### Introduction

Digital forensics is a branch of forensics aiming to deal with the recovery, investigation, examination and analysis of digital devices, often left at a crime scene. Digital forensics concerns itself with questions such as:
>How should law enforcement collect digital evidence, such as smartphones and hard drives? What if the devices are still on? How can these devices be collected in such a way that no evidence is lost or tampered with?


>How should digital evidence be transferred across different systems?


>How can digital evidence, which could contain terabytes of data, be effectively and efficiently analyzed to find evidence of a crime?

A high-level overview of the steps taken in a digital forensics investigation are as follows:
1. When digital devices are found, they must be placed in a secure container to ensure they cannot be damaged, or tampered with. Devices which can connect to a network must not be able to receive or transmit any data over a network, otherwise they can be remotely wiped.
2. When securely transported to a digital forensics lab, a forensic copy of all data must be made. Any original data should not be altered.
3. Before analyzing a file, the file should be hashed in order to validate the integrity of any copies.
4. Only the forensic copy of devices should be analyzed - if it is damaged, a new one can be created.

### File Metadata

When files are created, the operating system usually leaves behind some metadata - such as file creation dates, modification dates and file owners. Although a basic analysis technique, examining the metadata of a file can reveal illuminating information.

Text files, documents and PDF files all leave behind metadata. For analysing metadata of a PDF file, the Linux tool ```pdfinfo``` can be used. The following example of a ransom letter is taken from [Tryhackme’s Intro to Digital Forensics room](https://tryhackme.com/room/introdigitalforensics). In this scenario, a cat called Gato has been kidnapped, and the kidnappers have left a ransom letter and photo. This example demonstrates how file metadata can reveal information the threat actor would not have wanted revealed. In the below example, we use ```pdfinfo``` to read the metadata of the PDF ransom letter file.

```
└─$ pdfinfo ransom-letter.pdf
Title:           Pay NOW
Subject:         We Have Gato
Author:          Ann Gree Shepherd
Creator:         Microsoft® Word 2016
Producer:        Microsoft® Word 2016
CreationDate:    Wed Feb 23 04:10:36 2022 EST
ModDate:         Wed Feb 23 04:10:36 2022 EST
Custom Metadata: no
Metadata Stream: yes
Tagged:          yes
UserProperties:  no
Suspects:        no
Form:            none
JavaScript:      no
Pages:           1
Encrypted:       no
Page size:       595.44 x 842.04 pts (A4)
Page rot:        0
File size:       71371 bytes
Optimized:       no
PDF version:     1.7
```
We can see that the file was created by user ```We Have Gato``` on ```Wednesday 23rd Februrary 2022```, at the time ```04:10```. This kind of information can help forensic examiners create a timeline of events.

Photos taken on most digital cameras and smartphones use EXIF format - Exchangeable Image File Format. This format is a standard for embedding metadata into an image, for example camera model, date and time of image capture, camera settings, and sometimes even GPS data. This data can all be used to paint a better picture of images stored on a device.

```exiftool``` on Linux is a tool for reading the EXIF data from photos. Back to the kidnapped cat example, we now examine the EXIF data of the photo left behind.
