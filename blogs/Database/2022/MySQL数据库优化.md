---
title: MySQL数据库优化
date: 2022-11-03
categories:
 - Database
tags:
 - Mysql
---

# MySQL优化方向
`MySQL`数据库优化一般有这几个方面

* 减少数据访问：设置合理的字段类型，启用压缩，通过索引访问等减少磁盘`IO`
* 返回更少的数据：只返回所需字段和数据分页处理，减少磁盘`IO`和网络`IO`
* 减少交互次数：批量`DML`操作，函数存储等减少数据连接次数
* 减少服务器`CPU`开销：尽量减少数据库排序操作已经全表查询，减少`CPU`内存占用
* 利用更多资源：使用表分区，可以增加并行操作，更大限度利用`CPU`资源


# SHOW STATUS 
通过 `show status`查询`SQL`执行频率，了解当前数据库是以插入更新为主还是查询操作为主，以及各种`sql`大概执行比例，不加参数默认采用`session`级别，加上`global`参数则是上次数据库启动至今的统计结果。

```sql
show status like 'com_select';
show global status like 'com_select';
```
**Com_xx部分参数**

* `Com_xx`：代表xx语句执行次数，一般我们关心（`select、insert、update、delete`）

* `Com_select`：执行`select`操作次数，每次累加一次

* `Com_insert`：执行`insert`操作次数，对于批量插入操作只累加一次

* `Com_update`：执行`update`操作次数

* `Com_delete`：执行`delete`操作次数

