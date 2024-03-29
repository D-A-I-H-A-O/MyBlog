﻿---
title: 一条SQL查询语句被执行
date: 2022-06-11
categories:
 - Database
tags:
 - sql
---


在`Java`系统和 `MySQL` 进行交互之前，`MySQL` 驱动会帮我们建立好连接，然后我们只需要发送 `SQL` 语句就可以执行 `CRUD` 了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210122102908891.png)
一次 `SQL` 请求就会建立一个连接，多个请求就会建立多个连接。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2021012210292192.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
`Java` 系统在通过 `MySQL` 驱动和 `MySQL` 数据库连接的时候是基于 `TCP/IP` 协议的，所以如果每个请求都是新建连接和销毁连接，那这样势必会造成不必要的浪费和性能的下降。使用数据库连接池可解决此问题。

>数据库连接池 维护一定的连接数，方便系统获取连接，使用就去池子中获取，用完放回去就可以了，我们不需要关心连接的创建与销毁，也不需要关心线程池是怎么去维护这些连接的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210122102955358.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
我们已经知道的是我们的系统在访问  `MySQL`  数据库的时候，建立的连接并不是每次请求都会去创建的，而是从数据库连接池中去获取，这样就解决了因为反复的创建和销毁连接而带来的性能损耗问题了。业务系统是并发的，但是 `MySQL`  的数据库的接受请求还只是一个。

其实`MySQL` 的架构体系中也已经提供了这样的一个池子，也是**数据库连池**。双方都是通过数据库连接池来管理各个连接的，这样一方面线程之前不需要是争抢连接，更重要的是不需要反复的创建的销毁连接.
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210122103014920.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
1、`Mysql`线程接到请求，获取到`sql`语句转交`sql`接口处理
2、解析器对`sql`语句进行解析(翻译成`mysql`能认识)
3、查询缓存主要用来缓存我们所执行的 `SELECT` 语句以及该语句的结果集。(`MySQL 8.0` 版本后移除)
4、`mysql`对解析出来`sql`语句会进行优化，选择最优的查询路径
5、得出最优路径，由执行器调用存储引擎接口，执行`sql`语句。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210122110450488.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

# MySQL 的逻辑架构图

`MySQL` 可以分为 `Server` 层和存储引擎层两部分。

`Server` 层包括连接器、查询缓存、分析器、优化器、执行器等，涵盖 `MySQL` 的大多数核心服务功能，以及所有的内置函数（如日期、时间、数学和加密函数等），所有跨存储引擎的功能都在这一层实现，比如存储过程、触发器、视图等。

而存储引擎层负责数据的存储和提取。其架构模式是**插件式**的，支持 `InnoDB`、`MyISAM`、`Memory` 等多个存储引擎。现在最常用的存储引擎是 `InnoDB`，它从 `MySQL 5.5.5` 版本开始成为了默认存储引擎。

也就是说，你执行 `create table` 建表的时候，如果不指定引擎类型，默认使用的就是 `InnoDB`。不过，你也可以通过指定存储引擎的类型来选择别的引擎，比如在 `create table` 语句中使用 `engine=memory`, 来指定使用内存引擎创建表。不同存储引擎的表数据存取方式不同，支持的功能也不同。

## 连接器
连接器负责跟客户端建立连接、获取权限、维持和管理连接。

连接完成后，如果你没有后续的动作，这个连接就处于空闲状态，你可以在 `show processlist` 命令中看到它

