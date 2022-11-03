---
title: MySQL刷脏页
date: 2022-06-30
categories:
 - Database
tags:
 - Mysql
---

# MySQL刷脏页

`InnoDB `在处理更新语句的时候，只做了写日志这一个磁盘操作。这个日志叫作 `redo log`（重做日志），在更新内存写完 `redo log `后，就返回给客户端，本次更新成功。

内存里的数据写入磁盘的过程，术语就是 `flush`。

**当内存数据页跟磁盘数据页内容不一致的时候，我们称这个内存页为“脏页”。内存数据写入到磁盘后，内存和磁盘上的数据页的内容就一致了，称为“干净页”** 。


> 什么情况会引发数据库的 `flush `过程呢？
>


1、`InnoDB `的 `redo log `写满了。这时候系统会停止所有更新操作，把 `checkpoint `往前推进，`redo log `留出空间可以继续写。

2、系统内存不足。当需要新的内存页，而内存不够用的时候，就要淘汰一些数据页，空出内存给别的数据页使用。如果淘汰的是“脏页”，就要先将脏页写到磁盘。

3、`MySQL`认为系统“空闲”的时候。

4、`MySQL `正常关闭的情况。这时候，`MySQL `会把内存的脏页都 `flush `到磁盘上，这样下次 `MySQL `启动的时候，就可以直接从磁盘上读数据，启动速度会很快。


# InnoDB 刷脏页的控制策略

```sql
-- 当刷新脏数据时，控制MySQL每秒执行的写IO量
select @@innodb_io_capacity
```

`innodb_io_capacity`值建议设置成磁盘的 `IOPS`。磁盘的 `IOPS `可以通过 `fio `这个工具来测试

```text
fio -filename=$filename -direct=1 -iodepth 1 -thread -rw=randrw -ioengine=psync -bs=16k -size=500M -numjobs=10 -runtime=10 -group_reporting -name=mytest 
```


**控制刷脏页的速度，会参考哪些因素呢**?

`InnoDB `的刷盘速度要参考这两个因素：一个是脏页比例，一个是` redo log `写盘速度。

参数 `innodb_max_dirty_pages_pct `是脏页比例上限，默认值是 `75%`。`InnoDB `会根据当前的脏页比例（假设为 `M`），算出一个范围在 0 到 100 之间的数字，计算这个数字的伪代码类似这样：

```javascript
F1(M)
{
  if M>=innodb_max_dirty_pages_pct then
      return 100;
  return 100*M/innodb_max_dirty_pages_pct;
}
```

`InnoDB `每次写入的日志都有一个序号，当前写入的序号跟 `checkpoint `对应的序号之间的差值，我们假设为 `N`。`InnoDB `会根据这个 `N` 算出一个范围在 0 到 100 之间的数字，这个计算公式可以记为 `F2(N)`。`F2(N)` 算法比较复杂，你只要知道` N` 越大，算出来的值越大就好了。

然后，根据上述算得的 `F1(M)` 和 `F2(N)` 两个值，取其中较大的值记为 `R`，之后引擎就可以按照 `innodb_io_capacity `定义的能力乘以 `R% `来控制刷脏页的速度。

`InnoDB `会在后台刷脏页，而刷脏页的过程是要将内存页写入磁盘。所以，无论是你的查询语句在需要内存的时候可能要求淘汰一个脏页，还是由于刷脏页的逻辑会占用` IO` 资源并可能影响到了你的更新语句，都可能是造成你从业务端感知到 `MySQL`“抖”了一下的原因。

要尽量避免这种情况，你就要合理地设置 `innodb_io_capacity `的值，并且 **平时要多关注脏页比例，不要让它经常接近 75%** 。

其中，脏页比例是通过` Innodb_buffer_pool_pages_dirty/Innodb_buffer_pool_pages_total `得到的，具体的命令参考下面的代码：

```text
use performance_schema;
select VARIABLE_VALUE  from global_status where VARIABLE_NAME = 'Innodb_buffer_pool_pages_dirty';
select VARIABLE_VALUE  from global_status where VARIABLE_NAME = 'Innodb_buffer_pool_pages_total';
select (select VARIABLE_VALUE  from global_status where VARIABLE_NAME = 'Innodb_buffer_pool_pages_dirty'
       ) / (select VARIABLE_VALUE  from global_status where VARIABLE_NAME = 'Innodb_buffer_pool_pages_total');
```

一旦一个查询请求需要在执行过程中先 `flush `掉一个脏页时，这个查询就可能要比平时慢了。而 `MySQL `中的一个机制，可能让你的查询会更慢：在准备刷一个脏页的时候，如果这个数据页旁边的数据页刚好是脏页，就会把这个“邻居”也带着一起刷掉；而且这个把“邻居”拖下水的逻辑还可以继续蔓延，也就是对于每个邻居数据页，如果跟它相邻的数据页也还是脏页的话，也会被放到一起刷。

在 `InnoDB `中，`innodb_flush_neighbors `参数就是用来控制这个行为的，值为 1 的时候会有上述的“连坐”机制，值为 0 时表示不找邻居，自己刷自己的。

找“邻居”这个优化在机械硬盘时代是很有意义的，可以减少很多随机` IO`。机械硬盘的随机 `IOPS `一般只有几百，相同的逻辑操作减少随机` IO `就意味着系统性能的大幅度提升。

而如果使用的是 `SSD `这类 `IOPS `比较高的设备的话，我就建议你把 `innodb_flush_neighbors `的值设置成 0。因为这时候 `IOPS `往往不是瓶颈，而“只刷自己”，就能更快地执行完必要的刷脏页操作，减少 SQL 语句响应时间。

在` MySQL 8.0` 中，`innodb_flush_neighbors `参数的默认值已经是 0 了。
