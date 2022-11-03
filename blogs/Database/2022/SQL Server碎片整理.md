---
title: SQL Server碎片整理
date: 2022-06-02
categories:
 - Database
tags:
 - sql
---

# 查看索引碎片
```sql
SELECT object_name(dt.object_id)         表名,
       si.name                           索引名称,
       dt.avg_fragmentation_in_percent   外部碎片,
       dt.avg_page_space_used_in_percent 内部碎片
FROM (
         SELECT object_id,
                index_id,
                avg_fragmentation_in_percent,
                avg_page_space_used_in_percent
         FROM sys.dm_db_index_physical_stats(
                 db_id('数据名'), null, null,
                 null, 'DETAILED'
             )
         WHERE index_id <> 0
     ) AS dt
         INNER JOIN sys.indexes si
                    ON si.object_id =
                       dt.object_id AND
                       si.index_id = dt.index_id
where dt.avg_fragmentation_in_percent > 10
  AND dt.avg_page_space_used_in_percent < 75
ORDER BY avg_fragmentation_in_percent DESC
```
*  `avg_fragmentation_in_percent`(越小越好)

索引的逻辑碎片，或 `IN_ROW_DATA` 分配单元中堆的区碎片。

此值按百分比计算，并将考虑多个文件。

0 表示 `LOB_DATA` 和 `ROW_OVERFLOW_DATA` 分配单元。

如果是堆表且`mode`模式为 `Sampled` 时，为 `NULL`。如果碎片小于`10% ~ 20%`，碎片不太可能会成为问题，如果索引碎片在`20%~40%`，碎片可能成为问题，但是可以通过索引重组来消除索引解决，大规模的碎片(当碎片大于`40%`)，可能要求索引重建。

* `avg_page_space_used_in_percent`(越大越好)

所有页中使用的可用数据存储空间的平均百分比。

对于索引，平均百分比应用于 `IN_ROW_DATA` 分配单元中 `b 树`的当前级别。

对于堆，表示 `IN_ROW_DATA` 分配单元中所有数据页的平均百分比。

对于 `LOB_DATA` 或 `ROW_OVERFLOW DATA` 分配单元，表示该分配单元中所有页的平均百分比。

当 `mode` 为 `LIMITED` 时，为 `NULL`。

# 索引优化

**1、 删除索引并重建**

缺点：

* 索引不可用：在删除索引期间，索引不可用。

* 阻塞：卸载并重建索引会阻塞表上所有的其他请求，也可能被其他请求所阻塞。
* 对于删除聚集索引，则会导致对应的非聚集索引重建两次(删除时重建，建立时再重建，因为非聚集索引中有指向聚集索引的指针)。

* 唯一性约束：用于定义主键或者唯一性约束的索引不能使用DROP INDEX语句删除。而且，唯一性约束和主键都可能被外键约束引用。在主键卸载之前，所有引用该主键的外键必须首先被删除。尽管可以这么做，但这是一种冒险而且费时的碎片整理方法。
　


**2、重建索引**

原子性的，不会导致非聚集索引重建两次，但会造成阻塞。

缺点：
* 阻塞：与卸载重建方法类似，这种技术也导致并面临来自其他访问该表(或该表的索引)的查询的阻塞问题。
* 使用约束的索引：与卸载重建不同，具有`DROP_EXISTING`子句的`CREATE INDEX`语句可以用于重新创建使用约束的索引。如果该约束是一个主键或与外键相关的唯一性约束，在`CREATE`语句中不能包含`UNIQUE`。

　　具有多个碎片化的索引的表：随着表数据产生碎片，索引常常也碎片化。如果使用这种碎片整理技术，表上所有索引都必须单独确认和重建。
```sql
CREATE UNIQUE CLUSTERED INDEX IX_C1 ON t1(c1) WITH (DROP_EXISTING = ON)
```

>删除索引和重建索引不建议在生产数据库，尤其是非空闲时间不建议采用这种技术。

**3、重组索引**

这种方式不会重建索引，也不会生成新的页，仅仅是整理页级数据，不涉及非页级，当遇到加锁的页时跳过，所以不会造成阻塞。
```sql
ALTER INDEX ALL ON TableName REORGANIZE
```

