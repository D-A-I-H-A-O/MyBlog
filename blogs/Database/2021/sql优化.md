---
title: SQL优化
date: 2021-02-22
categories:
 - Database
tags:
 - sql
---


## 1.查询的模糊匹配

尽量避免在一个复杂查询里面使用`LIKE '%parm1%' `左边的百分号会导致相关列的索引无法使,请注意使用。

改进方法：

a、修改前台程序——把查询条件的供应商名称一栏由原来的文本输入改为下拉列表，用户模糊输入供应商名称时，直接在前台就帮忙定位到具体的供应商，这样在调用后台程序时，这列就可以直接用等于来关联了。

b、直接修改后台——根据输入条件，先查出符合条件的供应商，并把相关记录保存在一个临时表里头，然后再用临时表去做复杂关联

##  2.索引问题

开发初期，由于表记录很少，索引创建与否，可能对性能没啥影响，开发人员因此也未多加重视。然一旦程序发布到生产环境，随着时间的推移，表记录越来越多，这时缺少索引，对性能的影响便会越来越大了。这个问题需要数据库设计人员和开发人员共同关注.

>不要在建立的索引的数据列上进行下列操作:

* 避免对索引字段进行计算操作
  
* 避免在索引字段上使用not，<>，!=
  
* 避免在索引列上使用IS NULL和IS NOT NULL
  
* 避免在索引列上出现数据类型转换
  
* 避免在索引字段上使用函数
  
* 避免建立索引的列中使用空值。

## 3.复杂操作

部分UPDATE、SELECT 语句写得很复杂（经常嵌套多级子查询）—— 可以考虑适当拆成几步，先生成一些临时数据表，再进行关联操作。

## 4、update

同一个表的修改在一个过程里出现好几十次，像这类脚本其实可以很简单就整合在一个UPDATE语句来完成。
```sql
     update table1 set col1=... where col2=...;
     update table1 set col1=... where col2=...
     ......
```

UPDATE操作不要拆成DELETE操作+INSERT操作的形式，虽然功能相同，但是性能差别是很大的。

## 5.在可以使用UNION ALL的语句里，使用了UNION

UNION 因为会将各查询子集的记录做比较，故比起UNION ALL ，通常速度都会慢上许多。一般来说，如果使用UNION ALL能满足要求的话，务必使用UNION ALL。还有一种情况大家可能会忽略掉，就是虽然要求几个子集的并集需要过滤掉重复记录，但由于脚本的特殊性，不可能存在重复记录，这时便应该使用UNION ALL，如xx模块的某个查询程序就曾经存在这种情况，见，由于语句的特殊性，在这个脚本中几个子集的记录绝对不可能重复，故可以改用UNION ALL）

## 6.对Where语句的法则

* 避免在WHERE子句中使用in、not  in、or 或者having。可以使用 exist 和not exist代替 in和not in。

可以使用表连接代替 exist。Having可以用where代替，如果无法代替可以分两步处理。

```sql
select Sendorder.id,Sendorder.reads,Sendorder.addtime from Sendorder where Sendorder.person_id not in(select user_id from reg_person ) or Sendorder.worksite_id not in(select id from worksite) order by Sendorder.addtime desc
```

```sql
select Sendorder.id,Sendorder.reads,Sendorder.addtime from Sendorder where not EXISTS (SELECT id FROM reg_person where reg_person.user_id=Sendorder.person_id) or not EXISTS (SELECT id FROM worksite where worksite.id=Sendorder.worksite_id) order by Sendorder.addtime desc
```

例子
```sql
SELECT *  FROM ORDERS WHERE CUSTOMER_NAME NOT IN (SELECT CUSTOMER_NAME FROM CUSTOMER)
```
优化
```sql
SELECT *  FROM ORDERS WHERE CUSTOMER_NAME not exist (SELECT CUSTOMER_NAME FROM CUSTOMER)
```

* 不要以字符格式声明数字，要以数字格式声明字符值。（日期同样）否则会使索引无效，产生全表扫描。

例子使用：
```sql
SELECT emp.ename, emp.job FROM emp WHERE emp.empno = 7369;
```
不要使用：
```sql
SELECT emp.ename, emp.job FROM emp WHERE emp.empno = '7369';
```

