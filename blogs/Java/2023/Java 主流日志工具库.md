---
title: Java 主流日志工具库
date: 2023-02-26
categories:
 - Java
tags:
 - 日志
---

# 日志系统
##  java.util.logging (JUL)
`JDK1.4` 开始，通过 `java.util.logging` 提供日志功能。虽然是官方自带的`log lib`，`JUL`的使用确不广泛。

 1. `JUL`从`JDK1.4` 才开始加入(2002年)，当时各种第三方`log lib`已经被广泛使用了
 2. `JUL`早期存在性能问题，到`JDK1.5`上才有了不错的进步，但现在和`Logback/Log4j2`相比还是有所不如
 3. `JUL`的功能不如`Logback/Log4j2`等完善，比如`Output Handler`就没有`Logback/Log4j2`的丰富，有时候需要自己来继承定制，又比如默认没有从`ClassPath`里加载配置文件的功能
## Log4j
`Log4j` 是 `apache` 的一个开源项目，创始人 `Ceki Gulcu`。`Log4j` 应该说是 `Java` 领域资格最老，应用最广的日志工具。`Log4j` 是高度可配置的，并可通过在运行时的外部文件配置。它根据记录的优先级别，并提供机制，以指示记录信息到许多的目的地，诸如：数据库，文件，控制台，`UNIX` 系统日志等。

`Log4j` 中有三个主要组成部分：`loggers` - 负责捕获记录信息。`appenders` - 负责发布日志信息，以不同的首选目的地。`layouts` - 负责格式化不同风格的日志信息。

`Log4j` 的短板在于性能，在`Logback` 和 `Log4j2` 出来之后，`Log4j`的使用也减少了。

## LogbackLogback 
是由 `log4j` 创始人 `Ceki Gulcu` 设计的又一个开源日志组件，是作为 `Log4j` 的继承者来开发的，提供了性能更好的实现，异步 `logger`，`Filter`等更多的特性。`logback` 当前分成三个模块：`logback-core`、`logback-classic` 和 `logback-access`。

`logback-core` - 是其它两个模块的基础模块。`logback-classic` - 是 `log4j` 的一个 改良版本。此外 `logback-classic` 完整实现 `SLF4J API` 使你可以很方便地更换成其它日志系统如 `log4j` 或 `JDK14 Logging`。

`logback-access` - 访问模块与 `Servlet` 容器集成提供通过 `Http` 来访问日志的功能。

## Log4j2
维护 `Log4j` 的人为了性能又搞出了 `Log4j2`。`Log4j2` 和 `Log4j1.x` 并不兼容，设计上很大程度上模仿了 `SLF4J/Logback`，性能上也获得了很大的提升。`Log4j2` 也做了 `Facade/Implementation` 分离的设计，分成了 `log4j-api` 和 `log4j-core`。

## Log4j vs Logback vs Log4j2
按照官方的说法，`Log4j2` 大大优于 `Log4j` 和 `Logback`。

那么，`Log4j2` 相比于先问世的 `Log4j` 和 `Logback`，它具有哪些优势呢？

* `Log4j2` 旨在用作审计日志记录框架。`Log4j 1.x` 和 `Logback` 都会在重新配置时丢失事件。`Log4j 2` 不会。在 `Logback` 中，`Appender` 中的异常永远不会对应用程序可见。在 `Log4j` 中，可以将 `Appender` 配置为允许异常渗透到应用程序。

* `Log4j2` 在多线程场景中，异步 `Loggers` 的吞吐量比 `Log4j 1.x` 和 `Logback` 高 10 倍，延迟低几个数量级。

* `Log4j2` 对于独立应用程序是无垃圾的，对于稳定状态日志记录期间的 `Web` 应用程序来说是低垃圾。这减少了垃圾收集器的压力，并且可以提供更好的响应时间性能。

* `Log4j2` 使用插件系统，通过添加新的 `Appender`、`Filter`、`Layout`、`Lookup` 和 `Pattern Converter`，可以非常轻松地扩展框架，而无需对 `Log4j` 进行任何更改。

* 由于插件系统配置更简单。配置中的条目不需要指定类名。

* 支持自定义日志等级。

* 支持 `lambda` 表达式。

* 支持消息对象。

