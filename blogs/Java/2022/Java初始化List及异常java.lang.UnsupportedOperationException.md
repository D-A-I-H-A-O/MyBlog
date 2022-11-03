---
title: Java初始化List及异常java.lang.UnsupportedOperationException
date: 2022-11-01
categories:
 - Java
---

```java
		//1.使用Arrays.asList()方法：,class java.util.Arrays$ArrayList
        //2.使用Collections.addAll()方法：,class java.util.Collections$EmptyList
        //3.使用Collections.unmodifiableList()方法：,class java.util.Collections$UnmodifiableRandomAccessList
        //4.使用Collections.singletonList()方法：,class java.util.Collections$SingletonList
        //5.使用双括号方法：,[1, 2, 3, 4]
        //6.使用Collectors.toList()方法：,[1, 2, 3, 4]
        //7.使用Collectors.toCollection()方法：,[1, 2, 3, 4]
        //8.使用List.of()方法：,class java.util.ImmutableCollections$ListN
        try {
            List<String> list = Arrays.asList("1", "2", "3");
            //list = new ArrayList<>(Arrays.asList("1", "2", "3"));
            list.add("4");
            System.out.println("1.使用Arrays.asList()方法：" + "," + list);
        } catch (Exception e) {
            System.out.println("1.使用Arrays.asList()方法：" + "," + Arrays.asList("1", "2", "3").getClass());
            e.printStackTrace();
        }
        try {
            List<String> list = Collections.EMPTY_LIST;
            Collections.addAll(list, "1", "2", "3");
            //Collections.addAll(list = new ArrayList<String>(), "1", "2", "3");
            list.add("4");
            System.out.println("2.使用Collections.addAll()方法：" + "," + list);
        } catch (Exception e) {
            System.out.println("2.使用Collections.addAll()方法：" + "," + Collections.EMPTY_LIST.getClass());
            e.printStackTrace();
        }
        try {
            List<String> list = Collections.unmodifiableList(Arrays.asList("1", "2", "3"));
            //list = new ArrayList<>(list);
            list.add("4");
            System.out.println("3.使用Collections.unmodifiableList()方法：" + "," + list);
        } catch (Exception e) {
            System.out.println("3.使用Collections.unmodifiableList()方法：" + "," + Collections.unmodifiableList(Arrays.asList("1", "2", "3")).getClass());
            e.printStackTrace();
        }
        try {
            List<String> list = Collections.singletonList("1");
            //list = new ArrayList<>(list);
            list.add("2");
            System.out.println("4.使用Collections.singletonList()方法：" + "," + list);
        } catch (Exception e) {
            System.out.println("4.使用Collections.singletonList()方法：" + "," + Collections.singletonList("1").getClass());
            e.printStackTrace();
        }
        List<String> list = new ArrayList<String>() {{
            add("1");
            add("2");
            add("3");
        }};
        list.add("4");
        System.out.println("5.使用{{方法：" + "," + list);
        
        list = Stream.of("1", "2", "3").collect(Collectors.toList());
        list.add("4");
        System.out.println("6.使用Collectors.toList()方法：" + "," + list);
        
        list = Stream.of("1", "2", "3").collect(Collectors.toCollection(ArrayList::new));
        list.add("4");
        System.out.println("7.使用Collectors.toCollection()方法：" + "," + list);
        
        try {
            list = List.of("1", "2", "3");
            list.add("4");
            System.out.println("8.使用List.of()方法：" + "," + list);
        } catch (Exception e) {
            System.out.println("8.使用List.of()方法：" + "," + List.of("1", "2", "3").getClass());
            e.printStackTrace();
        }
```

在某些初始化`List`后对其进行添加，修改等操作时会抛出异常，这是因为生成的`List`类型默认不支持请求的操作。

```bash
java.lang.UnsupportedOperationException
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/c609b0c2205141ef91a5189947db1ea8.png)

初始化`List`需注意`List`是否支持修改操作，可以转为可修改类型再操作。
