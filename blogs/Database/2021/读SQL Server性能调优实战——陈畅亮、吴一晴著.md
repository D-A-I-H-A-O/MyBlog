---
title: 读SQL Server性能调优实战——陈畅亮、吴一晴著
date: 2021-04-04
categories:
 - Database
tags:
 - sql server
---


sqlserver 微软

## 安装

根据业务特点来考虑

1、分析产品业务数据的增长量  预估某些关键业务数据在一定时间内的增长量，预估数据在未来的增长数据，

2、了解产品业务操作类型。考虑业务是以查询为主还是以更新为主。从而选择多大的内存。

##  SQL server配置

1、服务端的SQL server配置管理器（SQL server Configuration Management ）

2、客户端的SQL server Management Studio

## 数据库连接安全性

三种方式的连接协议

1、 共享内存

2、命名管道

3、TCP/IP协议

**数据库实例配置**

1、对CPU的使用分配，可以选择SQL server使用或者不使用某些CPU线程

2、内存配置，通过对操作系统内存的总体应用，从而优化数据库性能

​	2.1、最大服务器内存：SQL server的Buffer Pool最大使用的内存量。默认值2147483647MB。

当配置为0或者超过当前系统最大内存值时，使用系统最大内存量。当设置小于当前系统的最大内存值，并且大于最小内存值时，SQL server实例到达设置的最大内存量后，将不会继续扩大内存的使用量。

​	2.2、最小服务器内存：为SQL server实例预留能够使用的内存，当服务器内存出现压力，数据库收缩持有内存量，到达配置值将不在收缩。

## 影响sqlserver性能的因素

1、内存

1.1、执行计划缓存

​	    执行T-SQl语句是，数据库引擎接收到语句后，首先会进行一系列复杂的计算分析，得到相应的执行计划，再根据执行计划进行各种操作。由于执行计划的计算和分析占用CPU资源较多，SQL server会将分析生成好的执行计划缓存起来，称之为`执行计划缓存`



1.2、数据缓存 

内存和磁盘中读写数据，内存速度较快。所以SQL server的数据操作都是通过内存来实现的。数据库获取到执行计划后，会根据执行计划中所对应的操作来执行，若遇到数据访问操作符，会先从缓存中查询，如果没有才从磁盘中读取数据并缓存到缓存中。

​	如果数据库内存不足，数据库引擎会使用最近最少使用的算法将缓存数据清理，然后存入缓存。这样会引起大量的磁盘IO，并导致执行语句执行效率降低。



2、CPU

​	任务调度，执行计划分析，排序等计算时都要使用大量的CPU资源。一般来说，CPU占用资源30%左右，服务器比较空闲。到达50%-60%，表示服务器繁忙，如果到达80%，表示服务器非常繁忙。



3、磁盘I/O

​	数据库引擎会定期将缓存数据写入磁盘，为确保数据一致性，SQL server引入锁机制闩（shuan）锁（Latch），如果磁盘I/O能力差，同样造成语句性能低下。

​	为确保数据库ACID，SQL server还引入日志的机制，日志记录磁盘几乎都是实时的，当事务提交时，事务日志便会写入磁盘，如果磁盘I/O能力差，同样影响语句的执行速度。



4、网络带宽

​	SQL server服务为服务进程，与客户端程序为两个不同的程序，在进行客户端和数据库引擎的指令发送和数据读取过程，网络间的传输速率将直接影响到SQL server的运行效率。



5、SQL server版本

​	SQL server不同版本对内存，CPU和数据文件的大小存在不同的限制，并收费标准也不同。

   

 ## SQL server约束

1、默认值约束

​	在新增时，没有指定值，则使用默认约束中定义的值填充。默认值约束只在新增数据时才会被调用，且只影响新增的行，对数据库引擎来说，它的影响几乎可以忽略不计。



2、Check约束

​	在新增或者修改数据时，会判断新值是否满足Check约束的定义，若不符合则返回相应警告信息。Check约束就是告诉查询优化器，这个字段的值只有某些值。例如性别字段，其约束值只能为“Male”和“Female”两种值。当查询语句通过字段查找不到这两种值，就直接返回空数据，因为约束告诉查询优化器，过滤的这两个值是不存在的。



