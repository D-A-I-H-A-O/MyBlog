---
title: MySQL的日志
date: 2022-08-05
categories:
 - Database
tags:
 - Mysql
---

# redo log
`redo log` 是 `InnoDB` 引擎特有的日志

`WAL` 技术 `Write-Ahead Logging`：当有一条记录需要更新的时候，`InnoDB` 引擎就会先把记录写到 `redo log` 里面，并更新内存，这个时候更新就算完成了。同时，`InnoDB` 引擎会在适当的时候，将这个操作记录更新到磁盘里面，而这个更新往往是在系统比较空闲的时候做。

`InnoDB` 的 `redo log` 是固定大小的，比如可以配置为一组 `4` 个文件，每个文件的大小是 `1GB`，那么总共就可以记录 `4GB` 的操作。从头开始写，写到末尾就又回到开头循环写，如下面这个图所示。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d9dca840dd8e479096205344e3ba7ee9.png)

`write pos` 是当前记录的位置，一边写一边后移，写到第 `3` 号文件末尾后就回到 `0` 号文件开头。`checkpoint` 是当前要擦除的位置，也是往后推移并且循环的，擦除记录前要把记录更新到数据文件。

`write pos` 和 `checkpoint` 之间的是还空着的部分，可以用来记录新的操作。如果 `write pos` 追上 `checkpoint`，表示满了，这时候不能再执行新的更新，得停下来先擦掉一些记录，把 `checkpoint` 推进一下。

有了 `redo log`，`InnoDB` 就可以保证即使数据库发生异常重启，之前提交的记录都不会丢失，这个能力称为`crash-safe`。

## redo log 的写入机制
 **redo log 存储状态**
 

 1. 存在 `redo log buffer` 中，物理上是在`MySQL`进程内存中
 2. 写到磁盘`（write）`，但是没有持久化`（fsync）`
 3. 持久化到磁盘，对应的是 `hard disk`

日志写到 `redo log buffer` 是很快的，`wirte` 到 `page cache` 也差不多，但是持久化到磁盘的速度就慢多了。

为了控制 `redo log` 的写入策略，`InnoDB` 提供了 `innodb_flush_log_at_trx_commit` 参数，它有三种可能取值：

```sql
select @@innodb_flush_log_at_trx_commit;
```

设置为 0 的时候，表示每次事务提交时都只是把 `redo log` 留在 `redo log buffer` 中 ;

设置为 1 的时候，表示每次事务提交时都将 `redo log` 直接持久化到磁盘；

设置为 2 的时候，表示每次事务提交时都只是把 `redo log` 写到 `page cache`。

`InnoDB` 有一个后台线程，每隔 1 秒，就会把 `redo log buffer` 中的日志，调用 `write` 写到文件系统的 `page cache`，然后调用 `fsync` 持久化到磁盘。

# binlog

 1. `redo log` 是 `InnoDB` 引擎特有的；`binlog` 是 `MySQL` 的 `Server` 层实现的，所有引擎都可以使用。
 
 2.  `redo log` 是物理日志，记录的是“在某个数据页上做了什么修改”；`binlog` 是逻辑日志，记录的是这个语句的原始逻辑，比如“给 `ID=2` 这一行的 `c` 字段加 1 ”。

 3. `redo log` 是循环写的，空间固定会用完；`binlog` 是可以追加写入的。“追加写”是指 `binlog` 文件写到一定大小后会切换到下一个，并不会覆盖以前的日志。

## binlog 的写入机制
事务执行过程中，先把日志写到 `binlog cache`，事务提交的时候，再把 `binlog cache` 写到 `binlog` 文件中。

一个事务的 `binlog` 是不能被拆开的，因此不论这个事务多大，也要确保一次性写入。这就涉及到了 `binlog cache` 的保存问题。

系统给 `binlog cache` 分配了一片内存，每个线程一个(每个线程有自己 `binlog cache`，但是共用同一份 `binlog` 文件)，参数 `binlog_cache_size` 用于控制单个线程内 `binlog cache` 所占内存的大小。如果超过了这个参数规定的大小，就要暂存到磁盘。

```sql
select @@binlog_cache_size ;
```

事务提交的时候，执行器把 `binlog cache` 里的完整事务写入到 `binlog` 中，并清空 `binlog cache`。

`write`:指的就是指把日志写入到文件系统的 `page cache`，并没有把数据持久化到磁盘，所以速度比较快。
`fsync`:才是将数据持久化到磁盘的操作。一般情况下，我们认为 `fsync` 才占磁盘的 `IOPS`。

`write` 和 `fsync` 的时机，是由参数 `sync_binlog` 控制的：

`sync_binlog=0` 的时候，表示每次提交事务都只 `write`，不 `fsync`；

`sync_binlog=1` 的时候，表示每次提交事务都会执行 `fsync`；

`sync_binlog=N(N>1)` 的时候，表示每次提交事务都 `write`，但累积 `N` 个事务后才 `fsync`。

因此，在出现 `IO` 瓶颈的场景里，将 `sync_binlog` 设置成一个比较大的值，可以提升性能。在实际的业务场景中，考虑到丢失日志量的可控性，一般不建议将这个参数设成 0，比较常见的是将其设置为 `100~1000` 中的某个数值。

但是，将 `sync_binlog` 设置为 `N`，对应的风险是：如果主机发生异常重启，会丢失最近 `N` 个事务的 `binlog` 日志。

# undo log
是`innodb`引擎的一种日志，在事务的修改记录之前，会把该记录的原值`（before image）`先保存起来`（undo log）`再做修改，以便修改过程中出错能够恢复原值或者其他的事务读取。


**作用**
事务回滚 - 原子性： `undo log`是为了实现事务的原子性而出现的产物，事务处理的过程中，如果出现了错误或者用户执行`ROLLBACK`语句，`MySQL`可以利用`undo log`中的备份将数据恢复到事务开始之前的状态。

多个行版本控制（`MVCC`）- 隔离性： `undo log`在`MySQL InnoDB`储存引擎中用来实现多版本并发控制，事务未提交之前，当读取的某一行被其他事务锁定时，它可以从`undo log`中分析出该行记录以前的数据是什么，从而提供该行版本信息，让用户实现非锁定一致性读取。

**什么时候会生成undo log**

在事务中，进行以下操作，都会创建`undo log`

 1. `insert` 用户定义的表或用户定义的临时表
 2. `update` 或者 `delete` 用户定义的表或用户定义的临时表

[庖丁解InnoDB之UNDO LOG](https://jinglingwang.cn/archives/mysqlundolog)


![在这里插入图片描述](https://img-blog.csdnimg.cn/9fba391e83a8475cb2ac98526ec8b912.png)

