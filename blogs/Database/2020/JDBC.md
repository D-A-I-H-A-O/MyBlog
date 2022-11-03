---
title: JDBC
date: 2020-12-28
categories:
 - Database
tags:
 - JDBC
---


## JDBC

### 概述

在Java中，数据库存取技术可分为如下几类：

1、JDBC直接访问数据库

2、JDO技术（Java Data Object）

3、 第三方O/R工具，如`Hibernate`, `Mybatis`等

JDBC是Java访问数据库的基石，`JDO`，`Hibernate`等只是更好的封装了JDBC。


### 什么是JDBC

- JDBC全称为：`Java Data Base Connectivuty`，是Java语言中用来规范客户端程序如何来访问数据库的应用程序接口，提供了诸如查询和更新数据库中数据的方法。

### 为什么要使用JDBC

- JDBC为访问不同的数据库提供了一种**统一的路径**，为开发者屏蔽了一些细节问题。
- JDBC的目标：是使Java程序员使用JDBC可以连接任何提供了JDBC驱动程序的数据库系统，这样就使得程序员无需对特定的数据库系统的特点有过多的了解，从而大大简化和加快了开发过程。

如果没有JDBC，那么Java程序访问数据库时是这样的：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201228100714364.png)
使用JDBC访问数据库：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201228100746657.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

- JDBC是SUN公司（Oracle公司甲骨文）提供一套用于数据库操作的接口API，Java程序员只需要面向这套接口编程即可。不同的数据库厂商，需要针对这套接口，提供不同实现。不同的实现的集合，即为不同数据库的驱动。

### JDBC API
JDBC API是一系列的接口，它统一和规范了应用程序与数据库的连接、执行SQL语句，并到得到返回结果等各类操作。声明在java.sql与javax.sql包中。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020122810150884.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
### JDBC程序访问数据库步骤
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201228101546478.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
### JDBC程序编写步骤
1、引入数据库驱动，驱动程序由数据库提供商提供下载。 [MySQL的驱动下载地址](http://dev.mysql.com/downloads/)

2、加载并注册驱动，加载驱动有两种⽅式
- DriverManager.registerDriver(new com.mysql.jdbc.Driver());
>会导致驱动会注册两次，过度依赖于mysql的api，脱离的mysql的开发包，程序则
⽆法编译

- Class.forName("com.mysql.jdbc.Driver")
> 通过反射，加载与注册驱动类，驱动只会加载⼀次，不需要依赖具体的驱动，灵活性⾼。我们⼀般都是使⽤第⼆种⽅式

Driver接口的驱动程序类中包含了静态代码块，在这个静态代码块中，会调用`DriverManager.registerDriver() `方法来注册自身的一个实例，所以只需要让驱动类的这段静态代码执行即可注册驱动类。而要让这段静态代码执行，只要让该类被类加载器加载即可。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201228102640895.png)
 还有一种是服务提供者框架（例如：JDBC的驱动程序）自动注册（有版本要求），符合JDBC 4.0规范的驱动程序包含了一个文件META-INF/services/java.sql.Driver，在这个文件中提供了JDBC驱动实现的类名。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201228104111500.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
JVM的服务提供者框架在启动应用时就会注册服务，例如：MySQL的JDBC驱动就会被注册，而原代码中的Class.forName(“com.mysql.jdbc.Driver”)仍然可以存在，但是不会起作用。


3、获取数据库链接

可以通过`DriverManager`类建立到数据库的连接`Connection`：

`DriverManager` 试图从已注册的 `JDBC` 驱动程序集中选择一个适当的驱动程序。

```java
public static Connection getConnection(String url)

public static Connection getConnection(String url,String user, String password)

public static Connection getConnection(String url,Properties info)
```

- 其中Properties info通常至少应该包括 `user` 和 `password` 属性

`JDBC URL` 用于标识一个被注册的驱动程序，驱动程序管理器通过这个 `URL` 选择正确的驱动程序，从而建立到数据库的连接。`JDBC URL`的标准由三部分组成，各部分间用冒号分隔。 

