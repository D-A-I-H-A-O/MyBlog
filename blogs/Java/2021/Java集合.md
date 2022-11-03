---
title: Java集合
date: 2021-06-02
categories:
 - Java
tags:
 - 集合
---

# 集合

可以动态地把多个对象的引用存储起来的容器。

**特点：**

* 集合只能储存对象
* 集合是不需要指定长度
* 集合中可以存放任意类型的对象（不指定泛型的情况下）

**优点：**
* 降低编程难度 
* 提高程序性能 
* 提高API间的互操作性 
* 降低学习难度 
* 降低设计和实现相关API的难度 
* 增加程序的重用性 

`Java`容器里只能放对象，对于基本类型`(int, long, float, double等)`，需要将其包装成对象类型后`(Integer, Long, Float, Double等)`才能放到容器里。很多时候拆包装和解包装能够自动完成。这虽然会导致额外的性能和空间开销，但简化了设计和编程。


# 集合与数组的区别
* 	长度区别
		数组固定
		集合可变
* 	内容区别
		数组可以是基本类型，也可以是引用类型
		集合只能是引用数据
* 	元素内容
		数据只能存储同一类型
		集合可以存储不同类型（其实集合一般存储的也是同一种类型）

# Java集合体系
Java集合可分为`Collection`和`Map`两种体系
* `Collection`接口：对象的集合 `Set` 和 `List`
* `Map`接口：具有映射关系`key-value对`的集合

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210615111405778.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210615092738928.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210615094610809.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

# Collection
1、`Collection`接口是`List`、`Set` 和 `Queue` 接口的父接口，该接口里定义的方法三者都适用。

2、`JDK`不提供此接口的任何直接实现，而是提供更具体的子接口实现

2、在`Java5`之前，`Java`集合会丢失容器中所有对象的数据类型，把所有对象都当成`Object`类型处理，从`JDK5.0`增加`泛型`后，`Java`集合可以记住容器中对象的数据类型。


[Collection API](https://www.apiref.com/java11-zh/java.base/java/util/Collection.html)

## List
1、有序集合（也称为序列 ）。 该接口的用户可以精确控制列表中每个元素的插入位置。 用户可以通过整数索引（列表中的位置）访问元素，并搜索列表中的元素。

2、`List`允许重复元素。

3、`List`接口提供了一个特殊的迭代器，称为`ListIterator` ，除了`Iterator`接口提供的正常操作外，还允许元素插入和替换以及双向访问。 提供了一种方法来获得从列表中的指定位置开始的列表迭代器。

[List API](https://www.apiref.com/java11-zh/java.base/java/util/List.html)

### ArrayList
`ArrayList`实现了`List`接口，是顺序容器，即元素存放的数据与放进去的顺序相同，允许放入`null`元素，底层通过数组实现。该类未实现同步外，其余跟`Vector`大致相同。每个`ArrayList`都有一个容量(`capacity`)，表示底层数组的实际大小，容器内存储元素的个数不能多于当前容量。当向容器中添加元素时，如果容量不足，容器会自动增大底层数组的大小。`Java泛型`只是编译器提供的语法糖，所以这里的数组是一个`Object`数组，以便能够容纳任何类型的对象

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
    private static final long serialVersionUID = 8683452581122892189L;

    /**
     * Default initial capacity.
     */
    private static final int DEFAULT_CAPACITY = 10;

    /**
     * Shared empty array instance used for empty instances.
     */
    private static final Object[] EMPTY_ELEMENTDATA = {};

    /**
     * Shared empty array instance used for default sized empty instances. We
     * distinguish this from EMPTY_ELEMENTDATA to know how much to inflate when
     * first element is added.
     */
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

    /**
     * The array buffer into which the elements of the ArrayList are stored.
     * The capacity of the ArrayList is the length of this array buffer. Any
     * empty ArrayList with elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA
     * will be expanded to DEFAULT_CAPACITY when the first element is added.
     */
    transient Object[] elementData; // non-private to simplify nested class access

    /**
     * The size of the ArrayList (the number of elements it contains).
     *
     * @serial
     */
    private int size;

   
    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                    initialCapacity);
        }
    }
    
    
    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }

   
    public ArrayList(Collection<? extends E> c) {
        Object[] a = c.toArray();
        if ((size = a.length) != 0) {
            if (c.getClass() == java.util.ArrayList.class) {
                elementData = a;
            } else {
                elementData = Arrays.copyOf(a, size, Object[].class);
            }
        } else {
            // replace with empty array.
            elementData = EMPTY_ELEMENTDATA;
        }
    }
}
```
**自动扩容**

每当向数组中添加元素时，都要去检查添加后元素的个数是否会超出当前数组的长度，如果超出，数组将会进行扩容，以满足添加数据的需求。数组扩容通过一个公开的方法`ensureCapacity(int minCapacity)`来实现。在实际添加大量元素前，我也可以使用`ensureCapacity`来手动增加`ArrayList`实例的容量，以减少递增式再分配的数量。
```java
    public void ensureCapacity(int minCapacity) {
        int minExpand = (elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
            // 如果不是为空 为0
            ? 0
            // 如果为空 则为初始化容量10
            : DEFAULT_CAPACITY;

        if (minCapacity > minExpand) {
            ensureExplicitCapacity(minCapacity);
        }
    }

    private void ensureExplicitCapacity(int minCapacity) {
        modCount++;

        // overflow-conscious code
        if (minCapacity - elementData.length > 0)
            grow(minCapacity);
    }

    /**
     * The maximum size of array to allocate.
     * Some VMs reserve some header words in an array.
     * Attempts to allocate larger arrays may result in
     * OutOfMemoryError: Requested array size exceeds VM limit
     * 要分配的数组的最大大小。 一些 VM 在数组中保留一些头字。 
     * 尝试分配更大的数组可能会导致 OutOfMemoryError：请求的数组大小超出 VM 限制
     */
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

    /**
     * Increases the capacity to ensure that it can hold at least the
     * number of elements specified by the minimum capacity argument.
     * 数组进行扩容时，会将老数组中的元素重新拷贝一份到新的数组中，
     * 每次数组容量的增长大约是其原容量的1.5倍。
     * 这种操作的代价是很高的，因此在实际使用时，我们应该尽量避免数组容量的扩张。
     * 当我们可预知要保存的元素的多少时，要在构造ArrayList实例时，就指定其容量，以避免数组扩容的发生
     * 或者根据实际需求，通过调用ensureCapacity方法来手动增加ArrayList实例的容量。
     * @param minCapacity the desired minimum capacity
     */
    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }

    private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
        return (minCapacity > MAX_ARRAY_SIZE) ?
            Integer.MAX_VALUE :
            MAX_ARRAY_SIZE;
    }

