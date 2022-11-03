---
title: JdbcTemplate操作SQLServer存储过程
date: 2021-01-29
categories:
 - Java
tags:
 - JdbcTemplate
 - SQLServer
---

﻿存储过程操作模板类

```java
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.JdbcTemplate;

import java.lang.reflect.Field;
import java.sql.*;
import java.util.*;

public class ProcTemplate {
    private JdbcTemplate jdbcTemplate;

    public ProcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * 执行存储过程
     * @param procName 存储过程名称
     * @param outArgInfo 输出参数及参数类型
     * @param inArgInfoArr 输入参数及参数值
     * @return 结果集封装为 List 返回
     */
    public List exec(String procName, Map<String, Object> outArgInfo, Object... inArgInfoArr) {
        // 校验入参个数必须为偶数
        if (!isEven(inArgInfoArr.length)) {
            throw new RuntimeException("一个入参必须对应一个值");
        }
        if (outArgInfo != null) {
            // 校验输出参数类型必须为 SQLType
            Collection<Object> values = outArgInfo.values();
            values.forEach(p -> {
                if (!(p instanceof Integer) || !(isInclude(Integer.parseInt(p.toString())))) {
                    throw new RuntimeException("类型代码必须在【java.sql.Types】类中已定义");
                }
            });
        }
        // 入参信息整理
        Map<String, Object> inArgInfo = new HashMap<>();
        String inArgName = "";
        for (int i = 0; i < inArgInfoArr.length; i++) {
            boolean isArgInfo = isEven(i);
            if (isArgInfo) { // 偶数时为参数信息
                inArgName = inArgInfoArr[i].toString();
            } else {// 奇数时为参数值
                inArgInfo.put(inArgName, inArgInfoArr[i]);
            }
        }
        // 拼接执行存储过程参数占位符
        String procPlaceHolder = genProcPlaceHolder(inArgInfo.size() + (outArgInfo != null ? outArgInfo.size() : 0));
        // 要执行的 SQL
        String execSql = String.format("exec %s %s", procName, procPlaceHolder);

        return jdbcTemplate.execute(execSql,
                new CallableStatementCallback<List<Map<String, Object>>>() {
                    @Override
                    public List<Map<String, Object>> doInCallableStatement(
                            CallableStatement cs) throws SQLException,
                            DataAccessException {
                        // 设置入参参数值
                        for (String inArgName : inArgInfo.keySet()) {
                            cs.setObject(inArgName, inArgInfo.get(inArgName));
                        }
                        if (outArgInfo != null) {
                            // 注册输出参数
                            for (String outArgName : outArgInfo.keySet()) {
                                cs.registerOutParameter(outArgName, (Integer) outArgInfo.get(outArgName));
                            }
                        }
                        // 执行存储过程，获得结果集
                        ResultSet rs = cs.executeQuery();
                        List list = convertResultSetToList(rs);
                        if (outArgInfo != null) {
                            // 获取输出参数值
                            for (String outArgName : outArgInfo.keySet()) {
                                outArgInfo.replace(outArgName, cs.getObject(outArgName));
                            }
                        }
                        return list;
                    }
                });
    }

    public List convertResultSetToList(ResultSet rs) throws SQLException {
        // 封装到 List
        List<Map<String, Object>> resultList = new ArrayList<>();
        ResultSetMetaData metaData = rs.getMetaData();
        int columnCount = metaData.getColumnCount();
        while (rs.next()) {// 转换每行的返回值到Map中
            Map rowMap = new HashMap();
            for (int i = 1; i <= columnCount; i++) {
                String columnName = metaData.getColumnName(i);
                rowMap.put(columnName, rs.getString(columnName));
            }
            resultList.add(rowMap);
        }
        rs.close();
        return resultList;
    }


    /**
     * 判断一个数是不是偶数
     *
     * @param num 需要判断的数字
     * @return 如果是返回 true，否则为 false
     */
    private boolean isEven(int num) {
        return num % 2 == 0;
    }

    /**
     * 按指定个数生成存储过程占位符
     *
     * @param argCount 参数个数
     * @return 占位符字符串，如 ?,?,?,...
     */
    private String genProcPlaceHolder(int argCount) {
        List<String> placeHolderList = new ArrayList<>();
        for (int i = 0; i < argCount; i++) {
            placeHolderList.add("?");
        }
        return String.join(",", placeHolderList);
    }

    /**
     * 检查传入类型代码是否合法
     *
     * @param key 类型代码
     * @return 如果合法则返回 true，否则返回 false
     * @throws IllegalAccessException
     */
    private static boolean isInclude(int key) {
        List<Integer> typeCodeList = new ArrayList<Integer>();
        Field[] declaredFields = Types.class.getDeclaredFields();
        for (Field declaredField : declaredFields) {
            try {
                typeCodeList.add(declaredField.getInt(Types.class));
            } catch (IllegalAccessException e) {
                throw new RuntimeException("类型检查失败");
            }
        }
        return typeCodeList.contains(key);
    }
}

```
**使用**

```SQL
--创建名为GetTest_DS的有输入参数和结果集的存储过程
create procedure GetTest_DS
    @start_time bigint,
    @end_time bigint
as
begin
    select *
    from dbo.test
    where create_time between @start_time and @end_time
end
go
```
没有输出参数outArgInfo，则可直接传 null
```java
List list = procTemplate.exec("GetTest_DS", null, "end_time",1607507853502l,"start_time", 1607507853502l);
// 输出参数值直接从 outArgInfo 中拿到
System.out.println(outArgInfo.get("remark"));
```

```SQL
--创建名为GetTest_DS的有输入参数,输出参数和结果集的存储过程
create procedure GetTest_DS
	@id varchar(50) output ,
    @start_time bigint,
    @end_time bigint
as
begin
    select *
    from dbo.test
    where create_time between @start_time and @end_time
end
go
```
有输出参数outArgInfo，则需要添加输出参数信息
```java
// 定义一个存放输出参数信息的 Map ，泛型必须为 Map<String, Object>，如果没有输出参数则可直接传 null
Map<String, Object> outArgInfo = new HashMap<>();
// 向输出参数 Map 中添加输出参数信息，key 是存储过程对应输出参数名称，值是 java.sql.Types 中的成员变量
outArgInfo.put("id", Types.VARCHAR);
// 执行存储过程，返回值为将结果集包装的 List，输出参数值直接返回到 outArgInfo
// param1：存储过程名称
// param2：输出参数 Map 对象
//param3-n：输入参数与其值，如 "id",1,"name","zhang",...
List list = procTemplate.exec("GetTest_DS", outArgInfo, "end_time", 1607507853502l, "start_time", 1607507853502l);
// 输出参数值直接从 outArgInfo 中拿到
System.out.println(outArgInfo.get("remark"));
```
