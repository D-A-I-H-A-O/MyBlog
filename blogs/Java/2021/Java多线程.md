---
title: Java多线程
date: 2021-06-02
categories:
 - Java
tags:
 - 多线程
---

﻿# 概念

* 程序：是为完成特定任务，用某种语言编写的一组指令的集合。即指一段静态的代码，静态对象。
* 进程:进程是一个具有一定独立功能的程序关于某个数据集合的一次运行活动。它是操作系统动态执行的基本单元，在传统的操作系统中，进程既是基本的分配单元，也是基本的执行单元。
> (一个程序，QQ.exe Music.exe 程序的集合)

* 线程:通常在一个进程中可以包含若干个线程，当然一个进程中至少有一个线程，不然没有存在的意义。线程可以利用进程所拥有的资源，在引入线程的操作系统中，通常都是把进程作为分配资源的基本单位，而把线程作为独立运行和独立调度的基本单位，由于线程比进程更小，基本上不拥有系统资源，故对它的调度所付出的开销就会小得多，能更高效的提高系统多个程序间并发执行的程度。
>  (开了一个进程 Typora，写字，自动保存（线程负责的))

# 多线程创建和启动
**`Thread`类**

1、`Java`语言的`JVM`允许程序运行多个线程，他通过`java.lang.Thread`类来实现

2、每个线程都是通过某个特定`Thread`对象的`run()`方法来完成操作的，经常把`run()`方法的主体称为线程体

3、通过该`Thread`对象的start()方法来调用这个线程

4、构造器
* Thread():创建新的Thread对象
* Thread(Runnable target):指定创建线程的目标对象，他实现了Runnable接口中的run方法
* Thread(Runnable target,String name):创建新的Thread对象，指定名字


**线程创建的方式**

* 继承thread类


```java
public class ThreadDemo {
    public static void main(String[] args)  {
        new ThreadB().start();
        new ThreadB().start();
        new ThreadB().start();
    }
}

class ThreadB extends Thread {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + "------------------");
    }
}
```

* 实现runnable接口

```java
public class ThreadDemo {
    public static void main(String[] args) throws ,  {
        new Thread(new ThreadA()).start();
        new Thread(new ThreadA()).start();
        new Thread(new ThreadA()).start();
    }
}

class ThreadA implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + "------------------");
    }
}
```

* 实现callable接口
```java
public class ThreadDemo {
    public static void main(String[] args) throws   {
    
        FutureTask<Integer> f1 = new FutureTask<>(new ThreadC());
        FutureTask<Integer> f2 = new FutureTask<>(new ThreadC());
        FutureTask<Integer> f3 = new FutureTask<>(new ThreadC());

        new Thread(f1, "A").start();
        //System.out.println(f1.get());

        new Thread(f2, "B").start();
       //System.out.println(f2.get());

        new Thread(f3, "C").start();

        //System.out.println(f3.get());
    }
}

class ThreadC implements Callable {
    @Override
    public Object call() throws Exception {
        System.out.println(Thread.currentThread().getName() + "------------------");
        return Thread.currentThread().getName() ;
    }
}
```

* java的线程池获得

```java
public class Demo01 {
    public static void main(String[] args) {
        // 自定义线程池！工作 ThreadPoolExecutor

        // 最大线程到底该如何定义
        // 1、CPU 密集型，几核，就是几，可以保持CPu的效率最高！
        // 2、IO  密集型   > 判断你程序中十分耗IO的线程，
        // 程序   15个大型任务  io十分占用资源！

        // 获取CPU的核数
     System.out.println(Runtime.getRuntime().availableProcessors());

        List  list = new ArrayList();
        ExecutorService threadPool = new ThreadPoolExecutor(
                2,
                Runtime.getRuntime().availableProcessors(),
                3,
                TimeUnit.SECONDS,
                new LinkedBlockingDeque<>(3),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.DiscardOldestPolicy());  //队列满了，尝试去和最早的竞争，也不会抛出异常！
        try {
            // 最大承载：Deque + max
            // 超过 RejectedExecutionException
            for (int i = 1; i <= 9; i++) {
                // 使用了线程池之后，使用线程池来创建线程
                threadPool.execute(()->{
                    System.out.println(Thread.currentThread().getName()+" ok");
                });
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 线程池用完，程序结束，关闭线程池
            threadPool.shutdown();
        }
    }
}
```
[这就是标题——JUC](https://blog.csdn.net/D_A_I_H_A_O/article/details/106156075)