```
**Set**

底层是一个数组`ArrayList`的`set()`方法也就变得非常简单，直接对数组的指定位置赋值即可。
```java
public E set(int index, E element) {
    rangeCheck(index);//下标越界检查
    E oldValue = elementData(index);
    elementData[index] = element;//赋值到指定位置，复制的仅仅是引用
    return oldValue;
}
```
**Get**
`get()`方法同样很简单，唯一要注意的是由于底层数组是`Object[]`，得到元素后需要进行类型转换。
```java
public E get(int index) {
    rangeCheck(index);
    return (E) elementData[index];//注意类型转换
}
```
**Remove**

`remove()`方法也有两个版本，一个是`remove(int index)`删除指定位置的元素，另一个是`remove(Object o)`删除第一个满足`o.equals(elementData[index])`的元素。

删除操作是`add()`操作的逆过程，需要将删除点之后的元素向前移动一个位置。需要注意的是为了让`GC`起作用，必须显式的为最后一个位置赋`null`值。

```java
public E remove(int index) {
    rangeCheck(index);
    modCount++;
    E oldValue = elementData(index);
    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index, numMoved);
    elementData[--size] = null; //清除该位置的引用，让GC起作用
    //有了垃圾收集器并不意味着一定不会有内存泄漏。
    //对象能否被GC的依据是是否还有引用指向它，上面代码中如果不手动赋null值，
    //除非对应的位置被其他元素覆盖，否则原来的对象就一直不会被回收。
    return oldValue;
}
```
**trimToSize**

可以通过`trimToSize`方法来实现将底层数组的容量调整为当前列表保存的实际元素的大小的功能
```java
    /**
     * Trims the capacity of this <tt>ArrayList</tt> instance to be the
     * list's current size.  An application can use this operation to minimize
     * the storage of an <tt>ArrayList</tt> instance.
     */
    public void trimToSize() {
        modCount++;
        if (size < elementData.length) {
            elementData = (size == 0)
              ? EMPTY_ELEMENTDATA
              : Arrays.copyOf(elementData, size);
        }
    }
```

```java
public class Test{
    public static void main(String args[]) {
        ArrayList<Integer> arrayList = new ArrayList<>();
 
        System.out.println(getArrayListCapacity(arrayList));//0
 
        //增加元素，使其扩容
        arrayList.add(0);
        System.out.println(getArrayListCapacity(arrayList));//10

        //容量调整
        arrayList.trimToSize();

        System.out.println(getArrayListCapacity(arrayList));//1
    }
 
    public static int getArrayListCapacity(ArrayList<?> arrayList) {
        Class<ArrayList> arrayListClass = ArrayList.class;
        try {
            Field field = arrayListClass.getDeclaredField("elementData");
            field.setAccessible(true);
            Object[] objects = (Object[])field.get(arrayList);
           return objects.length;
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
            return -1;
        } catch (IllegalAccessException e) {
            e.printStackTrace();
            return -1;
        }
    }
}
```
**Fail-Fast机制** 

`ArrayList`也采用了快速失败的机制，通过记录`modCount`参数来实现。在面对并发的修改时，迭代器很快就会完全失败，而不是冒着在将来某个不确定时间发生任意不确定行为的风险。

**Arraylist 与 LinkedList 区别**
* 是否保证线程安全： `ArrayList` 和 `LinkedList` 都是不同步的，也就是不保证线程安全；

* 底层数据结构： `Arraylist` 底层使用的是 `Object` 数组；`LinkedList` 底层使用的是 `双向链表` 数据结构（JDK1.6 之前为循环链表，JDK1.7 取消了循环）

* 插入和删除是否受元素位置的影响：`ArrayList` 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。 比如：执行`add(E e)`方法的时候， `ArrayList` 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是 `O(1)`。但是如果要在指定位置 `i` 插入和删除元素的话`（add(int index, E element)）`时间复杂度就为 `O(n-i)`。因为在进行上述操作的时候集合中第 `i` 和第 `i` 个元素之后的`(n-i)`个元素都要执行向后位/向前移一位的操作。`LinkedList` 采用链表存储，所以，如果是在头尾插入或者删除元素不受元素位置的影响`add(E e)、addFirst(E e)、addLast(E e)、removeFirst() 、removeLast()`，近似 `O(1)`，如果是要在指定位置 `i` 插入和删除元素的话`add(int index, E element)，remove(Object o)` 时间复杂度近似为 `O(n)` ，因为需要先移动到指定位置再插入。

* 是否支持快速随机访问： `LinkedList` 不支持高效的随机元素访问，而 `ArrayList` 支持。快速随机访问就是通过元素的序号快速获取元素对象(对应于`get(int index)`方法)。

* 内存空间占用： `ArrayList` 的空间浪费主要体现在在 `list` 列表的结尾会预留一定的容量空间，而 `LinkedList` 的空间花费则体现在它的每一个元素都需要消耗比 `ArrayList` 更多的空间（因为要存放直接后继和直接前驱以及数据）

|| 底层|效率(增删)| 效率(查)|线程安全|
|--|--|--|--|--|
|LinkedList| 双向链表|较高|较低|不安全|
|ArrayList| 数组|较低|较高|不安全|

[JavaGuide-ArrayList](https://snailclimb.gitee.io/javaguide/#/docs/java/collection/ArrayList%E6%BA%90%E7%A0%81+%E6%89%A9%E5%AE%B9%E6%9C%BA%E5%88%B6%E5%88%86%E6%9E%90?id=_1-arraylist-%E7%AE%80%E4%BB%8B)

### Vector
`Vector` 是一个古老的集合，`JDK1.0`就有了。大多数操作与`ArrayList`相同，区别之处在于`Vector`是线程安全的。

`Vector`  已经过时

||版本| 底层|线程安全|效率|
|--|--|--|--|--|
|Vector|1.0| 数组|安全|较低|
|ArrayList|1.2| 数组|不安全|较高|

### LinkedList 
 `LinkedList`同时实现了`List`接口和`Deque`接口，也就是说它既可以看作一个顺序容器，又可以看作一个队列(`Queue`)，同时又可以看作一个栈(`Stack`)。当你需要使用栈或者队列时，可以考虑使用`LinkedList`，一方面是因为`Java`官方已经声明不建议使用`Stack`类，更遗憾的是，`Java`里根本没有一个叫做`Queue`的类(它是个接口名字)。关于栈或队列，现在的首选是`ArrayDeque`，它有着比`LinkedList`(当作栈或队列使用时)有着更好的性能。

```java
public class LinkedList<E>
        extends AbstractSequentialList<E>
        implements List<E>, Deque<E>, Cloneable, java.io.Serializable
