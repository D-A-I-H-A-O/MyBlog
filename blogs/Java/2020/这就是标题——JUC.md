---
title: 这就是标题——JUC
date: 2020-12-25
categories:
 - Java
tags:
 - JUC
---


# 这就是标题——JUC

## JUC是什么

java.util.concurrent  并发编程工具包、包、分类
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020051611003263.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

## 线程

### 进程 / 线程
**进程**:进程是一个具有一定独立功能的程序关于某个数据集合的一次运行活动。它是操作系统动态执行的基本单元，在传统的操作系统中，进程既是基本的分配单元，也是基本的执行单元。
(一个程序，QQ.exe Music.exe 程序的集合)

**线程**:通常在一个进程中可以包含若干个线程，当然一个进程中至少有一个线程，不然没有存在的意义。线程可以利用进程所拥有的资源，在引入线程的操作系统中，通常都是把进程作为分配资源的基本单位，而把线程作为独立运行和独立调度的基本单位，由于线程比进程更小，基本上不拥有系统资源，故对它的调度所付出的开销就会小得多，能更高效的提高系统多个程序间并发执行的程度。
(开了一个进程 Typora，写字，自动保存（线程负责的))

> 扩展:Java默认有2个线程——mian、GC

### 线程状态
```java
Thread.State

public enum State {
	//新生
	NEW,
	//运行
	RUNNABLE,
	//阻塞
	BLOCKED,
	//等待，死死地等
	WAITING,
	//超时等待
	TIMED_WAITING,
	//终止
	TERMINATED;
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517154419219.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200519093654746.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
上图为[武哥聊编程](https://blog.csdn.net/eson_15/article/details/105637498?utm_medium=distribute.pc_feed.none-task-blog-alirecmd-3.nonecase&depth_1-utm_source=distribute.pc_feed.none-task-blog-alirecmd-3.nonecase&request_id=)
[线程状态](https://www.zhihu.com/question/27654579)
### wait / sleep
功能都是当前线程暂停，有什么区别？
**1、来自不同的类**
	wait => Object
	sleep => Thread
	
**2、关于锁的释放**
wait 会释放锁，sleep 睡觉了，抱着锁睡觉，不会释放！

**3、使用的范围是不同的**
<font color="red">wait必须在同步代码块中</font>
sleep 可以在任何地方睡

**4、是否需要捕获异常**
wait 不需要捕获异常
sleep 必须要捕获异常

### 并发 / 并行
**并发**（多线程操作同一个资源）
CPU 一核 ，模拟出来多条线程

**并行**（多个人一起行走）
CPU 多核 ，多个线程可以同时执行； 线程池

并发编程的本质：充分利用CPU的资源

## Lock
经典售票例子
```java
/**
 * @description:售票
 * @author: DAIHAO
 * @time: 2020/5/16 10:42
 */
public class SaleTicketBySynchronized {

	public static void main(String[] args) {
		Ticket ticket = new Ticket();

		new Thread(() -> {
			for (int i = 1; i < 40; i++) {
				ticket.sale();
			}
		}, "A").start();
		new Thread(() -> {
			for (int i = 1; i < 40; i++) {
				ticket.sale();
			}
		}, "B").start();
		new Thread(() -> {
			for (int i = 1; i < 40; i++) {
				ticket.sale();
			}
		}, "C").start();
	}
}

// 资源类 OOP
class Ticket {

	// 票号
	private int number = 30;

	/**
	 * 卖票的方式
	 */
	//synchronized 本质: 队列，锁
	public synchronized void sale() {
		if (number > 0) {
			System.out.println(Thread.currentThread().getName() + "卖出了" + (number--) + "票,剩余：" + number);
		}
	}
}
```
上面例子中最直接是给售票方法加上synchronized，同步方法，并发问题解决。

### 使用Lock锁
三步：
1、new ReentrantLock(); 
2、加锁 
3、解锁
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516112555378.png)
```java
public class SaleTicketByLock {

	public static void main(String[] args) {
		Ticket2 ticket = new Ticket2();

		new Thread(() -> {
			for (int i = 1; i < 40; i++) {
				ticket.sale();
			}
		}, "A").start();
		new Thread(() -> {
			for (int i = 1; i < 40; i++) {
				ticket.sale();
			}
		}, "B").start();
		new Thread(() -> {
			for (int i = 1; i < 40; i++) {
				ticket.sale();
			}
		}, "C").start();
	}
}

// 资源类 OOP
class Ticket2 {

	// 票号
	private int number = 30;

	//1、new ReentrantLock();
	Lock lock = new ReentrantLock();

	/**
	 * 卖票的方式
	 */
	public void sale() {
		//2、加锁
		lock.lock();
		try {
			//业务代码
			if (number > 0) {
				System.out.println(Thread.currentThread().getName() + "卖出了" + (number--) + "票,剩余：" + number);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			//3、解锁
			lock.unlock();
		}
	}
}
```
### 可重入锁
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516112612930.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
**可重入锁**指的是可重复可递归调用的锁，在外层使用锁之后，在内层仍然可以使用，并且不发生死锁（前提得是同一个对象或者class），这样的锁就叫做可重入锁。ReentrantLock和synchronized都是可重入锁

示例：可以测试无死锁情况
```java
public class SynchronizedDemo {

	public static void main(String[] args) {

		Person person = new Person();

		new Thread(() -> {
			for (; ; ) {
				person.eat();
			}
		},"A").start();
		new Thread(() -> {
			for (; ; ) {
				person.eat();
			}
		},"B").start();
	}
}

class Person {

	public synchronized void eat() {
		System.out.println(Thread.currentThread().getName());
		hand();
	}

