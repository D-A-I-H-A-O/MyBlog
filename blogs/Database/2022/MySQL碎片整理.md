---
title: MySql碎片整理
date: 2022-05-26
categories:
 - Database
tags:
 - Mysql
---

# MySQL碎片
`MySQL` 碎片就是 `MySQL` 数据文件中一些不连续的空白空间，这些空间无法再被全部利用，久而久之越来多，越来越零碎，从而造成物理存储和逻辑存储的位置顺序不一致，这就是碎片。


# 碎片的产生
* `delete` 操作

在 `MySQL` 中删除数据，在存储中就会产生空白的空间，当有新数据插入时，`MySQL` 会试着在这些空白空间中保存新数据，但是呢总是用不满这些空白空间。所以日积月累，亦或是一下有大量的 `delete` 操作，一下就会有大量的空白空间，慢慢的会大到比表的数据使用的空间还大。

* `update` 操作

在 `MySQL` 中更新数据，在可变长度的字段（比如 `varchar`）中更新数据，`innodb` 表存储数据的单位是页，`update` 操作会造成页分裂，分裂以后存储变的不连续，不规则，从而产生碎片。比如说原始字段长度 `varchar(100)`，我们大量的更新数据长度位为 `50`，这样的话，有 `50` 的空间被空白了，新入库的数据不能完全利用剩余的 `50`，这就会产生碎片。

# 碎片的影响

* 空间浪费

空间浪费不用多说，碎片占用了大量可用空间。

* 读写性能下降

由于存在大量碎片，数据从连续规则的存储方式变为随机分散的存储方式，磁盘 `IO` 会变的繁忙，数据库读写性能就会下降。

# 查看碎片

```sql
-- 通过表状态信息查看
show table status like '%table_name%';
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5f0fc84f4cb14e1fa8a8000e26ad1c02.png)
`Data_Length` 表数据大小
 `Index_Length` 表索引大小 
 `Data_Free` 碎片大小

```sql
-- 通过数据库视图信息查看
select t.table_schema,
       t.table_name,
       t.table_rows,
       t.data_length,
       t.index_length,
       concat(round(t.data_free / 1024 / 1024, 2),
              'm') as data_free
from information_schema.tables t
where t.table_name = 'table_name';
```
`data_free` 列数据就是我们要查询的表的碎片大小内容

# 清理碎片
```sql
-- 整理数据文件，重新排列索引
optimize table table_name;
```

`OPTIMIZE TABLE`适用于 `InnoDB`、`MyISAM` 和 `ARCHIVE` 表`。OPTIMIZE TABLE`也支持内存中`NDB`表的动态列。它不适用于内存中表的固定宽度列，也不适用于磁盘数据表。

对于 `InnoDB` 表，`OPTIMIZE TABLE` 等于 `ALTER TABLE ... FORC`E，用于重建表以更新索引统计信息并释放聚集索引中未使用的空间。

`OPTIMIZE TABLE`会锁表，时间长短依据表数据量的大小。

[MySQL 8.0 参考手册](https://dev.mysql.com/doc/refman/8.0/en/optimize-table.html)

```sql
-- 重建表的存储引擎，重组数据和索引的存储。
alter table table_name engine = innodb;
```

[MySQL 8.0 参考手册-对表进行碎片整理](https://dev.mysql.com/doc/refman/8.0/en/innodb-file-defragmenting.html)


根据实际情况，只需要每周或者每月整理一次即可
