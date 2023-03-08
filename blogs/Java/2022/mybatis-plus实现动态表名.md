---
title: mybatis-plus实现动态表名
date: 2022-03-07
categories:
 - Java
tags:
 - Mybatis
---

**MyBatis-Plus版本**

1、添加`MyBatis-Plus`依赖
```xml
<dependency>
	<groupId>com.baomidou</groupId>
	<artifactId>mybatis-plus-boot-starter</artifactId>
	<version>3.5.1</version>
</dependency>
```

**MyBatis-Plus配置**

2、添加`MyBatis-Plus`配置，利用拦截器获取到表名给替换
```java
@Configuration
public class MybatisPlusConfig {
    static List<String> tableList(){
        List<String> tables = new ArrayList<>();
        //表名
        tables.add("TestUser");
        return tables;
    }

	//拦截器，获取到表名给替换
    @Bean
    public MybatisPlusInterceptor dynamicTableNameInnerInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        DynamicTableNameInnerInterceptor dynamicTableNameInnerInterceptor = new DynamicTableNameInnerInterceptor();
        dynamicTableNameInnerInterceptor.setTableNameHandler((sql, tableName) -> {
            String newTable = null;
            for (String table : tableList()) {
                newTable = RequestDataHelper.getRequestData(table);
                if (table.equals(tableName) && newTable!=null){
                    tableName = newTable;
                    break;
                }
            }
            return tableName;
        });
        interceptor.addInnerInterceptor(dynamicTableNameInnerInterceptor);
        return interceptor;
    }
}
```

**请求参数传递辅助类**

3、创建请求参数传递辅助类

```java
public class RequestDataHelper {
    /**
     * 请求参数存取
     */
    private static final ThreadLocal<Map<String, Object>> REQUEST_DATA = new ThreadLocal<>();

    /**
     * 设置请求参数
     *
     * @param requestData 请求参数 MAP 对象
     */
    public static void setRequestData(Map<String, Object> requestData) {
        REQUEST_DATA.set(requestData);
    }

    /**
     * 获取请求参数
     *
     * @param param 请求参数
     * @return 请求参数 MAP 对象
     */
    public static <T> T getRequestData(String param) {
        Map<String, Object> dataMap = getRequestData();
        if (CollectionUtils.isNotEmpty(dataMap)) {
            return (T) dataMap.get(param);
        }
        return null;
    }

    /**
     * 获取请求参数
     *
     * @return 请求参数 MAP 对象
     */
    public static Map<String, Object> getRequestData() {
        return REQUEST_DATA.get();
    }
}
```
**使用**

4、在程序中使用，注意如果实际表名与实体类与不同，可先在实体类类注明表名`@TableName("TestUser")`
```java
@Test
public void test1() {
    RequestDataHelper.setRequestData(new HashMap<String, Object>() {{
        put("TestUser", "TestUser_" + "2022_05");
    }});

	//表名会被动态替换成"TestUser_2022_05"
	//如果实际表名与实体类与不同，可先在实体类类注明表名@TableName("TestUser")
    List<UserEntity> users= userDao.selectList(null);

    System.out.println(users);

}
```