3、唯一约束

​	创建一个唯一约束会默认创建一个唯一索引。它在校验时，是利用索引的树结构来检索的，唯一索引是筛选条件非常高的一种索引结构。



4、外键约束

​	外键约束保证主、子表的完整性，在子表进行操作时，会同时校验主表的数据是否完整。这个过程会对主表加锁查询，其主表的关联字段一定是主键或者唯一键，检验速度非常快，不会有太大问题。

​	当子表进行删除操作，外键约束会去校验子表的关联字段是否存在，如果子表的关联字段没有索引，将会扫描整个子表，这会开销剧增。所以当添加外键关联时，需要同时检查子表中的关联字段是否有索引。                     



## T-SQL与性能调优

> SELECT

​	1.1、避免使用select *

​	1.2、限定好查询出的结果集，当结果集较大，就应该考虑是否限制结果集大小，使用top子句或者使用分布算法对数据进行分页处理。

​	1.3、对数据进行过滤时，应优先考虑索引字段。不要在过滤字段上使用任何计算，包括函数，逻辑计算，普通计算，使用计算将造成查询优化器无法使用相应字段的索引。

​	1.4、尽量使用有索引的字段进行排序



> ORDER BY

​	2.1、order by子句的性能取决于参加排序操作的数据量的大小。排序操作会在数据筛选完后，对结果集进行排序，当排序操作超过可以分配的内存大小时，会将排序的中间数据存在Tempdb数据库中，这将增加I/O操作，导致语句性能下降。

> Tempdb是SQL server的一个系统数据库，用于存储查询过程中产生的中间数据。Tempdb磁盘占用增长了，需占用大量磁盘I/O写入数据，且Tempdb是公共资源。容易造成资源阻塞，影响其他会话正常工作。

> GROUP BY

​	分组排序需要对数据进行分类，分类也需要使用排序算法，所以对排序的优化，适用与group by


> DISTINCT

​	distinct关键字所实现的功能就是对指定查询字段进行一次group by 



> UPDATE

 1、update首先会将符合条件数据筛选出来（与SELECT语句类似，其性能取决于检索数据的数据量），SQL server会优先对数据添加更新锁，当确定是需要更新的数据，再将更新锁转为排他锁，然后更新数据。

2、小数据量的更新建议使用主键或者唯一键字段来更新

3、update语句不支持group by 和 order by子句
    
> DELETE

1、delete用于删除符合条件数据，其检索数据性能也与SELECT语句类似，其性能取决于检索数据的数据量
2、delete操作会将数据行记录在日志文件中，因此大批量删除数据时，会有大量的日志生成
3、TRUNCATE TABLE可删除整张表数据，并且不对所删除数据生成记录日志
4、delete也不支持group by 和 order by子句
       
