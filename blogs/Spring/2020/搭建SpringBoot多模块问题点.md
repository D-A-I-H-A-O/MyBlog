---
title: 搭建SpringBoot多模块问题点
date: 2020-12-26
categories:
 - SpringBoot
tags:
 - SpringBoot

---

﻿# packaging

![在这里插入图片描述](https://img-blog.csdnimg.cn/202011211159176.png#pic_center)
* 配置`<packaging>pom</packaging>`的意思是使用`maven`分模块管理，都会有一个父级项目，`pom`文件一个重要的属性就是`packaging（打包类型）`，一般来说所有的父级项目的`packaging`都为`pom`，`packaging`默认类型`jar`类型，如果不做配置，`maven`会将该项目打成`jar`包

# properties
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201121122545914.png#pic_center)
* 指定jdk版本以及项目maven编码集

# druid
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201121122815411.png#pic_center)
* 当application.yml文件中配置数据源有druid时没有引入druid依赖，配置是失效的。

会报错：Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could be configured.
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201121122943175.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)
# driver-class-name
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201121123042156.png#pic_center)
* 驱动名字要对上 不然也是无法注入上数据源的

# 文件编码
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201121130007174.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)
# jdk编译版本
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201121130054857.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)
# 打包

```go
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.6.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
```
* 多模块打包只需要在需要启动类的项目下写上插件打包即可

# 自动注入
出现Consider defining a bean of type ‘xxx‘ in your configuration

由于RedisUtils放在了公共模块中，并且也使用了@Component注解，但是自动注入找不到。
* 可在主启动类中使用注解将公共模块也扫描进去
`scanBasePackages`写上基础包名
```java
@SpringBootApplication(scanBasePackages = "")
```
使用`@ComponentScan`注解也是一样的
