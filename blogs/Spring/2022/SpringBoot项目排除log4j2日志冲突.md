---
title: SpringBoot项目排除log4j2日志冲突
date: 2022-03-07
categories:
 - Spring
tags:
 - Spring
 - log4j2
---

﻿要排除掉Spring Boot 很多jar里边默认依赖的日志包spring-boot-starter-logging。一个一个写依赖排除也可以，但是太繁琐了，经过尝试，只让它依赖个spring-boot-starter-logging的空壳，里边的东西全部排除掉即可。使用下边的方式就可以达到想要的效果。


```pom、        
<!--全局排除spring-boot-starter-logging内的所有依赖-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-logging</artifactId>
    <exclusions>
        <exclusion>
            <groupId>*</groupId>
            <artifactId>*</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

