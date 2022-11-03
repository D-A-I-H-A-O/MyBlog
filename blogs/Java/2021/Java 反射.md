---
title: Java反射
date: 2021-06-02
categories:
 - Java
tags:
 - 反射
---

﻿# 概念

Java的反射（`reflection`）机制是指在程序的运行状态中，可以构造任意一个类的对象，可以了解任意一个对象所属的类，可以了解任意一个类的成员变量和方法，可以调用任意一个对象的属性和方法。这种动态获取程序信息以及动态调用对象的功能称为`Java`语言的反射机制。

# 功能
* 在运行时判断任意一个对象所属的类。

* 在运行时构造任意一个类的对象。

* 在运行时判断任意一个类所具有的成员变量和方法。

* 在运行时调用任意一个对象的方法。

* 生成动态代理。

# Class
`Class`类的类表示正在运行的`Java`应用程序中的类和接口。 枚举是一种类，一个注释是一种界面。 每个数组也属于一个反映为类对象的类，该对象由具有相同元素类型和维数的所有数组共享。 原始`Java`类型`（ boolean ， byte ， char ， short ， int ， long ， float和double ）`，和关键字`void`也表示为类对象。

类没有公共构造函数。 相反， 类对象由`Java`虚拟机自动构建，因为加载了类，并且通过调用类加载器中的`defineClass`方法。

 1. `Class`本身也是一个类
 2. `Class` 对象只能由系统建立对象
 3. 一个类在 `JVM` 中只会有一个`Class`实例
 4. 一个`Class`对象对应的是一个加载到`JVM`中的一个`.class`文件
 5. 每个类的实例都会记得自己是由哪个 `Class` 实例所生成
 6.  通过`Class`可以完整地得到一个类中的完整结构 (属性、方法、构造器、父类、父接口)


**Class获取方式**
```java
public class ReflectionDemo {


    public static void main(String[] args) {
        //1. 通过对象去获得Class实例
        Person p = new Person();
        Class c = p.getClass();
        System.out.println(c);

        //2. 通过类名去获得
        Class c1 = Person.class;
        System.out.println(c1);

        //3. 通过全类名去获得
        String str = "my.Person";
        try {
            Class c2 = Class.forName(str);
            System.out.println(c2);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        //4. 根据classLoader 和全类名 获得Class对象
        ClassLoader classLoader = p.getClass().getClassLoader();
        try {
            Class<?> loadClass = classLoader.loadClass("my.Person");
            System.out.println(loadClass);
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        //5. 基本数据类型的Class对象
        Class c5 = int.class;
        System.out.println(c5);
    }

}

class Person {
    private String name;
    private int age;
}
```
**Class实例获取类的完整信息**
>属性 	

`java.lang.Class`
* getField(String name);根据属性名去获得属性值(a.共有的b.继承下来的也可以)
* getFields();  获取所有共有的属性(a.继承下来的也可以)
* getDeclaredField(String name)根据属性名去获得属性值(a.本类的b.和访问修饰符无关)
* getDeclaredFields(); 获得本类所有属性(a.本类的b.和访问修饰符无关 )

`java.lang.reflect.Field`
* getModifiers();获得修饰符的int表现形式  通过( String Modifier.toString(int))转化
* getType()  获得属性类型   返回值是Class对象
* getName()  获得属性名

>方法

`java.lang.Class`

* getMethod(String name,Class...parameterType);根据方法名和参数类型或方法(a.共有的b.继承下来的也可以)
* getMethods();获取所有的方法(a.继承下来的也可以)
* getDeclaredMethod(String name,Class...parameterType)根据方法名和参数类型获得本类中的方法
* getDeclaredMethods();获得本类中所有的方法
	

`java.lang.reflect.Method`
* getModifiers();//获得修饰符的int表现形式  通过( String Modifier.toString(int))转化
* getReturnType();获得返回值类型    Class对象
* getName()  获得方法名
* getParameterTypes()  获得方法的所有参数类型

> 构造器

`java.lang.Class`

* getConstructor(Class...paramterTypes);根据参数列表获得本类共有的构造器
* getConstructors()  获得本类中所有共有构造器
* getDeclaredConstructor(Class...paramterTypes);根据参数列表获得本类任意构造器
* getDeclaredConstructors(); 获取本类中所有构造器

`java.lang.reflect.Constructor`
	 		
* getModifiers();//获得修饰符的int表现形式  通过( String Modifier.toString(int))转化
* getName()  获得方法名
* getParameterTypes()  获得方法的所有参数类型
> 父类

* getSuperclass();  返回的是父类的Class对象 
> 父接口

* getInterfaces();  返回当前类的所有父接口

```java
public class ReflectionDemo {
    public static void main(String[] args) throws Exception {


        Class c = Class.forName("my.Person");


        Constructor constructor = c.getDeclaredConstructor(String.class, int.class);

        System.out.println(constructor);

        constructor.setAccessible(true);

        Person p = (Person) constructor.newInstance("A", 2);

        System.out.println(p);

        Method say = c.getMethod("say1");
        say.invoke(p);

        Method say2 = c.getDeclaredMethod("say2");
        say2.invoke(p);

    }

}

class Person {
    private String name;
    private int age;

    public Person() {
    }

    private Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void say1() {
        System.out.println("name=" + name + ",age=" + age);
    }
     void say2() {
        System.out.println("name=" + name + ",age=" + age);
    }
}
```
[学习java应该如何理解反射？](https://www.zhihu.com/question/24304289)
