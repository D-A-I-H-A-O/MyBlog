---
title: Java集合中对象的复制-浅拷贝、深拷贝
date: 2021-01-22
categories:
 - Java
tags:
 - 集合
 - 浅拷贝、深拷贝
---

**浅拷贝**: 对于仅仅是复制了引用（地址），换句话说，复制了之后，原来的变量和新的变量指向同一个东西，彼此之间的操作会互相影响，为`浅拷贝`。

**深拷贝**：而如果是在堆中重新分配内存，拥有不同的地址，但是值是一样的，复制后的对象与原来的对象是完全隔离，互不影响，为`深拷贝`。

深浅拷贝的主要区别就是：复制的是引用(地址)还是复制的是实例。

测试Bean
```java
class Person implements Serializable {
    private int age;
    private String name;

    public Person() {
    }

    public Person(int age, String name) {
        this.age = age;
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String toString() {
        return this.name + "-->" + this.age;
    }
}
```

# 浅拷贝

## 循环复制
```java
@Test
 public void test() {
     List<Person> list = new ArrayList<>();
     list.add(new Person(18, "zhangsan"));

     //循环复制
     List<Person> newList=new ArrayList<>(list.size());
     for(Person p : list){
         newList.add(p);
     }

     System.out.println(list);//[zhangsan-->18]
     System.out.println(newList);//[zhangsan-->18]

     System.out.println("---改变newList中Person的age，list中Person的age也被改变---");
     newList.get(0).setAge(20);

     System.out.println(list);//[zhangsan-->20]
     System.out.println(newList);//[zhangsan-->20]
 }
```

## List实现类的构造方法
```java
@Test
public void test() {
    List<Person> list = new ArrayList<>();
    list.add(new Person(18, "zhangsan"));

    //使用List实现类的构造方法
    List<Person> newList=new ArrayList<>(list);

    System.out.println(list);//[zhangsan-->18]
    System.out.println(newList);//[zhangsan-->18]

    System.out.println("---改变newList中Person的age，list中Person的age也被改变---");
    newList.get(0).setAge(20);

    System.out.println(list);//[zhangsan-->20]
    System.out.println(newList);//[zhangsan-->20]
}
```

## addAll()方法
```java
@Test
public void test() {
    List<Person> list = new ArrayList<>();
    list.add(new Person(18, "zhangsan"));

    //使用addAll()方法
    List<Person> newList=new ArrayList<>();
    newList.addAll(list);

    System.out.println(list);//[zhangsan-->18]
    System.out.println(newList);//[zhangsan-->18]

    System.out.println("---改变newList中Person的age，list中Person的age也被改变---");
    newList.get(0).setAge(20);

    System.out.println(list);//[zhangsan-->20]
    System.out.println(newList);//[zhangsan-->20]
}
```

## System.arraycopy()方法
```java
@Test
public void test() {
    List<Person> list = new ArrayList<>();
    list.add(new Person(18, "zhangsan"));

    //使用System.arraycopy()方法
    Person[] array = list.toArray(new Person[0]);
    Person[] newArray=new Person[array.length];
    System.arraycopy(array, 0, newArray, 0, array.length);
    List<Person> newList = Arrays.asList(newArray);

    System.out.println(list);//[zhangsan-->18]
    System.out.println(newList);//[zhangsan-->18]

    System.out.println("---改变newList中Person的age，list中Person的age也被改变---");
    newList.get(0).setAge(20);

    System.out.println(list);//[zhangsan-->20]
    System.out.println(newList);//[zhangsan-->20]
}
```

## clone()方法
```java
@Test
public void test() {
    List<Person> list = new ArrayList<>();
    list.add(new Person(18, "zhangsan"));

    //使用clone()方法
    Person[] array = list.toArray(new Person[0]);
    Person[] newArray = array.clone();

    List<Person> newList = Arrays.asList(newArray);

    System.out.println(list);//[zhangsan-->18]
    System.out.println(newList);//[zhangsan-->18]

    System.out.println("---改变newList中Person的age，list中Person的age也被改变---");
    newList.get(0).setAge(20);

    System.out.println(list);//[zhangsan-->20]
    System.out.println(newList);//[zhangsan-->20]
}
```

# 深拷贝

## 序列化方法
> 对象需要序列化(实现Serializable)
```java
public <T> List<T> depCopy(List<T> srcList) {
        ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
        try {
            ObjectOutputStream out = new ObjectOutputStream(byteOut);
            out.writeObject(srcList);
            ByteArrayInputStream byteIn = new ByteArrayInputStream(byteOut.toByteArray());
            ObjectInputStream inStream = new ObjectInputStream(byteIn);
            List<T> destList = (List<T>) inStream.readObject();
            return destList;
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }
```
```java
@Test
public void test() {
    List<Person> list = new ArrayList<>();
    list.add(new Person(18, "zhangsan"));

    //使用序列化方法
    List<Person> newList = depCopy(list);

    System.out.println(list);//[zhangsan-->18]
    System.out.println(newList);//[zhangsan-->18]

    System.out.println("---改变newList中Person的age，list中Person的age不被改变---");
    newList.get(0).setAge(20);

    System.out.println(list);//[zhangsan-->18]
    System.out.println(newList);//[zhangsan-->20]
}
```

## 实现cloneable接口和重写clone方法
> 有限制性，要先声明List是保存的什么对象，并且当碰到对象里面还持有List集合的时候,则不管用

```java
class Person implements Cloneable, Serializable {
    private int age;
    private String name;

    public Person() {
    }

    public Person(int age, String name) {
        this.age = age;
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String toString() {
        return this.name + "-->" + this.age;
    }

    @Override
    public Object clone() {
        Person o = null;
        try {
            o = (Person) super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return o;
    }
}
```

```java
@Test
public void test() {
   List<Person> list = new ArrayList<>();
   list.add(new Person(18, "zhangsan"));

   //重写clone方法
   List<Person> newList = new ArrayList<>();
   for (int i = 0; i < list.size(); i++) {
       Person clone = (Person) list.get(i).clone();
       newList.add(clone);
   }

   System.out.println(list);//[zhangsan-->18]
   System.out.println(newList);//[zhangsan-->18]

   System.out.println("---改变newList中Person的age，list中Person的age不被改变---");
   newList.get(0).setAge(20);

   System.out.println(list);//[zhangsan-->18]
   System.out.println(newList);//[zhangsan-->20]
}
```
## 基础类型没有深浅拷贝

```java
@Test
public void test() {
    List<String> list = new ArrayList<>();
    list.add("A");
    list.add("B");
    list.add("C");

    List<String> newList = new ArrayList<>(list.size());
    newList.addAll(list);

    System.out.println(list);
    System.out.println(newList);

    System.out.println("---基础类型没有深浅拷贝---");
    newList.set(0, "AA");

    System.out.println(list);
    System.out.println(newList);
}
```

[Java提高篇——对象克隆（复制)](https://www.cnblogs.com/Qian123/p/5710533.html)

