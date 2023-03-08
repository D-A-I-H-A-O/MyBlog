---
title: SQL Server 使用优化脚本
date: 2023-03-07
categories:
 - Database
tags:
 - SQL Server
---
 
# 查询每个数据库上的Session数量是多少

`sys.sysprocesses` ：包含有关在 `SQL Server` 实例上运行的进程的信息。 这些进程可以是客户端进程或系统进程。 若要访问 `sysprocesses`，您必须位于 `master` 数据库上下文中，或者必须使用由三部分构成的名称 `master.dbo.sysprocesses`。

[sys.sysprocesses](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-compatibility-views/sys-sysprocesses-transact-sql?view=sql-server-ver16)
```sql
-- 每个数据库上的Session数量是多少
SELECT DB_NAME(dbid) AS DBName, COUNT(dbid) AS NumberOfConnections, loginame AS LoginName
FROM sys.sysprocesses
WHERE dbid > 0
GROUP BY dbid, loginame
```

# 查询表现最差的前10名

`sys.dm_exec_query_stats` : 返回 `SQL Server` 中缓存查询计划的聚合性能统计信息。 缓存计划中的每个查询语句在该视图中对应一行，并且行的生存期与计划本身相关联。 在从缓存删除计划时，也将从该视图中删除对应行。
[sys.dm_exec_query_stats](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-stats-transact-sql?view=sql-server-ver16)

`sys.dm_exec_sql_text` : 返回由指定的 `sql_handle` 标识的 `SQL` 批处理的文本。 该表值函数将替换系统函数 `fn_get_sql`。
[sys.dm_exec_sql_text](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-sql-text-transact-sql?view=sql-server-ver16)

```sql
SELECT TOP 10 ProcedureName    = t.text,
              ExecutionCount   = s.execution_count,
              AvgExecutionTime = isnull(s.total_elapsed_time / s.execution_count, 0),
              AvgWorkerTime    = s.total_worker_time / s.execution_count,
              TotalWorkerTime  = s.total_worker_time,
              MaxLogicalReads  = s.max_logical_reads,
              MaxPhysicalReads = s.max_physical_reads,
              MaxLogicalWrites = s.max_logical_writes,
              CreationDateTime = s.creation_time,
              CallsPerSecond   = isnull(s.execution_count / datediff(second, s.creation_time, getdate()), 0)
FROM sys.dm_exec_query_stats s
         CROSS APPLY sys.dm_exec_sql_text(s.sql_handle) t
ORDER BY s.max_physical_reads DESC
```

# 查询是否由于连接没有释放引起CPU过高

```sql
select *
from master.dbo.sysprocesses
where spid > 50
  and waittype = 0x0000
  and waittime = 0
  and status = 'sleeping '
  and last_batch < dateadd(minute, -10, getdate())
  and login_time < dateadd(minute, -10, getdate())
```

# 强行释放空连接

```sql
select 'kill ' + rtrim(spid)
from master.dbo.sysprocesses
where spid > 50
  and waittype = 0x0000
  and waittime = 0
  and status = 'sleeping '
  and last_batch < dateadd(minute, -60, getdate())
  and login_time < dateadd(minute, -60, getdate())
```

# 查询当前占用 cpu 资源最高的会话和其中执行的语句

```sql
SELECT total_worker_time/execution_count AS avg_cpu_cost, plan_handle,
   execution_count,
   (SELECT SUBSTRING(text, statement_start_offset/2 + 1,
      (CASE WHEN statement_end_offset = -1
         THEN LEN(CONVERT(nvarchar(max), text)) * 2
         ELSE statement_end_offset
      END - statement_start_offset)/2)
   FROM sys.dm_exec_sql_text(sql_handle)) AS query_text
FROM sys.dm_exec_query_stats
ORDER BY [avg_cpu_cost] DESC
```