	public synchronized void hand() {
		System.out.println(Thread.currentThread().getName());
	}

}
```
### 公平锁 / 非公平锁
1、公平锁能保证：老的线程排队使用锁，新线程仍然排队使用锁。
2、非公平锁保证：老的线程排队使用锁；但是无法保证新线程抢占已经在排队的线程的锁。
<font color="red">ReentrantLock默认非公平锁</font>
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516112633302.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

### Synchronized / Lock
1、Synchronized 内置的Java关键字， Lock 是一个Java类
2、Synchronized 无法判断获取锁的状态，Lock 可以判断是否获取到了锁
3、Synchronized 会自动释放锁，lock 必须要手动释放锁！如果不释放锁，死锁
4、Synchronized 线程 1（获得锁，阻塞）、线程2（等待，傻傻的等）；Lock锁就不一定会等待下去；
5、Synchronized 可重入锁，不可以中断的，非公平；Lock ，可重入锁，可以 判断锁，非公平（可以自己设置）；
6、Synchronized 适合锁少量的代码同步问题，Lock 适合锁大量的同步代码！
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200518092922268.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

## 线程通讯
线程通讯的目的：是让线程之间可以相互发送信号.更多是能够让线程去等待其他线程的信号.如线程B等待线程A的信号用于指示数据已经准备就绪等待处理。


**监视器(monitor)**
* Java中每一个对象都可以成为一个监视器（Monitor）, 该Monitor由一个锁（lock）, 一个等待队列（waiting queue ）, 一个入口队列( entry queue)组成.
* 对于一个对象的方法， 如果没有synchonized关键字， 该方法可以被任意数量的线程，在任意时刻调用。
* 对于添加了synchronized关键字的方法，任意时刻只能被唯一的一个获得了对象实例锁的线程调用

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516141616931.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

> **进入区(Entry Set):** 表示线程通过 synchronized要求获得对象锁，如果获取到了，则成为拥有者，如果没有获取到在在进入区等待，直到其他线程释放锁之后再去竞争(谁获取到则根据)
> 
> **拥有者(Owner):** 表示线程获取到了对象锁，可以执行synchronized包围的代码了
> 
> **等待区(Wait Set):** 表示线程调用了wait方法,此时释放了持有的对象锁，等待被唤醒(谁被唤醒取得监视器锁由jvm决定)

1、 线程在竞争锁失败的情况下会放到Entry Set中，图中2表示线程可以获取锁
2、获取到锁的线程可以调用wait方法，让线程阻塞，此时线程被放到了Wait Set中，如图中3所示
3、Wait Set中的线程在时间到或者被notify后可以竞争锁，如图中4所示
4、 Wait Set中的线程在**获取到锁**后才可以继续执行。
5、notify只会将Wait Set中的一个**随机线程**移到Entry Set来竞争锁，notifyAll会将全部线程由Wait Set移到Entry Set，然后参与锁的竞争，竞争成功则继续执行，如果不成功则留在Entry Set等待锁被释放后再次参与竞争。
6、notify和notifyAll的作用可以直观的认为就是将线程从Wait Set挪到Entry Set

**问题**
 生产者消费者问题（生产一个，消费一个）：现在两个线程， 操作初始值为零的一个变量， 实现一个线程对该变量加1，一个线程对该变量减1， 交替，来10轮。 

**多线程套路**
 * 线程操作资源类
 * 判断>>干活>>通知

### wait()、notify()和notifyAll()
**问题示例：**
```java
/**
 * 现在两个线程， 操作初始值为零的一个变量， 实现一个线程对该变量加1，一个线程对该变量减1， 交替，来10轮
 */
public class NotifyWaitDemoOne {
	public static void main(String[] args) {
		ShareDate shareDate = new ShareDate();

		new Thread(() -> {
			for (int i = 0; i < 10; i++) {
				shareDate.increment();
			}
		}, "A").start();
		new Thread(() -> {
			for (int i = 0; i < 10; i++) {
				shareDate.decrement();
			}
		}, "B").start();
	}


	//资源类
	static class ShareDate {
		private int number = 0;