![在这里插入图片描述](https://img-blog.csdnimg.cn/2b27b4c45aad4b6c8daf6d6055386ed2.png)
客户端如果太长时间没动静，连接器就会自动将它断开。这个时间是由参数 `wait_timeout` 控制的，默认值是 `8` 小时。

如果在连接被断开之后，客户端再次发送请求的话，就会收到一个错误提醒： `Lost connection to MySQL server during query`。这时候如果你要继续，就需要重连，然后再执行请求了。

数据库里面，长连接是指连接成功后，如果客户端持续有请求，则一直使用同一个连接。短连接则是指每次执行完很少的几次查询就断开连接，下次查询再重新建立一个。

建立连接的过程通常是比较复杂的，所以我建议你在使用中要尽量减少建立连接的动作，也就是尽量使用长连接。

但是全部使用长连接后，你可能会发现，有些时候 `MySQL` 占用内存涨得特别快，这是因为 `MySQL` 在执行过程中临时使用的内存是管理在连接对象里面的。这些资源会在连接断开的时候才释放。所以如果长连接累积下来，可能导致内存占用太大，被系统强行杀掉（`OOM`），从现象看就是 `MySQL` 异常重启了。

怎么解决这个问题呢？你可以考虑以下两种方案。

1、定期断开长连接。使用一段时间，或者程序里面判断执行过一个占用内存的大查询后，断开连接，之后要查询再重连。

2、如果你用的是 `MySQL 5.7` 或更新版本，可以在每次执行一个比较大的操作后，通过执行 `mysql_reset_connection` 来重新初始化连接资源。这个过程不需要重连和重新做权限验证，但是会将连接恢复到刚刚创建完时的状态。

## 查询缓存
`MySQL` 拿到一个查询请求后，会先到查询缓存看看，之前是不是执行过这条语句。之前执行过的语句及其结果可能会以 `key-value` 对的形式，被直接缓存在内存中。`key` 是查询的语句，`value` 是查询的结果。如果你的查询能够直接在这个缓存中找到 `key`，那么这个 `value` 就会被直接返回给客户端。

如果语句不在查询缓存中，就会继续后面的执行阶段。执行完成后，执行结果会被存入查询缓存中。你可以看到，如果查询命中缓存，`MySQL` 不需要执行后面的复杂操作，就可以直接返回结果，这个效率会很高。

但是大多数情况下我会建议你不要使用查询缓存，为什么呢？因为查询缓存往往弊大于利。

查询缓存的失效非常频繁，只要有对一个表的更新，这个表上所有的查询缓存都会被清空。因此很可能你费劲地把结果存起来，还没使用呢，就被一个更新全清空了。对于更新压力大的数据库来说，查询缓存的命中率会非常低。除非你的业务就是有一张静态表，很长时间才会更新一次。比如，一个系统配置表，那这张表上的查询才适合使用查询缓存。

好在 `MySQL` 也提供了这种“按需使用”的方式。你可以将参数 `query_cache_type` 设置成 `DEMAND`，这样对于默认的 `SQL` 语句都不使用查询缓存。而对于你确定要使用查询缓存的语句，可以用 `SQL_CACHE` 显式指定。

需要注意的是，`MySQL 8.0` 版本直接将查询缓存的整块功能删掉了，也就是说 `8.0` 开始彻底没有这个功能了。

## 分析器
如果没有命中查询缓存，就要开始真正执行语句了。首先，`MySQL` 需要知道你要做什么，因此需要对 `SQL` 语句做解析。

分析器先会做“词法分析”。你输入的是由多个字符串和空格组成的一条 `SQL` 语句，`MySQL` 需要识别出里面的字符串分别是什么，代表什么。

`MySQL` 从你输入的`"select"`这个关键字识别出来，这是一个查询语句。它也要把字符串`“Table”`识别成“表名 `“Table”`，把字符串`“ID”`识别成`“列 ID”`。

做完了这些识别以后，就要做“语法分析”。根据词法分析的结果，语法分析器会根据语法规则，判断你输入的这个 `SQL` 语句是否满足 `MySQL` 语法。

如果你的语句不对，就会收到`“You have an error in your SQL syntax”`的错误提醒。

一般语法错误会提示第一个出现错误的位置，所以你要关注的是紧接`“use near”`的内容。

## 优化器
经过了分析器，`MySQL` 就知道你要做什么了。在开始执行之前，还要先经过优化器的处理。

优化器是在表里面有多个索引的时候，决定使用哪个索引；或者在一个语句有多表关联（`join`）的时候，决定各个表的连接顺序。比如你执行下面这样的语句，这个语句是执行两个表的 `join`：

```java
mysql> select * from t1 join t2 using(ID)  where t1.c=10 and t2.d=20;
```

既可以先从表 `t1` 里面取出 `c=10` 的记录的 `ID` 值，再根据 `ID` 值关联到表 `t2`，再判断 `t2` 里面 `d` 的值是否等于 `20`。

也可以先从表 `t2` 里面取出 `d=20` 的记录的 `ID` 值，再根据 `ID` 值关联到 `t1`，再判断 `t1` 里面 `c` 的值是否等于 `10`。

这两种执行方法的逻辑结果是一样的，但是执行的效率会有不同，而优化器的作用就是决定选择使用哪一个方案。

优化器阶段完成后，这个语句的执行方案就确定下来了，然后进入执行器阶段。

## 执行器
`MySQL` 通过分析器知道了你要做什么，通过优化器知道了该怎么做，于是就进入了执行器阶段，开始执行语句。

开始执行的时候，要先判断一下你对这个表有没有执行查询的权限，如果没有，就会返回没有权限的错误

```
mysql> select * from T where ID=10;
 
ERROR 1142 (42000): SELECT command denied to user 'b'@'localhost' for table 'T'
```

如果有权限，就打开表继续执行。打开表的时候，执行器就会根据表的引擎定义，去使用这个引擎提供的接口。

比如我们这个例子中的表 `T` 中，`ID` 字段没有索引，那么执行器的执行流程是这样的：

调用 `InnoDB` 引擎接口取这个表的第一行，判断 `ID` 值是不是 `10`，如果不是则跳过，如果是则将这行存在结果集中；调用引擎接口取“下一行”，重复相同的判断逻辑，直到取到这个表的最后一行。

执行器将上述遍历过程中所有满足条件的行组成的记录集作为结果集返回给客户端。

至此，这个语句就执行完成了。

对于有索引的表，执行的逻辑也差不多。第一次调用的是“取满足条件的第一行”这个接口，之后循环取“满足条件的下一行”这个接口，这些接口都是引擎中已经定义好的。

你会在数据库的慢查询日志中看到一个 `rows_examined` 的字段，表示这个语句执行过程中扫描了多少行。这个值就是在执行器每次调用引擎获取数据行的时候累加的。



![在这里插入图片描述](https://img-blog.csdnimg.cn/20210122112008688.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)



[码海：头条二面：详述一条 SQL 的执行过程](https://juejin.cn/post/6920076107609800711#heading-0)

[ratelfu：一条SQL语句在MySQL中执行过程全解析](https://blog.csdn.net/weter_drop/article/details/93386581?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522161128447716780261971166%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=161128447716780261971166&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-6-93386581.first_rank_v2_pc_rank_v29&utm_term=sql%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B&spm=1018.2226.3001.4187)
