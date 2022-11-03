---
title: 学习ThreadLocal
date: 2022-05-17
categories:
 - Java
tags:
 - ThreadLocal
---


# ThreadLocal的数据结构
`JDK`早期设计：每个`ThreadLocal`都创建一个`Map`, 然后用`Thread`(线程) 作为`Map`的`key`, 要存储的局部变量作为`Map`的`value`, 这样就能达到各个线程的局部变量隔离的效果。

`JDK8` 优化设计：每个`Thread`维护一个`ThreadLocalMap`, 这个`Map`的`key`是`ThreadLocal`实例本身,`value`才是真正要存储的值`Object`。`ThreadLocal`内部维护的是一个类似`Map`的`ThreadLocalMap`数据结构，`key`为当前对象的`Thread`对象，值为泛型的`Object`。使用`ThreadLocal`比较方便的就是当`thread`不变的情况下，可以很方便的设置或者获取对象。

```java
static class ThreadLocalMap {

        /**
         * The entries in this hash map extend WeakReference, using
         * its main ref field as the key (which is always a
         * ThreadLocal object).  Note that null keys (i.e. entry.get()
         * == null) mean that the key is no longer referenced, so the
         * entry can be expunged from table.  Such entries are referred to
         * as "stale entries" in the code that follows.
         */
        static class Entry extends WeakReference<ThreadLocal<?>> {
            /** The value associated with this ThreadLocal. */
            Object value;

            Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }

        /**
         * The initial capacity -- MUST be a power of two.
         */
        private static final int INITIAL_CAPACITY = 16;

        /**
         * The table, resized as necessary.
         * table.length MUST always be a power of two.
         */
        private Entry[] table;

        /**
         * The number of entries in the table.
         */
        private int size = 0;

        /**
         * The next size value at which to resize.
         */
        private int threshold; // Default to 0

        /**
         * Set the resize threshold to maintain at worst a 2/3 load factor.
         */
        private void setThreshold(int len) {
            threshold = len * 2 / 3;
        }

        /**
         * Increment i modulo len.
         */
        private static int nextIndex(int i, int len) {
            return ((i + 1 < len) ? i + 1 : 0);
        }

        /**
         * Decrement i modulo len.
         */
        private static int prevIndex(int i, int len) {
            return ((i - 1 >= 0) ? i - 1 : len - 1);
        }

        /**
         * Construct a new map initially containing (firstKey, firstValue).
         * ThreadLocalMaps are constructed lazily, so we only create
         * one when we have at least one entry to put in it.
         */
        ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
            table = new Entry[INITIAL_CAPACITY];
            int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
            table[i] = new Entry(firstKey, firstValue);
            size = 1;
            setThreshold(INITIAL_CAPACITY);
        }

        /**
         * Construct a new map including all Inheritable ThreadLocals
         * from given parent map. Called only by createInheritedMap.
         *
         * @param parentMap the map associated with parent thread.
         */
        private ThreadLocalMap(ThreadLocalMap parentMap) {
            Entry[] parentTable = parentMap.table;
            int len = parentTable.length;
            setThreshold(len);
            table = new Entry[len];

            for (Entry e : parentTable) {
                if (e != null) {
                    @SuppressWarnings("unchecked")
                    ThreadLocal<Object> key = (ThreadLocal<Object>) e.get();
                    if (key != null) {
                        Object value = key.childValue(e.value);
                        Entry c = new Entry(key, value);
                        int h = key.threadLocalHashCode & (len - 1);
                        while (table[h] != null)
                            h = nextIndex(h, len);
                        table[h] = c;
                        size++;
                    }
                }
            }
        }

        /**
         * Get the entry associated with key.  This method
         * itself handles only the fast path: a direct hit of existing
         * key. It otherwise relays to getEntryAfterMiss.  This is
         * designed to maximize performance for direct hits, in part
         * by making this method readily inlinable.
         *
         * @param  key the thread local object
         * @return the entry associated with key, or null if no such
         */
        private Entry getEntry(ThreadLocal<?> key) {
            int i = key.threadLocalHashCode & (table.length - 1);
            Entry e = table[i];
            if (e != null && e.get() == key)
                return e;
            else
                return getEntryAfterMiss(key, i, e);
        }

        /**
         * Version of getEntry method for use when key is not found in
         * its direct hash slot.
         *
         * @param  key the thread local object
         * @param  i the table index for key's hash code
         * @param  e the entry at table[i]
         * @return the entry associated with key, or null if no such
         */
        private Entry getEntryAfterMiss(ThreadLocal<?> key, int i, Entry e) {
            Entry[] tab = table;
            int len = tab.length;

            while (e != null) {
                ThreadLocal<?> k = e.get();
                if (k == key)
                    return e;
                if (k == null)
                    expungeStaleEntry(i);
                else
                    i = nextIndex(i, len);
                e = tab[i];
            }
            return null;
        }

        /**
         * Set the value associated with key.
         *
         * @param key the thread local object
         * @param value the value to be set
         */
        private void set(ThreadLocal<?> key, Object value) {

            // We don't use a fast path as with get() because it is at
            // least as common to use set() to create new entries as
            // it is to replace existing ones, in which case, a fast
            // path would fail more often than not.

            Entry[] tab = table;
            int len = tab.length;
            int i = key.threadLocalHashCode & (len-1);

            for (Entry e = tab[i];
                 e != null;
                 e = tab[i = nextIndex(i, len)]) {
                ThreadLocal<?> k = e.get();

                if (k == key) {
                    e.value = value;
                    return;
                }

                if (k == null) {
                    replaceStaleEntry(key, value, i);
                    return;
                }
            }

            tab[i] = new Entry(key, value);
            int sz = ++size;
            if (!cleanSomeSlots(i, sz) && sz >= threshold)
                rehash();
        }

        /**
         * Remove the entry for key.
         */
        private void remove(ThreadLocal<?> key) {
            Entry[] tab = table;
            int len = tab.length;
            int i = key.threadLocalHashCode & (len-1);
            for (Entry e = tab[i];
                 e != null;
                 e = tab[i = nextIndex(i, len)]) {
                if (e.get() == key) {
                    e.clear();
                    expungeStaleEntry(i);
                    return;
                }
            }
        }

        /**
         * Replace a stale entry encountered during a set operation
         * with an entry for the specified key.  The value passed in
         * the value parameter is stored in the entry, whether or not
         * an entry already exists for the specified key.
         *
         * As a side effect, this method expunges all stale entries in the
         * "run" containing the stale entry.  (A run is a sequence of entries
         * between two null slots.)
         *
         * @param  key the key
         * @param  value the value to be associated with key
         * @param  staleSlot index of the first stale entry encountered while
         *         searching for key.
         */
        private void replaceStaleEntry(ThreadLocal<?> key, Object value,
                                       int staleSlot) {
            Entry[] tab = table;
            int len = tab.length;
            Entry e;

            // Back up to check for prior stale entry in current run.
            // We clean out whole runs at a time to avoid continual
            // incremental rehashing due to garbage collector freeing
            // up refs in bunches (i.e., whenever the collector runs).
            int slotToExpunge = staleSlot;
            for (int i = prevIndex(staleSlot, len);
                 (e = tab[i]) != null;
                 i = prevIndex(i, len))
                if (e.get() == null)
                    slotToExpunge = i;

            // Find either the key or trailing null slot of run, whichever
            // occurs first
            for (int i = nextIndex(staleSlot, len);
                 (e = tab[i]) != null;
                 i = nextIndex(i, len)) {
                ThreadLocal<?> k = e.get();

                // If we find key, then we need to swap it
                // with the stale entry to maintain hash table order.
                // The newly stale slot, or any other stale slot
                // encountered above it, can then be sent to expungeStaleEntry
                // to remove or rehash all of the other entries in run.
                if (k == key) {
                    e.value = value;

                    tab[i] = tab[staleSlot];
                    tab[staleSlot] = e;

                    // Start expunge at preceding stale entry if it exists
                    if (slotToExpunge == staleSlot)
                        slotToExpunge = i;
                    cleanSomeSlots(expungeStaleEntry(slotToExpunge), len);
                    return;
                }

                // If we didn't find stale entry on backward scan, the
                // first stale entry seen while scanning for key is the
                // first still present in the run.
                if (k == null && slotToExpunge == staleSlot)
                    slotToExpunge = i;
            }

            // If key not found, put new entry in stale slot
            tab[staleSlot].value = null;
            tab[staleSlot] = new Entry(key, value);

            // If there are any other stale entries in run, expunge them
            if (slotToExpunge != staleSlot)
                cleanSomeSlots(expungeStaleEntry(slotToExpunge), len);
        }

        /**
         * Expunge a stale entry by rehashing any possibly colliding entries
         * lying between staleSlot and the next null slot.  This also expunges
         * any other stale entries encountered before the trailing null.  See
         * Knuth, Section 6.4
         *
         * @param staleSlot index of slot known to have null key
         * @return the index of the next null slot after staleSlot
         * (all between staleSlot and this slot will have been checked
         * for expunging).
         */
        private int expungeStaleEntry(int staleSlot) {
            Entry[] tab = table;
            int len = tab.length;

            // expunge entry at staleSlot
            tab[staleSlot].value = null;
            tab[staleSlot] = null;
            size--;

            // Rehash until we encounter null
            Entry e;
            int i;
            for (i = nextIndex(staleSlot, len);
                 (e = tab[i]) != null;
                 i = nextIndex(i, len)) {
                ThreadLocal<?> k = e.get();
                if (k == null) {
                    e.value = null;
                    tab[i] = null;
                    size--;
                } else {
                    int h = k.threadLocalHashCode & (len - 1);
                    if (h != i) {
                        tab[i] = null;

                        // Unlike Knuth 6.4 Algorithm R, we must scan until
                        // null because multiple entries could have been stale.
                        while (tab[h] != null)
                            h = nextIndex(h, len);
                        tab[h] = e;
                    }
                }
            }
            return i;
        }

        /**
         * Heuristically scan some cells looking for stale entries.
         * This is invoked when either a new element is added, or
         * another stale one has been expunged. It performs a
         * logarithmic number of scans, as a balance between no
         * scanning (fast but retains garbage) and a number of scans
         * proportional to number of elements, that would find all
         * garbage but would cause some insertions to take O(n) time.
         *
         * @param i a position known NOT to hold a stale entry. The
         * scan starts at the element after i.
         *
         * @param n scan control: {@code log2(n)} cells are scanned,
         * unless a stale entry is found, in which case
         * {@code log2(table.length)-1} additional cells are scanned.
         * When called from insertions, this parameter is the number
         * of elements, but when from replaceStaleEntry, it is the
         * table length. (Note: all this could be changed to be either
         * more or less aggressive by weighting n instead of just
         * using straight log n. But this version is simple, fast, and
         * seems to work well.)
         *
         * @return true if any stale entries have been removed.
         */
        private boolean cleanSomeSlots(int i, int n) {
            boolean removed = false;
            Entry[] tab = table;
            int len = tab.length;
            do {
                i = nextIndex(i, len);
                Entry e = tab[i];
                if (e != null && e.get() == null) {
                    n = len;
                    removed = true;
                    i = expungeStaleEntry(i);
                }
            } while ( (n >>>= 1) != 0);
            return removed;
        }

        /**
         * Re-pack and/or re-size the table. First scan the entire
         * table removing stale entries. If this doesn't sufficiently
         * shrink the size of the table, double the table size.
         */
        private void rehash() {
            expungeStaleEntries();

            // Use lower threshold for doubling to avoid hysteresis
            if (size >= threshold - threshold / 4)
                resize();
        }

        /**
         * Double the capacity of the table.
         */
        private void resize() {
            Entry[] oldTab = table;
            int oldLen = oldTab.length;
            int newLen = oldLen * 2;
            Entry[] newTab = new Entry[newLen];
            int count = 0;

            for (Entry e : oldTab) {
                if (e != null) {
                    ThreadLocal<?> k = e.get();
                    if (k == null) {
                        e.value = null; // Help the GC
                    } else {
                        int h = k.threadLocalHashCode & (newLen - 1);
                        while (newTab[h] != null)
                            h = nextIndex(h, newLen);
                        newTab[h] = e;
                        count++;
                    }
                }
            }

            setThreshold(newLen);
            size = count;
            table = newTab;
        }

        /**
         * Expunge all stale entries in the table.
         */
        private void expungeStaleEntries() {
            Entry[] tab = table;
            int len = tab.length;
            for (int j = 0; j < len; j++) {
                Entry e = tab[j];
                if (e != null && e.get() == null)
                    expungeStaleEntry(j);
            }
        }
    }
```
`ThreadLocalMap`是`ThreadLocal`的内部类，底层数据结构是一个**数组**，元素是`Entry`类，这个类是`ThreadLocalMap`的内部类，继承了`WeakReference`类