[一张图看懂 SQL 的各种 JOIN 用法](https://www.runoob.com/w3cnote/sql-join-image-explain.html)

> 连接操作

1、NESTED LOOP：NESTED LOOP适用于小数据量与大数据量的数据集之间的连接操作。NESTED LOOP被认为是性能最好的连接方式。

2、MERGE JOIN：MERGE JOIN一般出现在连接数据集的数据量相当，并且数据几的连接条件均为顺序排列。

 3、HASH JOIN：HASH JOIN应用在大数据量的连接中，通过SCAN操作，将两份大的数据集取出，并对关联字段进行hash操作，从而得出两个集合的hash数据集，然后将两份hash集合比较，并输出hash值相等的数据行。

>子查询

 1、子查询是一个嵌套在select，insert，update，delete语句及其子查询中的查询
    
 2、子查询尽量集中在where子句中，方便阅读

3、在一个语句中，子查询的数据最好不超过3个，整个查询语句涉及的表不超过5个

 4、避免在子查询中对大的数据集进行汇总或排序操作

   5、应尽量缩小子查询中可能返回的结果集，使得涉及的数据量尽量小
    
> FOR XML子句
> 
1、FOR XML子句将通过sql查询返回的结果集转换为xml格式的数据

用法：
>1、AUTO模式：返回数据表为起表名的元素，每一列的值返回为属性；
 SELECT *  FROM tb_test for xml auto
 2、RAW模式：返回数据行为元素，每一列的值作为元素的属性；
 SELECT *  FROM tb_test for xml raw('fsf')
 3、PATH模式：通过简单的XPath语法来允许用户自定义嵌套的XML结构、元素、属性值
 SELECT *  FROM tb_test for xml path('fsf')
 4、EXPLICIT模式：通过SELECT语法定义输出XML的结构

常见用法合并字段：
```sql
select orderNum+',' from orderHeader  where orderNum is not null for xml path('')
```

>  BULK...INSERT

[Bulk Insert命令详细](https://blog.csdn.net/jackmacro/article/details/5959321?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522161639896216780262515487%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=161639896216780262515487&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-1-5959321.first_rank_v2_pc_rank_v29&utm_term=bulk+insert)

>  INSERT...SELECT
>  
批量将查询的数据插入目标表中。

> SELECT...INTO

与 INSERT...SELECT类似，但是SELECT INTO语句必须导入到一个并不存在的表，SELECT INTO会自动依据结果集推测数据类型
    
>  OUTPUT
>  
OUTPUT子句可以输出insert，update，delete语句中被修改数据的旧版本及当前版本，这样就能很方便得获取到被修改数据的前后版本。

> MERGE

[SQLServer MERGE 用法](https://blog.csdn.net/qq_27628011/article/details/89319710?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522161639940616780262551380%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=161639940616780262551380&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-1-89319710.first_rank_v2_pc_rank_v29&utm_term=sqlserver+merge)

## SQL server 执行计划分析
实际执行计划：该语句是实际执行过了的，同时实际执行计划中的数据都是实际采集到的，而不是预估的。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210322211214430.png)
预估执行计划：是SQL server优化引擎根据统计信息、执行计划的计算等为参考评估出来的，是虚拟的执行计划，即这个执行语句是查询优化引擎评估出来的，表示应该照这样来做，但还没有实际执行过。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210322211427629.png)

执行计划中，每一个结点均是一个实际的操作，可以称为操作符或迭代器。下图是一个简单的查询语句的执行计划，它将a表的所有数据都查出来，
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210322212457794.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
鼠标在迭代器上驻留，弹出一个详细信息的提示窗口
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210322213229991.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

STATISTICS :查看语句的实际执行计划，执行后实际的I/O信息，以及执行时间。

```sql
SET STATISTICS profile ON
SET STATISTICS io ON
SET STATISTICS time ON
 
GO
 
select * from dbo.a

 
GO


SET STATISTICS profile OFF
SET STATISTICS io OFF
SET STATISTICS time OFF
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210322213939922.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210322213945151.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210322214451192.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
Rows:执行计划的每一步返回的实际行数

Executes:执行计划的每一步被运行了多少次

StmtText:执行计划的具体内容。执行计划以一棵树的形式显示。每一行都是运行的一步，都会有结果集返回，也都会有自己的cost

EstimateRows:SQLSERVER根据表格上的统计信息，预估的每一步的返回行数。在分析执行计划时，

我们会经常将Rows和EstimateRows这两列做对比，先确认SQLSERVER预估得是否正确，以判断统计信息是否有更新

EstimateIO:SQLSERVER根据EstimateRows和统计信息里记录的字段长度，预估的每一步会产生的I/O cost

EstimateCPU:SQLSERVR根据EstimateRows和统计信息里记录的字段长度，以及要做的事情的复杂度，预估每一步会产生的CPU cost

TotalSubtreeCost:SQLSERVER根据EstimateIO和EstimateCPU通过某种计算公式，计算出每一步执行计划子树的cost(包括这一步自己的cost和他的所有下层步骤的cost总和）。

Warnings:SQLSERVER在运行每一步时遇到的警告，例如，某一步没有统计信息支持cost预估等。

Parallel:执行计划的这一步是不是使用了并行的执行计划

Logical Reads: 这是SET STATISTICS IO或SET STATISTICS TIME命令提供的最有用的数据。我们知道，SQL Server在可以对任何数据进行操作前，必须首先把数据读取到其数据缓冲区中。此外，我们也知道SQL Server何时会从数据缓冲区中读取数据，并把数据读取到大小为8K字节的页中。那么LogicalReads的意义是什么呢？Logical Reads是指SQL Server为得到查询中的结果而必须从数据缓冲区读取的页数。在执行查询时，SQL Server不会读取比实际需求多或少的数据，因此，当在相同的数据集上执行同一个查询，得到的LogicalReads的数字总是相同的。（SQL Server执行查询时的Logical Reads值每一次这个数值是不会变化的。因此，在进行查询性能的调节时，这是一个可以用来衡量你的调节措施是否成功的一个很好的标准。如果Logical Reads值下降，就表明查询使用的服务器资源减少，查询的性能有所提高。如果Logical Reads值增加，则表示调节措施降低了查询的性能。在其他条件不变的情况下，一个查询使用的逻辑读越少，其效率就越高，查询的速度就越快。）

Physical Reads：物理读，在执行真正的查询操作前，SQL Server必须从磁盘上向数据缓冲区中读取它所需要的数据。在SQL Server开始执行查询前，它要作的第一件事就是检查它所需要的数据是否在数据缓冲区中，如果在，就从中读取，如果不在，SQLServer必须首先将它需要的数据从磁盘上读到数据缓冲区中。我们可以想象得到，SQL Server在执行物理读时比执行逻辑读需要更多的服务器资源。因此，在理想情况下，我们应当尽量避免物理读操作。下面的这一部分听起来让人容易感到糊涂了。在对查询的性能进行调节时，可以忽略物理读而只专注于逻辑读。你一定会纳闷儿，刚才不是还说物理读比逻辑读需要更多的服务器资源吗？情况确实是这样， SQLServer在执行查询时所需要的物理读次数不可能通过性能调节而减少的。减少物理读的次数是DBA的一项重要工作，但它涉及到整个服务器性能的调节，而不仅仅是查询性能的调节。在进行查询性能调节时，我们不能控制数据缓冲区的大小或服务器的忙碌程度以及完成查询所需要的数据是在数据缓冲区中还是在磁盘上，唯一我们能够控制的数据是得到查询结果所需要执行的逻辑读的次数。因此，在查询性能的调节中，我们可以心安理得地不理会SET STATISTICS IO命令提供的PhysicalRead的值。（减少物理读次数、加快SQL Server运行速度的一种方式是确保服务器的物理内存足够多。）

Read-Ahead Reads： 与Physical Reads一样，这个值在查询性能调节中也没有什么用。Read-Ahead Reads表示SQL Server在执行预读机制时读取的物理页。为了优化其性能，SQL Server在认为它需要数据之前预先读取一部分数据，根据SQLServer对数据需求预测的准确程度，预读的数据页可能有用，也可能没用。在本例中，Read-Ahead Reads的值为9，Physical Read的值为1，而LogicalReads的值为10，它们之间存在着简单的相加关系。
        
### 常见的执行计划操作符
 常用的操作符或迭代器分为：

 1、数据访问操作符
 * SCAN：依据表的不同，又分为
 * 	*  Table Scan：全表扫描

 * 	* Cluster Index Scan：聚集索引扫描，表中所有数据行都存在与聚集索引的叶结点中，所以聚集索引的扫描相当于将整个表中的数据都取出来。

 * * Non-Cluster Index Scan：针对非聚集索引 。Index Scan发生在检索的数据都包含在已经定义好的索引之中（即覆盖索引中），这样便不需要扫描整表，只需要将索引中的数据取处1便可，这样的索引叫做覆盖索引。


 * SEEK：查找操作发生在索引上，通过索引定位到具体的数据，根据索引的不同分为聚集索引查找和非聚集索引查找
 * * Cluster Index Seek ：聚集索引查找发生在对聚集索引字段进行where条件过滤的情况下，对表的聚集索引（被定义为 primary key的字段），默认情况下便是 Cluster Index Seek
 * * Index Seek： 非聚集索引查找发生在对非聚集索引的字段进行where条件过滤的情况下
 * Bookmark Lookup 
* * RIDLookup是在使用提供的行标识符(RID) 在堆上进行的书签查找

* *  KeyLookup运算符是在具有聚集索引的表上进行的书签查找

* * 区别是 Key Lookup通过聚集索引键值进行查找，RID Lookup是通过堆的行标识符（FileID:PageID:SlotNumber）查找,由于都需要额外的IO完成查询，所以这两个操作都是很耗费资源的。

### 关联操作符
1、Nested Loop Join：以小数据量的输入为外部循环表，以较大数据量的集合为内部循环表
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210325162712756.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210325162720721.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

2、Merge Join：对于两个部分的输入数据都只会做一次操作	

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210325162748687.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
3、Hash Join：对于提供输入数据集的两个操作符只会有一次操作，Merge Join需要输入的数据集都是排好序的，而Hash Join则不需要

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210325163018641.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210325163032417.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
>在日常语句维护中,应该注意Nested Loop才是OLTP数据库系统中主要的连接操作符。因为这个操作符代表着更小的数据集操作,更有效的索引利用率。

### 聚合操作符
流聚合（Stream Aggregate）：流聚合与Merge Join类似,流聚合的输入数据集需要的是已排序完成的集合,排序操作要占用内存,并且当内存不够时,会使用Tempdb的表空间。与哈希连接类似,哈希聚合同样需要使用内存空间来完成相应的哈希计算,当内存不足时,会使用Tempdb的表空间。聚合操作是一个阻塞操作,在数据集输入以后,需要等待聚合计算完成,才会输出相应的结果。

哈希聚合（Hash Aggregate）：哈希聚合发生在输入数据集无排序的情况下，Hash Aggregate的迭代器名称为Hash Match

## 执行计划缓存及重编译
数据库执行计划的分析和生成，其开销是昂贵的，为降低代价，SQL server会将生成的执行计划缓存起来，即将这些已生成的执行计划放在内存中，待下次有相同的语句被执行时，可以复用该执行计划。

使用下面的 语句， 可以查看被使用超过5次的执行计划， 以及其对应的执行语句信息。 通过DMF（动态管理函数）sys.dm_exec_ sq I_ text可以获得plan_handlle 对应的执行计划及执行计划的对象 ID (object id) 。

```javascript
SELECT dest.dbid,dest.objectid,decp.objtype,decp.cacheobjtype,dest.text 
FROM sys.dm_exec_cached_plans AS deep 
CROSS APPLY sys.dm_exec_sql_text(decp.plan_handle) AS dest 
WHERE decp.usecounts>5 
```

还可以通过DMF sys.dm_exec_query_plans函数获取当前正在执行语句的执行计划信息

```javascript
SELECT der.session_id,der.request_id,der.status,deqp.query_plan 
fROM sys.dm_exec_requests AS der WITH(NOLOCK)
CROSS APPLY sys.dm_exec_query_plan(der.plan_handle) AS deqp 
```
## 索引
### 什么是索引
索引：索引是一种快速查找数据的数据结构。

在SQL server中，索引是B-树结构进行存储的，包括根页面，中间层页面，叶子页面。B-树的特点就是它能够平衡索引是树。
### 索引的类型
sqlserver按照数据的存储方式不同，可以分为聚集索引和非聚集索引。

* 聚集索引：数据是按顺序存储的，使用聚集索引查找到的数据就是数据物理存储的位置，聚集索引的叶子结点不仅包含了索引键，还包含了数据页。实际的数据页只能按照一种顺序存储，所以一张表中只能存在一个聚集索引。
* 非聚集索引：索引是独立与数据的，是在另外的索引页面存放了非聚集索引数据的，使用非聚集索引查找数据时，除非这个非聚集索引已经包含了T-SQL查询需要返回的字段，不然索引就需要根据非聚集索引中叶子结点的书签来定位到实际的数据页，才能获取到所有需要返回的字段，
>非聚集索引并不影响数据行的存储， 因此每张表可以包含多个非聚集索引， 在SQLServer 2008中， 匈张表最多可以包含999个非聚某索引， 在SQLServer 2005中最多为249个。


按照功能和效果划分，索引还可以分为

* 唯一索引：唯一索引能够保证索引键中不存在重复值，从而使表中的每一行从某种方式上具有唯一性。关键字是`UNIQUE`
>在创建唯一索引时有个选项衙要注意． 那就是忽略谊复键的选项：IGNORE_DUP_KEY, 默认值为OFF, 如果设笠为ON, 那么在批蜇插入数据时会忽略重复的记录， 而没有重复的记录将成功插入到表中， 但此时表中的自增ID字段可能会出现断层.

 * 复合索引：在创建索引时如果选择了多列，那么这个索引称为复合索引。如果索引选择了单列，那叫单列索引。复合索引创建时字段顺序与T-SQL语句条件字段的排列顺序一致，才能通过复合索引查找到数据。

 * 包含性索引：关键字INCLUDE。顾名思义就是把字段包含进索引，通过将非键列添加到非聚集索引的`叶级别`来扩展非聚集索引的功能。它与复合索引类似，都是未来让查询能够覆盖索引，但是两者是有区别的。在存储上，索引的键列是存储在索引的所有级别中的，而非键列仅仅存储在叶级别中，包含性索引INCLUDE后面的字段就属于非键列，非键列只能作为字段返回，不能作为T-SQL查询的条件。

 * 索引覆盖：又叫覆盖索引，其实它更多地是反应一个索引的使用情况，T-SQL查询时，如果通过某个索引可以直接返回数据，而不需要通过书签来查询数据页，则称这个索引为索引覆盖。它的好处时减少I/O的开销，更快的返回数据。

 * 筛选索引：也可以称为过滤索引，这是在创建索引时加上关键字`WHERE`来筛选表中符合条件的记录，再对这些记录创建索引，不符合条件的记录时不会包含在索引中的。

* 计算列索引：很多系统会有对基础数据计算后检索的需求，而对列进行函数运算后是无法使用列上的索引的，此时计算列索引则派上用场，在表中增加一个字段，用于保存基础列计算后的结果，在这个增加列上创建的索引就是计算列索引了。需要注意的是这个计算公式是一个比较确定的公式，不常变换，不然就失去了计算列索引的意义了。

* 索引视图：也可叫物化视图，标准视图的结果集不是永久地存储在数据库中的，而索引视图是通过`WITH SCHEMABINDING`关键字为视图创建唯一聚集索引来把结果集存储在数据库中的，这样查询视图时，数据库则不需再为查询视图的T-SQL动态生成结果集，但基础数据很少更新时，索引视图的效果会更好。

* 列存储索引：即`ColumnStore Index`，SQL server2012新功能，列存储索引是按照列存入页当中的，而不是传统地以行作为单位存入页，就存储上来看，由于是集中式存储，在一个有限的8KB大小的数据页中存储了更多的记录，所以在内存有限的情况下，缓存中的命中率将会更高，但是现在的列存储索引还有较多的限制，比如列存储索引不能是过滤索引，包含性索引，计算列索引，而且这个表会变成只读表。

### 索引的物理结构
### 基本概念
1、数据库文件
		
SQL server数据库的文件主要包括：
* 主文件： 以mdf后缀结尾的文件
* 次要文件：一般以ndf后缀结尾
* 日志文件：以ldf后缀结尾的文件

创建数据库时默认会创建一个mdf文件和一个ldf文件。mdf文件和ndf文件是以Page为最小存储单元，Page的固定大小为8KB，这两种文件都可以用来保存表数据或索引数据。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210331225440697.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)


2、表结构

表包含在一个或多个分区中，每个分区可以保存堆数据或聚集索引数据。还可以保存非聚集索引。堆页或者聚集索引页，非聚集索引页都是以8KB大小的页进行存储的。

如果非聚集索引与数据存储在相同的分区中，则被称为索引对齐。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210331225427626.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
3、页、区

SQL server中存储数据的基本单位是页，页的大小为8KB。虽然每一页大小为8KB，但是每页用户存入数据小于8KB。因为每页都包含96个字节的页头数据，用于存储页的系统信息：页码、页类型、页的可用空间、幻象记录。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210331230133391.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
上面是页内数据的排序， 同理， 页与页之间的排序也是逻辑上有序的。 一个页在插入数据时需要一分为二， SQL Server并不把该页的后续页面移到新的位甡， 而是新分配一个页给这个对象，再通过修改页头的页链(PageChain)属性m_prevPage和m_nextPage来达到逻辑上的有序。


页是存储的基本单位， 而区是管理空间的基本单位。 一个区是由8个物理上连续的页所组成的， 区分为统一区和混合区， 统一区表示这个区中的8个页都用来存储同一个对象，自然， 混合区就表示存储的对象不唯一， 混合区通常用于存储小对象。

4、行记录

SQL Server是关系型数据库， 关系型数据库都是基于行的形式进行存储的， SQL Server 2012 加入了以列的形式进行存储的功能， 在存储一行记录时， 所占用的空间并不单单只是一条记录所有字段空间的总和 ， 因为每一行都会有行头数据和一些空值字段位图数据等， 这就是为什么一个 8192 字节的页中保存一条记录的最大值为 8053 了。

5、B-Tree
索引的目的是快速定位到具体的数据行， 索引是以索引键为依据， 建立一棵B-树的，因此，索引也称为B－树索引。

B－树的叶子结点都在同一层级别」勹每个中间结点（包括根结点）可能包含的子结点数目都不相同 ， 每个结点中容乃的素数目也可能不相同。

使用B-树作为索引结构是专门为大数据存储、 小数据定位查找而设计的。 由B－树的特点 ， 整个索引树的尝试通常都保持在3到4层的深度， 因此 ， 当定位具体的数据时， 只读取极少的数据页 ， 便能准确地定位到具体的数据行了。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210331230611203.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
6.书签(Bookmarks入RID (Relative Identifier入UNIQUIFIER

书签(Bookmarks)可帮助SQLServer快速从非聚集索引条目导向到对应的行， 也就是真正存储行数据的物理地址。在SQLServer中， 当一条查询通过非聚集索引找到请求的数据， 如果查询还需要返回除索引键值之外的字段， 那么这个查询有可能使用书签查找(Bookmark Lookup)来查找其他的字段。

书签查找分为：键查找(Key Lookup)和RID查找(RIDLookup)。

书签在堆表和聚集表会有不同的格式， 在堆表中， 书签是一个RID, RID是RowIdentifier的缩写， 翻译过来就是行标识符。其实RID表示一条记录在当前数据库的唯一标识， 或者称为行记录的物理地址， 关于RID的物理结果将在下一节作详细的讲述。

如果是聚集表， 又可以分为两种情况。当聚集索引是个不唯一的聚集索引． 

聚集索引键值没有重复值时， 书签就是聚集索引键； 当聚集索引键值出现重复值时， 书签就是聚集索引键加UNlQUIFTER 值； 

如果聚集索引是个唯一的聚集索引， 书签就是聚集索引键值。

图7-6总结了前面提到的书签与聚集表、堆表、RID、UNIQUIFIER的逻辑关系

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210331230719300.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
 ## 事务
 [学不会的数据事务](https://blog.csdn.net/D_A_I_H_A_O/article/details/107235568)

## 锁
![在这里插入图片描述](https://img-blog.csdnimg.cn/2021040414145381.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
死锁
*  当阻塞的事务与资源之间发生了无限的相互等待，便会产生死锁。死锁的构成，必须发生在两个或两个以上的资源或事务中，否则无法构成资源等待的斯循环。
