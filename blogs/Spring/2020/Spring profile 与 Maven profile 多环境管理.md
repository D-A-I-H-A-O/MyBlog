---
title: Spring profile 与 Maven profile 多环境管理
date: 2020-12-26
categories:
 - Spring 
tags:
 - Spring 
 - Maven

---

﻿@[toc]

实际开发中一个项目至少对应开发、测试、生成三种环境，如何方便的管理多环境

# Spring Profile

Spring Profile 是 Spring 提供的多环境管理方案。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200810141723260.png)

如图，每种环境都对应一个 yml 文件，然后在`application.yml`中配置一下要使用的环境

```
spring:
  profiles:
    active: dev
```

上面配置匹配的是 `application-dev.yml`,如果写的是test，则匹配 `application-test.yml`。也就是说，Spring Profile 对配置文件的命名有要求，必须是 `application-` 开头

>除了配置环境外，一些不随环境而变化的配置也应该放到 application.yml中，application-.yml最好只存放与环境相关的配置项

Spring Profile 给出的多环境管理方案:通过改变 `spring.profiles.active`的值来切换不同的环境.
存在两个问题
>1、每次切换环境要手动修改 spring.profiles.active 的值
>2、打包的时候，要手动删除其它环境的配置文件，不然其它环境的敏感信息就都打包进去了


#  Maven profile 
* maven 的 profile 可以让我们定义多套配置信息，并指定其激活条件，然后在不同的环境下使用不同的profile配置。

在maven中有两个地方可以配置 profile

1、`pom.xml`中：这里面定义的 profile 作用范围是当前项目
2、`{user}/.m2/settings.xml`中：这里面定义的 profile 作用范围是所有使用了该配置文件的项目

**`settings.xml`中的 profile**

* 不同的地方 profile 中能定义的信息也不相同

* 由于settings.xml作用范围宽泛， profile 中只能定义一些公共信息，如下

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      https://maven.apache.org/xsd/settings-1.0.0.xsd">
    ...
    <profiles>
        <profile>
            <id>...</id> <!-- id：该 profile 的唯一标识 -->
            <activation>...</activation><!-- activation：在哪些情况下激活 profile,这里面有多种策略可供选择,只要满足其中一个条件就激活 -->
            <repositories>...</repositories><!-- repositories：远程仓库 -->
        </profile>
    </profiles>
    ...
</settings>
```
* 由于能配置的东西有限，一般都会将 maven profile 配置在pom.xml

**`pom.xml`中 的profile**
* pom.xml中：profile 能定义的东西就非常多了，如下

```xml
<profiles>
    <profile>
        <id>..</id>
        <activation>...</activation>
        <build>...</build>
        <modules>...</modules>
        <repositories>...</repositories>
        <pluginRepositories>...</pluginRepositories>
        <dependencies>...</dependencies>
        <reporting>...</reporting>
        <dependencyManagement>...</dependencyManagement>
        <distributionManagement>...</distributionManagement>
    </profile>
</profiles>
```
当然我们的目的也不是把它配全，而是解决 Spring Profile 遗留下来的两个问题。

**问题1**

>每次切换环境要手动修改`spring.profiles.active`的值

这个问题就可以通过配置 profile 解决，在pom的根节点下添加
```xml
<profiles>
    <profile>
        <id>dev</id>
        <activation>
            <!-- activeByDefault 为 true 表示，默认激活 id为dev 的profile-->
            <activeByDefault>true</activeByDefault>
        </activation>
        <!-- properties 里面可以添加自定义节点，如下添加了一个env节点 -->
        <properties>
            <!-- 这个节点的值可以在maven的其他地方引用，可以简单理解为定义了一个叫env的变量 -->
            <env>dev</env>
        </properties>
    </profile>
    <profile>
        <id>test</id>
        <properties>
            <env>test</env>
        </properties>
    </profile>
    <profile>
        <id>prod</id>
        <properties>
            <env>prod</env>
        </properties>
    </profile>
</profiles>
```
如上，定义了三套环境，其中id为dev的是默认环境，三套环境中定义了叫 env的“变量”

如果你用的是idea编辑器，添加好后，maven控件窗口应该会多出一个 Profiles,其中默认值就是上面配置的dev
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200810143138954.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
* 最小化的 profiles 已经配置好了，通过勾选上图中的Profiles，就可以快速切换 maven的 profile 环境。
* 现在 maven profile 可以通过 勾选上图中的Profiles 快速切换环境,Spring Profile 还得通过 手动修改spring.profiles.active的值来切环境
* 现在的问题是怎样让 maven profile的环境与Spring Profile一一对应，达到切换maven profile环境时，Spring Profile环境也被切换了

还记得maven profile 中定义的 env "变量"吗,现在只需要把
```
spring:
  profiles:
    active: dev
```
改成
```
spring:
  profiles:
    active: @env@
```
就将maven profile 与 Spring Profile 环境关联起来了
>当maven profile 将 环境切换成 test 时，在pom中定义的id为test的profile环境将被激活，在该环境下env的值是test，maven插件会将 @env@ 替换为 test，这样Spring Profile的环境也随之发生了改变。从上面可以看出，自定义的"变量"env的值还不能乱写，要与Spring Profile的环境相对应。

**问题2**

打包的时候，要手动删除其它环境的配置文件，不然其它环境的敏感信息就都打包进去了

解决这个问题需要在pom根节点下中配置 build 信息
```xml
<build>
    <resources>
        <resource>
            <directory>src/main/resources</directory><!--directory：资源文件所在目录-->
            <excludes>
                <!--先排除application开头的配置文件-->
                <exclude>application*.yml</exclude><!--excludes：需要排除的文件列表-->
            </excludes>
        </resource>
        <resource>
            <directory>src/main/resources</directory>
            <!--filtering 需要设置为 true，这样在include的时候，才会把
            配置文件中的@env@ 这个maven`变量`替换成当前环境的对应值  -->
            <filtering>true</filtering>
            <includes><!--includes：需要包含的文件列表-->
                <!--引入所需环境的配置文件-->
                <include>application.yml</include>
                <include>application-${env}.yml</include>
            </includes>
        </resource>
    </resources>
</build>

```
如上，配置了两个 <resource>，第一个先排除了src/main/resources目录下所有 application 开头是配置文件，第二个在第一个的基础上添加了所需的配置文件。注意 application-${env}.yml,它是一个动态变化的值，随着当前环境的改变而改变，假如当前环境是 id叫 dev的 profile，那么env的值为 dev。

这样配置后，maven在build时，就会根据配置先排除掉指定的配置文件，然后根据当前环境添加所需要的配置文件。

**Maven profile 与 Spring profile 有自的优点，结合起来的步骤如下：**

1、在 pom.xml 中定义多个 profile 及自己的属性

2、在 pom.xml 中定义 resource filtering，一方面控制 jar 中包含的资源文件，一方面允许 @XX@ 的变量替换

3、在 application.yml中指定 spring.profiles.active，值为 maven profile 中定义的属性。

4、构建时使用 mvm clean package -P<profile> 来指定 profile。