```sql
show global status like 'com_select';
show global status like 'com_insert';
show global status like 'com_update';
show global status like 'com_delete';

-- 临时表
show global status like 'created_tmp%';
-- 试图连接服务器次数
show global status like 'conn%';
-- 服务器工作时间
show global status like 'upti%';
-- 慢查询次数
show global status like 'slow_q%';

```
[mysql状态分析之show global status](https://blog.csdn.net/qq_26941173/article/details/77823184)

# EXPLAIN 
`EXPLAIN `指令：模拟`Mysql`优化器执行`SQL`语句，查看`SQL`语句的执行计划。

`EXPLAIN` 可以作用于`SELECT`、`DELETE`、`INSERT`、`REPLACE`和`UPDATE`语句 。

`EXPLAIN` 为`SELECT`语句中使用的每个表返回一行信息。它按 `Mysql`在处理语句时读取的顺序列出输出的表。`Mysql`使用嵌套循环连接方法解析所有连接，这意味着 `Mysql`从第一个表中读取一行，然后在第二个表中、第三个表中找到匹配的行，依此类推。处理完所有表后，`Mysql`输出所选列，并在表列表中回溯，直到找到一个有更多匹配行的表。从该表中读取下一行，并继续处理下一个表。



```sql
explain (sql 语句)
```

## id
* 查询中 `SELECT` 的序列号，如果该行引用其他行的并集结果，则该行可以为 `Null`
* `id`列的值代表着表的执行顺序
* `id`越大代表优先级越大，越先被执行

## select_type
表示了查询的类型, 它的常用取值有: 

* `SIMPLE`：表示此查询不包含 `UNION` 查询或子查询

* `PRIMARY`,：表示此查询是最外层的查询

* `UNION`：表示此查询是 `UNION` 的第二或随后的查询

* `DEPENDENT UNION`：`UNION` 中的第二个或后面的查询语句, 取决于外面的查询

* `UNION RESULT`：`UNION` 的结果

* `SUBQUERY`：子查询中的第一个 `SELECT`

* `DEPENDENT SUBQUERY`：子查询中的第一个 `SELECT`, 取决于外面的查询. 即子查询依赖于外层查询的结果.

## table
表示查询涉及的表或衍生表

## type
`type`提供了判断查询是否高效的重要依据依据。通过 `type` 字段，我们判断此次查询是**全表扫描**还是**索引扫描**等。

* `system`: 表中只有一条数据. 这个类型是特殊的 `const` 类型

* `const`: 针对主键或唯一索引的等值查询扫描, 最多只返回一行数据. `const` 查询速度非常快, 因为它仅仅读取一次即可

* `eq_ref`: 此类型通常出现在多表的 `join` 查询, 表示对于前表的每一个结果, 都只能匹配到后表的一行结果. 并且查询的比较操作通常是 =, 查询效率较高

* `ref`: 此类型通常出现在多表的 `join` 查询, 针对于非唯一或非主键索引, 或者是使用了**最左前缀**规则索引的查询

* `range`: 表示使用索引范围查询, 通过索引字段范围获取表中部分数据记录. 这个类型通常出现在 `=, <>, >, >=, <, <=, IS NULL, <=>, BETWEEN, IN()` 操作中.
当 `type` 是 `range` 时, 那么 `EXPLAIN` 输出的 `ref` 字段为 `NULL`, 并且 `key_len` 字段是此次查询中使用到的索引的最长的那个

* `index`: 表示全索引扫描(`full index scan`), 和 `ALL` 类型类似, 只不过 `ALL` 类型是全表扫描, 而 `index` 类型则仅仅扫描所有的索引, 而不扫描数据。`index` 类型通常出现在: 所要查询的数据直接在索引树中就可以获取到, 而不需要扫描数据. 当是这种情况时, `Extra` 字段会显示 `Using index`.

* `ALL`: 表示全表扫描, 这个类型的查询是性能最差的查询之一. 通常来说, 我们的查询不应该出现 `ALL` 类型的查询, 因为这样的查询在数据量大的情况下, 对数据库的性能是巨大的灾难. 如一个查询是 `ALL` 类型查询, 那么一般来说可以对相应的字段添加索引来避免

通常来说, 不同的 `type` 类型的性能关系如下:

```sql
ALL < index < range ~ index_merge < ref < eq_ref < const < system
```
## possible_keys
`possible_keys` 表示 `MySQL` 在查询时， 能够使用到的索引。注意，即使有些索引在 `possible_keys` 中出现， 但是并不表示此索引会真正地被 `MySQL` 使用到。`MySQL` 在查询时具体使用了哪些索引，由 `key` 字段决定。

## key
此字段是 `MySQL` 在当前查询时所真正使用到的索引

## key_len
表示查询优化器使用了索引的字节数。这个字段可以评估组合索引是否完全被使用，或只有最左部分字段被使用到。`key_len`可以衡量索引的好坏，`key_len`越小索引效果越好，

`key_len` 的计算规则如下:

* 字符串

`char(n)`: `n`字节长度

`varchar(n)`: 如果是 `utf8` 编码, 则是 `3n + 2` 字节; 如果是 `utf8mb4` 编码, 则是 `4n + 2` 字节.

* 数值类型:

`TINYINT`: 1字节

`SMALLINT`: 2字节

`MEDIUMINT`: 3字节

`INT`: 4字节

`BIGINT`: 8字节

* 时间类型

`DATE`: 3字节

`TIMESTAMP`: 4字节

`DATETIME`: 8字节

* 字段属性: `NULL` 属性 占用一个字节。如果一个字段是 `NOT NULL` 的, 则没有此属性

## rows
`MySQL` 查询优化器根据统计信息， 估算 `SQL` 要查找到结果集需要扫描读取的数据行数。

这个值非常直观显示 `SQL` 的效率好坏, 原则上 `rows` 越少越好。

## ref 
`ref`字段的值是列或者常数，指的是这个列或常数与 `key` 的值一起从表中选择行数据

##  filtered
表示存储引擎返回的数据在 `server` 层过滤后，剩下多少满足查询的记录数量的比例，此值是百分比，不是具体记录数量。

## Extra 
性能从好到坏排列： 

```sql
using index > using where > using temporary > using filesort
```


* `using index` ：表示覆盖索引，不需要回表操作

* `using where`：没有可用的索引查找

* `using temporary`：表示 `MySQL` 需要使用临时表来存储结果集，常见于排序和分组查询

* `using filesort`：`MySQL` 中无法利用索引完成的排序操作称为“文件排序”，一般有此值建议使用索引进行优化

* `using join buffer`：强调了在获取连接条件时没有使用索引，并且需要连接缓冲区来存储中间结果，如果出现此值，应该根据具体情况添加索引来改进性能

* `distinct`：在`select`部分使用了`distinc`关键字

# 优化一：尽量考虑覆盖索引
**覆盖索引**：`SQL`只需要通过遍历索引树就可以返回所需要查询的数据，而不必通过辅助索引查到主键值之后再去查询数据（回表操作）。

# 优化二：必须最左前缀匹配
**联合索引**命中必须遵循**最左前缀法则**。即查询字段必须从索引的最左前列开始匹配，不能跳过索引中的列。**联合索引**又称**复合索引**。

```sql
-- 如User表的name和city加联合索引就是(name,city)
select * from user where name=xx and city=xx ; --可以命中索引
select * from user where name=xx ; --可以命中索引
select * from user where city=xx ; --无法命中索引    
```
# 优化三：不对索引字段进行逻辑操作
不对索引字段进行逻辑操作。在索引字段上进行计算、函数、类型转换（自动\手动）都会导致索引失效。

# 优化四：范围查询字段放最后
联合索引定义时，尽量将范围查询字段放在最后（放在最后联合索引使用最充分，放在中间联合索引使用不充分）。使用联合索引时范围列（当前范围列索引生效）后面的索引列无法生效，同时索引最多用于一个范围列，如果查询条件中有多个范围列，也只能用到一个范围列索引。

# 优化五：尽量全值匹配
全值匹配也就是精确匹配不使用like查询（模糊匹配），使用`like`会使查询效率降低。

# 优化六：Like查询，左侧尽量不要加%
`like` 以`%`开头，当前列索引无效(当为联合索引时，当前列和后续列索引不生效，可能导致索引使用不充分)；当`like`前缀没有`%`，后缀有`%`时，索引有效。

# 优化七：注意NULL/NOT NULL可能对索引有影响
在索引列上使用 `IS NULL` 或 `IS NOT NULL`条件，可能对索引有所影响。


字段定义默认为`NULL`时，`NULL`索引生效，`NOT NULL`索引不生效；

字段定义明确为`NOT NULL` ，不允许为空时，`NULL/NOT NULL`索引列，索引均失效；

列字段尽量设置为`NOT NULL`，`MySQL`难以对使用`NULL`的列进行查询优化，允许`Null`会使索引值以及索引统计更加复杂。允许`NULL`值的列需要更多的存储空间，还需要`MySQL`内部进行特殊处理。


# 优化八：尽量减少使用不等于

不等于操作符是不会使用索引的。不等于操作符包括：not，<>，!=。

优化方法：数值型 key<>0 改为 key>0 or key<0。

# 优化九：字符类型务必加上引号
若`varchar`类型字段值不加单引号，可能会发生数据类型隐式转化，自动转换为`int`型，使索引无效。

# 优化十：OR关键字前后尽量都为索引列
当`OR`左右查询字段只有一个是索引，会使该索引失效，只有当`OR`左右查询字段均为索引列时，这些索引才会生效。`OR`改`UNION`效率高。

# 优化十一：尽量避免in和not in
`in`和`not in`可能会导致走全表扫描。如果是连续数值，可以用`between`代替，如果是子查询，可以用`exists`代替。

# 优化十二：order by 条件与 where 中条件一致
`order by` 条件要与 `where` 中条件一致，否则`order by` 不会利用索引进行排序。

# 优化十三：避免select * 
用`select*`取出全部列，会让优化器无法完成索引覆盖扫描这类优化，会影响优化器对执行计划的选择，也会增加网络带宽消耗，更会带来额外的`I/0`，内存和`CPU`消耗

# 优化十四：避免having
避免使用`having`字句，因为`having`只会检索出所有记录之后才对结果集进行过滤，而`where`则是在聚合前刷选数据，如果能通过`where`字句限制记录的数目，就能减少这方面的开销。

# 优化十五：尽量使用truncate
`truncate table`在功能上与不带 `where`子句的`delete`语句相同：二者均删除表中的全部行。但 `truncate table`比 `delete`速度快，且使用的系统和事务日志资源少。

`delete`语句每次删除一行，并在事务日志中为所删除的每行记录一项。`truncate table`通过释放存储表数据所用的数据页来删除数据，并且只在事务日志中记录页的释放。`truncate table`删除表中的所有行，但表结构及其列、约束、索引等保持不变。新行标识所用的计数值重置为该列的种子。如果想保留标识计数值，请改用`delete`。

如果要删除表定义及其数据，请使用 `drop table`语句。对于由 `foreign key`约束引用的表，不能使用`truncate table`，而应使用不带 `where`子句的`delete`语句。由于 `truncate table`不记录在日志中，所以它不能激活触发器。`truncate table`不能用于参与了索引视图的表