```java
static class Entry extends WeakReference<ThreadLocal<?>> {
    /** The value associated with this ThreadLocal. */
    Object value;

    Entry(ThreadLocal<?> k, Object v) {
        super(k);
        value = v;
    }
}
```
`Entry`中`k`是弱引用，也就是`ThreadLocal`，而`value`仍然是强引用，我们通常所说的内存泄漏原因也就在这个地方。

# ThreadLocal使用场景
* `ThreadLocal` 用作保存每个线程独享的对象，为每个线程都创建一个副本，这样每个线程都可以修改自己所拥有的副本, 而不会影响其他线程的副本，确保了线程安全。

* `ThreadLocal` 用作每个线程内需要独立保存信息，以便供其他方法更方便地获取该信息的场景。每个线程获取到的信息可能都是不一样的，前面执行的方法保存了信息后，后续方法可以通过 `ThreadLocal` 直接获取到，避免了传参，类似于全局变量的概念。

# ThreadLocal的set

```java
public void set(T value) {
    Thread t = Thread.currentThread();
    //获取当前线程所保存的ThreadLocalMap
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        map.set(this, value);
    } else {
	    //如果为空先进行初始化
        createMap(t, value);
    }
}
```

```java
 void createMap(Thread t, T firstValue) {
      t.threadLocals = new ThreadLocalMap(this, firstValue);
  }
```
```java
 ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
     table = new Entry[INITIAL_CAPACITY];
     int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
     table[i] = new Entry(firstKey, firstValue);
     size = 1;
     setThreshold(INITIAL_CAPACITY);
 }
```
当`Entry`的`key`为`null`，但是`value`是不为`null`的，这里造成了内存泄漏问题。