```rul
jdbc:<子协议>:<子名称>
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201228104905568.png)

- 协议：JDBC URL中的协议总是jdbc 
- 子协议：子协议用于标识一个数据库驱动程序
- 子名称：一种标识数据库的方法。子名称可以依不同的子协议而变化，用子名称的目的是为了定位数据库提供足够的信息 

**MySQL的连接URL编写方式：**
- 	jdbc:mysql://主机名称:mysql服务端口号/数据库名称?参数=值&参数=值
- 	jdbc:mysql://localhost:3306/testdb
- 	jdbc:mysql://localhost:3306/testdb?useUnicode=true&characterEncoding=utf8（如果JDBC程序与服务器端的字符集不一致，会导致乱码，那么可以通过参数指定服务器端的字符集）
- 	jdbc:mysql://localhost:3306/testdb?user=root&password=123456

**Oracle9i:**
- 	jdbc:oracle:thin:@主机名称:oracle服务端口号:数据库名称
-  jdbc:oracle:thin:@localhost:1521:testdb

**SQLServer**
- 	jdbc:sqlserver://主机名称:sqlserver服务端口号:DatabaseName=数据库名称
- 	jdbc:sqlserver://localhost:1433:DatabaseName=testdb

4、操作访问数据库

数据库连接被用于向数据库服务器发送命令和 SQL 语句，并接受数据库服务器返回的结果。其实一个数据库连接就是一个`Socket`连接。

在 java.sql 包中有 3 个接口分别定义了对数据库的调用的不同方式：
- `Statement`：用于执行静态 SQL 语句并返回它所生成结果的对象。 
- `PrepatedStatement：SQL` 语句被预编译并存储在此对象中，然后可以使用此对象多次高效地执行该语句。
- `CallableStatement`：用于执行 SQL 存储过程

**Statement**

通过调用 Connection 对象的 createStatement() 方法创建该对象，该对象用于执行静态的 SQL 语句，并且返回执行结果。

Statement 接口中定义了下列方法用于执行 SQL 语句：

```java
int excuteUpdate(String sql)：执行更新操作INSERT、UPDATE、DELETE
ResultSet excuteQuery(String sql)：执行查询操作SELECT
```

**ResultSet**

通过调用 `Statement` 对象的 `excuteQuery()` 方法创建该对象

- ResultSet 对象以逻辑表格的形式封装了执行数据库操作的结果集，ResultSet 接口由数据库厂商实现
- ResultSet 对象维护了一个指向当前数据行的游标，初始的时候，游标在第一行之前，可以通过ResultSet 对象的 next() 方法移动到下一行

ResultSet 接口的常用方法：

```java
boolean next()

getXxx(String columnLabel)：columnLabel使用SQL AS子句指定的列标签。如果未指定SQL AS子句，则标签是列名称