# 查询缓存中重用次数少，占用内存大的查询语句（当前缓存中未释放的）
```sql
SELECT TOP 100 usecounts, objtype, p.size_in_bytes, [sql].[text]
FROM sys.dm_exec_cached_plans p
         OUTER APPLY sys.dm_exec_sql_text(p.plan_handle) sql
ORDER BY usecounts, p.size_in_bytes desc

SELECT top 25 qt.text, qs.plan_generation_num, qs.execution_count, dbid, objectid
FROM sys.dm_exec_query_stats qs
         CROSS APPLY sys.dm_exec_sql_text(sql_handle) as qt
WHERE plan_generation_num > 1
ORDER BY qs.plan_generation_num

SELECT top 50 qt.text                                             AS SQL_text,
              SUM(qs.total_worker_time)                           AS total_cpu_time,
              SUM(qs.execution_count)                             AS total_execution_count,
              SUM(qs.total_worker_time) / SUM(qs.execution_count) AS avg_cpu_time,
              COUNT(*)                                            AS number_of_statements
FROM sys.dm_exec_query_stats qs
         CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) as qt
GROUP BY qt.text
ORDER BY total_cpu_time DESC --统计总的CPU时间
-- ORDER BY avg_cpu_time DESC --统计平均单次查询CPU时间
```

# 查询是否有阻塞

`sys.dm_exec_requests` 返回有关在 SQL Server 中正在执行的每个请求的信息
[sys.dm_exec_requests](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-requests-transact-sql?view=sql-server-ver16)
```sql
SELECT [session_id],
       [request_id],
       [start_time]           AS '开始时间',
       [status]               AS '状态',
       [command]              AS '命令',
       dest.[text]            AS 'sql语句',
       DB_NAME([database_id]) AS '数据库名',
       [blocking_session_id]  AS '正在阻塞其他的ID',
       [wait_type]            AS '等待资源类型',
       [wait_time]            AS '等待时间',
       [wait_resource]        AS '等待的资源',
       [reads]                AS '物理读次数',
       [writes]               AS '写次数',
       [logical_reads]        AS '逻辑读次数',
       [row_count]            AS '返回结果行数'
FROM sys.[dm_exec_requests] AS der
         CROSS APPLY
     sys.[dm_exec_sql_text](der.[sql_handle]) AS dest
WHERE [session_id] > 50
ORDER BY [cpu_time] DESC
```

# 查看死锁

`sys.dm_tran_locks `  返回有关`SQL Server`中当前活动的锁管理器资源的信息。 向锁管理器发出的已授予锁或正等待授予锁的每个当前活动请求分别对应一行。

结果集中的列大体分为两组：资源组和请求组。 资源组说明正在进行锁请求的资源，请求组说明锁请求。
 [sys.dm_tran_locks ](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-tran-locks-transact-sql?view=sql-server-ver16)
 
`sys.dm_os_waiting_tasks`  返回有关正在等待某些资源的任务的等待队列的信息
[sys.dm_os_waiting_tasks](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-os-waiting-tasks-transact-sql?view=sql-server-ver16)

```sql
use master

select        spid         进程
     ,        STATUS       状态
     , 登录帐号=SUBSTRING(SUSER_SNAME(sid), 1, 30)
     , 用户机器名称=SUBSTRING(hostname, 1, 12)
     , 是否被锁住=convert(char(3), blocked)
     , 数据库名称=SUBSTRING(db_name(dbid), 1, 20)
     ,        cmd          命令
     ,        waittype  as 等待类型
     ,        last_batch   最后批处理时间
     ,        open_tran    未提交事务的数量
     ,        getdate() as 执行时间
from master.sys.sysprocesses
Where status = 'sleeping'
  and waittype = 0x0000
  and open_tran > 0


select t1.resource_type                                [资源锁定类型]
     , DB_NAME(resource_database_id)                as 数据库名
     , t1.resource_associated_entity_id                锁定对象
     , t1.request_mode                              as 等待者请求的锁定模式
     , t1.request_session_id                           等待者SID
     , t2.wait_duration_ms                             等待时间
     , (select TEXT
        from sys.dm_exec_requests r
                 cross apply
             sys.dm_exec_sql_text(r.sql_handle)
        where r.session_id = t1.request_session_id) as 等待者要执行的SQL
     , (select SUBSTRING(qt.text, r.statement_start_offset / 2 + 1,
                         (case
                              when r.statement_end_offset = -1 then DATALENGTH(qt.text)
                              else r.statement_end_offset end - r.statement_start_offset) / 2 + 1
                   )
        from sys.dm_exec_requests r
                 cross apply sys.dm_exec_sql_text(r.sql_handle) qt
        where r.session_id = t1.request_session_id)    等待者正要执行的语句
     , t2.blocking_session_id                          [锁定者SID]
     , (select TEXT
        from sys.sysprocesses p
                 cross apply
             sys.dm_exec_sql_text(p.sql_handle)
        where p.spid = t2.blocking_session_id
)                                                      锁定者执行语句
     , getdate()                                    as 执行时间
from sys.dm_tran_locks t1,
     sys.dm_os_waiting_tasks t2
where t1.lock_owner_address = t2.resource_address
```