在`Java`中引用分为4种`强软弱虚`，强引用就是我们日常工作时用到的引用，比如`User a = new User()`，a就是强引用，软引用使用`SoftReference`包装，弱引用使用`WeakReference`包装，虚引用使用`PhantomReference`包装。

虚引用一般是用来链接堆外对象，通过虚引用实现对堆外内存的回收。弱引用每次发生`GC`的时候会被回收，而软引用只有在内存不足的时候才会被回收。

`ThreadLocalMap`中`Entry`的`key`就是通过弱引用修饰的，所以每次发生`GC`时会被回收掉，导致`key`变成`null`，而`value`是强引用，不会被回收，但是此时的`value`已经没有了任何意义，只是白白占着内存，所以也就导致了这部分内存不能被正常使用，造成内存泄漏。

# ThreadLocal的get
```java
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    //获取当前线程的ThreadLocalMap变量，如果为null，调用setInitialValue初始化
    if (map != null) {
    //如果ThreadLocalMap变量不为null，调用getEntry获取Entry元素
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```
一直没找到则调用`setInitialValue`方法，将当前`ThreadLocal`实例作为`key`，`null`作为`value`，构造一个`Entry`插入到数组中

```java
private Entry getEntry(ThreadLocal<?> key) {
    int i = key.threadLocalHashCode & (table.length - 1);
    Entry e = table[i];
    //如果计算出来的i索引位满足就返回，否则调用getEntryAfterMiss方法
    if (e != null && e.get() == key)
        return e;
    else
        return getEntryAfterMiss(key, i, e);
}
```

