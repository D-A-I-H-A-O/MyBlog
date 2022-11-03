---
title: SpringBoot项目使用Jackson格式化JSON日期
date: 2020-12-26
categories:
 - SpringBoot
tags:
 - Jackson
---

﻿@[TOC]
最近遇到日期处理问题，网上发现各式各样，最后看了很多才看明白，做个总结。

最开始看有说使用Jackson格式化需要导入依赖，不知道是不是之前版本需要，还是怎么样，自己好像一直都没有引入过什么依赖，只要是SpringBoot项目即可，因为Jackson被Spring Boot用作其默认的JSON处理器。

有四种使用方法：

#  @JsonFormat
>在日期字段上标注` @JsonFormat`即可

```java
public class DateDTO {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date date;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

}
```
对应的输出：
```
{
	"date": "2020-12-19 16:12:46"
}
```

* pattern有`yyyy-MM-dd`，`yyyy-MM-dd HH:mm:ss`不同转换格式
* timezone则是指定时区

# yml或properties
>可以在yml文件或properties文件中配置，即为所有日期类型进行转换，进行全局配置。但这种方法它不适用于Java 8日期类型，例如 LocalDate 和 LocalDateTime，我们只能使用它来格式化java.util.Date或 java.util.Calendar类型的字段。

* yml文件

```yml
spring:
  jackson:
    time-zone: GMT+8
    date-format: yyyy-MM-dd HH:mm:ss
    default-property-inclusion: always
```
* properties文件：

```yml
spring.jackson.date-format = yyyy-MM-dd HH:mm:ss
spring.jackson.time-zone= GMT+8
spring.jackson.default-property-inclusion=ALWAYS
```
* date-format：指定时间格式
* time-zone：指定时区
* default-property-inclusion：指定属性即使为null，仍然也会输出这个key

# @JsonComponent

> @JsonFormat 注解的优先级比较高，会以 @JsonFormat 注解的时间格式为主。所以一般可以使用@JsonFormat + @JsonComponent一起使用

```java
@JsonComponent
public class DateFormatConfig {

    private static final String dateFormat = "yyyy-MM-dd";
    private static final String dateTimeFormat = "yyyy-MM-dd HH:mm:ss";

    /**
     * 格式化Date
     */
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilder() {

        return builder -> {
            TimeZone timeZone = TimeZone.getTimeZone("UTC");
            DateFormat dateFormat = new SimpleDateFormat(dateTimeFormat);
            dateFormat.setTimeZone(timeZone);
            builder.failOnEmptyBeans(false)
                    .failOnUnknownProperties(false)
                    .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                    .dateFormat(dateFormat);
        };
    }

    /**
     * 格式化LocalDate和LocalDateTime
     */
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        return builder -> {
            builder.simpleDateFormat(dateTimeFormat);
            builder.serializers(new LocalDateSerializer(DateTimeFormatter.ofPattern(dateFormat)));
            builder.serializers(new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(dateTimeFormat)));
        };
    }
}
```
# @Configuration 

>将上面的@JsonComponent替换成@Configuration 也是可以的，但是使用这中方法相当与在配置文件中配置，字段上加@JsonFormat 注解将不再生效。


配上测试代码：

* pom文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.1</version>
        <relativePath/>
    </parent>
    <groupId>com.daihao</groupId>
    <artifactId>data-format</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>data-format</name>
    <description>Spring Boot项目使用Jackson格式化JSON日期</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

</project>
```

时间类：

```java
public class DateDTO {

    private Date date;
    private LocalDate localDate;
    private LocalDateTime localDateTime;

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }

    public LocalDate getLocalDate() {
        return localDate;
    }

    public void setLocalDate(LocalDate localDate) {
        this.localDate = localDate;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
    
}
```

测试Controller：

```java
@RestController
public class TestController {

    /**
     * 测试时间序列化, java.util.date 类型 -> String
     */
    @RequestMapping("/dateToString")
    public DateDTO dateFormatTest() {
        DateDTO date = new DateDTO();
        date.setDate(new Date());
        date.setLocalDate(LocalDate.now());
        date.setLocalDateTime(LocalDateTime.now());
        return date;
    }

    /**
     * 测试时间反序列化 String ->  java.util.date 类型
     */
    @PostMapping(value = "/stringToDate")
    public void dateFormatTest2(@RequestBody DateDTO dto) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println(dateFormat.format(dto.getDate()));
        System.out.println(dateFormat.format(dto.getLocalDate()));
    }

}
```