getXxx(int index) :索引从1开始
```

5、释放资源

`Connection`、`Statement`、`ResultSet`都是应用程序和数据库服务器的连接资源，使用后一定要关闭，可以在finally中关闭。

**代码**

```java
        Connection connection = null;
        Statement statement = null;
        ResultSet result = null;

        try {
            Class.forName("com.mysql.jdbc.Driver");
            //获取与数据库连接的对象-Connetcion
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/testdb", "root", "root");
            //获取执⾏sql语句的statement对象
            statement = connection.createStatement();
            //执⾏sql语句,拿到结果集
            result = statement.executeQuery("select * from users");
            //遍历结果集，得到数据
            while (result.next()) {
                System.out.println(result.getString(1));
                System.out.println(result.getString(2));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
            //关闭资源，后调⽤的先关闭,关闭之前，要判断对象是否存在
            if (result != null) {
                try {
                    result.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (statement != null) {
                try {
                    statement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
```
### JDBC使用细节
#### PreparedStatement对象

- 可以通过调用 `Connection` 对象的 `preparedStatement(String sql)` 方法获取 `PreparedStatement` 对象

- `PreparedStatement` 接口是 `Statement` 的子接口，它表示一条预编译过的 SQL 语句

- `PreparedStatement` 对象所代表的 SQL 语句中的参数用问号(?)来表示，调用 `PreparedStatement` 对象的 `setXxx()` 方法来设置这些参数.。`setXxx()` 方法有两个参数，第一个参数是要设置的 SQL 语句中的参数的索引(从 1 开始)，第二个是设置的 SQL 语句中的参数的值。

- 处理`BlOB`类型的数据（`BLOB (binary large object)`，二进制大对象，`BLOB`常常是数据库中用来存储二进制文件的字段类），插入`BLOB`类型的数据必须使用`PreparedStatement`，因为`BLOB`类型的数据无法使用字符串拼接写的。


```sql
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `head_picture` mediumblob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
```

```java
/*
 * PreparedStatement：是Statement子接口
 * 1、SQL不需要拼接
 * 2、SQL不会出现注入
 * 3、可以处理Blob类型的数据
 * tinyblob：255字节以内
 * blob：65K以内
 * mediumblob:16M以内
 * longblob：4G以内
 * 
 * 如果还是报错：xxx too large，那么在mysql的安装目录下，找my.ini文件加上如下的配置参数：
 * max_allowed_packet=16M
 * 注意：修改了my.ini文件，一定要重新启动服务
 * 
 */
public class TestPreparedStatement {
  @Test
  public void add() throws Exception {
    Scanner input = new Scanner(System.in);
    System.out.println("请输入姓名：");
    String name = input.nextLine();

    System.out.println("请输入手机号码：");
    String tel = input.nextLine();

    System.out.println("请输入性别：");
    String gender = input.nextLine();

    System.out.println("请输入薪资：");
    double salary = input.nextDouble();

    System.out.println("请输入部门编号：");
    int did = input.nextInt();

    //1、连接数据库
    Class.forName("com.mysql.jdbc.Driver");

    String url = "jdbc:mysql://localhost:3306/test";
    String user = "root";
    String password = "123456";
    Connection conn = DriverManager.getConnection(url, user, password);

    //2、编写带？的SQL
    String sql = "INSERT INTO t_employee (ename,tel,gender,salary,did) VALUES(?,?,?,?,?)";

    // 3、准备一个PreparedStatement：预编译sql
    PreparedStatement pst = conn.prepareStatement(sql);// 对带？的sql进行预编译

    // 4、把?用具体的值进行代替
    pst.setString(1, name);
    pst.setString(2, tel);
    pst.setString(3, gender);
    pst.setDouble(4, salary);
    pst.setInt(5, did);

    // 5、执行sql
    int len = pst.executeUpdate();
    System.out.println(len>0?"添加成功":"添加失败");

    // 6、释放资源
    pst.close();
    conn.close();
  }

  @Test
  public void select() throws Exception {
    Scanner input = new Scanner(System.in);
    System.out.println("请输入姓名：");
    String name = input.nextLine();

    //1、连接数据库
    Class.forName("com.mysql.jdbc.Driver");

    String url = "jdbc:mysql://localhost:3306/test";
    String user = "root";
    String password = "123456";
    Connection conn = DriverManager.getConnection(url, user, password);

    //2、编写带?的sql
    //孙红雷  ' or '1' = '1
    String sql = "SELECT eid,ename,tel,gender,salary FROM t_employee WHERE ename = ?";

    // 3、把带？的sql语句进行预编译
    PreparedStatement pst = conn.prepareStatement(sql);

    // 4、把？用具体的变量的赋值
    pst.setString(1, name);

    // 5、执行sql
    ResultSet rs = pst.executeQuery();
    while (rs.next()) {
      int id = rs.getInt("eid");
      String ename = rs.getString("ename");
      String tel = rs.getString("tel");
      String gender = rs.getString("gender");
      double salary = rs.getDouble("salary");

      System.out.println(id + "\t" + ename + "\t" + tel + "\t" + gender + "\t" + salary);
    }

    // 6、释放资源
    rs.close();
    pst.close();
    conn.close();
  }

  @Test
  public void addBlob() throws Exception {
    Scanner input = new Scanner(System.in);
    System.out.println("请输入用户名：");
    String username = input.nextLine();

    System.out.println("请输入密码：");
    String pwd = input.nextLine();

    System.out.println("请指定照片的路径：");
    String photoPath = input.nextLine();

    //1、连接数据库
    Class.forName("com.mysql.jdbc.Driver");

    String url = "jdbc:mysql://localhost:3306/test";
    String user = "root";
    String password = "123456";
    Connection conn = DriverManager.getConnection(url, user, password);

    //2、 INSERT INTO `user` VALUES(NULL,用户名,密码,照片)
    String sql = "INSERT INTO `user` (username,`password`,head_picture)VALUES(?,?,?)";

    // 3、准备一个PreparedStatement：预编译sql
    PreparedStatement pst = conn.prepareStatement(sql);// 对带？的sql进行预编译

    // 4、对？进行设置
    pst.setString(1, username);
    pst.setString(2, pwd);
    pst.setBlob(3, new FileInputStream(photoPath));

    // 5、执行sql
    int len = pst.executeUpdate();
    System.out.println(len > 0 ? "添加成功" : "添加失败");

    // 6、释放资源
    pst.close();
    conn.close();
  }
}
```
#### PreparedStatement VS Statement

 * 代码的可读性和可维护性. Statement的sql拼接是个难题。 PreparedStatement 可以防止 SQL 注入
 * PreparedStatement 可以处理Blob类型的数据，PreparedStatement能最大可能提高性能：（Oracle和PostgreSQL8是这样，但是对于MySQL，不一定比Statement高）
 >DBServer会对预编译语句提供性能优化。因为预编译语句有可能被重复调用，所以语句在被DBServer的编译器编译后的执行代码被缓存下来，那么下次调用时只要是相同的预编译语句就不需要编译，只要将参数直接传入编译过的语句执行代码中就会得到执行。

**JDBC 取得数据库自动生成的主键**

- 获取自增长的键值：

在创建PreparedStatement对象时

```java
原来：
PreparedStatement pst = conn.preparedStatement(sql);
现在：
PreparedStatement pst = conn.prepareStatement(orderInsert,Statement.RETURN_GENERATED_KEYS);

原来执行更新
int len = pst.executeUpdate();

现在：
int len = pst.executeUpdate();
ResultSet rs = pst.getGeneratedKeys();
if(rs.next()){
​ Object key = rs.getObject(第几列);//获取自增长的键值
}
```

#### 批处理
当需要成批插入或者更新记录时。可以采用Java的批量更新机制，这一机制允许多条语句一次性提交给数据库批量处理。通常情况下比单独提交处理更有效率。

JDBC的批量处理语句包括下面两个方法：

```go
addBatch()：添加需要批量处理的SQL语句或参数
executeBatch()：执行批量处理语句；
```

通常我们会遇到两种批量执行SQL语句的情况：

- 多条SQL语句的批量处理；
- 一个SQL语句的批量传参；

>JDBC连接MySQL时，如果要使用批处理功能，请再url中加参数?rewriteBatchedStatements=true PreparedStatement作批处理插入时使用values（使用value没有效果）

#### 事务
JDBC程序中当一个连接对象被创建时，默认情况下是自动提交事务：每次执行一个 SQL 语句时，如果执行成功，就会向数据库自动提交，而不能回滚。

JDBC程序中为了让多个 SQL 语句作为一个事务执行：（重点）
- 调用 Connection 对象的 setAutoCommit(false); 以取消自动提交事务
- 在所有的 SQL 语句都成功执行后，调用 commit(); 方法提交事务
- 在其中某个操作失败或出现异常时，调用 rollback(); 方法回滚事务
- 若此时 Connection 没有被彻底关闭，还可能被重复使用, 则需要恢复其自动提交状态 setAutoCommit(true);

>如果多个操作，每个操作使用的是自己单独的连接，则无法保证事务。即同一个事务的多个操作必须在同一个连接下


### 数据库连接池
**数据库连接池的必要性**
- 普通的JDBC数据库连接使用 DriverManager 来获取，每次向数据库建立连接的时候都要将 Connection 加载到内存中，再验证IP地址，用户名和密码(得花费0.05s～1s的时间)。需要数据库连接的时候，就向数据库要求一个，执行完成后再断开连接。这样的方式将会消耗大量的资源和时间。数据库的连接资源并没有得到很好的重复利用.若同时有几百人甚至几千人在线，频繁的进行数据库连接操作将占用很多的系统资源，严重的甚至会造成服务器的崩溃。
- 对于每一次数据库连接，使用完后都得断开。否则，如果程序出现异常而未能关闭，将会导致数据库系统中的内存泄漏，最终将导致重启数据库。
- 这种开发不能控制被创建的连接对象数，系统资源会被毫无顾及的分配出去，如连接过多，也可能导致内存泄漏，服务器崩溃。为解决传统开发中的数据库连接问题，可以采用数据库连接池技术（connection pool）。
- 数据库连接池的基本思想就是为数据库连接建立一个“缓冲池”。预先在缓冲池中放入一定数量的连接，当需要建立数据库连接时，只需从“缓冲池”中取出一个，使用完毕之后再放回去。数据库连接池负责分配、管理和释放数据库连接，它允许应用程序重复使用一个现有的数据库连接，而不是重新建立一个。连接池的最大数据库连接数量限定了这个连接池能占有的最大连接数，当应用程序向连接池请求的连接数超过最大连接数量时，这些请求将被加入到等待队列中。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201228115626397.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
**数据库连接池技术的优点：**
- **资源重用**：	由于数据库连接得以重用，避免了频繁创建，释放连接引起的大量性能开销。在减少系统消耗的基础上，另一方面也增加了系统运行环境的平稳性。
- **更快的系统反应速度**：数据库连接池在初始化过程中，往往已经创建了若干数据库连接置于连接池中备用。此时连接的初始化工作均已完成。对于业务请求处理而言，直接利用现有可用连接，避免了数据库连接初始化和释放过程的时间开销，从而减少了系统的响应时间
- **新的资源分配手段**：对于多应用共享同一数据库的系统而言，可在应用层通过数据库连接池的配置，实现某一应用最大可用数据库连接数的限制，避免某一应用独占所有的数据库资源
- **统一的连接管理，避免数据库连接泄露**：在较为完善的数据库连接池实现中，可根据预先的占用超时设定，强制回收被占用连接，从而避免了常规数据库连接操作中可能出现的资源泄露

**多种开源的数据库连接池**

JDBC 的数据库连接池使用 javax.sql.DataSource 来表示，DataSource 只是一个接口，该接口通常由服务器(Weblogic, WebSphere, Tomcat)提供实现，也有一些开源组织提供实现：
- DBCP 是Apache提供的数据库连接池，速度相对c3p0较快，但因自身存在BUG，Hibernate3已不再提供支持
- C3P0 是一个开源组织提供的一个数据库连接池，速度相对较慢，稳定性还可以

- Proxool 是sourceforge下的一个开源项目数据库连接池，有监控连接池状态的功能，稳定性较c3p0差一点
- 	BoneCP 是一个开源组织提供的数据库连接池，速度快
- Druid 是阿里提供的数据库连接池，据说是集DBCP 、C3P0 、Proxool 优点于一身的数据库连接池，但是速度不知道是否有BoneCP快DataSource 通常被称为数据源，它包含连接池和连接池管理两个部分，习惯上也经常把 DataSource 称为连接池

>	数据源和数据库连接不同，数据源无需创建多个，它是产生数据库连接的工厂，因此整个应用只需要一个数据源即可。

>当数据库访问结束后，程序还是像以前一样关闭数据库连接：conn.close(); 但conn.close()并没有关闭数据库的物理连接，它仅仅把数据库连接释放，归还给了数据库连接池。

[DruidDataSource配置属性列表](https://github.com/alibaba/druid/wiki/DruidDataSource%E9%85%8D%E7%BD%AE%E5%B1%9E%E6%80%A7%E5%88%97%E8%A1%A8)

### 面试题
>JDBC操作数据库的步骤 ？

1. 注册数据库驱动。
2. 建⽴数据库连接。
3. 创建⼀个Statement。
4. 执⾏SQL语句。
5. 处理结果集。
6. 关闭数据库连接

>JDBC中的Statement 和PreparedStatement的区别？

 1. PreparedStatement是预编译的SQL语句，效率⾼于Statement。
 2. PreparedStatement⽀持?操作符，相对于Statement更加灵活。
 3.  PreparedStatement可以防⽌SQL注⼊，安全性⾼于Statement。
 4. CallableStatement适⽤于执⾏存储过程。
>JDBC中⼤数据量的分⻚解决⽅法?

最好的办法是利⽤sql语句进⾏分⻚，这样每次查询出的结果集中就只包含某⻚的数据内容

mysql语法：

```sql
SELECT *
 FROM 表名
 LIMIT [START], length;
```

oracle语法：

```sql
SELECT *FROM (
 SELECT 列名,列名,ROWNUM rn
 FROM 表名
 WHERE ROWNUM<=(currentPage*lineSize)) temp

 WHERE temp.rn>(currentPage-1)*lineSize;
```


>说说数据库连接池⼯作原理和实现⽅案？

 1. ⼯作原理： 服务器启动时会建⽴⼀定数量的池连接，并⼀直维持不少于此数⽬的池连接。客户端程序需要连接时，池驱动程序会返回⼀个未使⽤的池连接并将其表记为忙。如果当前没有空闲连接，池驱动程序就新建⼀定数量的连接，新建连接的数量有配置参数决定。当使⽤的池连接调⽤完成后，池驱动程序将此连接表记为空闲，其他调⽤就可以使⽤这个连接。
 2. 实现⽅案：连接池使⽤集合来进⾏装载，返回的Connection是原始Connection的代理，代理
Connection的close⽅法，当调⽤close⽅法时，不是真正关连接，⽽是把它代理的Connection对象
放回到连接池中，等待下⼀次重复利⽤。

>Java中如何进⾏事务的处理?
>
1. 事务是作为单个逻辑⼯作单元执⾏的⼀系列操作。
2. ⼀个逻辑⼯作单元必须有四个属性，称为原⼦性、⼀致性、隔离性和持久性 (ACID) 属性，只有这
样才能成为⼀个事务

Connection类中提供了4个事务处理⽅法:

 - setAutoCommit(BooleanautoCommit):设置是否⾃动提交事务,默认为⾃动提交,即为true,通过设置false禁⽌⾃动提交事务;
 -  commit():提交事务; 
 - rollback():回滚事务. 
 - savepoint:保存点
   注意：savepoint不会结束当前事务，普通提交和回滚都会结束当前事务的

> JDBC连接本机MySQL数据库的代码
```java
class Constant{
    public static final String URL="jdbc:oracle:thin:@127.0.0.1:1521:sid";
    public static final String USERNAME="username";
    public static final String PASSWORD="password";
}

class DAOException extends Exception{
    public DAOException(){
        super();
    }
    public DAOException(String msg){
        super(msg);
    }
}

public class Test{

    public void printProducts() throws DAOException{
        Connection c = null;
        Statement s = null;
        ResultSet r = null;
        try{
            c = DriverManager.getConnection(Constant.URL,Constant.USERNAME,Constant.PASSWORD);
            s = c.createStatement();
            r = s.executeQuery("select id,name,price from product");
            System.out.println("Id\tName\tPrice");
            while(r.next()){
                int x = r.getInt("id");
                String y = r.getString("name");
                float z = r.getFloat("price");
                System.out.println(x + "\t" + y + "\t" + z);
            }
        } catch (SQLException e){
            throw new DAOException("数据库异常");
        } finally {
            try{
                r.close();
                s.close();
                c.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}

```
>PreparedStatement的缺点是什么，怎么解决这个问题？
>
PreparedStatement的一个缺点是，我们不能直接用它来执行in条件语句；需要执行IN条件语句的话，下面有一些解决方案：

- 分别进行单条查询——这样做性能很差，不推荐。
- 使用存储过程——这取决于数据库的实现，不是所有数据库都支持。
- 动态生成PreparedStatement——这是个好办法，但是不能享受PreparedStatement的缓存带来的好处了。
- 在PreparedStatement查询中使用NULL值——如果你知道输入变量的最大个数的话，这是个不错的办法，扩展一下还可以支持无限参数。


>JDBC的DriverManager是用来做什么的？ 
 - JDBC的DriverManager是一个工厂类，我们通过它来创建数据库连接.当JDBC的Driver类被加载进来时，它会自己注册到DriverManager类里面然后我们会把数据库配置信息传成DriverManager.getConnection()方法，DriverManager会使用注册到它里面的驱动来获取数据库连接，并返回给调用的程序。

>JDBC的ResultSet是什么?
>
- 在查询数据库后会返回一个ResultSet，它就像是查询结果集的一张数据表。 
- ResultSet对象维护了一个游标，指向当前的数据行。开始的时候这个游标指向的是第一行。如果调用了ResultSet的next()方法游标会下移一行，如果没有更多的数据了，next()方法会返回false。可以在for循环中用它来遍历数据集。 
- 默认的ResultSet是不能更新的，游标也只能往下移。也就是说你只能从第一行到最后一行遍历一遍。不过也可以创建可以回滚或者可更新的ResultSet
- 当生成ResultSet的Statement对象要关闭或者重新执行或是获取下一个ResultSet的时候，ResultSet对象也会自动关闭。 
- 可以通过ResultSet的getter方法，传入列名或者从1开始的序号来获取列数据。 

> 有哪些不同的ResultSet？

根据创建Statement时输入参数的不同，会对应不同类型的ResultSet。如果你看下Connection的方法，你会发现createStatement和prepareStatement方法重载了，以支持不同的ResultSet和并发类型。
一共有三种ResultSet对象。

- ResultSet.TYPEFORWARDONLY：这是默认的类型，它的游标只能往下移。
- ResultSet.TYPESCROLLINSENSITIVE：游标可以上下移动，一旦它创建后，数据库里的数据再发生修改，对它来说是透明的。 
- ResultSet.TYPESCROLLSENSITIVE：游标可以上下移动，如果生成后数据库还发生了修改操作，它是能够感知到的。
- 
ResultSet有两种并发类型。
- ResultSet.CONCURREADONLY:ResultSet是只读的，这是默认类型。
- ResultSet.CONCUR_UPDATABLE:我们可以使用ResultSet的更新方法来更新里面的数据。


>JDBC的DataSource是什么，有什么好处

DataSource即数据源，它是定义在javax.sql中的一个接口，跟DriverManager相比，它的功能要更强大。我们可以用它来创建数据库连接，当然驱动的实现类会实际去完成这个工作。除了能创建连接外，它还提供了如下的特性：


 - 	缓存PreparedStatement以便更快的执行 
 - 	可以设置连接超时时间 •	提供日志记录的功能
 - ResultSet大小的最大阈值设置 
 - 	通过JNDI的支持，可以为servlet容器提供连接池的功能

>常见的JDBC异常有哪些？

- java.sql.SQLException——这是JDBC异常的基类。
- 	java.sql.BatchUpdateException——当批处理操作执行失败的时候可能会抛出这个异常。这取决于具体的JDBC驱动的实现，它也可能直接抛出基类异常java.sql.SQLException
- java.sql.SQLWarning——SQL操作出现的警告信息。
- 	java.sql.DataTruncation——字段值由于某些非正常原因被截断了（不是因为超过对应字段类型的长度限制）