# 查询表空间大小

`sp_spaceused` 显示当前数据库中表、索引视图或 `Service Broker` 队列使用的行数、保留磁盘空间和磁盘空间，或显示整个数据库保留和使用的磁盘空间。
```sql
create table #tb
(
    表名     sysname,
    记录数    int,
    保留空间   varchar(100),
    使用空间   varchar(100),
    索引使用空间 varchar(100),
    未用空间   varchar(100)
)
insert into #tb exec sp_MSForEachTable 'EXEC sp_spaceused ''?'''
select *
from #tb
go
SELECT 表名,
       记录数,
       cast(ltrim(rtrim(replace(保留空间, 'KB', ''))) as int) / 1024           保留空间MB,
       cast(ltrim(rtrim(replace(使用空间, 'KB', ''))) as int) / 1024           使用空间MB,
       cast(ltrim(rtrim(replace(使用空间, 'KB', ''))) as int) / 1024 / 1024.00 使用空间GB,
       cast(ltrim(rtrim(replace(索引使用空间, 'KB', ''))) as int) / 1024         索引使用空间MB,
       cast(ltrim(rtrim(replace(未用空间, 'KB', ''))) as int) / 1024           未用空间MB
FROM #tb
WHERE cast(ltrim(rtrim(replace(使用空间, 'KB', ''))) as int) / 1024 > 0
--order by 记录数 desc
ORDER BY 使用空间MB DESC
DROP TABLE #tb;
```

# 查询哪些表的Index 需要改进
`sys.dm_db_missing_index_group_stats` 返回缺失索引组的摘要信息，不包括空间索引。
[sys.dm_db_missing_index_group_stats](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-db-missing-index-group-stats-transact-sql?view=sql-server-ver16)

`sys.dm_db_missing_index_groups` 返回有关特定索引组中缺少的索引的信息
[sys.dm_db_missing_index_groups](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-db-missing-index-groups-transact-sql?view=sql-server-ver16)

`sys.dm_db_missing_index_details` 返回有关缺失索引的详细信息。
[sys.dm_db_missing_index_details](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-db-missing-index-details-transact-sql?view=sql-server-ver16)

```sql
-- 找出哪些表的Index 需要改进
SELECT CONVERT(DECIMAL(18, 2), user_seeks * avg_total_user_cost * (avg_user_impact * 0.01)) AS [index_advantage]
     , migs.last_user_seek
     , mid.[statement]                                                                      AS [Database.Schema.Table]
     , mid.equality_columns
     , mid.inequality_columns
     , mid.included_columns
     , migs.unique_compiles
     , migs.user_seeks
     , migs.avg_total_user_cost
     , migs.avg_user_impact
FROM sys.dm_db_missing_index_group_stats AS migs WITH (NOLOCK)
         INNER JOIN sys.dm_db_missing_index_groups AS mig WITH (NOLOCK) ON migs.group_handle = mig.index_group_handle
         INNER JOIN sys.dm_db_missing_index_details AS mid WITH (NOLOCK) ON mig.index_handle = mid.index_handle
ORDER BY index_advantage desc
```

# 查询 Index 碎片化指数
`sys.dm_db_index_physical_stats` 返回`SQL Server`中指定表或视图的数据和索引的大小和碎片信息。 对于索引，针对每个分区中的 `B 树`的每个级别，返回与其对应的一行。 对于堆，针对每个分区的 `IN_ROW_DATA` 分配单元，返回与其对应的一行。 对于大型对象 `(LOB)` 数据，针对每个分区的 `LOB_DATA` 分配单元返回与其对应的一行。 如果表中存在行溢出数据，则针对每个分区中的 `ROW_OVERFLOW_DATA` 分配单元，返回与其对应的一行。 不返回有关 `xVelocity` 内存优化的列存储索引的信息。
[sys.dm_db_index_physical_stats](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-dynamic-management-views/sys-dm-db-index-physical-stats-transact-sql?view=sql-server-ver16)

