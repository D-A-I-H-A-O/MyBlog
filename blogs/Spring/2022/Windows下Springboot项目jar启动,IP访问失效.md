---
title: Windows下SpringBoot项目jar启动,IP访问失效
date: 2022-03-07
categories:
 - Spring
tags:
 - SpringBoot
---



﻿1、修改内置tomcat配置 

```
server.address=0.0.0.0
```
本地ip能直接访问，但是局域网下其他电脑却不能访问

2、修改防火墙

![在这里插入图片描述](https://img-blog.csdnimg.cn/e8804ad9f79c41fdbfef0b4d849636bf.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/032f3a4bc5b14dbbbfaf43881d517e08.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_20,color_FFFFFF,t_70,g_se,x_16)