**4、重建索引**
通过动态重建索引而不需要卸载并重建索引，会造成阻塞。原子操作，如果它在结束前停止，所有到那时为止进行的碎片整理操作都将丢失。可以通过`ONLINE`关键字减少锁，但会造成重建时间加长。
```java
ALTER INDEX ALL ON TableName REBUILD WITH (FILLFACTOR=90,ONLINE=ON)
```

 **索引整理脚本**
 
自动重新组织或重建数据库中平均碎片超过 `10%` 的所有分区。执行此查询需要“查看数据库状态”权限。此示例指定 `DB_ID` 作为第一个参数，而不指定数据库名称。如果当前数据库的兼容级别为 80 或更低，则将生成错误。若要解决此错误，请将 `DB_ID()` 替换为有效的数据库名称。有关数据库兼容级别的详细信息，请参阅 [ALTER 数据库兼容级别 （Transact-SQL）](https://docs.microsoft.com/en-us/sql/t-sql/statements/alter-database-transact-sql-compatibility-level?view=sql-server-ver16)

```sql
-- Ensure a USE <databasename> statement has been executed first.  
SET NOCOUNT ON;  
DECLARE @objectid int;  
DECLARE @indexid int;  
DECLARE @partitioncount bigint;  
DECLARE @schemaname nvarchar(130);   
DECLARE @objectname nvarchar(130);   
DECLARE @indexname nvarchar(130);   
DECLARE @partitionnum bigint;  
DECLARE @partitions bigint;  
DECLARE @frag float;  
DECLARE @command nvarchar(4000);   
-- Conditionally select tables and indexes from the sys.dm_db_index_physical_stats function   
-- and convert object and index IDs to names.  
SELECT  
    object_id AS objectid,  
    index_id AS indexid,  
    partition_number AS partitionnum,  
    avg_fragmentation_in_percent AS frag  
INTO #work_to_do  
FROM sys.dm_db_index_physical_stats (DB_ID(), NULL, NULL , NULL, 'LIMITED')  
WHERE avg_fragmentation_in_percent > 10.0 AND index_id > 0;  
  
-- Declare the cursor for the list of partitions to be processed.  
DECLARE partitions CURSOR FOR SELECT * FROM #work_to_do;  
  
-- Open the cursor.  
OPEN partitions;  
  
-- Loop through the partitions.  
WHILE (1=1)  
    BEGIN;  
        FETCH NEXT  
           FROM partitions  
           INTO @objectid, @indexid, @partitionnum, @frag;  
        IF @@FETCH_STATUS < 0 BREAK;  
        SELECT @objectname = QUOTENAME(o.name), @schemaname = QUOTENAME(s.name)  
        FROM sys.objects AS o  
        JOIN sys.schemas as s ON s.schema_id = o.schema_id  
        WHERE o.object_id = @objectid;  
        SELECT @indexname = QUOTENAME(name)  
        FROM sys.indexes  
        WHERE  object_id = @objectid AND index_id = @indexid;  
        SELECT @partitioncount = count (*)  
        FROM sys.partitions  
        WHERE object_id = @objectid AND index_id = @indexid;  
  
-- 30 is an arbitrary decision point at which to switch between reorganizing and rebuilding.  
        IF @frag < 30.0  
            SET @command = N'ALTER INDEX ' + @indexname + N' ON ' + @schemaname + N'.' + @objectname + N' REORGANIZE';  
        IF @frag >= 30.0  
            SET @command = N'ALTER INDEX ' + @indexname + N' ON ' + @schemaname + N'.' + @objectname + N' REBUILD';  
        IF @partitioncount > 1  
            SET @command = @command + N' PARTITION=' + CAST(@partitionnum AS nvarchar(10));  
        EXEC (@command);  
        PRINT N'Executed: ' + @command;  
    END;  
  
-- Close and deallocate the cursor.  
CLOSE partitions;  
DEALLOCATE partitions;  
  
-- Drop the temporary table.  
DROP TABLE #work_to_do;  
GO
```

 

[优化索引维护以提高查询性能并减少资源消耗](https://docs.microsoft.com/zh-cn/sql/relational-databases/indexes/reorganize-and-rebuild-indexes?view=sql-server-ver16)

[ALTER INDEX (Transact-SQL)](https://docs.microsoft.com/zh-cn/sql/t-sql/statements/alter-index-transact-sql?view=sql-server-ver16)

[SQL Server索引的维护 - 索引碎片、填充因子 <第三篇>](https://www.cnblogs.com/kissdodog/archive/2013/06/14/3135412.html)