SQLSERVER采用自下而上的顺序解析WHERE子句，根据这个原理，表之间的连接必须写在其他WHERE条件之前，那些可以过滤掉最大数量记录的条件必须写在WHERE子句的末尾 

```sql
--低效
SELECT * 
FROM EMP E 
WHERE SAL > 50000 
AND JOB = 'MANAGER' 
AND 25 < (SELECT COUNT(*) FROM EMP WHERE MGR=E.EMPNO); 
```

```sql
--高效
SELECT * 
FROM EMP E 
WHERE 25 < (SELECT COUNT(*) FROM EMP WHERE MGR=E.EMPNO) 
AND SAL > 50000 
AND JOB = 'MANAGER';
```

## 7.对Select语句的法则

在应用程序、包和过程中限制使用select * from table这种方式。看下面例子

使用
```sql
SELECT empno,ename,category FROM emp WHERE empno = 7369
```
而不要使用
```sql
SELECT * FROM emp WHERE empno = '7369'
```
### 8.排序

避免使用耗费资源的操作，带有DISTINCT,UNION,MINUS,INTERSECT,ORDER BY的SQL语句会启动SQL引擎 执行，耗费资源的排序(SORT)功能. DISTINCT需要一次排序操作, 而其他的至少需要执行两次排序

## 9.临时表

慎重使用临时表可以极大的提高系统性能

## 10.减少不必要的操作

* 杜绝不必要的表连接，多一个表链接代表多很大部分开销。
* 减少不必要的条件判断，很多时候前台传入为空值得时候 后台语句被写成XX=XX OR XX IS NULL OR XX LIKE OR ...OR ...OR 等。这是比较经典的问题了，请加入判断在拼入最后的条件！
* 你的语句需要去重复么？ distinct 、union等操作
* LEFT JOIN 和 inner join的区别，是否真的需要left join，否则选用inner join 来减少不必要的数据返回。
* order by 你的语句是否需要排序？排序是否可以通过索引来降低性能消耗？ 
* 控制同一语句的多次执行，特别是一些基础数据的多次执行是很多程序员很少注意的。
* 减少多次的数据转换，也许需要数据转换是设计的问题，但是减少次数是程序员可以做到的。
* 杜绝不必要的子查询和连接表，子查询在执行计划一般解释成外连接，多余的连接表带来额外的开销。

## 11、减少访问数据库的次数。

当执行每条SQL语句时，SQLSERVER在内部执行了许多工作：解析SQL语句，估算索引的利用率，绑定变量，读数据块等等 .由此可见，减少访问数据库的次数，就能实际上减少SQLSERVER的工作量。
例如：以下有三种方法可以检索出雇员号等于0342或0291的职员

方法1 (最低效)
```sql
SELECT EMP_NAME, SALARY, GRADE FROM EMP  WHERE EMP_NO = 342;  
SELECT EMP_NAME, SALARY, GRADE FROM EMP  WHERE EMP_NO = 291;
```

方法2 (次低效)
```sql
DECLARE 
CURSOR C1 (E_NO NUMBER) IS 
SELECT EMP_NAME,SALARY,GRADE FROM EMP WHERE EMP_NO = E_NO; 
BEGIN 
OPEN C1(342); 
FETCH C1 INTO …,…,…; 
… 
OPEN C1(291); 
FETCH C1 INTO …,…,…; 
… 
CLOSE C1; 
END;
```

方法3 (高效)
```sql
SELECT A.EMP_NAME, A.SALARY, A.GRADE, B.EMP_NAME, B.SALARY, B.GRADE FROM EMP A, EMP B WHERE A.EMP_NO = 342 AND B.EMP_NO = 291;
```
## 11.使用表的别名(Alias)

当在SQL语句中连接多个表时，请使用表的别名并把别名前缀于每个Column上，这样可以减少解析的时间并减少那些由Column歧义引起的语法错误     


[高手详解SQL性能优化十条经验](https://database.51cto.com/art/200904/118526.htm  )
[SQL Server查询语句性能优化技巧](https://www.modb.pro/db/12139)