		/**
		 * +1
		 */
		public synchronized void increment() {
			//1、判断 睡眠
			if (number != 0) {
				try {
					this.wait();
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
			//2、干活
			++number;
			System.out.println(Thread.currentThread().getName() + "\t" + number);

			//3、通知
			this.notify();
		}

		/**
		 * -1
		 */
		public synchronized void decrement() {
			//1、判断 睡眠
			if (number == 0) {
				try {
					this.wait();
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
			//2、干活
			--number;
			System.out.println(Thread.currentThread().getName() + "\t" + number);

			//3、通知
			this.notifyAll();
		}

	}
}
```
测试结果循环输出1，0 没有问题。

上面是两个线程打印，现在想加到4个线程使用会怎样呢？
![!\[在这里插入图片描述\](https://img-blog.csdnimg.cn/2020051614304331.png](https://img-blog.csdnimg.cn/20200516143849447.png)
换成4个线程会导致错误，**虚假唤醒**。

### 虚假唤醒
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516144333467.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
[为什么条件锁会产生虚假唤醒现象](https://www.zhihu.com/question/271521213)
**我的理解：**
就是当两个线程通过if进入wait，这时当（其他线程）生产者执行完，唤醒全部线程后，那些在等待的线程，没有进行验证，而是直接走了下去。

**解决办法—将if替换为while**
替换为while后,即使被唤醒,仍然会再检查一遍限制条件,保证逻辑的正确性.

**为什么要用while来避免虚假唤醒？**
1、if判断流水线状态为空时，线程被阻塞，这时if判断就完成了，线程被唤醒后直接执行线程剩余操作
2、while判断流水线状态为空时，线程被阻塞，这时的while循环没有完成，线程被唤醒后会先进行while判断
重点是线程被唤醒并不是线程主动检测到流水线不为空，而是被动被唤醒，所以线程会先去检测流水线是否为空

### Condition
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516151017156.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516150700489.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
Condition用来替代传统的Object的wait()、notify()实现线程间的协作，相比使用Object的wait()、notify()，使用Condition的await()、signal()这种方式实现线程间协作更加安全和高效。因此通常来说比较推荐使用Condition，阻塞队列实际上是使用了Condition来模拟线程间协作。

Condition是个接口，基本的方法就是await()和signal()方法；
Condition依赖于Lock接口，生成一个Condition的基本代码是lock.newCondition() 
 调用Condition的await()和signal()方法，都必须在lock保护之内，就是说必须在lock.lock()和lock.unlock之间才可以使用
* Conditon中的await()对应Object的wait()；
* Condition中的signal()对应Object的notify()；
* Condition中的signalAll()对应Object的notifyAll()。

> Lock替换synchronized方法和语句的使用， Condition取代了对象监视器方法的使用。

**示例**
```java
/**
 * 现在两个线程， 操作初始值为零的一个变量， 实现一个线程对该变量加1，一个线程对该变量减1， 交替，来10轮
 */
public class ConditionDemo {
	public static void main(String[] args) {
		ShareDate2 shareDate = new ShareDate2();

		new Thread(() -> {
			for (int i = 0; i < 10; i++) {
				shareDate.increment();
			}
		}, "A").start();
		new Thread(() -> {
			for (int i = 0; i < 10; i++) {
				shareDate.decrement();
			}
		}, "B").start();
		new Thread(() -> {
			for (int i = 0; i < 10; i++) {
				shareDate.increment();
			}
		}, "C").start();
		new Thread(() -> {
			for (int i = 0; i < 10; i++) {
				shareDate.decrement();
			}
		}, "D").start();
	}


	//资源类
	static class ShareDate2 {
		private int number = 0;

		Lock lock = new ReentrantLock();
		Condition condition = lock.newCondition();

		/**
		 * +1
		 */
		public void increment() {
			lock.lock();
			try {
				//1、判断 睡眠
				while (number != 0) {
					try {
						condition.await();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				//2、干活
				++number;
				System.out.println(Thread.currentThread().getName() + "\t" + number);

				//3、通知
				condition.signalAll();
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				lock.unlock();
			}
		}

		/**
		 * -1
		 */
		public void decrement() {
			lock.lock();
			try {
				//1、判断 睡眠
				while (number == 0) {
					try {
						condition.await();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				//2、干活
				--number;
				System.out.println(Thread.currentThread().getName() + "\t" + number);
				//3、通知
				condition.signalAll();
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				lock.unlock();
			}
		}
	}
}
```
**测试结果**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516155444511.png)
## 定制化通信
发现执行顺序随机。可以使用Condition进行**定制化通信**。
比如实现三个线程循环输出，A完成后B，B完成后为C。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516161233333.png)
**示例**
```java
public class ConditionDemo2 {
	public static void main(String[] args) {
		ShareDate2 shareDate = new ShareDate2();

		new Thread(() -> {
			for (int i = 0; i < 10; i++) {
				shareDate.printA();
			}
		}, "A").start();
		new Thread(() -> {
			for (int i = 0; i < 10; i++) {
				shareDate.printB();
			}
		}, "B").start();
		new Thread(() -> {
			for (int i = 0; i < 10; i++) {
				shareDate.printC();
			}
		}, "C").start();

	}


	//资源类
	static class ShareDate2 {
		private int number = 1;
		private Lock lock = new ReentrantLock();
		private Condition c1 = lock.newCondition();
		private Condition c2 = lock.newCondition();
		private Condition c3 = lock.newCondition();

		public void printA() {
			lock.lock();
			try {
				//1、判断 A睡眠
				while (number != 1) {
					try {
						c1.await();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				//2、干活
				System.out.println(Thread.currentThread().getName() + "\t" + "我是线程A");

				//3、唤醒指定的人B
				number = 2;
				c2.signalAll();
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				lock.unlock();
			}
		}

		public void printB() {
			lock.lock();
			try {
				//1、判断 B睡眠
				while (number != 2) {
					try {
						c2.await();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				//2、干活
				System.out.println(Thread.currentThread().getName() + "\t" + "我是线程B");

				//3、唤醒指定的人C
				number = 3;
				c3.signalAll();
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				lock.unlock();
			}
		}

		public void printC() {
			lock.lock();
			try {
				//1、判断 C睡眠
				while (number != 3) {
					try {
						c2.await();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				}
				//2、干活
				System.out.println(Thread.currentThread().getName() + "\t" + "我是线程C");

				//3、唤醒指定的人C
				number = 1;
				c1.signalAll();
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				lock.unlock();
			}
		}
	}
}
```

## 多线程锁
假设两个线程分别调用发短信和打电话方法：（在不加锁的情况下是随机访问的，现讨论加锁）
 * 标准情况下，两个线程先打印 发短信还是打电话？ 发短信
 * sendSms延迟4秒，两个线程先打印 发短信还是打电话？ 发短信

**这个时候 synchronized 锁的对象是当前实例对象，其它的线程都不能进入到当前对象的其它的synchronized方法**

```java
public class Test1 {
	public static void main(String[] args) throws Exception {
		//实例化一个
		Phone phone = new Phone();

		new Thread(() -> {
			phone.sendSms();
		}, "A").start();


		new Thread(() -> {
			phone.call();
		}, "B").start();
	}
}

class Phone {
	// synchronized 锁的对象是当前实例对象
	// 两个方法用的是同一个锁，谁先拿到谁执行！
	public synchronized void sendSms()  {
		try {
			//睡眠4s看是否打电话先执行
			TimeUnit.SECONDS.sleep(4);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		System.out.println("发短信");
	}

	public synchronized void call() {
		System.out.println("打电话");
	}
}
```
* 将打电话方法改为**普通方法**，此时先打印发短信还是打电话？ 打电话

```java
public class Test2 {
	public static void main(String[] args) throws Exception {
		Phone2 phone2 = new Phone2();

		new Thread(() -> {
			phone2.sendSms();
		}, "A").start();

		TimeUnit.SECONDS.sleep(1);

		new Thread(() -> {
			phone2.call();
		}, "B").start();
	}
}

class Phone2 {
	// synchronized 锁的对象是当前实例对象
	// 两个方法用的是同一个锁，谁先拿到谁执行！
	public synchronized void sendSms() {
		try {
			TimeUnit.SECONDS.sleep(4);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		System.out.println("发短信");
	}

	// 这里没有锁！不是同步方法，不受锁的影响
	public void call() {
		System.out.println("打电话");
	}
}
```
* 两个对象,此时先打印发短信还是打电话？打电话
```java
public class Test3 {
	public static void main(String[] args) throws Exception {

		//两个对象，两个调用者，两把锁
		Phone3 phone1 = new Phone3();
		Phone3 phone2 = new Phone3();

		new Thread(() -> {
			phone1.sendSms();
		}, "A").start();

		TimeUnit.SECONDS.sleep(1);

		new Thread(() -> {
			phone2.call();
		}, "B").start();
	}
}

class Phone3 {
	public synchronized void sendSms() {
		try {
			TimeUnit.SECONDS.sleep(4);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		System.out.println("发短信");
	}
	public synchronized void call() {
		System.out.println("打电话");
	}
}
```
* 静态的同步方法，只有一个对象,此时先打印发短信还是打电话？发短信
```java
public class Test4 {
	public static void main(String[] args) throws Exception {

		Phone4 phone1 = new Phone4();

		new Thread(() -> {
			phone1.sendSms();
		}, "A").start();

		TimeUnit.SECONDS.sleep(1);

		new Thread(() -> {
			phone1.call();
		}, "B").start();
	}
}

class Phone4 {
	public static synchronized void sendSms() {
		try {
			TimeUnit.SECONDS.sleep(4);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		System.out.println("发短信");
	}

	public static synchronized void call() {
		System.out.println("打电话");
	}
}
```
* 静态的同步方法，二个对象,此时先打印发短信还是打电话？发短信

```java
public class Test5 {
	public static void main(String[] args) throws Exception {

		Phone5 phone1 = new Phone5();
		Phone5 phone2 = new Phone5();

		new Thread(() -> {
			phone1.sendSms();
		}, "A").start();

		TimeUnit.SECONDS.sleep(1);

		new Thread(() -> {
			phone2.call();
		}, "B").start();
	}
}

class Phone5 {
	public static synchronized void sendSms() {
		try {
			TimeUnit.SECONDS.sleep(4);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		System.out.println("发短信");
	}

	public static synchronized void call() {
		System.out.println("打电话");
	}
}
```
* 1个静态的同步方法，1个普通的同步方法 ，一个对象，此时先打印发短信还是打电话？打电话
```java
public class Test6 {
	public static void main(String[] args) throws Exception {

		Phone6 phone1 = new Phone6();

		new Thread(() -> {
			phone1.sendSms();
		}, "A").start();

		TimeUnit.SECONDS.sleep(1);

		new Thread(() -> {
			phone1.call();
		}, "B").start();
	}
}

class Phone6 {
	// 静态的同步方法 锁的是 Class 类模板
	public static synchronized void sendSms() {
		try {
			TimeUnit.SECONDS.sleep(4);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		System.out.println("发短信");
	}

	// 普通的同步方法 锁的调用者
	public synchronized void call() {
		System.out.println("打电话");
	}
}
```
* 1个静态的同步方法，1个普通的同步方法 ，两个对象，此时先打印发短信还是打电话？打电话
```java
public class Test7 {
	public static void main(String[] args) throws Exception {
		//两个对象的Class类模板只有一个，static，锁的是Class
		Phone7 phone1 = new Phone7();
		Phone7 phone2 = new Phone7();
		
		new Thread(() -> {
			phone1.sendSms();
		}, "A").start();

		TimeUnit.SECONDS.sleep(1);

		new Thread(() -> {
			phone2.call();
		}, "B").start();
	}
}

class Phone7 {

	// 静态的同步方法 锁的是 Class 对象
	public static synchronized void sendSms() {
		try {
			TimeUnit.SECONDS.sleep(4);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		System.out.println("发短信");
	}

	// 普通的同步方法 锁的当前实例对象
	public synchronized void call() {
		System.out.println("打电话");
	}
}
```
**总结：**
* 普通同步方法，锁是当前实例对象
* 静态同步方法，锁是当前类的class对象
* 同步代码块，锁是Synchonized括号中的对象

## 并发下的集合类
### List
```java
public class ListTest {
	public static void main(String[] args) {
		List<String> list = new ArrayList<>();
		for (int i = 1; i <= 10; i++) {
			new Thread(() -> {
				list.add(UUID.randomUUID().toString().substring(0, 5));
				System.out.println(list);
			}, String.valueOf(i)).start();
			new Thread(() -> {
				list.add(UUID.randomUUID().toString().substring(0, 5));
				System.out.println(list);
			}, String.valueOf(i)).start();
		}
	}
}
```
多执行几次发现
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516173648638.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
点进ArrayList源码add方法,发现是没有Synchonized的所以不安全
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516174613384.png)

* 解决方案一：
  
  ```java
  List<String> list = new Vector<>();
  ```
  
  点进Vector源码，找到add方法，发现加了Synchonized所以线程安全
   ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516175016973.png)
  
* 解决方案二：
  
```java
  List<String> list = Collections.synchronizedList(new ArrayList<>());
```

  [Collections.synchronizedList](https://www.cnblogs.com/yaowen/p/5983136.html)

* 解决方案三：
  
  ```java
  List<String> list = new CopyOnWriteArrayList<>()；
  ```
  
  CopyOnWrite容器即写时复制的容器。往一个容器添加元素的时候，不直接往当前容器Object[]添加，而是先将当前容器Object[]进行Copy，复制出一个新的容器Object[] newElements，然后向新的容器Object[] newElements里添加元素。添加元素后，再将原容器的引用指向新的容器setArray(newElements)。这样做的好处是可以对CopyOnWrite容器进行并发的读，而不需要加锁，因为当前容器不会添加任何元素。所以CopyOnWrite容器也是一种读写分离的思想，读和写不同的容器。
  [JAVA中的COPYONWRITE容器](https://coolshell.cn/articles/11175.html)

### Set

Set也是不安全的集合类
```java
public class SetTest {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        // Set<String> set = Collections.synchronizedSet(new HashSet<>());
        // Set<String> set = new CopyOnWriteArraySet<>();

        for (int i = 1; i <=30 ; i++) {
           new Thread(()->{
               set.add(UUID.randomUUID().toString().substring(0,5));
               System.out.println(set);
           },String.valueOf(i)).start();
        }
    }
}
```
同样，将不安全的集合变成安全集合的方法：

> 使用Collections.synchronizedList( new HashSet<>() )的方式创建集合
> 使用CopyOnWriteArraySet<>()

**HashSet的底层**

默认的空参初始化方法![](https://img-blog.csdnimg.cn/2020051712314536.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

使用HashSet的add方法，依然是调用HashMap的底层put方法
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517123240775.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
**即HashSet的底层就是HashMap**


### Map
Map也是不安全的集合类

> 1、在1.7的时候，HasMap在并发扩容时，会扩容重新hash复制到扩容后的桶，在扩容时使用的是头插法，可能会导致出现循环链表，在get时出现死循环
> 2、在1.8的时候HashMap改成了尾插法，不会出现死循环，但是在并发扩容情况下还是线程不安全的，会出现扩容数据被覆盖，导致数据丢失的错误

[JAVA HASHMAP的死循环](https://coolshell.cn/articles/9606.html)

将不安全的集合变成安全集合的方法：

> 使用Collections.synchronizedMap( new HashMap() )的方式创建集合
> 使用ConcurrentHashMap<>()

建议使用ConcurrentHashMap
>1.7的ConcurrentHashMap采用的是分段锁的机制，就是将数据分成一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据的时候，其他段的数据也能被其他线程访问
>1.8的ConcurrentHashMap变成了和1.8的HashMap一样采用的也是数组+链表+红黑树的结构，去除了分段锁，采用了CAS+synchronized的结构来保证线程安全

## Callable接口
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517124547517.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
这是一个函数式接口，因此可以用作lambda表达式或方法引用的赋值对象。

## 线程创建的方式
>1、继承thread类
>2、实现runnable接口
>3、实现callable接口
>4、java的线程池获得

### callable / runnable


 ```java
 // 创建新类MyThread实现runnable接口
class MyThread implements Runnable{
 @Override
 public void run() {
 
 }
}
 ```
```java
//新类MyThread2实现callable接口
class MyThread2 implements Callable<Integer>{
 @Override
 public Integer call() throws Exception {
  return 200;
 } 
}
```
><font color="red">1、实现callable接口有返回值</font>
>2、实现callable接口需要抛异常
>3、启动方法不一样，一个是run，一个是call

**使用callable** 

无法直接使用，Thread构造器没有callable
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517155113329.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517155001268.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
**利用FutureTask**
```java
  FutureTask<Integer> f = new FutureTask<>(new MyThread2());
  new Thread(f, "AA").start();
```
**获取返回值**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517155857326.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

### FutureTask
<font color="red">**未来的任务，用来异步调用，不影响主线程**</font>

<font color="yellow、" size=5px>
1、在主线程中需要执行比较耗时的操作时，但又不想阻塞主线程时，可以把这些任务交给Future对象在后台完成，当主线程将来需要时，就可以通过Future对象获得后台任务的计算结果或者执行状态。</font>
<br />
<br />
<font color="yellow、" size=5px>
2、一般FutureTask多用于耗时的计算，主线程可以在完成自己的任务后，再去获取结果。  
</font>
<br /><br />

<font color="yellow、" size=5px>
3、仅在计算完成时才能检索结果；如果计算尚未完成，则阻塞 get 方法。一旦计算完成，就不能再重新开始或取消计算。get方法而获取结果只有在计算完成时获取，否则会一直阻塞直到任务转入完成状态， 然后会返回结果或者抛出异常。 
</font><br /><br />

<font color="yellow、" size=5px>
4、只计算一次(有缓存)，get方法放到最后
</font>
<br /><br />

**示例**
```java
public class CallableDemo {
    public static void main(String[] args) throws Exception {
        FutureTask<Integer> futureTask = new FutureTask(() -> {
            System.out.println(Thread.currentThread().getName() + "  come in callable");
            TimeUnit.SECONDS.sleep(4);
            return 1024;
        });
        FutureTask<Integer> futureTask2 = new FutureTask(() -> {
            System.out.println(Thread.currentThread().getName() + "  come in callable");
            TimeUnit.SECONDS.sleep(4);
            return 2048;
        });
        new Thread(futureTask, "DAIHAO1").start();
        new Thread(futureTask2, "DAIHAO2").start();

        //1、一般放在程序后面，直接获取结果
        //2、只会计算结果一次
        System.out.println("futureTask GET:" + futureTask.get());
        System.out.println("futureTask2 GET:" + futureTask2.get());

        //任务是否已经完成，若任务完成，则返回true
        while (!futureTask.isDone()) {
            System.out.println("***wait");
        }
        System.out.println("futureTask GET:" + futureTask.get());
        System.out.println(Thread.currentThread().getName() + " come over");
    }
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517125530694.png)
## JUC常用辅助类
### CountDownLatch (减少计数器)
```java
/**
 * 1、CountDownLatch 减少计数 让一些线程阻塞直到另一些线程完一系列操作以后才会被唤醒
 * 2、两个方法：当一个或多个线程调用await方法时，这些线程会被阻塞
 * 3、其他线程调用countDown方法会将计数器-1（调用coutDown方法的线程不会阻塞）
 * 4、当计数器的值变为o时，因wait方法阻塞的线程会被唤醒，继续执行
 * @author DAIHAO
 * @version 1.0
 */

public class CountDownLatchDemo {

    public static void main(String[] args) throws InterruptedException {

        CountDownLatch countDownLatch = new CountDownLatch(6);

        for (int i = 1; i <= 6; i++) {//执行6次任务

            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "执行了一次任务");
                //减数
                countDownLatch.countDown();
            }, String.valueOf(i)).start();
        }

        //阻塞主线程直到计数为0
        countDownLatch.await();

        System.out.println(Thread.currentThread().getName() + "主线程结束");
    }

}
```

### CyclicBarrier（加法计数器）
```java
/**
 * 1、CyclicBarrier 循环栅栏
 * 2、CyclicBarrier 字面意思是可循环使用的屏障。
 * 3、它做的事情就是让一组线程到达一个屏障（同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会打开，
 * 所有被屏障拦截的线程才会继续干活。
 * 4、线程屏障通过await（）方法
 *
 * @author DAIHAO
 * @version 1.0
 */

public class CyclicBarrierDemo {

    //集齐7颗龙珠就可以召唤神龙
    private static final int NUMBER = 7;

    public static void main(String[] args) {

        CyclicBarrier cyclicBarrier = new CyclicBarrier(NUMBER, () -> {
            System.out.println("集齐7颗龙珠就可以召唤神龙");
        });

        for (int i = 1; i <= 7; i++) {//只有到达所设值得number值才会执行完毕打开屏障，不然则会阻塞

            new Thread(() -> {
                try {
                    System.out.println(Thread.currentThread().getName() + "\t 龙珠正在被收集");
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }, String.valueOf(i)).start();
        }
    }
}
```
### Semaphore（信号量，流量控制）
```java
 * Description：JUC辅助类-信号灯
 * acquire（获取）:当一个线程调用 acquire操作时，他要么通过成功获取信号量（信号量-1），要么一直等下去，直到有线程释放信号量，或超时
 * release（释放）:实际上会将信号量的值+1,然后唤醒等待的线程
 * 信号量主要用于两个目的：一个用于共享资源的互斥使用，二是限流，对并发线程数的控制
 * @author DAIHAO
 * @version 1.0
 */

public class SemaphoreDemo {
    public static void main(String[] args) {
        
        Semaphore semaphore = new Semaphore(3);//模拟3个停车位
        
        for (int i = 1; i <= 6; i++) {//模拟6辆车
            new Thread(() -> {
                try {
                    //信号量-1
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName() + "\t" + "抢到了车位");
                    SECONDS.sleep(new Random().nextInt(5));//随机生成秒数睡眠
                    System.out.println(Thread.currentThread().getName() + "\t" + "离开了车位");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    //信号量的值+1 唤醒等待的线程
                    semaphore.release();
                }
            }, String.valueOf(i)).start();
        }
    }
}
```
### ReentrantReadWriteLock （读写锁）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517174421503.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
<font color="red">ReadWriteLock维护一对关联锁，一个用于只读操作，一个用于写入。只要没有写入程序，读锁可以由多个读线程同时保持。写锁是独占的。</font>

```java
/**
 * 独占锁（写锁） 一次只能被一个线程占有
 * 共享锁（读锁） 多个线程可以同时占有
 * ReadWriteLock
 * 读-读  可以共存！
 * 读-写  不能共存！
 * 写-写  不能共存！
 * @author DAIHAO
 * @version 1.0
 */
public class ReadWriteLockDemo {
    public static void main(String[] args) {
        //MyCacheLock myCache = new MyCacheLock();
        MyCache myCache = new MyCache();

        // 写入
        for (int i = 1; i <= 5; i++) {
            final int temp = i;
            new Thread(() -> {
                myCache.put(temp + "", temp + "");
            }, String.valueOf(i)).start();
        }

        // 读取
        for (int i = 1; i <= 5; i++) {
            final int temp = i;
            new Thread(() -> {
                myCache.get(temp + "");
            }, String.valueOf(i)).start();
        }
    }
}

// 加锁的
class MyCacheLock {
    //被volatile修饰的变量能够保证每个线程能够获取该变量的最新值，从而避免出现数据脏读的现象
    private volatile Map<String, Object> map = new HashMap<>();
    // 读写锁： 更加细粒度的控制
    private ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    // 存，写入的时候，只希望同时只有一个线程写
    public void put(String key, Object value) {
        readWriteLock.writeLock().lock();
        try {
            System.out.println(Thread.currentThread().getName() + "写入" + key);
            map.put(key, value);
            System.out.println(Thread.currentThread().getName() + "写入OK");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.writeLock().unlock();
        }
    }

    // 取，读，所有人都可以读！
    public void get(String key) {
        readWriteLock.readLock().lock();
        try {
            System.out.println(Thread.currentThread().getName() + "读取" + key);
            Object o = map.get(key);
            System.out.println(Thread.currentThread().getName() + "读取OK,读取到：" + o);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.readLock().unlock();
        }
    }
}

//未加锁
class MyCache {

    private volatile Map<String, Object> map = new HashMap<>();

    // 存，写
    public void put(String key, Object value) {
        System.out.println(Thread.currentThread().getName() + "写入" + key);
        map.put(key, value);
        System.out.println(Thread.currentThread().getName() + "写入OK");
    }

    // 取，读
    public void get(String key) {
        System.out.println(Thread.currentThread().getName() + "读取" + key);
        Object o = map.get(key);
        System.out.println(Thread.currentThread().getName() + "读取OK");
    }
}
```
## BlockingQueue（阻塞队列）
>&emsp;&emsp;最常用的"**生产者-消费者**"问题中，队列通常被视作线程间操作的**数据容器**，这样，可以对各个模块的业务功能进行解耦，生产者将“生产”出来的数据放置在数据容器中，而消费者仅仅只需要在“数据容器”中进行获取数据即可，这样生产者线程和消费者线程就能够进行解耦，只专注于自己的业务功能即可.阻塞队列（`BlockingQueue`）被广泛使用在“生产者-消费者”问题中，其原因是 `BlockingQueue` 提供了可阻塞的插入和移除的方法。

**BlockingQueue 继承于 Queue 接口**,BlockingQueue方法有四种形式:<font color="red">一种方法抛出异常，另一种方法返回特殊值（根据操作的不同，可以为null或false），第三个在操作成功之前无限期阻塞当前线程，第四个在放弃之前仅阻塞给定的最大时间限制。</font>

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517211919274.png)

**插入**
>add(E e) ：往队列插入数据，当队列满时，插入元素时会抛出 IllegalStateException 异常；
>offer(E e)：当往队列插入数据时，插入成功返回true，否则则返回false。当队列满时不会抛出异常；
>put(E e)：当阻塞队列容量已经满时，往阻塞队列插入数据的线程会被阻塞，直至阻塞队列已经有空余的容量可供使用；
>offer(E e, long timeout, TimeUnit unit)：若阻塞队列已经满时，同样会阻塞插入数据的线程，直至阻塞队列已经有空余的地方，与 put 方法不同的是，该方法会有一个超时时间，若超过当前给定的超时时间，插入数据的线程会退出；



**删除**
>remove(Object o)：从队列中删除数据，成功则返回true，否则为false
>poll()：删除数据，当队列为空时，返回 null；
>take()：当阻塞队列为空时，获取队头数据的线程会被阻塞；
>poll(long timeout, TimeUnit unit)：当阻塞队列为空时，获取数据的线程会被阻塞，另外，如果被阻塞的线程超过了给定的时长，该线程会退出

**查看**
>element：获取队头元素，如果队列为空时则抛出 NoSuchElementException 异常；
>peek：获取队头元素，如果队列为空则抛出 NoSuchElementException 异常

```java
public class Test {
    public static void main(String[] args) throws InterruptedException {
        test4();
    }
    /**
     * 抛出异常
     */
    public static void test1(){
        // 队列的大小
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue<>(3);

        System.out.println(blockingQueue.add("a"));
        System.out.println(blockingQueue.add("b"));
        System.out.println(blockingQueue.add("c"));
        // IllegalStateException: Queue full 抛出异常！
        // System.out.println(blockingQueue.add("d"));

        System.out.println("=-===========");

        System.out.println(blockingQueue.element()); // 查看队首元素是谁
        System.out.println(blockingQueue.remove());


        System.out.println(blockingQueue.remove());
        System.out.println(blockingQueue.remove());

        // java.util.NoSuchElementException 抛出异常！
        // System.out.println(blockingQueue.remove());
    }

    /**
     * 有返回值，没有异常
     */
    public static void test2(){
        // 队列的大小
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue<>(3);

        System.out.println(blockingQueue.offer("a"));
        System.out.println(blockingQueue.offer("b"));
        System.out.println(blockingQueue.offer("c"));

        System.out.println(blockingQueue.peek());
        // System.out.println(blockingQueue.offer("d")); // false 不抛出异常！
        System.out.println("============================");
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll()); // null  不抛出异常！
    }

    /**
     * 等待，阻塞（一直阻塞）
     */
    public static void test3() throws InterruptedException {
        // 队列的大小
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue<>(3);

        // 一直阻塞
        blockingQueue.put("a");
        blockingQueue.put("b");
        blockingQueue.put("c");
        // blockingQueue.put("d"); // 队列没有位置了，一直阻塞
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take()); // 没有这个元素，一直阻塞

    }

    /**
     * 等待，阻塞（等待超时）
     */
    public static void test4() throws InterruptedException {
        // 队列的大小
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue<>(3);

        blockingQueue.offer("a");
        blockingQueue.offer("b");
        blockingQueue.offer("c");
        // blockingQueue.offer("d",2,TimeUnit.SECONDS); // 等待超过2秒就退出
        System.out.println("===============");
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        blockingQueue.poll(2,TimeUnit.SECONDS); // 等待超过2秒就退出

    }
}
```
**其他阻塞队列**

> <font size =4>ArrayBlockingQueue：由数组结构组成的有界阻塞队列。
> LinkedBlockingQueue：由链表结构组成的有界（但大小默认值为integer.MAX_VALUE）阻塞队列。
> PriorityBlockingQueue：支持优先级排序的无界阻塞队列。 
> DelayQueue：使用优先级队列实现的延迟无界阻塞队列。
> SynchronousQueue：不存储元素的阻塞队列，也即单个元素的队列。
> LinkedTransferQueue：由链表组成的无界阻塞队列。 
> LinkedBlockingDeque：由链表组成的双向阻塞队列。</font>

**SynchronousQueue**
```java
/**
 * 同步队列
 * 和其他的BlockingQueue 不一样， SynchronousQueue 不存储元素
 * put了一个元素，必须从里面先take取出来，否则不能在put进去值！
 */
public class SynchronousQueueDemo {
    public static void main(String[] args) {
        BlockingQueue<String> blockingQueue = new SynchronousQueue<>(); // 同步队列

        new Thread(()->{
            try {
                System.out.println(Thread.currentThread().getName()+" put 1");
                blockingQueue.put("1");
                System.out.println(Thread.currentThread().getName()+" put 2");
                blockingQueue.put("2");
                System.out.println(Thread.currentThread().getName()+" put 3");
                blockingQueue.put("3");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"T1").start();


        new Thread(()->{
            try {
                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName()+"=>"+blockingQueue.take());
                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName()+"=>"+blockingQueue.take());
                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName()+"=>"+blockingQueue.take());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"T2").start();
    }
}
```

## 线程池
### 池化技术
><font size =4>由于创建、销毁，十分浪费资源，事先准备好一些资源，要用则去池中拿，用完之后就还给池中</font>

### 线程池的优势
><font size =4>线程池做的工作只要是控制运行的线程数量，处理过程中将任务放入队列，然后在线程创建后启动这些任务，如果线程数量超过了最大数量，超出数量的线程排队等候，等其他线程执行完毕，再从队列中取出任务来执行。</font>

 ### 线程池的特点
><font size =4 color="red">线程复用;控制最大并发数;管理线程</font> 
><font size =4 >1、降低资源消耗。通过重复利用已创建的线程降低线程创建和销毁造成的销耗。</font>
>2、提高响应速度。当任务到达时，任务可以不需要等待线程创建就能立即执行。
    >3、提高线程的可管理性。线程是稀缺资源，如果无限制的创建，不仅会销耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。

 ### 线程池三大方法
  **线程池三大方法即创建线程池的三种方法**， Java 中的线程池是通过 `Executor` 框架来实现的，该框架中使用到了 `Executor`，`Executors`，`ExecutorService`，`ThreadPoolExecutor` 这几个类
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517214741460.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

**1、Excutors.newFixedThreadPool(int)**
创建一个定长线程池，可控制线程最大并发数，超出的线程会在队列中等待
>`newFixedThreadPool`创建的线程池`corePoolSize`和`maximumPoolSize`值是相等的，它使用的`LinkedBlockingQueue`

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
 	return new ThreadPoolExecutor(nThreads, nThreads,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>());
}
```
**2、Excutors.newSingleThreadExecutor()**
创建一个单线程化的线程池，它只会用唯一的工作线程来执行任务，保证所有任务按照指定顺序执行
>`newSingleThreadExecutor`创建的线程池`corePoolSize`和`maximumPoolSize`值都设置为1，它使用的`LinkedBlockingQueue`

```java
 public static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory) {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>(),
                                    threadFactory));
    }
```
**3、Excutors.newCachedThreadPool()**
创建一个可缓存线程池，如果线程池长度超出处理需要，可灵活回收空闲线程，若无可回收，则新建线程

>`newCachedThreadPool`将`corePoolSize`设置为0，将`maximumPoolSize`设置为`Integer.MAX_VALUE`，使用的`SynchronousQueue`，也就是说来了任务就创建线程运行，多余的空闲线程的存活时间60秒
```java
public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }
```
阿里巴巴代码规范中提到：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200517214513281.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
可以看出三大方法本质上也还是调用ThreadPoolExecutor，看源码

 ### 线程池七大参数
```java
 public ThreadPoolExecutor(int corePoolSize,//核心线程池大小,当提交一个任务到线程池时，线程池会创建一个线程来执行任务，即使其他空闲的基本线程能够执行新任务也会创建线程，等到需要执行的任务数大于线程池基本大小时就不再创建。如果调用了线程池的prestartAllCoreThreads方法，线程池会提前创建并启动所有基本线程
                              int maximumPoolSize,//最大线程池大小,线程池允许创建的最大线程数。如果队列满了，并且已创建的线程数小于最大线程数，则线程池会再创建新的线程执行任务。值得注意的是如果使用了无界的任务队列这个参数就没什么效果
                              long keepAliveTime,//超时没人调用就会释放
                              TimeUnit unit,//超时单位
                              BlockingQueue<Runnable> workQueue,//阻塞队列
                              ThreadFactory threadFactory,//线程工厂，创建线程的，一般不动
                              RejectedExecutionHandler handler//拒绝策略) {
        if (corePoolSize < 0 ||
            maximumPoolSize <= 0 ||
            maximumPoolSize < corePoolSize ||
            keepAliveTime < 0)
            throw new IllegalArgumentException();
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200518224130128.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

```java
// Executors 工具类、3大方法

/**
 * new ThreadPoolExecutor.AbortPolicy() // 银行满了，还有人进来，不处理这个人的，抛出异常
 * new ThreadPoolExecutor.CallerRunsPolicy() // 哪来的去哪里！
 * new ThreadPoolExecutor.DiscardPolicy() //队列满了，丢掉任务，不会抛出异常！
 * new ThreadPoolExecutor.DiscardOldestPolicy() //队列满了，尝试去和最早的竞争，也不会抛出异常！
 */
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
### 线程池四种拒绝策略
> 1、new ThreadPoolExecutor.AbortPolicy() // 银行满了，还有人进来，不处理这个人的，抛出异 常
> 
> 2、new ThreadPoolExecutor.CallerRunsPolicy() // 哪来的去哪里！
> 
> 3、new ThreadPoolExecutor.DiscardPolicy() //队列满了，丢掉任务，不会抛出异常！
> 
> 4、new ThreadPoolExecutor.DiscardOldestPolicy() //队列满了，尝试去和早的竞争，也不会抛出异常！


## ForkJoin
在必要的情况下，将一个大任务，进行拆分(fork)成若干个小任务（拆到不可再拆时），再将一个个的小任务运算的结果进行 join 汇总
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200518133045554.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
**Fork/Join 框架与传统线程池的区别**
> 
> ForkJoin采用 “工作窃取”模式（work-stealing）(所谓工作窃取，指的是闲置的线程去处理本不属于它的任务)：当执行新的任务时它可以将其拆分分成更小的任务执行，并将小任务加到线程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队列中

> 相对于一般的线程池实现,fork/join框架的优势体现在对其中包含的任务的处理方式上.在一般的线程池中,如果一个线程正在执行的任务由于某些原因无法继续运行,那么该线程会处于等待状态.而在fork/join框架实现中,如果某个子问题由于等待另外一个子问题的完成而无法继续运行.那么处理该子问题的线程会主动寻找其他尚未运行的子问题来执行.这种方式减少了线程的等待时间,提高了性能

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200518133201435.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

> 在ForkJoinPool中运行的任务的抽象基类。ForkJoinTask是一个类似线程的实体，它比普通线程轻得多。大量的任务和子任务可能由ForkJoinPool中的少量实际线程托管，代价是有些使用限制。

```java
/**
 * 求和计算的任务！
 * 3000   6000（ForkJoin）  9000（Stream并行流）
 * // 如何使用 forkjoin
 * // 1、forkjoinPool 通过它来执行
 * // 2、计算任务 forkjoinPool.execute(ForkJoinTask task)
 * // 3. 计算类要继承 ForkJoinTask
 */
public class ForkJoinDemo extends RecursiveTask<Long> {

    private Long start;  // 1
    private Long end;    // 1990900000

    // 临界值
    private Long temp = 10000L;

    public ForkJoinDemo(Long start, Long end) {
        this.start = start;
        this.end = end;
    }
    // 计算方法
    @Override
    protected Long compute() {
        if ((end-start)<temp){
            Long sum = 0L;
            for (Long i = start; i <= end; i++) {
                sum += i;
            }
            return sum;
        }else { // forkjoin 递归
            long middle = (start + end) / 2; // 中间值
            ForkJoinDemo task1 = new ForkJoinDemo(start, middle);
            task1.fork(); // 拆分任务，把任务压入线程队列
            ForkJoinDemo task2 = new ForkJoinDemo(middle+1, end);
            task2.fork(); // 拆分任务，把任务压入线程队列

            return task1.join() + task2.join();
        }
    }
}
```

测试
```java
/**
 * 同一个任务，别人效率高你几十倍！
 */
public class Test {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // test1(); // 12224
        // test2(); // 10038
        // test3(); // 153
    }

    // 普通程序员
    public static void test1(){
        Long sum = 0L;
        long start = System.currentTimeMillis();
        for (Long i = 1L; i <= 10_0000_0000; i++) {
            sum += i;
        }
        long end = System.currentTimeMillis();
        System.out.println("sum="+sum+" 时间："+(end-start));
    }

    // 会使用ForkJoin 中级程序员
    public static void test2() throws ExecutionException, InterruptedException {
        long start = System.currentTimeMillis();

        ForkJoinPool forkJoinPool = new ForkJoinPool();
        ForkJoinTask<Long> task = new ForkJoinDemo(0L, 10_0000_0000L);
        ForkJoinTask<Long> submit = forkJoinPool.submit(task);// 提交任务
        Long sum = submit.get();

        long end = System.currentTimeMillis();

        System.out.println("sum="+sum+" 时间："+(end-start));
    }
    //牛逼程序员
    public static void test3(){
        long start = System.currentTimeMillis();
        // Stream并行流 ()  (]
        long sum = LongStream.rangeClosed(0L, 10_0000_0000L).parallel().reduce(0, Long::sum);
        long end = System.currentTimeMillis();
        System.out.println("sum="+"时间："+(end-start));
    }
}
```
## 异步回调
所谓异步调用其实就是实现一个可无需等待被调用函数的返回值而让操作继续运行的方法。在 Java 语言中，简单的讲就是另启一个线程来完成调用中的部分计算，使调用继续运行或返回，而不需要等待计算结果。但调用者仍需要取线程的计算结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200518135230505.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
**没有返回值的**
```java
public class CompletableFutureDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 没有返回值的 runAsync 异步回调
        CompletableFuture<Void> completableFuture = CompletableFuture.runAsync(()->{
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()+"runAsync=>Void");
        });

        System.out.println("1111");

        //获取阻塞执行结果
        completableFuture.get(); 
```
结果：
```
1111
ForkJoinPool.commonPool-worker-3runAsync=>Void
```
**有返回值的**
```java
public class CompletableFutureDemo {
	public static void main(String[] args) throws ExecutionException, InterruptedException {
		// 有返回值的 supplyAsync 异步回调
		// 返回的是错误信息
		CompletableFuture<Integer> completableFuture = CompletableFuture.supplyAsync(() -> {
			System.out.println(Thread.currentThread().getName() + "supplyAsync=>Integer");
			int i = 10 / 0;
			return 1024;
		});

		System.out.println(completableFuture.whenComplete((t, u) -> {
			System.out.println("正常的返回结果=>" + t); // 正常的返回结果
			System.out.println("错误信息=>" + u); // 错误信息：java.util.concurrent.CompletionException: java.lang.ArithmeticException: / by zero
		}).exceptionally((e) -> {//失败的回调
			System.out.println(e.getMessage());
			return 233; // 可以获取到错误的返回结果
		}).get());
	}
}
```
结果
```
ForkJoinPool.commonPool-worker-3supplyAsync=>Integer
正常的返回结果=>null
错误信息=>java.util.concurrent.CompletionException: java.lang.ArithmeticException: / by zero
java.lang.ArithmeticException: / by zero
233
```
## Volatile
是java虚拟机提供 轻量级的同步机制

1、保证可见性

2、不保证原子性

3、禁止指令重排序

> 1、保证可见性
```java
public class JMMDemo {
    // 不加 volatile 程序就会死循环！
    // 加 volatile 可以保证可见性
    private volatile static int num = 0;

    public static void main(String[] args) { // main

        new Thread(()->{ // 线程 1 对主内存的变化不知道的
            while (num==0){

            }
        }).start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        num = 1;
        System.out.println(num);
    }
}
```

>2、不保证原子性

原子性 : 不可分割
线程A在执行任务的时候，不能被打扰的，也不能被分割。要么同时成功，要么同时失败。
```java
// volatile 不保证原子性
public class VDemo02 {

    // volatile 不保证原子性
    // 原子类的 Integer
    private volatile static AtomicInteger num = new AtomicInteger();

    public static void add(){
        // num++; // 不是一个原子性操作
        num.getAndIncrement(); // AtomicInteger + 1 方法， CAS
    }

    public static void main(String[] args) {

        //理论上num结果应该为 2 万
        for (int i = 1; i <= 20; i++) {
            new Thread(()->{
                for (int j = 0; j < 1000 ; j++) {
                    add();
                }
            }).start();
        }

        while (Thread.activeCount()>2){ // main  gc
            Thread.yield();
        }

        System.out.println(Thread.currentThread().getName() + " " + num);

    }
}
```
如果不加 lock 和 synchronized ，怎么样保证原子性

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020051814574868.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
使用原子类，解决 原子性问题

![在这里插入图片描述](https://img-blog.csdnimg.cn/202005181458032.png)

这些类的底层都直接和操作系统挂钩！在内存中修改值！Unsafe类是一个很特殊的存在!

```java
/**
 * Atomically increments by one the current value.
 *
 * @return the previous value
 */
public final int getAndIncrement() {
    return unsafe.getAndAddInt(this, valueOffset, 1);
}
```

### 指令重排

什么是 指令重排：你写的程序，计算机并不是按照你写的那样去执行的。
<font color="red">源代码-->编译器优化的重排--> 指令并行也可能会重排--> 内存系统也会重排--->  执行</font>
处理器在进行指令重排的时候，考虑：数据之间的依赖性！


```
int x = 1; // 1

int y = 2; // 2

x = x + 5; // 3

y = x * x; // 4
```

我们所期望的：1234  但是可能执行的时候回变成 2134  1324 可不可能是  4123！

可能造成影响的结果： a b x y 这四个值默认都是 0；
<font color="red">volatile可以避免指令重排： 内存屏障。CPU指令。</font>

作用：
1、保证特定的操作的执行顺序！

2、可以保证某些变量的内存可见性 （利用这些特性volatile实现了可见性）

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200518145956441.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
Volatile 是可以保持 可见性。不能保证原子性，由于内存屏障，可以保证避免指令重排的现象产生！ 

## JMM

JMM ： Java内存模型，不存在的东西，概念！约定！  

在硬件内存模型中，各种CPU架构的实现是不尽相同的，Java作为跨平台的语言，为了屏蔽底层硬件差异，定义了Java内存模型（JMM）。JMM作用于JVM和底层硬件之间，屏蔽了下游不同硬件模型带来的差异，为上游开发者提供了统一的使用接口。说了这么多其实就是想说明白JMM——JVM——硬件的关系。总之一句话，<font color="red">JMM是JVM的内存使用规范，是一个抽象的概念</font>
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020051814505339.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
如图在JMM中，内存划分为两个区域，线程本地内存，主内存。

**本地内存**：每个线程均有自己的本地内存（Local Memory，也称之为线程的工作内存），本地内存是线程独占的。
**主内存**：存储所有的变量。如果一个变量被多个线程使用（被多个线程load到线程的本地内存中），则该变量被称之为共享变量

**关于JMM的一些同步的约定：** 

1、线程解锁前，必须把共享变量立刻刷新回主存

2、线程加锁前，必须读取主存中的最新值到工作内存中

3、加锁和解锁是同一把锁！


**关于主内存与工作内存之间的具体交互协议，即一个变量如何从主内存拷贝到工作内存、如何从工作内存同步到主内存之间的实现细节，Java内存模型定义了以下八种操作来完成：**

* lock（锁定）：作用于主内存的变量，把一个变量标识为一条线程独占状态。
* unlock（解锁）：作用于主内存变量，把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定。
* read（读取）：作用于主内存变量，把一个变量值从主内存传输到线程的工作内存中，以便随后的load动作使用
* load（载入）：作用于工作内存的变量，它把read操作从主内存中得到的变量值放入工作内存的变量副本中。
* use（使用）：作用于工作内存的变量，把工作内存中的一个变量值传递给执行引擎，每当虚拟机遇到一个需要使用变量的值的字节码指令时将会执行这个操作。
* assign（赋值）：作用于工作内存的变量，它把一个从执行引擎接收到的值赋值给工作内存的变量，每当虚拟机遇到一个给变量赋值的字节码指令时执行这个操作。
* store（存储）：作用于工作内存的变量，把工作内存中的一个变量的值传送到主内存中，以便随后的write的操作。
* write（写入）：作用于主内存的变量，它把store操作从工作内存中一个变量的值传送到主内存的变量中。
* 
**Java内存模型还规定了在执行上述八种基本操作时，必须满足如下规则：**
* 如果要把一个变量从主内存中复制到工作内存，就需要按顺寻地执行read和load操作， 如果把变量从工作内存中同步回主内存中，就要按顺序地执行store和write操作。但Java内存模型只要求上述操作必须按顺序执行，而没有保证必须是连续执行。
* 不允许read和load、store和write操作之一单独出现
* 不允许一个线程丢弃它的最近assign的操作，即变量在工作内存中改变了之后必须同步到主内存中。
* 不允许一个线程无原因地（没有发生过任何assign操作）把数据从工作内存同步回主内存中。
* 一个新的变量只能在主内存中诞生，不允许在工作内存中直接使用一个未被初始化（load或assign）的变量。即就是对一个变量实施use和store操作之前，必须先执行过了assign和load操作。
* 一个变量在同一时刻只允许一条线程对其进行lock操作，但lock操作可以被同一条线程重复执行多次，多次执行lock后，只有执行相同次数的unlock操作，变量才会被解锁。lock和unlock必须成对出现
* 如果对一个变量执行lock操作，将会清空工作内存中此变量的值，在执行引擎使用这个变量前需要重新执行load或assign操作初始化变量的值
* 如果一个变量事先没有被lock操作锁定，则不允许对它执行unlock操作；也不允许去unlock一个被其他线程锁定的变量。
* 对一个变量执行unlock操作之前，必须先把此变量同步到主内存中（执行store和write操作）