* `Log4j` 和 `Logback` 的 `Layout` 返回的是字符串，而 `Log4j2` 返回的是二进制数组，这使得它能被各种 `Appender` 使用。

* `Syslog Appender` 支持 `TCP` 和 `UDP` 并且支持 `BSD` 系统日志。

* `Log4j2` 利用 `Java5` 并发特性，尽量小粒度的使用锁，减少锁的开销

# 日志门面
日志门面是对不同日志框架提供的一个 `API` 封装，可以在部署的时候不修改任何配置即可接入一种日志实现方案。

## common-logging
`common-logging`是`apache`的一个开源项目。也称`Jakarta Commons Logging`，缩写 `JCL`。`common-logging` 的功能是提供日志功能的 `API` 接口，本身并不提供日志的具体实现（当然，`common-logging` 内部有一个 `Simple logger` 的简单实现，但是功能很弱，直接忽略），而是在运行时动态的绑定日志实现组件来工作（如 `log4j`、`java.util.loggin`）。

## slf4j
全称为 `Simple Logging Facade for Java`，即 `java` 简单日志门面。类似于 `Common-Logging`，`slf4j` 是对不同日志框架提供的一个 `API` 封装，可以在部署的时候不修改任何配置即可接入一种日志实现方案。但是，`slf4j` 在编译时静态绑定真正的 `Log` 库。使用 `SLF4J` 时，如果你需要使用某一种日志实现，那么你必须选择正确的 `SLF4J` 的 `jar` 包的集合（各种桥接包）


## common-logging vs slf4j
`slf4j` 库类似于 `Apache Common-Logging`。但是，他在编译时静态绑定真正的日志库。这点似乎很麻烦，其实也不过是导入桥接 `jar` 包而已。

`slf4j` 一大亮点是提供了更方便的日志记录方式：

不需要使用`logger.isDebugEnabled()`来解决日志因为字符拼接产生的性能问题。`slf4j` 的方式是使用`{}`作为字符串替换符，形式如下：

```java
logger.debug("id: {}, name: {} ", id, name);
```

**总结** 使用 slf4j + Logback 可谓是目前最理想的日志解决方案了。

#  slf4j + Logback 
添加依赖到 `pom.xml` 中即可。`logback-classic-1.0.13.jar` 会自动将 `slf4j-api-1.7.21.jar` 和 `logback-core-1.0.13.jar` 也添加到你的项目中。

```java
<dependency>
  <groupId>ch.qos.logback</groupId>
  <artifactId>logback-classic</artifactId>
  <version>1.0.13</version>
</dependency>
```