```java
private Entry getEntryAfterMiss(ThreadLocal<?> key, int i, Entry e) {
    Entry[] tab = table;
    int len = tab.length;
	//e为null说明已经发生GC被回收掉了，返回null。
	//否则，从i开始往后遍历，满足条件就返回，
	//为null就清理，一直到e==null或者找到符合条件的为止
    while (e != null) {
        ThreadLocal<?> k = e.get();
        if (k == key)
            return e;
        if (k == null)
            expungeStaleEntry(i);
        else
            i = nextIndex(i, len);
        e = tab[i];
    }
    return null;
}
```

# ThreadLocal的reove

```java
public void remove() {
     ThreadLocalMap m = getMap(Thread.currentThread());
     if (m != null) {
         m.remove(this);
     }
 }
```

```java
//计算出当前ThreadLocal实例所在的i索引位，判断此位置的key是否是自己
//是，就删除，然后调用expungeStaleEntry方法看看能不能清理掉一些元素，然后返回。
private void remove(ThreadLocal<?> key) {
     Entry[] tab = table;
     int len = tab.length;
     int i = key.threadLocalHashCode & (len-1);
     for (Entry e = tab[i];
          e != null;
          e = tab[i = nextIndex(i, len)]) {
         if (e.get() == key) {
             e.clear();
             expungeStaleEntry(i);
             return;
         }
     }
 }
```

