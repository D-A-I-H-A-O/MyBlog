---
title: 一、Spring概述
date: 2022-04-12
categories:
 - Spring
tags:
 - Spring
---


# Spring概述

 1. `Spring`是一个开源框架。

 2. `Spring`为简化企业级开发而生，使用`Spring`开发可以将`Bean`对象，`Dao`组件对象，`Service`组件对象等交给`Spring`容器来管理，这样使得很多复杂的代码在`Spring`中开发却变得非常的优雅和简洁，有效的降低代码的耦合度，极大的方便项目的后期维护、升级和扩展。

 3. `Spring`是一个`IOC(DI)`和`AOP`容器框架。
 
# Spring的优良特性

 1. 非侵入式：基于`Spring`开发的应用中的对象可以不依赖于`Spring`的`API`

 2. 控制反转：`IOC——Inversion of Control`，指的是将对象的创建权交给`Spring`去创建。使用`Spring`之前，对象的创建都是由我们自己在代码中`new`创建。而使用`Spring`之后。对象的创建都是由给了`Spring`框架。

 3. 依赖注入：`DI——Dependency Injection`，是指依赖的对象不需要手动调用`setXX`方法去设置，而是通过配置赋值。

 4. 面向切面编程：`Aspect Oriented Programming——AOP`

 5. 容器：`Spring`是一个容器，因为它包含并且管理应用对象的生命周期

 6. 组件化：`Spring`实现了使用简单的组件配置组合成一个复杂的应用。在 `Spring` 中可以使用`XML`和`Java`注解组合这些对象。

 7. 一站式：在`IOC`和`AOP`的基础上可以整合各种企业应用的开源框架和优秀的第三方类库（实际上`Spring` 自身也提供了表述层的`SpringMVC`和持久层的`Spring JDBC`）

# Spring的模块
![在这里插入图片描述](https://img-blog.csdnimg.cn/fc1cec63eaee4beda4891108cb1e1e87.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
`Spring 5`版本中的`web`模块已经去掉了`Portlet`模块，新增了`WebFlux`模块等。

Spring框架分为四大模块：
>Core核心模块。负责管理组件的Bean对象

spring-beans-4.0.0.RELEASE.jar
spring-context-4.0.0.RELEASE.jar
spring-core-4.0.0.RELEASE.jar
spring-expression-4.0.0.RELEASE.jar

>面向切面编程

spring-aop-4.0.0.RELEASE.jar
spring-aspects-4.0.0.RELEASE.jar

>数据库操作

spring-jdbc-4.0.0.RELEASE.jar
spring-orm-4.0.0.RELEASE.jar
spring-oxm-4.0.0.RELEASE.jar
spring-tx-4.0.0.RELEASE.jar
spring-jms-4.0.0.RELEASE.jar

>Web模块

spring-web-4.0.0.RELEASE.jar
spring-webmvc-4.0.0.RELEASE.jar
spring-websocket-4.0.0.RELEASE.jar
spring-webmvc-portlet-4.0.0.RELEASE.jar

# Java版本依赖与支持
![在这里插入图片描述](https://img-blog.csdnimg.cn/0a763e77a8914fadba7496054b8b864a.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
[Spring Framework 中文文档](https://www.docs4dev.com/docs/zh/spring-framework/5.1.3.RELEASE/reference)