```java
<?xml version="1.0" encoding="UTF-8" ?>
 
<!-- logback中一共有5种有效级别，分别是TRACE、DEBUG、INFO、WARN、ERROR，优先级依次从低到高 -->
<configuration scan="true" scanPeriod="60 seconds" debug="false">
 
  <property name="DIR_NAME" value="spring-helloworld"/>
 
  <!-- 将记录日志打印到控制台 -->
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n</pattern>
    </encoder>
  </appender>
 
  <!-- RollingFileAppender begin -->
  <appender name="ALL" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- 根据时间来制定滚动策略 -->
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>${user.dir}/logs/${DIR_NAME}/all.%d{yyyy-MM-dd}.log</fileNamePattern>
      <maxHistory>30</maxHistory>
    </rollingPolicy>
 
    <!-- 根据文件大小来制定滚动策略 -->
    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
      <maxFileSize>30MB</maxFileSize>
    </triggeringPolicy>
 
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n</pattern>
    </encoder>
  </appender>
 
  <appender name="ERROR" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- 根据时间来制定滚动策略 -->
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>${user.dir}/logs/${DIR_NAME}/error.%d{yyyy-MM-dd}.log</fileNamePattern>
      <maxHistory>30</maxHistory>
    </rollingPolicy>
 
    <!-- 根据文件大小来制定滚动策略 -->
    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
      <maxFileSize>10MB</maxFileSize>
    </triggeringPolicy>
 
    <filter class="ch.qos.logback.classic.filter.LevelFilter">
      <level>ERROR</level>
      <onMatch>ACCEPT</onMatch>
      <onMismatch>DENY</onMismatch>
    </filter>
 
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n</pattern>
    </encoder>
  </appender>
 
  <appender name="WARN" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- 根据时间来制定滚动策略 -->
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>${user.dir}/logs/${DIR_NAME}/warn.%d{yyyy-MM-dd}.log</fileNamePattern>
      <maxHistory>30</maxHistory>
    </rollingPolicy>
 
    <!-- 根据文件大小来制定滚动策略 -->
    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
      <maxFileSize>10MB</maxFileSize>
    </triggeringPolicy>
 
    <filter class="ch.qos.logback.classic.filter.LevelFilter">
      <level>WARN</level>
      <onMatch>ACCEPT</onMatch>
      <onMismatch>DENY</onMismatch>
    </filter>
 
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n</pattern>
    </encoder>
  </appender>
 
  <appender name="INFO" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- 根据时间来制定滚动策略 -->
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>${user.dir}/logs/${DIR_NAME}/info.%d{yyyy-MM-dd}.log</fileNamePattern>
      <maxHistory>30</maxHistory>
    </rollingPolicy>
 
    <!-- 根据文件大小来制定滚动策略 -->
    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
      <maxFileSize>10MB</maxFileSize>
    </triggeringPolicy>
 
    <filter class="ch.qos.logback.classic.filter.LevelFilter">
      <level>INFO</level>
      <onMatch>ACCEPT</onMatch>
      <onMismatch>DENY</onMismatch>
    </filter>
 
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n</pattern>
    </encoder>
  </appender>
 
  <appender name="DEBUG" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- 根据时间来制定滚动策略 -->
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>${user.dir}/logs/${DIR_NAME}/debug.%d{yyyy-MM-dd}.log</fileNamePattern>
      <maxHistory>30</maxHistory>
    </rollingPolicy>
 
    <!-- 根据文件大小来制定滚动策略 -->
    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
      <maxFileSize>10MB</maxFileSize>
    </triggeringPolicy>
 
    <filter class="ch.qos.logback.classic.filter.LevelFilter">
      <level>DEBUG</level>
      <onMatch>ACCEPT</onMatch>
      <onMismatch>DENY</onMismatch>
    </filter>
 
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n</pattern>
    </encoder>
  </appender>
 
  <appender name="TRACE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- 根据时间来制定滚动策略 -->
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>${user.dir}/logs/${DIR_NAME}/trace.%d{yyyy-MM-dd}.log</fileNamePattern>
      <maxHistory>30</maxHistory>
    </rollingPolicy>
 
    <!-- 根据文件大小来制定滚动策略 -->
    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
      <maxFileSize>10MB</maxFileSize>
    </triggeringPolicy>
 
    <filter class="ch.qos.logback.classic.filter.LevelFilter">
      <level>TRACE</level>
      <onMatch>ACCEPT</onMatch>
      <onMismatch>DENY</onMismatch>
    </filter>
 
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n</pattern>
    </encoder>
  </appender>
 
  <appender name="SPRING" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!-- 根据时间来制定滚动策略 -->
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>${user.dir}/logs/${DIR_NAME}/springframework.%d{yyyy-MM-dd}.log
      </fileNamePattern>
      <maxHistory>30</maxHistory>
    </rollingPolicy>
 
    <!-- 根据文件大小来制定滚动策略 -->
    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
      <maxFileSize>10MB</maxFileSize>
    </triggeringPolicy>
 
    <encoder>
      <pattern>%d{HH:mm:ss.SSS} [%thread] [%-5p] %c{36}.%M - %m%n</pattern>
    </encoder>
  </appender>
  <!-- RollingFileAppender end -->
 
  <!-- logger begin -->
  <!-- 本项目的日志记录，分级打印 -->
  <logger name="org.zp.notes.spring" level="TRACE" additivity="false">
    <appender-ref ref="STDOUT"/>
    <appender-ref ref="ERROR"/>
    <appender-ref ref="WARN"/>
    <appender-ref ref="INFO"/>
    <appender-ref ref="DEBUG"/>
    <appender-ref ref="TRACE"/>
  </logger>
 
  <!-- SPRING框架日志 -->
  <logger name="org.springframework" level="WARN" additivity="false">
    <appender-ref ref="SPRING"/>
  </logger>
 
  <root level="TRACE">
    <appender-ref ref="ALL"/>
  </root>
  <!-- logger end -->
 
</configuration>
```