```
 `LinkedList`的实现方式决定了所有跟下标相关的操作都是线性时间，而在首段或者末尾删除元素只需要常数时间。为追求效率`LinkedList`没有实现同步(`synchronized`)，如果需要多个线程并发访问，可以先采用`Collections.synchronizedList()`方法对其进行包装。

底层是`双向链表`，在创建`LinkedLitst`时，会生成`first`和`last`两个节点（`Node`）对象，当链表为空的时候`first`和`last`都指向`NUll`。

 **Node**
```java
    transient int size = 0;

    /**
     * Pointer to first node.
     * Invariant: (first == null && last == null) ||
     * (first.prev == null && first.item != null)
     */
    transient Node<E> first;

    /**
     * Pointer to last node.
     * Invariant: (first == null && last == null) ||
     * (last.next == null && last.item != null)
     */
    transient Node<E> last;


    /**
     * 构造一个空列表
     */
    public LinkedList() {
    }

    /**
     * 按照集合的迭代器返回的顺序构造一个包含指定集合元素的列表
     */
    public LinkedList(Collection<? extends E> c) {
        this();
        addAll(c);
    }
```

```java
    //Node是私有的内部类
	private static class Node<E> {
	    E item;
	    Node<E> next;
	    Node<E> prev;
	
	    Node(Node<E> prev, E element, Node<E> next) {
	        this.item = element;
	        this.next = next;
	        this.prev = prev;
	    }
	}
```

**增**

`add()`方法有两个版本，一个是`add(E e)`，该方法在`LinkedList`的末尾插入元素，因为有`last`指向链表末尾，在末尾插入元素的花费是常数时间。只需要简单修改几个相关引用即可；另一个是`add(int index, E element)`，该方法是在指定下表处插入元素，需要先通过线性查找找到具体位置，然后修改相关引用完成插入操作。

```java
    /**
     * Appends the specified element to the end of this list.
     *
     * <p>This method is equivalent to {@link #addLast}.
     *
     * @param e element to be appended to this list
     * @return {@code true} (as specified by {@link Collection#add})
     */
    public boolean add(E e) {
        linkLast(e);
        return true;
    }
    
    /**
     * Links e as last element.
     */
    void linkLast(E e) {
       final Node<E> l = last;
        //在第一次添加`add`时，会新建一个`Node`节点对象，并且将该节点对象赋值给first和last
        //在以后的每次添加，都会新建一个Node节点对象,将之前的最后一个节点设置为当前节点的前一个节点
        final Node<E> newNode = new Node<>(l, e, null);
        last = newNode;
        if (l == null)//由于第一次添加   last==null成立
            first = newNode;
        else
            l.next = newNode;//将之前的最后一个节点的下一个节点设置为当前节点
        size++;
        modCount++;
    }

```
`add(int index, E element)`, 当`index==size`时，等同于`add(E e)`;如果不是，则分两步: 1.先根据`index`找到要插入的位置,即`node(index)`方法；2.修改引用，完成插入操作

```java
    public void add(int index, E element) {
        checkPositionIndex(index);

        if (index == size)
            linkLast(element);
        else
            linkBefore(element, node(index));
    }

    /**
     * Returns the (non-null) Node at the specified element index.
     * 链表是双向的，可以从开始往后找，也可以从结尾往前找，
     * 具体朝那个方向找取决于条件index < (size >> 1)，也即是index是靠近前端还是后端。
     * 从这里也可以看出，linkedList通过index检索元素的效率没有arrayList高
     */
    Node<E> node(int index) {
        // assert isElementIndex(index);

        if (index < (size >> 1)) {
            Node<E> x = first;
            for (int i = 0; i < index; i++)
                x = x.next;
            return x;
        } else {
            Node<E> x = last;
            for (int i = size - 1; i > index; i--)
                x = x.prev;
            return x;
        }
    }
```
 **addAll**
```java
    /**
     * 
     */
    public boolean addAll(Collection<? extends E> c) {
        return addAll(size, c);
    }

    /**
     * 
     */
    public boolean addAll(int index, Collection<? extends E> c) {
        checkPositionIndex(index);

        Object[] a = c.toArray();
        int numNew = a.length;
        if (numNew == 0)
            return false;

        Node<E> pred, succ;
        if (index == size) {
            succ = null;
            pred = last;
        } else {
            succ = node(index);
            pred = succ.prev;
        }

        for (Object o : a) {
            @SuppressWarnings("unchecked") E e = (E) o;
            Node<E> newNode = new Node<>(pred, e, null);
            if (pred == null)
                first = newNode;
            else
                pred.next = newNode;
            pred = newNode;
        }

        if (succ == null) {
            last = pred;
        } else {
            pred.next = succ;
            succ.prev = pred;
        }

        size += numNew;
        modCount++;
        return true;
    }