`sys.indexes` 每个表格对象（例如，表、视图或表值函数）的索引或堆都包含一行。
[sys.indexes](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-catalog-views/sys-indexes-transact-sql?view=sql-server-ver16)
```sql
--  查看Index 碎片化指数
SELECT DB_NAME(ps.database_id)     AS [Database Name]
     , OBJECT_NAME(ps.[object_id]) AS [Object Name]
     , i.[name]                    AS [Index Name]
     , ps.index_id
     , ps.index_type_desc
     , ps.avg_fragmentation_in_percent
     , ps.fragment_count
     , ps.page_count
     , i.fill_factor
     , i.has_filter
     , i.filter_definition
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, N'LIMITED') AS ps
         INNER JOIN sys.indexes AS i WITH (NOLOCK) ON ps.[object_id] = i.[object_id]
    AND ps.index_id = i.index_id
WHERE ps.database_id = DB_ID()
  AND ps.page_count > 2500
ORDER BY ps.avg_fragmentation_in_percent desc;
```
# 查询Index 的Statistics 最后更新时间
`sys.objects` 包含数据库中创建的每个用户定义的架构范围对象（包括本机编译的标量用户定义函数）的行。
[sys.objects](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-catalog-views/sys-objects-transact-sql?view=sql-server-ver16)

`sys.stats` 对于数据库中`SQL Server`中表、索引和索引视图存在的每个统计信息对象，包含一行。 每个索引都有一个具有相同名称和 `ID` 的对应统计信息行 `(index_id = stats_id)` ，但并非每个统计信息行都有相应的索引。
[sys.stats](https://learn.microsoft.com/zh-cn/sql/relational-databases/system-catalog-views/sys-stats-transact-sql?view=sql-server-ver16)
```sql
--   查询Index 的Statistics 最后更新时间
SELECT SCHEMA_NAME(o.[schema_id]) + N'.' + o.[name] AS [Object Name]
     , o.type_desc                                  AS [Object Type]
     , i.[name]                                     AS [Index Name]
     , STATS_DATE(i.[object_id], i.index_id)        AS [Statistics Date]
     , s.auto_created
     , s.no_recompute
     , s.user_created
     , st.row_count
     , st.used_page_count
FROM sys.objects AS o WITH (NOLOCK)
         INNER JOIN sys.indexes AS i WITH (NOLOCK) ON o.[object_id] = i.[object_id]
         INNER JOIN sys.stats AS s WITH (NOLOCK) ON i.[object_id] = s.[object_id]
    AND i.index_id = s.stats_id
         INNER JOIN sys.dm_db_partition_stats AS st WITH (NOLOCK) ON o.[object_id] = st.[object_id]
    AND i.[index_id] = st.[index_id]
WHERE o.[type] IN ('U', 'V')
  AND st.row_count > 0
ORDER BY STATS_DATE(i.[object_id], i.index_id) desc;
```
# 优化指定表
`ALTER INDEX`  通过禁用、重新生成或重新组织索引，或通过设置索引选项，修改现有的表索引或视图索引（行存储、列存储或 `XML`）。
[ALTER INDEX ](https://learn.microsoft.com/zh-cn/sql/t-sql/statements/alter-index-transact-sql?view=sql-server-ver16)

`UPDATE STATISTICS` 更新表或索引视图的查询优化统计信息。 默认情况下，查询优化器已根据需要更新统计信息以改进查询计划；但在某些情况下，可以通过使用 `UPDATE STATISTICS` 或存储过程 `sp_updatestats` 来比默认更新更频繁地更新统计信息，提高查询性能。
[UPDATE STATISTICS ](https://learn.microsoft.com/zh-cn/sql/t-sql/statements/update-statistics-transact-sql?view=sql-server-ver16)

[对表或索引启用压缩功能](https://learn.microsoft.com/zh-cn/sql/relational-databases/data-compression/enable-compression-on-a-table-or-index?view=sql-server-ver16)
```sql
declare @tableName nvarchar(100),@sqlStr nvarchar(300) --声明变量：待优化物理表名，优化语句。

set @tableName = ?

-- 重建索引，整理碎片
set @sqlStr = 'ALTER INDEX ALL ON [' + @tableName + '] REBUILD'
exec @sqlStr

-- 更新统计信息
set @sqlStr = 'UPDATE STATISTICS [' + @tableName + ']'
exec @sqlStr

-- 压缩索引
set @sqlStr = 'ALTER INDEX ALL ON [' + @tableName + '] REBUILD WITH (DATA_COMPRESSION=ROW)'
exec @sqlStr

-- 压缩物理表
set @sqlStr = 'ALTER TABLE [' + @tableName + '] REBUILD WITH (DATA_COMPRESSION=ROW)'
exec @sqlStr
```