```java
private int expungeStaleEntry(int staleSlot) {
       Entry[] tab = table;
       int len = tab.length;

       // expunge entry at staleSlot
       tab[staleSlot].value = null;
       tab[staleSlot] = null;
       size--;

       // Rehash until we encounter null
       Entry e;
       int i;
       for (i = nextIndex(staleSlot, len);
            (e = tab[i]) != null;
            i = nextIndex(i, len)) {
           ThreadLocal<?> k = e.get();
           if (k == null) {
               e.value = null;
               tab[i] = null;
               size--;
           } else {
               int h = k.threadLocalHashCode & (len - 1);
               if (h != i) {
                   tab[i] = null;

                   // Unlike Knuth 6.4 Algorithm R, we must scan until
                   // null because multiple entries could have been stale.
                   while (tab[h] != null)
                       h = nextIndex(h, len);
                   tab[h] = e;
               }
           }
       }
       return i;
   }

```
# ThreadLocal的内存泄漏

* 内存溢出: `Memory overflow` 没有足够的内存提供申请者使用.
* 内存泄漏: `Memory Leak` 程序中已经动态分配的堆内存由于某种原因, 程序未释放或者无法释放, 造成系统内部的浪费, 导致程序运行速度减缓甚至系统崩溃等严重结果. 内存泄漏的堆积终将导致内存溢出

内存泄漏的发生跟 `ThreadLocalIMap` 中的 `key` 是否使用弱引用是没有关系的。在内存泄漏的情况中．都有两个前提：
1 、没有手动侧除这个 `Entry`：只要在使用完下 `ThreadLocal` ，调用其 `remove` 方法翻除对应的 `Entry` ，就能避免内存泄漏。

2 、 `CurrentThread` 依然运行：由于`ThreodLocalMap` 是 `Threod` 的一个属性，被当前线程所引用所以它的生命周期跟 `Thread` 一样长。那么在使用完 `ThreadLocal` 的使用，如果当前`Thread` 也随之执行结束， `ThreadLocalMap` 自然也会被 `gc` 回收，从根源上避免了内存泄漏。如果`ThreadLocal`对象设`null`了，开始发生“内存泄露”，然后使用线程池，这个线程结束，线程放回线程池中不销毁，这个线程一直不被使用，或者分配使用了又不再调用`get,set`方法，那么这个期间就会发生真正的内存泄露。

避免`ThreadLocal`的内存泄漏的最好办法是不用的`ThreadLocal`及时`remove()`掉
