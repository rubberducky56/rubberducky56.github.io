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

Digital forensics is a branch of forensics aiming to deal with the __recovery, investigation, examination and analysis__ of digital devices, often left at a crime scene. Digital forensics concerns itself with questions such as:
>How should law enforcement collect digital evidence, such as smartphones and hard drives? What if the devices are still on? How can these devices be collected in such a way that no evidence is lost or tampered with?


>How should digital evidence be transferred across different systems?


>How can digital evidence, which could contain terabytes of data, be effectively and efficiently analyzed to find evidence of a crime?

A high-level overview of the steps taken in a digital forensics investigation are as follows:
1. When digital devices are found, they must be placed in a __secure container__ to ensure they cannot be damaged or tampered with. Devices which can connect to a network must not be able to receive or transmit any data over a network, otherwise they can be remotely wiped.
2. When securely transported to a digital forensics lab, a __forensic copy__ of all data must be made. Any original data should not be altered.
3. Before analyzing a file, the file should be __hashed__ in order to validate the integrity of any copies.
4. Only the forensic copy of devices should be analyzed - if it is damaged, a new one can be created.

### File Metadata

When files are created, the operating system usually leaves behind some __metadata__, such as file creation dates, modification dates and file owners. Although a basic analysis technique, examining the metadata of a file can reveal illuminating information.

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

Photos taken on most digital cameras and smartphones use __EXIF format__ - Exchangeable Image File Format. This format is a standard for embedding metadata into an image, for example camera model, date and time of image capture, camera settings, and sometimes even GPS data. This data can all be used to paint a better picture of images stored on a device.

The Linux tool ```exiftool``` is for reading the EXIF data from photos. Back to the kidnapped cat example, we now examine the EXIF data of the photo left behind.

### Memory Captures

When conducting a forensic examination, it is useful to dump and analyse the memory contents of a device. __Live capture__ is when the memory contents of a device are dumped whilst the device is still on. This is far easier and more accurate than the alternative, __offline capture__. Some tools used for live capture are:
* FTK imager
* Redline
* dumpit.exe
* win32dd.exe or win64dd.exe

Memory dump formats:
* The most common memory dump format is the ```.RAW``` file - this is a bit-by-bit copy of data in all files, without copying metadata. .RAW files do not contain any headers, metadata, or magic bytes.
* If a Windows system has crashed (the infamous blue screen of death), Windows will conveniently dump all of its memory information onto the disk. By default, this will be located in ```%SystemRoot%memory.dmp```. There are three types of Windows dump files:
  * Complete memory dump - the largest type of memory dump, contains all contents of memory
  * Kernel memory dump - only contains memory contents used by the kernel at the time of crash, does not include any memory allocated to user applications
  * Small memory dump - contains only bug-check information, processor context, kernel context for the process that crashed, thread information for the threat that crashed, the kernel call stack, and a list of loaded drivers. More details can be found [here](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/small-memory-dump).

![alt text](\assets\img\cybersecurity\forensics\bsod.png)

* When a Windows machine powers down, Windows will save the contents of RAM to the disk in a __Windows Hibernation File__, located at ```%SystemDrive%/hiberfil.sys```. This file is used for faster boot up times, but can be used for forensics if a Windows computer has been hibernated.
* __Virtual machines__ store captures of their memory, which can be extracted from its hypervisor without turning the machine off. Some common virtual memory image files are:
  * VMWare - .vmem  file
  * Hyper-V - .bin file
  * Parallels - .mem file
  * VirtualBox - .sav file 
