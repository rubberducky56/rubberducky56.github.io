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

When files are created, the operating system usually leaves behind some __metadata__, such as file creation dates, modification dates and file owners. Though a basic analysis technique, examining the metadata of a file can reveal illuminating information.

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


```
└─$ exiftool letter-image.jpg                             	 
ExifTool Version Number     	: 12.16
File Name                   	: letter-image.jpg
Directory                   	: .
File Size                   	: 124 KiB
File Modification Date/Time 	: 2022:02:23 03:53:33-05:00
File Access Date/Time       	: 2022:02:23 04:12:00-05:00
File Inode Change Date/Time 	: 2023:01:02 08:24:49-05:00
File Permissions            	: rwxr-xr-x
File Type                   	: JPEG
File Type Extension         	: jpg
MIME Type                   	: image/jpeg
JFIF Version                	: 1.01
Exif Byte Order             	: Little-endian (Intel, II)
Compression                 	: JPEG (old-style)
Make                        	: Canon
Camera Model Name           	: Canon EOS R6
Orientation                 	: Horizontal (normal)
X Resolution                	: 300
Y Resolution                	: 300
Resolution Unit             	: inches
Software                    	: GIMP 2.10.28
Modify Date                 	: 2022:02:15 17:23:40
(...)
ICC Profile Name            	: Adobe RGB (1998)
Creator Tool                	: GIMP 2.10
Metadata Date               	: 2021:12:02 13:32:48+01:00
Rating                      	: 2
Document ID                 	: adobe:docid:photoshop:de96cdf3-afbf-664d-9d4c-d5c1d0fdb4e1
Instance ID                 	: xmp.iid:b80f5656-424a-4d4d-9cd0-5a36706d26d6
Original Document ID        	: D3825C53382EED70DB7435B0CCF756F5
Preserved File Name         	: 5L0A2971.CR3
(...)
Profile Date Time           	: 2022:02:15 14:53:19
Profile File Signature      	: acsp
Primary Platform            	: Apple Computer Inc.
(...)
Date Created                	: 2022:02:15
Digital Creation Date       	: 2021:11:05
Digital Creation Time       	: 14:06:13+03:00
Application Record Version  	: 4
Time Created                	: 17:23:40-17:23
Image Width                 	: 1200
Image Height                	: 800
(...)
```
In this lucky instance, we see that EXIFtool was able to retrieve a huge amount of metadata. Most of this data is related to the camera’s specifications and photo information, which I have truncated out. We see that we have information relating to the date and time of the photo capture, the device used to take it, and GPS coordinates of the location of the capture. This information can be invaluable in a forensic investigation.

### Memory Captures

When conducting a forensic examination, it is useful to dump and analyse the memory contents of a device. __Live capture__ is when the memory contents of a device are dumped whilst the device is still on. This is far easier and more accurate than the alternative, __offline capture__. Some tools used for live capture are:
* FTK imager
* Redline
* dumpit.exe
* win32dd.exe or win64dd.exe

__Memory dump formats:__
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

So what can we do with memory captures?

### Volatility

__Volatility__ is an open-source framework for memory forensics, incident response and malware analysis, developed by Volatility Labs. Volatility is used to analyse the contents of __volatile memory__ (i.e. RAM) as part of a forensic investigation. This is an incredibly powerful tool, and includes the following features:

* List running __processes__
* List network __connections__
* View __internet history__
* Identify system __files__
* Read __documents__
* Retrieve Windows __CMD commands__
* Scan for __malware__ using YARA rules
* Retrieve __screenshots__ and __clipboard__ data
* Retrieve hashed __passwords__
* Retrieve __SSL keys__ and __certificates__