```
**删**
```java
    /**
     *删除第一次出现的这个元素, 如果没有这个元素，则返回false；
     *判读的依据是equals方法， 如果equals，则直接unlink这个node；
     *由于LinkedList可存放null元素，故也可以删除第一次出现null的元素
     */
    public boolean remove(Object o) {
        if (o == null) {
            for (Node<E> x = first; x != null; x = x.next) {
                if (x.item == null) {
                    unlink(x);
                    return true;
                }
            }
        } else {
            for (Node<E> x = first; x != null; x = x.next) {
                if (o.equals(x.item)) {
                    unlink(x);
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * Unlinks non-null node x.
     */
    E unlink(Node<E> x) {
        // assert x != null;
        final E element = x.item;
        final Node<E> next = x.next;
        final Node<E> prev = x.prev;

        if (prev == null) {// 第一个元素
            first = next;
        } else {
            prev.next = next;
            x.prev = null;
        }

        if (next == null) {// 最后一个元素
            last = prev;
        } else {
            next.prev = prev;
            x.next = null;
        }

        x.item = null; // GC
        size--;
        modCount++;
        return element;
    }
```
**删除指定位置的元素**
```java
    /**
     * 使用的是下标计数， 只需要判断该index是否有元素即可，如果有则直接unlink这个node。
     */
    public E remove(int index) {
        checkElementIndex(index);
        return unlink(node(index));
    }

```
**删除head元素**
```java
    /**
     * Removes and returns the first element from this list.
     *
     * @return the first element from this list
     * @throws NoSuchElementException if this list is empty
     */
    public E removeFirst() {
        final Node<E> f = first;
        if (f == null)
            throw new NoSuchElementException();
        return unlinkFirst(f);
    }


    /**
     * Unlinks non-null first node f.
     */
    private E unlinkFirst(Node<E> f) {
        // assert f == first && f != null;
        final E element = f.item;
        final Node<E> next = f.next;
        f.item = null;
        f.next = null; // help GC
        first = next;
        if (next == null)
            last = null;
        else
            next.prev = null;
        size--;
        modCount++;
        return element;
    }
```
**删除last元素**
```java
	/**
     * Removes and returns the last element from this list.
     *
     * @return the last element from this list
     * @throws NoSuchElementException if this list is empty
     */
    public E removeLast() {
        final Node<E> l = last;
        if (l == null)
            throw new NoSuchElementException();
        return unlinkLast(l);
    }
    
    /**
     * Unlinks non-null last node l.
     */
    private E unlinkLast(Node<E> l) {
        // assert l == last && l != null;
        final E element = l.item;
        final Node<E> prev = l.prev;
        l.item = null;
        l.prev = null; // help GC
        last = prev;
        if (prev == null)
            first = null;
        else
            prev.next = null;
        size--;
        modCount++;
        return element;
    }
```
 **改**
将某个位置的元素重新赋值
```java
    public E set(int index, E element) {
        checkElementIndex(index);
        Node<E> x = node(index);
        E oldVal = x.item;
        x.item = element;
        return oldVal;
    }
```
 **查**
获取第一个元素， 和获取最后一个元素
```java
    /**
     * Returns the first element in this list.
     *
     * @return the first element in this list
     * @throws NoSuchElementException if this list is empty
     */
    public E getFirst() {
        final Node<E> f = first;
        if (f == null)
            throw new NoSuchElementException();
        return f.item;
    }

    /**
     * Returns the last element in this list.
     *
     * @return the last element in this list
     * @throws NoSuchElementException if this list is empty
     */
    public E getLast() {
        final Node<E> l = last;
        if (l == null)
            throw new NoSuchElementException();
        return l.item;
    }
```

```java
    /**
     * 通过index获取元素
     */
    public E get(int index) {
        checkElementIndex(index);
        return node(index).item;
    }
```
查找第一次出现的index, 如果找不到返回-1
```java
    public int indexOf(Object o) {
        int index = 0;
        if (o == null) {
            for (Node<E> x = first; x != null; x = x.next) {
                if (x.item == null)
                    return index;
                index++;
            }
        } else {
            for (Node<E> x = first; x != null; x = x.next) {
                if (o.equals(x.item))
                    return index;
                index++;
            }
        }
        return -1;
    }
```
查找最后一次出现的index, 如果找不到返回-1
```java
    public int lastIndexOf(Object o) {
        int index = size;
        if (o == null) {
            for (Node<E> x = last; x != null; x = x.prev) {
                index--;
                if (x.item == null)
                    return index;
            }
        } else {
            for (Node<E> x = last; x != null; x = x.prev) {
                index--;
                if (o.equals(x.item))
                    return index;
            }
        }
        return -1;
    }
```
**clear**

为了让GC更快可以回收放置的元素，需要将node之间的引用关系赋空。
```java
    /**
     * Removes all of the elements from this list.
     * The list will be empty after this call returns.
     */
    public void clear() {
        // Clearing all of the links between nodes is "unnecessary", but:
        // - helps a generational GC if the discarded nodes inhabit
        //   more than one generation
        // - is sure to free memory even if there is a reachable Iterator
        for (Node<E> x = first; x != null; ) {
            Node<E> next = x.next;
            x.item = null;
            x.next = null;
            x.prev = null;
            x = next;
        }
        first = last = null;
        size = 0;
        modCount++;
    }
```

[LinkedList API](https://www.apiref.com/java11-zh/java.base/java/util/LinkedList.html)

### Queue

`Queue`接口继承自`Collection`接口，除了最基本的`Collection`的方法之外。队列还提供额外的插入、提取和检查操作。 这些方法中的每一个都以两种形式存在：一种在操作失败时抛出异常，另一种返回一个特殊值（ `null`或`false` ，取决于操作）。 后一种形式的插入操作是专门为与容量受限的`Queue`实现一起使用而设计的； 在大多数实现中，插入操作不会失败。 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210617065042548.png)
[Queue API](https://www.apiref.com/java11-zh/java.base/java/util/Queue.html)

### Deque
`Deque`是“双端队列”的缩写，通常发音为`“deck”`。 大多数Deque实现对它们可能包含的元素数量没有固定限制，但此接口支持容量限制的双端队列以及没有固定大小限制的双端队列。由于`Deque`是双向的，所以可以对队列的头和尾都进行操作，它同时也支持两组格式，一组是抛出异常的实现；另外一组是返回值的实现(没有则返回`null`)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210617070033369.png)
当把`Deque`当做`FIFO`（先进先出）的`Queue`来使用时，元素是从`Deque`的尾部添加，从头部进行删除的； 所以`Deque`的部分方法是和`Queue`是等同的。具体如下
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210617070313137.png)
`Deques`也可以用作`LIFO`（后进先出）堆栈。 应优先使用此接口，而不是旧版`Stack` 。 当`Deques`用作堆栈时，元素将从双端队列的开头推出并弹出。 堆栈方法相当于`Deques`方法，如下表所示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210617070406630.png)
请注意，当`Deque`用作队列或堆栈时， `peek`方法同样有效; 在任何一种情况下，元素都是从双端队列的开头绘制的。

此界面提供了两种删除内部元素的方法， `removeFirstOccurrence`和`removeLastOccurrence`

与`List`接口不同，此接口不支持对元素的索引访问。

虽然严格要求`Deque`实现禁止插入`null`元素，但强烈建议他们这样做。 任何用户`Deque`强烈建议实现，也允许`null`元素不采取插入空的能力优势。 这是因为`null`被各种方法用作特殊返回值，以指示`Deque`为空。

`Deque`实现通常不定义`equals`和`hashCode`方法的基于元素的版本，而是继承类`Object`基于身份的版本。

[Deque API](https://www.apiref.com/java11-zh/java.base/java/util/Deque.html)

### ArrayDeque
`ArrayDeque`和`LinkedList`是`Deque`的两个通用实现，官方更推荐使用`AarryDeque`用作栈和队列

从名字可以看出`ArrayDeque`底层通过数组实现，为了满足可以同时在数组两端插入或删除元素的需求，该数组还必须是循环的，即循环数组(`circular array`)，也就是说数组的任何一点都可能被看作起点或者终点。`ArrayDeque`是非线程安全的(`not thread-safe`)，当多个线程同时使用的时候，需要程序员手动同步；另外，该容器不允许放入`null`元素。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210617071340569.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
`head`指向首端第一个有效元素，`tail`指向尾端第一个可以插入元素的空位。因为是循环数组，所以`head`不一定总等于0，`tail`也不一定总是比`head`大
```java
public class ArrayDeque<E> extends AbstractCollection<E>
                           implements Deque<E>, Cloneable, Serializable
{
    transient Object[] elements; // non-private to simplify nested class access

    transient int head;
    
    transient int tail;
	//新创建的双端队列的最小容量。 必须是 2 的幂。
	private static final int MIN_INITIAL_CAPACITY = 8;
}
```
## Set
* 无序(存入和取出的顺序不一定相同)
* 不包含重复元素
* 可使用`null`
### HashSet
`HashSet`实现`Set`接口，由哈希表（实际上是一个`HashMap`实例）支持。它不保证`set` 的迭代顺序；特别是它不保证该顺序恒久不变。此类允许使用`null`元素

`HashSet`它是基于`HashMap`实现的，`HashSet`底层使用`HashMap`来保存所有元素，因此`HashSet` 的实现比较简单，相关`HashSet`的操作，基本上都是直接调用底层`HashMap`的相关方法来完成。

```java
public class HashSet<E>  
    extends AbstractSet<E>  
    implements Set<E>, Cloneable, java.io.Serializable  
{  
    static final long serialVersionUID = -5024744406713321676L;  
  
    // 底层使用HashMap来保存HashSet中所有元素。  
    private transient HashMap<E,Object> map;  
      
    // 定义一个虚拟的Object对象作为HashMap的value，将此对象定义为static final。  
    private static final Object PRESENT = new Object();  
  
    /** 
     * 默认的无参构造器，构造一个空的HashSet。 
     *  
     * 实际底层会初始化一个空的HashMap，并使用默认初始容量为16和加载因子0.75。 
     */  
    public HashSet() {  
  		 map = new HashMap<>();
    }  
  
    /** 
     * 构造一个包含指定collection中的元素的新set。 
     * 
     * 实际底层使用默认的加载因子0.75和足以包含指定 
     * collection中所有元素的初始容量来创建一个HashMap。 
     * @param c 其中的元素将存放在此set中的collection。 
     */  
    public HashSet(Collection<? extends E> c) {  
    map = new HashMap<E,Object>(Math.max((int) (c.size()/.75f) + 1, 16));  
    addAll(c);  
    }  
  
    /** 
     * 以指定的initialCapacity和loadFactor构造一个空的HashSet。 
     * 
     * 实际底层以相应的参数构造一个空的HashMap。 
     * @param initialCapacity 初始容量。 
     * @param loadFactor 加载因子。 
     */  
    public HashSet(int initialCapacity, float loadFactor) {  
    map = new HashMap<E,Object>(initialCapacity, loadFactor);  
    }  
  
    /** 
     * 以指定的initialCapacity构造一个空的HashSet。 
     * 
     * 实际底层以相应的参数及加载因子loadFactor为0.75构造一个空的HashMap。 
     * @param initialCapacity 初始容量。 
     */  
    public HashSet(int initialCapacity) {  
    map = new HashMap<E,Object>(initialCapacity);  
    }  
  
    /** 
     * 以指定的initialCapacity和loadFactor构造一个新的空链接哈希集合。 
     * 此构造函数为包访问权限，不对外公开，实际只是是对LinkedHashSet的支持。 
     * 
     * 实际底层会以指定的参数构造一个空LinkedHashMap实例来实现。 
     * @param initialCapacity 初始容量。 
     * @param loadFactor 加载因子。 
     * @param dummy 标记。 
     */  
    HashSet(int initialCapacity, float loadFactor, boolean dummy) {  
    map = new LinkedHashMap<E,Object>(initialCapacity, loadFactor);  
    }  
  
    /** 
     * 返回对此set中元素进行迭代的迭代器。返回元素的顺序并不是特定的。 
     *  
     * 底层实际调用底层HashMap的keySet来返回所有的key。 
     * 可见HashSet中的元素，只是存放在了底层HashMap的key上， 
     * value使用一个static final的Object对象标识。 
     * @return 对此set中元素进行迭代的Iterator。 
     */  
    public Iterator<E> iterator() {  
    return map.keySet().iterator();  
    }  
  
    /** 
     * 返回此set中的元素的数量（set的容量）。 
     * 
     * 底层实际调用HashMap的size()方法返回Entry的数量，就得到该Set中元素的个数。 
     * @return 此set中的元素的数量（set的容量）。 
     */  
    public int size() {  
    return map.size();  
    }  
  
    /** 
     * 如果此set不包含任何元素，则返回true。 
     * 
     * 底层实际调用HashMap的isEmpty()判断该HashSet是否为空。 
     * @return 如果此set不包含任何元素，则返回true。 
     */  
    public boolean isEmpty() {  
    return map.isEmpty();  
    }  
  
    /** 
     * 如果此set包含指定元素，则返回true。 
     * 更确切地讲，当且仅当此set包含一个满足(o==null ? e==null : o.equals(e)) 
     * 的e元素时，返回true。 
     * 
     * 底层实际调用HashMap的containsKey判断是否包含指定key。 
     * @param o 在此set中的存在已得到测试的元素。 
     * @return 如果此set包含指定元素，则返回true。 
     */  
    public boolean contains(Object o) {  
    return map.containsKey(o);  
    }  
  
    /** 
     * 如果此set中尚未包含指定元素，则添加指定元素。 
     * 更确切地讲，如果此 set 没有包含满足(e==null ? e2==null : e.equals(e2)) 
     * 的元素e2，则向此set 添加指定的元素e。 
     * 如果此set已包含该元素，则该调用不更改set并返回false。 
     * 
     * 底层实际将将该元素作为key放入HashMap。 
     * 由于HashMap的put()方法添加key-value对时，当新放入HashMap的Entry中key 
     * 与集合中原有Entry的key相同（hashCode()返回值相等，通过equals比较也返回true）， 
     * 新添加的Entry的value会将覆盖原来Entry的value，但key不会有任何改变， 
     * 因此如果向HashSet中添加一个已经存在的元素时，新添加的集合元素将不会被放入HashMap中， 
     * 原来的元素也不会有任何改变，这也就满足了Set中元素不重复的特性。 
     * @param e 将添加到此set中的元素。 
     * @return 如果此set尚未包含指定元素，则返回true。 
     */  
    public boolean add(E e) {  
    return map.put(e, PRESENT)==null;  
    }  
  
    /** 
     * 如果指定元素存在于此set中，则将其移除。 
     * 更确切地讲，如果此set包含一个满足(o==null ? e==null : o.equals(e))的元素e， 
     * 则将其移除。如果此set已包含该元素，则返回true 
     * （或者：如果此set因调用而发生更改，则返回true）。（一旦调用返回，则此set不再包含该元素）。 
     * 
     * 底层实际调用HashMap的remove方法删除指定Entry。 
     * @param o 如果存在于此set中则需要将其移除的对象。 
     * @return 如果set包含指定元素，则返回true。 
     */  
    public boolean remove(Object o) {  
    return map.remove(o)==PRESENT;  
    }  
  
    /** 
     * 从此set中移除所有元素。此调用返回后，该set将为空。 
     * 
     * 底层实际调用HashMap的clear方法清空Entry中所有元素。 
     */  
    public void clear() {  
    map.clear();  
    }  
  
    /** 
     * 返回此HashSet实例的浅表副本：并没有复制这些元素本身。 
     * 
     * 底层实际调用HashMap的clone()方法，获取HashMap的浅表副本，并设置到HashSet中。 
     */  
    public Object clone() {  
        try {  
            HashSet<E> newSet = (HashSet<E>) super.clone();  
            newSet.map = (HashMap<E, Object>) map.clone();  
            return newSet;  
        } catch (CloneNotSupportedException e) {  
            throw new InternalError();  
        }  
    }  
}  
```
对于`HashSet`中保存的对象，请注意正确重写其`equals`和`hashCode`方法，以保证放入的对象的唯一性。

### LinkedHashSet
`LinkedHashSet`是具有可预知迭代顺序的`Set`接口的哈希表和链接列表实现。此实现与`HashSet`的不同之处在于，后者维护着一个运行于所有条目的双重链接列表。此链接列表定义了迭代顺序，该迭代顺序可为插入顺序或是访问顺序。

注意，此实现不是同步的。如果多个线程同时访问链接的哈希`Set`，而其中至少一个线程修改了该`Set`，则它必须保持外部同步

 `LinkedHashSet`底层使用`LinkedHashMap`来保存所有元素，它继承与`HashSet`，其所有的方法操作上又与`HashSet`相同，因此`LinkedHashSet` 的实现上非常简单，只提供了四个构造方法，并通过传递一个标识参数，调用父类的构造器，底层构造一个`LinkedHashMap`来实现，在相关操作上与父类`HashSet`的操作相同，直接调用父类`HashSet`的方法即可

```java
public class LinkedHashSet<E>
    extends HashSet<E>
    implements Set<E>, Cloneable, java.io.Serializable {

    private static final long serialVersionUID = -2851667679971038690L;

    /** 
     * 构造一个带有指定初始容量和加载因子的新空链接哈希set。 
     * 
     * 底层会调用父类的构造方法，构造一个有指定初始容量和加载因子的LinkedHashMap实例。 
     * @param initialCapacity 初始容量。 
     * @param loadFactor 加载因子。 
     */  
    public LinkedHashSet(int initialCapacity, float loadFactor) {
        super(initialCapacity, loadFactor, true);
    }

    /** 
     * 构造一个带指定初始容量和默认加载因子0.75的新空链接哈希set。 
     * 
     * 底层会调用父类的构造方法，构造一个带指定初始容量和默认加载因子0.75的LinkedHashMap实例。 
     * @param initialCapacity 初始容量。 
     */   
    public LinkedHashSet(int initialCapacity) {
        super(initialCapacity, .75f, true);
    }

    /** 
     * 构造一个带默认初始容量16和加载因子0.75的新空链接哈希set。 
     * 
     * 底层会调用父类的构造方法，构造一个带默认初始容量16和加载因子0.75的LinkedHashMap实例。 
     */  
    public LinkedHashSet() {
        super(16, .75f, true);
    }

 /** 
     * 构造一个与指定collection中的元素相同的新链接哈希set。 
     *  
     * 底层会调用父类的构造方法，构造一个足以包含指定collection 
     * 中所有元素的初始容量和加载因子为0.75的LinkedHashMap实例。 
     * @param c 其中的元素将存放在此set中的collection。 
     */  
    public LinkedHashSet(Collection<? extends E> c) {
        super(Math.max(2*c.size(), 11), .75f, true);
        addAll(c);
    }

    /**
     * Creates a <em><a href="Spliterator.html#binding">late-binding</a></em>
     * and <em>fail-fast</em> {@code Spliterator} over the elements in this set.
     *
     * <p>The {@code Spliterator} reports {@link Spliterator#SIZED},
     * {@link Spliterator#DISTINCT}, and {@code ORDERED}.  Implementations
     * should document the reporting of additional characteristic values.
     *
     * @implNote
     * The implementation creates a
     * <em><a href="Spliterator.html#binding">late-binding</a></em> spliterator
     * from the set's {@code Iterator}.  The spliterator inherits the
     * <em>fail-fast</em> properties of the set's iterator.
     * The created {@code Spliterator} additionally reports
     * {@link Spliterator#SUBSIZED}.
     *
     * @return a {@code Spliterator} over the elements in this set
     * @since 1.8
     */
    @Override
    public Spliterator<E> spliterator() {
        return Spliterators.spliterator(this, Spliterator.DISTINCT | Spliterator.ORDERED);
    }
}
```
在父类`HashSet`中，专为`LinkedHashSet`提供的构造方法如下，该方法为包访问权限，并未对外公开。

```java
/** 
     * 以指定的initialCapacity和loadFactor构造一个新的空链接哈希集合。 
     * 此构造函数为包访问权限，不对外公开，实际只是是对LinkedHashSet的支持。 
     * 
     * 实际底层会以指定的参数构造一个空LinkedHashMap实例来实现。 
     * @param initialCapacity 初始容量。 
     * @param loadFactor 加载因子。 
     * @param dummy 标记。 
     */  
    HashSet(int initialCapacity, float loadFactor, boolean dummy) {  
    map = new LinkedHashMap<E,Object>(initialCapacity, loadFactor);  
    }  
```

### SortedSet
进一步提供其元素的总排序的`Set` 。

元素使用它们的`自然排序`进行排序，或者通过通常在排序集创建时提供的`Comparator`进行排序。 

集合的迭代器将按元素升序遍历集合。 提供了几个额外的操作来利用排序。这个接口是`SortedMap`的集合模拟。）

插入到有序集合中的所有元素都必须实现`Comparable`接口（或被指定的比较器接受）。 此外，所有这些元素必须相互比较： `e1.compareTo(e2) 或 comparer.compare(e1, e2)`不得为排序集中的任何元素`e1`和`e2`抛出`ClassCastException` 。 尝试违反此限制将导致违规方法或构造函数调用抛出`ClassCastException` 。


```java
public interface SortedSet<E> extends Set<E> 
```
### TreeSet
`TreeSet` 是一个有序的集合，它的作用是提供有序的`Set`集合。它继承于`AbstractSet`抽象类，实现了`NavigableSet<E>, Cloneable, java.io.Serializable`接口。

`TreeSet` 继承于`AbstractSet`，所以它是一个`Set`集合，具有`Set`的属性和方法。

`TreeSet` 实现了`NavigableSet`接口，意味着它支持一系列的导航方法。比如查找与指定目标最匹配项。

`TreeSet` 实现了`Cloneable`接口，意味着它能被克隆。

`TreeSet` 实现了`java.io.Serializable`接口，意味着它支持序列化。

`TreeSet`是基于`TreeMap`实现的。`TreeSet`中的元素支持2种排序方式：自然排序 或者 根据创建`TreeSet` 时提供的 `Comparator` 进行排序。这取决于使用的构造方法。

`TreeSet`是非同步的。 它的`iterator` 方法返回的迭代器是`fail-fast`的。

>如果你需要一个访问快速的`Set`，你应该使用`HashSet`；当你需要一个排序的`Set`，你应该使用`TreeSet`；当你需要记录下插入时的顺序时，你应该使用`LinedHashSet`。

## Map

### HashMap
[学不会的HashMap（一）](https://blog.csdn.net/D_A_I_H_A_O/article/details/109201156)

[学不会的HashMap（二）](https://blog.csdn.net/D_A_I_H_A_O/article/details/109221419)

### LinkedHashMap
`LinkedHashMap`实现了`Map`接口，即允许放入`key`为`null`的元素，也允许插入`value`为`null`的元素。从名字上可以看出该容器是`linked list`和`HashMap`的混合体，也就是说它同时满足`HashMap`和`linked list`的某些特性。可将`LinkedHashMap`看作采用`linked list`增强的`HashMap`。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210619213618445.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)

事实上`LinkedHashMap`是`HashMap`的直接子类，二者唯一的区别是`LinkedHashMap`在`HashMap`的基础上，采用双向链表`(doubly-linked list)`的形式将所有`entry`连接起来，这样是为保证元素的迭代顺序跟插入顺序相同。

上图给出了`LinkedHashMap`的结构图，主体部分跟`HashMap`完全一样，多了`header`指向双向链表的头部(是一个哑元)，该双向链表的迭代顺序就是`entry`的插入顺序。 除了可以保迭代历顺序，这种结构还有一个好处 : 迭代`LinkedHashMap`时不需要像`HashMap`那样遍历整个`table`，而只需要直接遍历`header`指向的双向链表即可，也就是说`LinkedHashMap`的迭代时间就只跟`entry`的个数相关，而跟`table`的大小无关。 

有两个参数可以影响`LinkedHashMap`的性能: 初始容量`(inital capacity)`和负载系数`(load factor)`。初始容量指定了初始`table`的大小，负载系数用来指定自动扩容的临界值。当`entry`的数量超过`capacity*load_factor`时，容器将自动扩容并重新哈希。对于插入元素较多的场景，将初始容量设大可以减少重新哈希的次数。 

将对象放入到`LinkedHashMap`或`LinkedHashSet`中时，有两个方法需要特别关心: `hashCode()`和`equals()`。`hashCode()`方法决定了对象会被放到哪个`bucket`里，当多个对象的哈希值冲突时，`equals()`方法决定了这些对象是否是“同一个对象”。所以，如果要将自定义的对象放入到`LinkedHashMap`或`LinkedHashSet`中，需要`@Override` `hashCode()`和`equals()`方法。

```java
  //插取顺序不一致
   Map<String, Object> map = new HashMap<>();
   map.put("a", 1);
   map.put("aaa", 2);
   map.put("aa", 3);

   System.out.println(map);//{aaa=2, aa=3, a=1}

   //插取顺序一致
   Map<String, Object> map2 = new LinkedHashMap<>();
   map2.put("a", 1);
   map2.put("aaa", 2);
   map2.put("aa", 3);

   System.out.println(map2);//{a=1, aaa=2, aa=3}

   //得到一个跟源Map 迭代顺序一样的LinkedHashMap
   LinkedHashMap<String, Object> linkedHashMap = new LinkedHashMap<>(map);

   System.out.println(linkedHashMap);//{aaa=2, aa=3, a=1}
```

出于性能原因，`LinkedHashMap`是非同步的`(not synchronized)`，如果需要在多线程环境使用，需要程序员手动同步；或者通过如下方式将`LinkedHashMap`包装成(`wrapped`)同步的:

```java
Map m = Collections.synchronizedMap(new LinkedHashMap(...));
```

### HashTable
>  `HashMap` 和 `Hashtable` 的区别

* 线程是否安全： `HashMap` 是非线程安全的，`HashTable` 是线程安全的,因为 `HashTable` 内部的方法基本都经过`synchronized` 修饰。（如果你要保证线程安全的话就使用 `ConcurrentHashMap` 吧！）。

* 效率： 因为线程安全的问题，`HashMap` 要比 `HashTable` 效率高一点。另外，`HashTable` 基本被淘汰，不要在代码中使用它；

* 对 `Null key` 和 `Null value` 的支持： `HashMap` 可以存储 `null` 的 `key` 和 `value`，但 `null` 作为键只能有一个，`null` 作为值可以有多个；`HashTable` 不允许有 `null` 键和 `null` 值，否则会抛出 `NullPointerException`。

* 初始容量大小和每次扩充容量大小的不同 ： ① 创建时如果不指定容量初始值，`Hashtable` 默认的初始大小为 `11`，之后每次扩充，容量变为原来的 `2n+1`。`HashMap` 默认的初始化大小为 `16`。之后每次扩充，容量变为原来的 `2` 倍。② 创建时如果给定了容量初始值，那么 `Hashtable` 会直接使用你给定的大小，而 `HashMap` 会将其扩充为 `2 的幂次方大小`（`HashMap` 中的`tableSizeFor()`方法保证）。也就是说 `HashMap` 总是使用 `2 的幂`作为哈希表的大小。

* 底层数据结构： `JDK1.8` 以后的 `HashMap` 在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）（将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树）时，将链表转化为红黑树，以减少搜索时间。`Hashtable` 没有这样的机制。
### SortedMap
`SortedMap` 接口扩展了 `Map` 接口并提供了有序的`Map`实现，`SortedMap` 的排序方式有两种：根据键值的自然顺序排序和指定比较器（`Comparator`）排序。插入有序的 `SortedMap` 的所有元素都必须实现`Comparable`接口

所有通用的有序映射实现类都应该提供四个“标准”构造函数：

* 一个`void`（无参数）构造函数，它根据键的自然顺序创建一个空的有序映射。

* 具有`Comparator`类型的单个参数的构造函数，它创建根据指定的比较器排序的空的有序映射。

* 具有`Map`类型的单个参数的构造函数，它创建一个具有与其参数相同的 `key-value` 映射的新映射，并根据键的自然顺序进行排序。

* 具有`SortedMap`类型的单个参数的构造函数，它创建一个新的有序映射，其具有相同的 `key-value` 映射和与输入有序映射相同的顺序。

### TreeMap
`TreeMap`实现了`SortedMap`接口，也就是说会按照`key`的大小顺序对`Map`中的元素进行排序，`key`大小的评判可以通过其本身的自然顺序`(natural ordering)`，也可以通过构造时传入的比较器`(Comparator)`。 

`TreeMap`底层通过红黑树`(Red-Black tree)`实现，也就意味着`containsKey(), get(), put(), remove()`都有着`log(n)`的时间复杂度

## Java Iterator（迭代器）
`Java Iterator`（迭代器）不是一个集合，它是一种用于访问集合的方法，可用于迭代集合。

`Iterator` 是 `Java` 迭代器最简单的实现，`ListIterator` 是 `Collection API` 中的接口， 它扩展了 `Iterator` 接口。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210615111653370.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70)
迭代器 `it` 的两个基本操作是 `next` 、`hasNext` 和 `remove`。

调用 `it.next()` 会返回迭代器的下一个元素，并且更新迭代器的状态。

调用 `it.hasNext()` 用于检测集合中是否还有元素。

调用 `it.remove()` 将迭代器返回的元素删除。

[深入理解Java集合之迭代器Iterator](https://blog.csdn.net/roguefist/article/details/79526657)

```java
public interface Iterator<E> {
   
    boolean hasNext();
    
    E next();
    
    default void remove() {
        throw new UnsupportedOperationException("remove");
    }

    default void forEachRemaining(Consumer<? super E> action) {
        Objects.requireNonNull(action);
        while (hasNext())
            action.accept(next());
    }
}
```

```java
public interface ListIterator<E> extends Iterator<E> {
   
    boolean hasNext();
    
    E next();
    
    boolean hasPrevious();
    
    E previous();

    int nextIndex();
    
    int previousIndex();
    
    void remove();

    void set(E e);

    void add(E e);
}
```
`Iterator` 与 `ListIterator` 区别

* 相同点

都是迭代器，当需要对集合中元素进行遍历不需要干涉其遍历过程时，这两种迭代器都可以使用。

* 不同点

1.使用范围不同，`Iterator`可以应用于所有的集合，`Set`、`List`和`Map`和这些集合的子类型。而`ListIterator`只能用于`List`及其子类型。

2.`ListIterator`有`add`方法，可以向`List`中添加对象，而`Iterator`不能。

3.`ListIterator`和`Iterator`都有`hasNext()`和`next()`方法，可以实现顺序向后遍历，但是`ListIterator`有`hasPrevious()`和`previous()`方法，可以实现逆向（顺序向前）遍历。`Iterator`不可以。

4.`ListIterator`可以定位当前索引的位置，`nextIndex()`和`previousIndex()`可以实现。`Iterator`没有此功能。

5.都可实现删除操作，但是`ListIterator`可以实现对象的修改，`set()`方法可以实现。`Iterator`仅能遍历，不能修改。

## Comparable Comparator
Comparator 与 Comparable 有什么不同? 
 1. `Comparable` 接口出自`java.lang`包 它有只有一个 `compareTo(Object obj)`方法用于定义对象的`自然顺序`
```java
public interface Comparable<T> {
    public int compareTo(T o);
}
```
 2. `Comparator` 出自 `java.util` 包它有一个`compare(Object obj1, Object obj2)`方法用于定义用户定制的顺序。
## Collections
`Collections` 工具类常用方法:

* 排序 查找

```java
void reverse(List list)//反转
void shuffle(List list)//随机排序
void sort(List list)//按自然排序的升序排序
void sort(List list, Comparator c)//定制排序，由Comparator控制排序逻辑
void swap(List list, int i , int j)//交换两个索引位置的元素
void rotate(List list, int distance)//旋转。当distance为正数时，将list后distance个元素整体移到前面。当distance为负数时，将 list的前distance个元素整体移到后面
```

* 替换操作 

```java
int binarySearch(List list, Object key)//对List进行二分查找，返回索引，注意List必须是有序的
int max(Collection coll)//根据元素的自然顺序，返回最大的元素。 类比int min(Collection coll)
int max(Collection coll, Comparator c)//根据定制排序，返回最大元素，排序规则由Comparatator类控制。类比int min(Collection coll, Comparator c)
void fill(List list, Object obj)//用指定的元素代替指定list中的所有元素
int frequency(Collection c, Object o)//统计元素出现次数
int indexOfSubList(List list, List target)//统计target在list中第一次出现的索引，找不到则返回-1，类比int lastIndexOfSubList(List source, list target)
boolean replaceAll(List list, Object oldVal, Object newVal)//用新元素替换旧元素
```

* 同步控制(不推荐，需要线程安全的集合类型时请考虑使用 JUC 包下的并发集合)

```java
synchronizedCollection(Collection<T>  c) //返回指定 collection 支持的同步（线程安全的）collection。
synchronizedList(List<T> list)//返回指定列表支持的同步（线程安全的）List。
synchronizedMap(Map<K,V> m) //返回由指定映射支持的同步（线程安全的）Map。
synchronizedSet(Set<T> s) //返回指定 set 支持的同步（线程安全的）set。
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210620200925788.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center)



**参考：**

* https://www.pdai.tech

* https://snailclimb.gitee.io/javaguide
