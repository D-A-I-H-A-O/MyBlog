---
title: IDEA配置
date: 2022-03-07
categories:
 - Java
tags:
 - 工具
---



﻿## idea64.exe.vmoptions

`idea64.exe.vmoptions`针对的是 `IDEA` 环境。`IDEA` 本身就是一个 `Java` 应用，所以也必须运行于 `JVM` 之上。此处的`idea64.exe.vmoptions`文件就是用来配置 `64` 位的 `IDEA` 所使用的 `JVM` 参数。是 `IDEA` 运行时用的配置，并不是项目运行的配置。
![在这里插入图片描述](https://img-blog.csdnimg.cn/960cfe93632e41ca80a738fabd506f67.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/d6caee40c613400fad14c9f50c8b4f08.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_19,color_FFFFFF,t_70,g_se,x_16)


```

# custom IntelliJ IDEA VM options

##################JVM模式############################

# IDEA的JVM以Server模式启动（新生代默认使用ParNew）
-server


##################内存分配############################

# 堆初始值占用3G，意味着IDEA启动即分配3G内存
-Xms3g

# 堆最大值占用3G
-Xmx3g

# 强制JVM在启动时申请到足够的堆内存（否则IDEA启动时堆初始大小不足3g）
-XX:+AlwaysPreTouch

# 年轻代与老年代比例为1:3（默认值是1:4），降低年轻代的回收频率
-XX:NewRatio=3

# 栈帧大小为16m
-Xss16m


##################老年代回收器############################

# 使用CMS老年代回收器
-XX:+UseConcMarkSweepGC

# CMS的重新标记步骤：多线程一起执行
-XX:+CMSParallelRemarkEnabled

# CMS的并发标记步骤：启用4个线程并发标记（理论上越多越好，前提是CPU核心足够多）
-XX:ConcGCThreads=4


##################JIT编译器############################

# 代码缓存，用于存放Just In Time编译后的本地代码，如果塞满，JVM将只解释执行，不再编译native代码。
-XX:ReservedCodeCacheSize=512m

# 分层编译，JIT编译优化越来越好，IDEA运行时间越久越快
-XX:+TieredCompilation

# 节省64位指针占用的空间，代价是JVM额外开销
-XX:+UseCompressedOops

# 增大软引用在JVM中的存活时长（堆空闲空间越大越久）
-XX:SoftRefLRUPolicyMSPerMB=50


-Dsun.io.useCanonCaches=false

-Djava.net.preferIPv4Stack=true

-Djsse.enableSNIExtension=false
```


## idea.properties配置

常修改的就是下面 4 个参数：
`idea.config.path=${user.home}/.IntelliJIdea/config`，该属性主要用于指向 `IntelliJ IDEA` 的个性化配置目录，默认是被注释，打开注释之后才算启用该属性，这里需要特别注意的是斜杠方向，这里用的是正斜杠。

`idea.system.path=${user.home}/.IntelliJIdea/system`，该属性主要用于指向 `IntelliJ IDEA` 的系统文件目录，默认是被注释，打开注释之后才算启用该属性，这里需要特别注意的是斜杠方向，这里用的是正斜杠。如果你的项目很多，则该目录会很大，如果你的 C 盘空间不够的时候，还是建议把该目录转移到其他盘符下。

`idea.max.intellisense.filesize=2500`，该属性主要用于提高在编辑大文件时候的代码帮助。`IntelliJ IDEA` 在编辑大文件的时候还是很容易卡顿的。

`idea.cycle.buffer.size=1024`，该属性主要用于控制控制台输出缓存。有遇到一些项目开启很多输出，控制台很快就被刷满了没办法再自动输出后面内容，这种项目建议增大该值或是直接禁用掉，禁用语句 `idea.cycle.buffer.size=disabled`。