For more on Volatility, check out its [Github repo](https://github.com/volatilityfoundation/volatility), and [HackTrick’s cheatsheet](https://book.hacktricks.xyz/generic-methodologies-and-resources/basic-forensic-methodology/memory-dump-analysis/volatility-cheatsheet).

We will now walk through the Volatility example in the [TryHackMe Volatility room](https://tryhackme.com/room/bpvolatility). We are first met with a file called ```cridex.vnem```. As above, this is a VMWare virtual machine memory file.

#### Profiles

The first thing to do is determine which Volatility __profile__ to use with this memory image. Each Windows version is slightly different, so Volatility needs to know exactly which one the memory dump came from. Volatility can identify the profile for us, and can determine the most likely operating system, version and architecture. Whenever a command is used, this profile must be used. The profile can be determined with the following command:

> volatility -f [memory file] imageinfo

We see the following output:

```
Volatility Foundation Volatility Framework 2.6
INFO	: volatility.debug	: Determining profile based on KDBG search...
      	Suggested Profile(s) : WinXPSP2x86, WinXPSP3x86 (Instantiated with WinXPSP2x86)
                 	AS Layer1 : IA32PagedMemoryPae (Kernel AS)
                 	AS Layer2 : FileAddressSpace ([memory image file])
                  	PAE type : PAE
                       	DTB : 0x2fe000L
                      	KDBG : 0x80545ae0L
      	Number of Processors : 1
 	Image Type (Service Pack) : 3
            	KPCR for CPU 0 : 0xffdff000L
         	KUSER_SHARED_DATA : 0xffdf0000L
       	Image date and time : 2012-07-22 02:45:08 UTC+0000
 	Image local date and time : 2012-07-21 22:45:08 -0400
```

Two different profiles have been suggested. This is because different operating system versions could have overlapping identifiers, which Volatility cannot distinguish. We see that the most likely profile is ```WinXPSP2x86```. We can further determine the true profile by listing processes with ```pslist```. If few processes are reported, it is likely that the wrong profile is used. We see that ```WinXPSP2x86``` is indeed the correct profile. It appears that this is a memory dump of a __Windows XP Virtualbox machine__.

#### Process Scanning

Shown below is the output of the command ```volatility -f [memory file] --profile=WinXPSP2x86 pslist```

```
Volatility Foundation Volatility Framework 2.6
Offset(V)  Name                	PID   PPID   Thds 	Hnds   Sess  Wow64 Start                      	Exit                     	 
---------- -------------------- ------ ------ ------ -------- ------ ------ ------------------------------ ------------------------------
0x823c89c8 System               4  	   0 	 53  	240     -----  	0                                                         	 
0x822f1020 smss.exe            	368    4  	 3   	19      -----  	0  2012-07-22 02:42:31 UTC+0000                            	 
0x822a0598 csrss.exe           	584	   368   9  	326  	0  	    0  2012-07-22 02:42:32 UTC+0000                            	 
0x82298700 winlogon.exe        	608	   368 	 23  	519  	0  	    0  2012-07-22 02:42:32 UTC+0000                            	 
0x81e2ab28 services.exe        	652	   608 	 16  	243  	0  	    0  2012-07-22 02:42:32 UTC+0000                            	 
0x81e2a3b8 lsass.exe           	664	   608 	 24  	330  	0  	    0  2012-07-22 02:42:32 UTC+0000                            	 
0x82311360 svchost.exe         	824	   652 	 20  	194  	0  	    0  2012-07-22 02:42:33 UTC+0000                            	 
0x81e29ab8 svchost.exe         	908	   652   9  	226  	0  	    0  2012-07-22 02:42:33 UTC+0000                            	 
0x823001d0 svchost.exe        	1004   652 	 64 	1118  	0  	    0  2012-07-22 02:42:33 UTC+0000                            	 
0x821dfda0 svchost.exe        	1056   652   5   	60  	0  	    0  2012-07-22 02:42:33 UTC+0000                            	 
0x82295650 svchost.exe        	1220   652 	 15  	197  	0  	    0  2012-07-22 02:42:35 UTC+0000                            	 
0x821dea70 explorer.exe       	1484   1464  17  	415  	0  	    0  2012-07-22 02:42:36 UTC+0000                            	 
0x81eb17b8 spoolsv.exe        	1512   652 	 14  	113  	0  	    0  2012-07-22 02:42:36 UTC+0000                            	 
0x81e7bda0 reader_sl.exe      	1640   1484  5   	39  	0  	    0  2012-07-22 02:42:36 UTC+0000                            	 
0x820e8da0 alg.exe             	788	   652   7  	104  	0  	    0  2012-07-22 02:43:01 UTC+0000                            	 
0x821fcda0 wuauclt.exe        	1136   1004  8  	173  	0       0  2012-07-22 02:43:46 UTC+0000                            	 
0x8205bda0 wuauclt.exe        	1588   1004  5  	132  	0  	    0  2012-07-22 02:44:01 UTC+0000   	
```

This command shows us the processes running at the time of capture. For instance, we see that the ```smss.exe``` process was running, which has PID ```368```.

At this point, since we know the profile used, I created an alias to avoid typing out the long command string over and over. This was achieved with the following command:

> alias vol=’volatility -f [memory file] --profile=WinXPSP2x86’

Malware will often attempt to hide itself and the processes which it runs. For instance, a process can be configured to not appear on some process scanners, such as on ```pslist```. Fortunately, the ```psxview``` command can help us out. This tool will list each process, and indicate whether or not it is detected by various process scanners. A ```false``` in any column indicates that the corresponding command did not find the given process. If a row contains mostly ```true``` entries, but one or two ```false``` entries, this could be classed as suspicious. The output of this command can be seen below:

```
└─$ vol psxview    	 
Volatility Foundation Volatility Framework 2.6
Offset(P)  Name                	PID pslist psscan thrdproc pspcid csrss session deskthrd ExitTime
---------- -------------------- ------ ------ ------ -------- ------ ----- ------- -------- --------
0x02498700 winlogon.exe        	608  True   True   True 	True   True  True	True	 
0x02511360 svchost.exe         	824  True   True   True 	True   True  True	True	 
0x022e8da0 alg.exe             	788  True   True   True 	True   True  True	True	 
0x020b17b8 spoolsv.exe        	1512 True   True   True 	True   True  True	True	 
0x0202ab28 services.exe        	652  True   True   True 	True   True  True	True	 
0x02495650 svchost.exe        	1220 True   True   True 	True   True  True	True	 
0x0207bda0 reader_sl.exe      	1640 True   True   True 	True   True  True	True	 
0x025001d0 svchost.exe        	1004 True   True   True 	True   True  True	True	 
0x02029ab8 svchost.exe         	908  True   True   True 	True   True  True	True	 
0x023fcda0 wuauclt.exe        	1136 True   True   True 	True   True  True	True	 
0x0225bda0 wuauclt.exe        	1588 True   True   True 	True   True  True	True	 
0x0202a3b8 lsass.exe           	664  True   True   True 	True   True  True	True	 
0x023dea70 explorer.exe       	1484 True   True   True 	True   True  True	True	 
0x023dfda0 svchost.exe        	1056 True   True   True 	True   True  True	True	 
0x024f1020 smss.exe            	368  True   True   True 	True   False False  False    
0x025c89c8 System               4    True   True   True 	True   False False  False    
0x024a0598 csrss.exe           	584  True   True   True 	True   False True	True
```

We see that the ```csrss.exe``` process gives a result of ```true``` for most scanners, but false for the ```csrss``` scanner.

The command ```ldrmodules``` can also be used to identify hidden processes. This command will output three columns of interest for each process it finds - ```InLoad```, ```InInit```, and ```InMem```. If any of these columns are ```False```, it is possible that the given process has been injected by malware. We can use ```grep``` to filter for any false entries, as seen below.

```
└─$ vol ldrmodules | grep False
Volatility Foundation Volatility Framework 2.6
   	4 System           	    0x7c900000 False  False  False \WINDOWS\system32\ntdll.dll
 	368 smss.exe         	0x48580000 True   False  True  \WINDOWS\system32\smss.exe
 	584 csrss.exe        	0x00460000 False  False  False \WINDOWS\Fonts\vgasys.fon
 	584 csrss.exe        	0x4a680000 True   False  True  \WINDOWS\system32\csrss.exe
 	608 winlogon.exe     	0x01000000 True   False  True  \WINDOWS\system32\winlogon.exe
 	652 services.exe     	0x01000000 True   False  True  \WINDOWS\system32\services.exe
 	664 lsass.exe        	0x01000000 True   False  True  \WINDOWS\system32\lsass.exe
 	824 svchost.exe      	0x01000000 True   False  True  \WINDOWS\system32\svchost.exe
 	908 svchost.exe      	0x01000000 True   False  True  \WINDOWS\system32\svchost.exe
	1004 svchost.exe      	0x01000000 True   False  True  \WINDOWS\system32\svchost.exe
	1056 svchost.exe      	0x01000000 True   False  True  \WINDOWS\system32\svchost.exe
	1220 svchost.exe      	0x01000000 True   False  True  \WINDOWS\system32\svchost.exe
	1484 explorer.exe     	0x01000000 True   False  True  \WINDOWS\explorer.exe
	1512 spoolsv.exe      	0x01000000 True   False  True  \WINDOWS\system32\spoolsv.exe
	1640 reader_sl.exe    	0x00400000 True   False  True  \Program Files\Adobe\Reader 9.0\Reader\reader_sl.exe
 	788 alg.exe          	0x01000000 True   False  True  \WINDOWS\system32\alg.exe
	1136 wuauclt.exe      	0x00400000 True   False  True  \WINDOWS\system32\wuauclt.exe
	1588 wuauclt.exe      	0x00400000 True   False  True  \WINDOWS\system32\wuauclt.exe
```

The ```csrss.exe``` process is yet again exhibiting suspicious behavior - all three columns are false. For more on how these process scanners work, and how each differs, [this blog series](https://eforensicsmag.com/windows-process-internals-a-few-concepts-to-know-before-jumping-on-memory-forensics-by-kirtar-oza/) explains how these Windows System Internals work.

When malicious code is injected into processes, it will often hook API calls made by the target process. This will allow the malware to control the execution path, and reroute the API to itself. The ```apihooks``` command can detect such API hooks. [This post](https://subscription.packtpub.com/book/networking-and-servers/9781788392501/11/ch11lvl1sec84/3-detecting-api-hooks) shows an example of Volatility detecting an API hook in the [Zeus Botnet malware](https://en.wikipedia.org/wiki/Zeus_(malware)) code. In the TryHackMe example, ```apihooks``` gave many detected API hooks. Below is an example.

```
Hook mode: Usermode
Hook type: Inline/Trampoline
Process: 1484 (explorer.exe)
Victim module: ntdll.dll (0x7c900000 - 0x7c9af000)
Function: ntdll.dll!LdrLoadDll at 0x7c9163a3
Hook address: 0x146a300
Hooking module: <unknown>

Disassembly(0):
0x7c9163a3 e9583fb584   	JMP 0x146a300
0x7c9163a8 68f864917c   	PUSH DWORD 0x7c9164f8
0x7c9163ad e8f984ffff   	CALL 0x7c90e8ab
0x7c9163b2 a1c8b0977c   	MOV EAX, [0x7c97b0c8]
0x7c9163b7 8945e4       	MOV [EBP-0x1c], EAX
0x7c9163ba 8b           	DB 0x8b

Disassembly(1):
0x146a300 8b442410     	MOV EAX, [ESP+0x10]
0x146a304 8b4c240c     	MOV ECX, [ESP+0xc]
0x146a308 8b542408     	MOV EDX, [ESP+0x8]
0x146a30c 56           	PUSH ESI
0x146a30d 50           	PUSH EAX
0x146a30e 8b44240c     	MOV EAX, [ESP+0xc]
0x146a312 51           	PUSH ECX
0x146a313 52           	PUSH EDX
0x146a314 50           	PUSH EAX
0x146a315 e8           	DB 0xe8
0x146a316 56           	PUSH ESI
0x146a317 6d           	INS DWORD [ES:EDI], DX
```

In this example, we see that the ```ntdll.dll``` file was targeted, specifically the ```ntdll.dll!LdrLoadDll``` function at memory address ```0x7c9163a3```. We can even see the disassembled assembly code found at this location.

For more comprehensive malware analysis, the ```malfind``` command can be used. It is often useful to dump malware files found into a local directory for further analysis. This can be achieved with the ```-D [directory]``` flag.

DLL files are often targeted by malware - malicious code is often injected into DLLs. We can list all DLL files in the memory file with the ```dlllist``` command. Since we identified the process ```csrss.exe``` as being suspicious, we can pull out all the DLL files associated with this process by specifying its PID with the ```--pid=[PID]``` flag, and the ```dlldump``` command.

```
└─$ vol dlldump --pid=584 -D malfind_out                                                       	
Volatility Foundation Volatility Framework 2.6
Process(V) Name             	Module Base Module Name      	Result
---------- -------------------- ----------- -------------------- ------
0x822a0598 csrss.exe        	0x04a680000 csrss.exe        	OK: module.584.24a0598.4a680000.dll
0x822a0598 csrss.exe        	0x07c900000 ntdll.dll        	OK: module.584.24a0598.7c900000.dll
0x822a0598 csrss.exe        	0x075b40000 CSRSRV.dll       	OK: module.584.24a0598.75b40000.dll
0x822a0598 csrss.exe        	0x077f10000 GDI32.dll        	OK: module.584.24a0598.77f10000.dll
0x822a0598 csrss.exe        	0x07e720000 sxs.dll          	OK: module.584.24a0598.7e720000.dll
0x822a0598 csrss.exe        	0x077e70000 RPCRT4.dll       	OK: module.584.24a0598.77e70000.dll
0x822a0598 csrss.exe        	0x077dd0000 ADVAPI32.dll     	OK: module.584.24a0598.77dd0000.dll
0x822a0598 csrss.exe        	0x077fe0000 Secur32.dll      	OK: module.584.24a0598.77fe0000.dll
0x822a0598 csrss.exe        	0x075b50000 basesrv.dll      	OK: module.584.24a0598.75b50000.dll
0x822a0598 csrss.exe        	0x07c800000 KERNEL32.dll     	OK: module.584.24a0598.7c800000.dll
0x822a0598 csrss.exe        	0x07e410000 USER32.dll       	OK: module.584.24a0598.7e410000.dll
0x822a0598 csrss.exe        	0x075b60000 winsrv.dll       	OK: module.584.24a0598.75b60000.dll
```

We see 12 DLL files associated with the suspicious process ```csrss.exe```.

#### Network Scanning

We can also scan for active and closed network connections with the command ```netscan```. However, Windows XP is too old for ```netscan```. Instead, the ```connscan``` command can find connections.

```
└─$ vol connscan   
Volatility Foundation Volatility Framework 2.6
Offset(P)  Local Address         	Remote Address        	Pid
---------- ------------------------- ------------------------- ---
0x02087620 172.16.112.128:1038   	41.168.5.140:8080     	1484
0x023a8008 172.16.112.128:1037   	125.19.103.198:8080   	1484
```

We see that at the time of capture, this device had connections to the above IP addresses. They were also connecting to port ```8080``` - it is likely that these are webservers. We can even go further - the ```sockscan``` command allows us to see all sockets that have been opened.

```
└─$ vol sockscan
Volatility Foundation Volatility Framework 2.6
Offset(P)   	PID   Port  Proto Protocol    	Address     	Create Time
---------- -------- ------ ------ --------------- --------------- -----------
0x01fd7618 	    1220   1900  17   UDP         	172.16.112.128  2012-07-22 02:43:01 UTC+0000
0x01fdb780  	664	   500 	 17   UDP         	0.0.0.0     	2012-07-22 02:42:53 UTC+0000
0x0203f460    	4	   138 	 17   UDP         	172.16.112.128  2012-07-22 02:42:38 UTC+0000
0x02076620 	    1004   123 	 17   UDP         	127.0.0.1   	2012-07-22 02:43:01 UTC+0000
0x020c23b0  	908	   135   6    TCP         	0.0.0.0     	2012-07-22 02:42:33 UTC+0000
0x02325610  	788    1028  6    TCP         	127.0.0.1   	2012-07-22 02:43:01 UTC+0000
0x02372808  	664    0	 255  Reserved    	0.0.0.0     	2012-07-22 02:42:53 UTC+0000
0x02372c50  	664    4500  17   UDP         	0.0.0.0     	2012-07-22 02:42:53 UTC+0000
0x0239cc08    	4	   445   6    TCP         	0.0.0.0     	2012-07-22 02:42:31 UTC+0000
0x023f0630 	    1004   123 	 17   UDP         	172.16.112.128  2012-07-22 02:43:01 UTC+0000
0x023f0d00    	4	   445 	 17   UDP         	0.0.0.0     	2012-07-22 02:42:31 UTC+0000
0x02440d08 	    1484   1038  6    TCP         	0.0.0.0     	2012-07-22 02:44:45 UTC+0000
0x02476878    	4	   139   6    TCP         	172.16.112.128  2012-07-22 02:42:38 UTC+0000
0x02477460    	4	   137 	 17   UDP         	172.16.112.128  2012-07-22 02:42:38 UTC+0000
0x024cd2b0 	    1220   1900  17   UDP         	127.0.0.1   	2012-07-22 02:43:01 UTC+0000
```

#### VirusTotal

Now that we have some dumped code files, we can upload them to [VirusTotal](https://www.virustotal.com/gui/home/upload), to try and determine if this really is malware.

We see that this is indeed a malicious program. After searching the hash on Google, we can determine that this is in fact from the [Cridex Worm](https://www.trendmicro.com/vinfo/us/threat-encyclopedia/malware/cridex).

![alt text](\assets\img\cybersecurity\forensics\vt.png)

This demonstrates how we can combine memory analysis techniques from digital forensics, with open sources from the malware analysis community to determine what has infected a system. For more on malware analysis, check out my ["Malware Analysis At A Glance" Article](/cybersecurity/malware-analysis-glance)

### Conclusion

This post has touched on the basics of digital forensics. We have looked at some basic techniques in analysing file metadata. We then looked at some examples of memory dumping, before using Volatility to analyse memory dumps. Through analysing the processes left on a system, we were able to deduce that the __Cridex Worm__ had infected this Windows XP system. This article has just scratched the surface in the wide field of digital forensics. Volatility has many more capabilities, and there are countless other tools out there for analysing memory dumps. In the future, I will write an article taking a deeper dive into other techniques and tools within digital forensics, as well as more detail on how these process scanners analyse Windows System Internals.

### External Links

[Tryhackme’s Intro to Digital Forensics Room](https://tryhackme.com/room/introdigitalforensics)

[Windows Small Memory Dumps](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/small-memory-dump)

[Volatility Github Repo](https://github.com/volatilityfoundation/volatility)

[HackTricks’ Volatility Cheatsheet](https://book.hacktricks.xyz/generic-methodologies-and-resources/basic-forensic-methodology/memory-dump-analysis/volatility-cheatsheet).

[TryHackMe Volatility Room](https://tryhackme.com/room/bpvolatility)

[Process Scanning and Windows System Internals](https://eforensicsmag.com/windows-process-internals-a-few-concepts-to-know-before-jumping-on-memory-forensics-by-kirtar-oza/)

[Detecting API Hooks and the Zeus Botnet](https://subscription.packtpub.com/book/networking-and-servers/9781788392501/11/ch11lvl1sec84/3-detecting-api-hooks)

[Zeus Botnet Malware](https://en.wikipedia.org/wiki/Zeus_(malware))

[VirusTotal](https://www.virustotal.com/gui/home/upload)

[Cridex Worm](https://www.trendmicro.com/vinfo/us/threat-encyclopedia/malware/cridex)
