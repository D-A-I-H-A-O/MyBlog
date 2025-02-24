(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{443:function(_,e,v){"use strict";v.r(e);var o=v(0),t=Object(o.a)({},(function(){var _=this,e=_._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[e("h1",{attrs:{id:"存储引擎"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#存储引擎"}},[_._v("#")]),_._v(" 存储引擎")]),_._v(" "),e("p",[e("code",[_._v("MySQL")]),_._v("区别于其他数据库的一个最重要的特点是插件式存储引擎。存储引擎是基于表的，而不是数据库，数据库引擎的作用是对表中数据的读取和写入工作。")]),_._v(" "),e("p",[e("code",[_._v("Mysql")]),_._v("数据库引擎有很多种，这里只记"),e("code",[_._v("MyISAM")]),_._v("和"),e("code",[_._v("InnoDB")]),_._v("两种。")]),_._v(" "),e("h2",{attrs:{id:"innodb"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#innodb"}},[_._v("#")]),_._v(" InnoDB")]),_._v(" "),e("p",[_._v("不同的存储引擎一般是为实现不同的特性而开发的，真实数据在不同存储引擎中存放的格式一般是不同的，甚至有的存储引擎比如"),e("code",[_._v("Memory")]),_._v("都不用磁盘来存储数据，也就是说关闭服务器后，表中的数据就消失了。")]),_._v(" "),e("p",[e("code",[_._v("InnoDB")]),_._v("是一个将表中的数据存储到磁盘上的存储引擎，所以关机重启后数据还是存在。而真正处理数据的过程是发生在内存中的，所以需要把磁盘中的数据加载到内存中，如果是写入或者修改的话，还需要把内存中的内容刷新到磁盘上。读写磁盘的速度非常慢，如果一条条的把数据从磁盘上读出来会非常慢。"),e("code",[_._v("InnoDB")]),_._v("采用的是："),e("code",[_._v("将数据划分为若干页，以页作为磁盘和内存之间交互的基本单位，InnoDB中大小一般为16KB")]),_._v("。")]),_._v(" "),e("p",[e("a",{attrs:{href:"https://mp.weixin.qq.com/s/vtIHUlR92GQVG6UW74PEqQ",target:"_blank",rel:"noopener noreferrer"}},[_._v("InnoDB记录存储结构"),e("OutboundLink")],1),_._v(" "),e("a",{attrs:{href:"https://mp.weixin.qq.com/s?__biz=MzIxNTQ3NDMzMw==&mid=2247483678&idx=1&sn=913780d42e7a81fd3f9b747da4fba8ec&chksm=979688eca0e101fa0913c3d2e6107dfa3a6c151a075c8d68ab3f44c7c364d9510f9e1179d94d&scene=21#wechat_redirect",target:"_blank",rel:"noopener noreferrer"}},[_._v("InnoDB数据页结构"),e("OutboundLink")],1),_._v(" "),e("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/158978012",target:"_blank",rel:"noopener noreferrer"}},[_._v("深入理解InnoDB -- 架构篇"),e("OutboundLink")],1)]),_._v(" "),e("h3",{attrs:{id:"innodb和myisam下数据文件"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#innodb和myisam下数据文件"}},[_._v("#")]),_._v(" InnoDB和MyISAM下数据文件")]),_._v(" "),e("p",[_._v("1、如果表采用 "),e("code",[_._v("MyISAM")]),_._v("，"),e("code",[_._v("data")]),_._v("数据库名字路径下会产生3个文件：")]),_._v(" "),e("p",[e("code",[_._v(".frm")]),_._v("：描述表结构文件，字段长度等")]),_._v(" "),e("p",[e("code",[_._v(".MYD(MYData)")]),_._v("：数据信息文件，存储数据信息(如果采用独立表存储模式)")]),_._v(" "),e("p",[e("code",[_._v(".MYI(MYIndex)")]),_._v("：索引信息文件。")]),_._v(" "),e("p",[_._v("2、如果表采用 "),e("code",[_._v("InnoDB")]),_._v("，"),e("code",[_._v("data")]),_._v("数据库名字路径下会产生1个或者2个文件：")]),_._v(" "),e("p",[e("code",[_._v(".frm")]),_._v(" ：描述表结构文件，字段长度等")]),_._v(" "),e("p",[e("code",[_._v(".ibd")]),_._v("：存储数据信息和索引信息")]),_._v(" "),e("p",[e("a",{attrs:{href:"https://www.cnblogs.com/bhlsheji/p/5332910.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("MySQL中的外键是什么、有什么作用"),e("OutboundLink")],1)]),_._v(" "),e("p",[e("a",{attrs:{href:"https://blog.csdn.net/n88Lpo/article/details/95118434",target:"_blank",rel:"noopener noreferrer"}},[_._v("MySQL 8.0中没FRM文件了还怎么恢复表的DDL信息"),e("OutboundLink")],1)]),_._v(" "),e("h2",{attrs:{id:"myisam和innodb区别"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#myisam和innodb区别"}},[_._v("#")]),_._v(" MyISAM和InnoDB区别")]),_._v(" "),e("ul",[e("li",[e("code",[_._v("InnoDB")]),_._v("支持事务，"),e("code",[_._v("MyISAM")]),_._v("不支持事务。这是"),e("code",[_._v("MySQL")]),_._v("将默认存储引擎从"),e("code",[_._v("MyISAM")]),_._v("变成"),e("code",[_._v("InnoDB")]),_._v("的重要原因之一。")]),_._v(" "),e("li",[e("code",[_._v("InnoDB")]),_._v("支持外键，而"),e("code",[_._v("MyISAM")]),_._v("不支持，对一个包含外键的"),e("code",[_._v("InnoDB")]),_._v("表转为"),e("code",[_._v("MyISAM")]),_._v("会失败。")]),_._v(" "),e("li",[e("code",[_._v("InnoDB")]),_._v("是聚集索引，"),e("code",[_._v("MyISAM")]),_._v("是非聚集索引。聚集索引的文件存放在主键索引的叶子节点上，因此"),e("code",[_._v("InnoDB")]),_._v("必须要有主键，而"),e("code",[_._v("MyISAM")]),_._v("是非聚集索引，数据文件是分离的，索引保存的是数据文件的指针。主键索引和辅助索引是独立的。(见下面"),e("code",[_._v("MyISAM和InnoDB")]),_._v("索引实现)")]),_._v(" "),e("li",[e("code",[_._v("InnoDB")]),_._v("不保存表的具体行数，执行"),e("code",[_._v("select count(*) from table")]),_._v("时需要全表扫描，而"),e("code",[_._v("MyISAM")]),_._v("用一个变量保存了整个表的行数，执行上述语句只需要读出该变量即可，速度很快。")]),_._v(" "),e("li",[e("code",[_._v("InnoDB")]),_._v("最小的锁粒度是行锁，"),e("code",[_._v("MyISAM")]),_._v("最小的锁粒度是表锁，一个更新语句锁住整张表，导致其他查询和更新会被阻塞，因此并发访问受限。")])]),_._v(" "),e("p",[e("a",{attrs:{href:"https://www.cnblogs.com/jianmingyuan/p/6741798.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("mysql--外键（froeign key）-----------MySQL外键使用详解"),e("OutboundLink")],1)]),_._v(" "),e("p",[e("a",{attrs:{href:"https://www.cnblogs.com/0201zcr/p/5296843.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("mysql 数据库引擎"),e("OutboundLink")],1)]),_._v(" "),e("h1",{attrs:{id:"索引"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#索引"}},[_._v("#")]),_._v(" 索引")]),_._v(" "),e("p",[e("strong",[_._v("索引：帮助查找数据的"),e("code",[_._v("排好序")]),_._v("的"),e("code",[_._v("数据结构")]),_._v("。")])]),_._v(" "),e("p",[_._v("在数据之外，数据库系统还维护着满足特定查找算法的数据结构，这些数据结构以某种方式引用（指向）数据，这样就可以在这些数据结构上实现高级查找算法。这种数据结构，就是索引。")]),_._v(" "),e("p",[e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719210445402.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"图1"}}),_._v("\n图展示了一种可能的索引方式。左边是数据表，一共有两列七条记录，最左边的是数据记录的物理地址（注意逻辑上相邻的记录在磁盘上也并不是一定物理相邻的）。为了加快"),e("code",[_._v("Col2")]),_._v("的查找，可以维护一个右边所示的二叉查找树，每个节点分别包含索引键值和一个指向对应数据记录物理地址的指针，这样就可以运用二叉查找在"),e("code",[_._v("O(log2n)")]),_._v("的复杂度内获取到相应数据。")]),_._v(" "),e("h2",{attrs:{id:"索引数据结构"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#索引数据结构"}},[_._v("#")]),_._v(" 索引数据结构")]),_._v(" "),e("p",[_._v("二叉查找树"),e("code",[_._v("（inary Search Tree）")]),_._v("，平衡二叉查找树"),e("code",[_._v("（Balanced Binary Search Tree）")]),_._v("，红黑树"),e("code",[_._v("(Red-Black Tree )")]),_._v("，"),e("code",[_._v("B-tree")]),_._v("和"),e("code",[_._v("B+-tree")]),_._v("。前三者是典型的二叉查找树结构，其查找的时间复杂度"),e("code",[_._v("O(log2N)")]),_._v("与"),e("code",[_._v("树的深度")]),_._v("相关，那么降低树的深度自然会提高查找效率。")]),_._v(" "),e("p",[e("a",{attrs:{href:"https://www.cs.usfca.edu/~galles/visualization/Algorithms.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("Data Structure Visualizations"),e("OutboundLink")],1)]),_._v(" "),e("h3",{attrs:{id:"二叉查找树"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#二叉查找树"}},[_._v("#")]),_._v(" 二叉查找树")]),_._v(" "),e("p",[_._v("左子树键值总是小于根的键值，右子树键值总是大于根的键值。因此中序遍历可以得到键值的排序输出。\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719072945474.png",alt:"在这里插入图片描述"}})]),_._v(" "),e("p",[_._v("但是二叉查找树可以以任意的顺序插入，例如当数据2 3 5 6 7 8以有序的顺序插入时候，可以看到树已经出现了极度不平衡，查找速度一定和线性查找一样了。所以"),e("code",[_._v("MySQL")]),_._v("索引实现不是这。\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719073206474.png",alt:"在这里插入图片描述"}})]),_._v(" "),e("h2",{attrs:{id:"平衡二叉树"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#平衡二叉树"}},[_._v("#")]),_._v(" 平衡二叉树")]),_._v(" "),e("p",[_._v("为了提高二叉树的搜索的效率,减少树的平均搜索长度，提出了"),e("code",[_._v("AVL")]),_._v("树，它的左子树和右子树的深度之差(平衡因子)的绝对值不超过1（也就是高度的平衡），且它的左子树和右子树都是一颗平衡二叉树。为了维持高度的平衡，则频繁的插入和删除，会引起频繁的"),e("code",[_._v("reblance")]),_._v("（旋转以维持平衡），导致效率可能会下降。\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719073613207.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}})]),_._v(" "),e("h2",{attrs:{id:"红黑树"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#红黑树"}},[_._v("#")]),_._v(" 红黑树")]),_._v(" "),e("p",[_._v("红黑树，一种二叉查找树，但在每个结点上增加一个存储位表示结点的颜色，可以是"),e("code",[_._v("Red")]),_._v("或"),e("code",[_._v("Black")]),_._v("。通过对任何一条从根到叶子的路径上各个结点着色方式的限制，红黑树牺牲了绝对平衡，换取了少旋转。红黑树确保没有一条路径会比其他路径长出俩倍，且对于任意结点而言，其到叶结点树尾端"),e("code",[_._v("NIL")]),_._v("指针的每条路径都包含相同数目的黑结点，因而是接近平衡的。")]),_._v(" "),e("p",[_._v("红黑树不是高度平衡的，算是一种折中，插入最多两次旋转，删除最多三次旋转。很好的解决了平衡二叉树旋转次数出现很多的可能。")]),_._v(" "),e("p",[_._v("红黑树具有5个性质：")]),_._v(" "),e("ul",[e("li",[_._v("每个结点要么是红的要么是黑的。")]),_._v(" "),e("li",[_._v("根结点是黑的。")]),_._v(" "),e("li",[_._v("每个叶结点（叶结点即指树尾端NIL指针或NULL结点）都是黑的。")]),_._v(" "),e("li",[_._v("如果一个结点是红的，那么它的两个儿子都是黑的。")]),_._v(" "),e("li",[_._v("对于任意结点而言，其到叶结点树尾端NIL指针的每条路径都包含相同数目的黑结点。")])]),_._v(" "),e("p",[_._v("正是红黑树的这5条性质，使一棵n个结点的红黑树始终保持了"),e("code",[_._v("log n")]),_._v("的高度，从而也就解释了“红黑树的查找、插入、删除的时间复杂度最坏为"),e("code",[_._v("O(log n)")]),_._v("。")]),_._v(" "),e("p",[e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719073727713.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}}),_._v(" "),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719074221296.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}})]),_._v(" "),e("h2",{attrs:{id:"b树-b-tree"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#b树-b-tree"}},[_._v("#")]),_._v(" B树(B-tree)")]),_._v(" "),e("p",[_._v("B树又叫做多叉平衡查找树。前面的平衡二叉树分支最多有2个，但是这里的B树分支可以有n个。分支多的好处就会形成一个矮胖矮胖的平衡二叉树。每个节点里面含有许多个键-值对。这就是B树。 B树中的每个结点根据实际情况可以包含大量的关键字信息和分支(当然是不能超过磁盘块的大小，根据磁盘驱动(disk drives)的不同，一般块的大小在1k~4k左右)；这样树的深度降低了，这就意味着查找一个元素只要很少结点从外存磁盘中读入内存，很快访问到要查找的数据。\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719075133803.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}})]),_._v(" "),e("h2",{attrs:{id:"b-树"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#b-树"}},[_._v("#")]),_._v(" B+树")]),_._v(" "),e("p",[_._v("B树的变体。"),e("code",[_._v("B+-tree")]),_._v("的内部结点并没有指向关键字具体信息的指针，只有在叶子节点才会有每个关键字具体信息，且每个节点内部含有键值的冗余。因此其内部结点相对B树更小。如果把所有同一内部结点的关键字存放在同一盘块中，那么盘块所能容纳的关键字数量也越多。一次性读入内存中的需要查找的关键字也就越多。相对来说"),e("code",[_._v("IO")]),_._v("读写次数也就降低了。")]),_._v(" "),e("p",[e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719075601787.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}}),_._v("\nB+树特点：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("所有的叶子结点中包含了全部元素的信息，及指向含这些元素记录的指针，且"),e("code",[_._v("叶子结点本身依关键字的大小自小而大顺序链接")]),_._v("。")])]),_._v(" "),e("li",[e("p",[_._v("所有的中间节点元素都同时存在于子节点，在子节点元素中是最大（或最小）元素。")])])]),_._v(" "),e("p",[_._v("B+树的优点：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("单一节点存储更多的元素（因为不含有对应的值，仅仅含有键），使得查询的"),e("code",[_._v("IO")]),_._v("次数更少。")])]),_._v(" "),e("li",[e("p",[_._v("所有查询都要从根节点查找到叶子节点，查询性能稳定，相对于B树更加稳定，因为B+树只有叶子节点存储了对应的值信息。")])]),_._v(" "),e("li",[e("p",[_._v("所有叶子节点形成有序双向链表，对于"),e("code",[_._v("SQL")]),_._v("的"),e("code",[_._v("范围查询以及排序查询")]),_._v("都很方便。")])]),_._v(" "),e("li",[e("p",[_._v("B/B+树的共同优点的每个节点有更多的孩子，插入不需要改变树的高度，从而减少重新平衡的次数，非常适合做数据库索引这种需要持久化在磁盘，同时需要大量查询和插入的应用。树中节点存储这指向页的信息，可以快速定位到磁盘对应的页上面")])])]),_._v(" "),e("h2",{attrs:{id:"myisam索引实现"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#myisam索引实现"}},[_._v("#")]),_._v(" MyISAM索引实现")]),_._v(" "),e("p",[e("code",[_._v("MyISAM")]),_._v("引擎使用"),e("code",[_._v("B+Tree")]),_._v("作为索引结构，叶节点的"),e("code",[_._v("data")]),_._v("域存放的是数据记录的地址。下图是"),e("code",[_._v("MyISAM")]),_._v("索引的原理图：\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719210913300.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"图8"}}),_._v("\n这里设表一共有三列，假设我们以"),e("code",[_._v("Col1")]),_._v("为主键，则上图是一个"),e("code",[_._v("MyISAM")]),_._v("表的主索引"),e("code",[_._v("（Primary key）")]),_._v("示意。可以看出"),e("code",[_._v("MyISAM")]),_._v("的索引文件仅仅保存数据记录的地址。在"),e("code",[_._v("MyISAM")]),_._v("中，主索引和辅助索引"),e("code",[_._v("（Secondary key）")]),_._v("在结构上没有任何区别，只是主索引要求"),e("code",[_._v("key")]),_._v("是唯一的，而辅助索引的"),e("code",[_._v("key")]),_._v("可以重复。如果我们在"),e("code",[_._v("Col2")]),_._v("上建立一个辅助索引，则此索引的结构如下图所示：")]),_._v(" "),e("p",[e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719211145350.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}})]),_._v(" "),e("p",[_._v("同样也是一棵"),e("code",[_._v("B+Tree")]),_._v("，"),e("code",[_._v("data")]),_._v("域保存数据记录的地址。因此，"),e("code",[_._v("MyISAM")]),_._v("中索引检索的算法为首先按照"),e("code",[_._v("B+Tree")]),_._v("搜索算法搜索索引，如果指定的"),e("code",[_._v("Key")]),_._v("存在，则取出其"),e("code",[_._v("data")]),_._v("域的值，然后以"),e("code",[_._v("data")]),_._v("域的值为地址，读取相应数据记录。")]),_._v(" "),e("p",[e("code",[_._v("MyISAM")]),_._v("的索引方式也叫做“非聚集”的，之所以这么称呼是为了与"),e("code",[_._v("InnoDB")]),_._v("的聚集索引区分。")]),_._v(" "),e("h2",{attrs:{id:"innodb索引实现"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#innodb索引实现"}},[_._v("#")]),_._v(" InnoDB索引实现")]),_._v(" "),e("p",[_._v("虽然"),e("code",[_._v("InnoDB")]),_._v("也使用"),e("code",[_._v("B+Tree")]),_._v("作为索引结构，但具体实现方式却与"),e("code",[_._v("MyISAM")]),_._v("截然不同。")]),_._v(" "),e("p",[_._v("第一个重大区别是"),e("code",[_._v("InnoDB")]),_._v("的数据文件本身就是索引文件。从上文知道，"),e("code",[_._v("MyISAM")]),_._v("索引文件和数据文件是分离的，索引文件仅保存数据记录的地址。而在"),e("code",[_._v("InnoDB")]),_._v("中，表数据文件本身就是按"),e("code",[_._v("B+Tree")]),_._v("组织的一个索引结构，这棵树的叶节点"),e("code",[_._v("data")]),_._v("域保存了完整的数据记录。这个索引的"),e("code",[_._v("key")]),_._v("是数据表的主键，因此"),e("code",[_._v("InnoDB")]),_._v("表数据文件本身就是主索引。")]),_._v(" "),e("p",[e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719211453749.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}})]),_._v(" "),e("p",[_._v("上图是"),e("code",[_._v("InnoDB")]),_._v("主索引（同时也是数据文件）的示意图，可以看到叶节点包含了完整的数据记录。这种索引叫做"),e("code",[_._v("聚集索引")]),_._v("。因为"),e("code",[_._v("InnoDB")]),_._v("的数据文件本身要按主键聚集，所以"),e("code",[_._v("InnoDB")]),_._v("要求表必须有主键（"),e("code",[_._v("MyISAM")]),_._v("可以没有），如果没有显式指定，则"),e("code",[_._v("MySQL")]),_._v("系统会自动选择一个可以唯一标识数据记录的列作为主键，如果不存在这种列，则"),e("code",[_._v("MySQ")]),_._v("L自动为"),e("code",[_._v("InnoDB")]),_._v("表生成一个隐含字段作为主键，这个字段长度为6个字节，类型为长整形。")]),_._v(" "),e("p",[_._v("第二个与"),e("code",[_._v("MyISAM")]),_._v("索引的不同是"),e("code",[_._v("InnoDB")]),_._v("的辅助索引"),e("code",[_._v("data")]),_._v("域存储相应记录主键的值而不是地址。换句话说，"),e("code",[_._v("InnoDB")]),_._v("的所有辅助索引都引用主键作为"),e("code",[_._v("data")]),_._v("域。例如，下图为定义在"),e("code",[_._v("Col3")]),_._v("上的一个辅助索引：\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719211758573.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}}),_._v("\n这里以英文字符的"),e("code",[_._v("ASCII")]),_._v("码作为比较准则。聚集索引这种实现方式使得按主键的搜索十分高效，但是辅助索引搜索需要检索两遍索引：首先检索辅助索引获得主键，然后用主键到主索引中检索获得记录。")]),_._v(" "),e("p",[_._v("了解不同存储引擎的索引实现方式对于正确使用和优化索引都非常有帮助，例如知道了"),e("code",[_._v("InnoDB")]),_._v("的索引实现后，就很容易明白为什么不建议使用过长的字段作为主键，因为所有辅助索引都引用主索引，过长的主索引会令辅助索引变得过大。再例如，用非单调的字段作为主键在"),e("code",[_._v("InnoDB")]),_._v("中不是个好主意，因为"),e("code",[_._v("InnoDB")]),_._v("数据文件本身是一颗"),e("code",[_._v("B+Tree")]),_._v("，非单调的主键会造成在插入新记录时数据文件为了维持"),e("code",[_._v("B+Tree")]),_._v("的特性而频繁的分裂调整，十分低效，而使用自增字段作为主键则是一个很好的选择。")]),_._v(" "),e("p",[e("a",{attrs:{href:"https://www.cnblogs.com/xiaoxi/p/6894610.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("B+Tree原理及mysql的索引分析"),e("OutboundLink")],1)]),_._v(" "),e("h2",{attrs:{id:"innodb的主键选择与插入优化"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#innodb的主键选择与插入优化"}},[_._v("#")]),_._v(" InnoDB的主键选择与插入优化")]),_._v(" "),e("p",[_._v("在使用"),e("code",[_._v("InnoDB")]),_._v("存储引擎时，如果没有特别的需要，请永远使用一个与业务无关的自增字段作为主键。")]),_._v(" "),e("p",[_._v("经常看到有帖子或博客讨论主键选择问题，有人建议使用业务无关的自增主键，有人觉得没有必要，完全可以使用如学号或身份证号这种唯一字段作为主键。不论支持哪种论点，大多数论据都是业务层面的。如果从数据库索引优化角度看，使用"),e("code",[_._v("InnoDB")]),_._v("引擎而不使用自增主键绝对是一个糟糕的主意。")]),_._v(" "),e("p",[_._v("上文讨论过"),e("code",[_._v("InnoDB")]),_._v("的索引实现，"),e("code",[_._v("InnoDB")]),_._v("使用聚集索引，数据记录本身被存于主索引（"),e("code",[_._v("B+Tree")]),_._v("）的叶子节点上。这就要求同一个叶子节点内（大小为一个内存页或磁盘页）的各条数据记录按主键顺序存放，因此每当有一条新的记录插入时，"),e("code",[_._v("MySQL")]),_._v("会根据其主键将其插入适当的节点和位置，如果页面达到装载因子"),e("code",[_._v("（InnoDB默认为15/16）")]),_._v("，则开辟一个新的页（节点）。")]),_._v(" "),e("p",[_._v("如果表使用自增主键，那么每次插入新的记录，记录就会顺序添加到当前索引节点的后续位置，当一页写满，就会自动开辟一个新的页。如下图所示：")]),_._v(" "),e("p",[e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719213129200.png",alt:"在这里插入图片描述"}})]),_._v(" "),e("p",[_._v("这样就会形成一个紧凑的索引结构，近似顺序填满。由于每次插入时也不需要移动已有数据，因此效率很高，也不会增加很多开销在维护索引上。")]),_._v(" "),e("p",[_._v("如果使用非自增主键（如果身份证号或学号等），由于每次插入主键的值近似于随机，因此每次新纪录都要被插到现有索引页得中间某个位置：")]),_._v(" "),e("p",[e("img",{attrs:{src:"https://img-blog.csdnimg.cn/20210719213156890.png",alt:"在这里插入图片描述"}}),_._v("\n此时"),e("code",[_._v("MySQL")]),_._v("不得不为了将新记录插到合适位置而移动数据，甚至目标页面可能已经被回写到磁盘上而从缓存中清掉，此时又要从磁盘上读回来，这增加了很多开销，同时频繁的移动、分页操作造成了大量的碎片，得到了不够紧凑的索引结构，后续不得不通过"),e("code",[_._v("OPTIMIZE TABLE")]),_._v("来重建表并优化填充页面。")]),_._v(" "),e("p",[_._v("因此，只要可以，请尽量在"),e("code",[_._v("InnoDB")]),_._v("上采用自增字段做主键。")]),_._v(" "),e("p",[_._v("那么问题又来了，如果自增用完了怎么办。")]),_._v(" "),e("p",[e("a",{attrs:{href:"http://blog.codinglabs.org/articles/theory-of-mysql-index.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("MySQL索引背后的数据结构及算法原理"),e("OutboundLink")],1)]),_._v(" "),e("h2",{attrs:{id:"数据库自增主键用完了怎么办"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#数据库自增主键用完了怎么办"}},[_._v("#")]),_._v(" 数据库自增主键用完了怎么办")]),_._v(" "),e("p",[e("a",{attrs:{href:"https://www.cnblogs.com/kongxiaoshuang/p/10714760.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("数据库自增主键用完了怎么办"),e("OutboundLink")],1)]),_._v(" "),e("h2",{attrs:{id:"常用索引种类"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#常用索引种类"}},[_._v("#")]),_._v(" 常用索引种类")]),_._v(" "),e("ol",[e("li",[_._v("普通索引: 即针对数据库表创建索引")]),_._v(" "),e("li",[_._v("唯一索引: 与普通索引类似，不同的就是：MySQL 数据库索引列的值\n必须唯一，但允许有空值")]),_._v(" "),e("li",[_._v("主键索引: 它是一种特殊的唯一索引，不允许有空值。一般是在建表的\n时候同时创建主键索引")]),_._v(" "),e("li",[_._v("组合索引: 为了进一步榨取MySQL 的效率，就要考虑建立组合索引。\n即将数据库表中的多个字段联合起来作为一个组合索引。")])]),_._v(" "),e("h1",{attrs:{id:"日志"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#日志"}},[_._v("#")]),_._v(" 日志")]),_._v(" "),e("p",[e("code",[_._v("MySQL")]),_._v("可以实现主从复制、实现持久化、实现回滚，其关键在于"),e("code",[_._v("MySQL")]),_._v("里的三种日志。分别是："),e("code",[_._v("binlog")]),_._v("、"),e("code",[_._v("redo log")]),_._v("、"),e("code",[_._v("undo log")])]),_._v(" "),e("p",[e("img",{attrs:{src:"https://img-blog.csdnimg.cn/2a450e8be97d4e35a34536107d18f5d9.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70#pic_center",alt:"在这里插入图片描述"}})]),_._v(" "),e("h2",{attrs:{id:"binlog"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#binlog"}},[_._v("#")]),_._v(" binlog")]),_._v(" "),e("p",[e("code",[_._v("binlog")]),_._v("是用于记录数据库表结构和表数据变更的二进制日志。比如"),e("code",[_._v("insert")]),_._v("、"),e("code",[_._v("update")]),_._v("、"),e("code",[_._v("delete")]),_._v("、"),e("code",[_._v("create")]),_._v("、"),e("code",[_._v("truncate")]),_._v("等操作，不会记录"),e("code",[_._v("select")]),_._v("、"),e("code",[_._v("show")]),_._v("操作，因为没有对数据本身发生变更。")]),_._v(" "),e("p",[e("code",[_._v("binlog")]),_._v("有两个最重要的使用场景:")]),_._v(" "),e("ol",[e("li",[_._v("用于主从复制，在主从结构中，需要"),e("code",[_._v("master")]),_._v("节点打开"),e("code",[_._v("binlog")]),_._v("日志，从机订阅"),e("code",[_._v("binlog")]),_._v("日志，当"),e("code",[_._v("master")]),_._v("发生数据变更时，从机读取"),e("code",[_._v("binlog")]),_._v("日志随着"),e("code",[_._v("master")]),_._v("节点的数据变更而变更，做到主从复制的效果。")]),_._v(" "),e("li",[_._v("然后就是数据恢复了，通过使用"),e("code",[_._v("mysqlbinlog")]),_._v("工具来使恢复数据。")])]),_._v(" "),e("p",[_._v("二进制日志包括两类文件：二进制日志索引文件（文件名后缀为"),e("code",[_._v(".index")]),_._v("）用于记录所有的二进制文件，二进制日志文件（文件名后缀为"),e("code",[_._v(".00000*")]),_._v("）记录数据库所有的"),e("code",[_._v("DDL")]),_._v("和"),e("code",[_._v("DML")]),_._v("(除了数据查询语句)语句事件。")]),_._v(" "),e("p",[_._v("通过mysql的变量配置表，查看二进制日志是否已开启")]),_._v(" "),e("div",{staticClass:"language-sql line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[_._v("show")]),_._v(" variables "),e("span",{pre:!0,attrs:{class:"token operator"}},[_._v("like")]),_._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[_._v("'log_%'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v(";")]),_._v(" \n")])]),_._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[_._v("1")]),e("br")])]),e("p",[e("code",[_._v("ON")]),_._v("表示已经开启"),e("code",[_._v("binlog")]),_._v("日志\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/8b8d7db57dc2489ca514f19c50e9490e.png",alt:"在这里插入图片描述"}}),_._v(" "),e("a",{attrs:{href:"https://www.cnblogs.com/softidea/p/12624778.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("mysql查看binlog日志"),e("OutboundLink")],1),_._v(" "),e("a",{attrs:{href:"https://www.cnblogs.com/struggle-1216/p/12554896.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("MySQL之六----MySQL数据库各种日志管理"),e("OutboundLink")],1)]),_._v(" "),e("h2",{attrs:{id:"redo-log"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#redo-log"}},[_._v("#")]),_._v(" redo log")]),_._v(" "),e("div",{staticClass:"language-sql line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-sql"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[_._v("UPDATE")]),_._v(" "),e("span",{pre:!0,attrs:{class:"token identifier"}},[e("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v("`")]),_._v("user"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v("`")])]),_._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[_._v("SET")]),_._v(" "),e("span",{pre:!0,attrs:{class:"token identifier"}},[e("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v("`")]),_._v("name"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v("`")])]),e("span",{pre:!0,attrs:{class:"token operator"}},[_._v("=")]),e("span",{pre:!0,attrs:{class:"token string"}},[_._v("'刘德华'")]),_._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[_._v("WHERE")]),_._v(" "),e("span",{pre:!0,attrs:{class:"token identifier"}},[e("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v("`")]),_._v("id"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v("`")])]),e("span",{pre:!0,attrs:{class:"token operator"}},[_._v("=")]),e("span",{pre:!0,attrs:{class:"token string"}},[_._v("'1'")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[_._v(";")]),_._v("\n")])]),_._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[_._v("1")]),e("br")])]),e("p",[_._v("我们想象一下"),e("code",[_._v("MySQL")]),_._v("修改数据的步骤，肯定是先把"),e("code",[_._v("id='1'")]),_._v("的数据查出来，然后修改名称为"),e("code",[_._v("'刘德华'")]),_._v("。再深层一点，"),e("code",[_._v("MySQL")]),_._v("是使用页作为存储结构，所以"),e("code",[_._v("MySQL")]),_._v("会先把这条记录所在的页加载到内存中，然后对记录进行修改。但是我们都知道"),e("code",[_._v("MySQL")]),_._v("支持持久化，最终数据都是存在于磁盘中。假设需要修改的数据加载到内存中，并且修改成功了，但是还没来得及刷到磁盘中，这时数据库宕机了，那么这次修改成功后的数据就丢失了。")]),_._v(" "),e("p",[_._v("为了避免出现这种问题，"),e("code",[_._v("MySQL")]),_._v("引入了"),e("code",[_._v("redo log")]),_._v("-重做日志。\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/e82a25aeb4dc49ddb0a19b55aed77ba6.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}}),_._v(" "),e("code",[_._v("redo log")]),_._v("在写入磁盘之前会先将内容写到内存中。因此，"),e("code",[_._v("redo log")]),_._v("的写入包括两部分内容：一部分是内存中的日志缓冲，称作"),e("code",[_._v("redo log buffer")]),_._v(";另一部分是磁盘日志文件，称作 "),e("code",[_._v("redo log file")]),_._v("。"),e("code",[_._v("MySQL")]),_._v("每执行一条"),e("code",[_._v("DML")]),_._v("语句，先将更新记录写入"),e("code",[_._v("redo log buffer")]),_._v(" ，然后再写入"),e("code",[_._v("redo log file")]),_._v("。我们将这种先写日志，再写磁盘的方式称为"),e("code",[_._v("WAL(Write-Ahead Logging)")]),_._v("技术\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/6a866f248b4f4ab28b85532247093a65.png",alt:"在这里插入图片描述"}}),_._v("\n顺着箭头的方向从左往右看，日志最开始会写入位于存储引擎"),e("code",[_._v("Innodb")]),_._v("的"),e("code",[_._v("redo log buffer")]),_._v("中，这个也就是所谓的用户空间"),e("code",[_._v("(user space)")]),_._v("，然后再将日志保存到操作系统内核空间"),e("code",[_._v("(kernel space)")]),_._v("的缓冲区"),e("code",[_._v("(OS buffer)")]),_._v("中。")]),_._v(" "),e("p",[_._v("最后，再从"),e("code",[_._v("OS buffer")]),_._v("写入到磁盘上的"),e("code",[_._v("redo log file")]),_._v("中，完成写入操作，这个写入磁盘的操作也称作“刷盘”。")]),_._v(" "),e("p",[_._v("了解了"),e("code",[_._v("redo log")]),_._v("的写入方式之后，我们发现主要完成的操作是"),e("code",[_._v("redo log buffer")]),_._v("到磁盘的"),e("code",[_._v("redo log file")]),_._v("的写入过程，其中需要经过"),e("code",[_._v("OS buffer")]),_._v("进行中转。关于"),e("code",[_._v("redo log buffer")]),_._v("写入"),e("code",[_._v("redo log file")]),_._v("的时机，可以通过 参数"),e("code",[_._v("innodb_flush_log_at_trx_commit")]),_._v(" 进行配置，各参数值含义如下：")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("参数为0的时候，称为“延迟写”。事务提交时不会将"),e("code",[_._v("redo log buffer")]),_._v("中日志写入到"),e("code",[_._v("OS buffer")]),_._v("，而是每秒写入"),e("code",[_._v("OS buffer")]),_._v("并调用写入到"),e("code",[_._v("redo log file")]),_._v("中。换句话说，这种方式每秒会发起写入磁盘的操作，假设系统崩溃，只会丢失1秒钟的数据。")])]),_._v(" "),e("li",[e("p",[_._v("参数为1 的时候，称为“实时写，实时刷”。事务每次提交都会将"),e("code",[_._v("redo log buffer")]),_._v("中的日志写入"),e("code",[_._v("OS buffer")]),_._v("并保存到"),e("code",[_._v("redo log file")]),_._v("中。其有点是，即使系统崩溃也不会丢失任何数据，缺点也很明显就是每次事务提交都要进行磁盘操作，性能较差。")])]),_._v(" "),e("li",[e("p",[_._v("参数为2的时候，称为“实时写，延迟刷”。每次事务提交写入到"),e("code",[_._v("OS buffer")]),_._v("，然后是每秒将日志写入到"),e("code",[_._v("redo log file")]),_._v("。这样性能会好点，缺点是在系统崩溃的时候会丢失1秒中的事务数据。")])])]),_._v(" "),e("p",[e("strong",[_._v("Redo log记录形式")])]),_._v(" "),e("p",[e("code",[_._v("redo log")]),_._v("是通过循环写入的方式保存的。\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/940cf277d97240c190d1b462b1d308a6.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}}),_._v(" "),e("code",[_._v("redo log buffer")]),_._v("(内存中)是由首尾相连的四个文件组成的，它们分别是："),e("code",[_._v("ib_logfile_1、ib_logfile_2、ib_logfile_3、ib_logfile_4")]),_._v("。")]),_._v(" "),e("p",[_._v("写入的方式也是从文件的头部开始写入(假设)，每增加一条日志记录就往文件的尾部添加，直到把四个文件写满，再回到文件开头的地方"),e("code",[_._v("(ib_logfile_1)")]),_._v("继续写，继续写的时候会覆盖之前的记录。")]),_._v(" "),e("p",[_._v("图中"),e("code",[_._v("write pos")]),_._v("表示当前写入记录位置(写入磁盘的数据页的逻辑序列位置)，"),e("code",[_._v("check point")]),_._v("表示刷盘(写入磁盘)后对应的位置。"),e("code",[_._v("write pos")]),_._v("到"),e("code",[_._v("check point")]),_._v("之间的部分用来记录新日志，也就是留给新记录的空间。"),e("code",[_._v("check point")]),_._v("到"),e("code",[_._v("write pos")]),_._v("之间是待刷盘的记录，如果不刷盘会被新记录覆盖。")]),_._v(" "),e("p",[_._v("当"),e("code",[_._v("write pos")]),_._v("指针追上"),e("code",[_._v("check point")]),_._v("的时候(也就是新记录即将覆盖老记录的时刻)，会推动"),e("code",[_._v("check point")]),_._v("向前移动，也就是催促其将记录刷到磁盘中，这样好空出位置给新记录。")]),_._v(" "),e("p",[_._v("当"),e("code",[_._v("redo log buffer")]),_._v("根据"),e("code",[_._v("check pint")]),_._v("刷盘以后，针对"),e("code",[_._v("Innodb")]),_._v("引擎而言是以页为单位进行磁盘存储，一个事务可能一个或者多个数据页，每个页面修改多个字节。当重新启动"),e("code",[_._v("Innodb")]),_._v("存储引擎的时候，是会进行恢复操作。因为"),e("code",[_._v("redo log")]),_._v("记录的是数据页的物理变化，恢复的速度比逻辑日志"),e("code",[_._v("(binlog)")]),_._v("要快。")]),_._v(" "),e("p",[_._v("在重启"),e("code",[_._v("Innodb")]),_._v("时，首先会检查磁盘中数据页的逻辑序列位置，如果数据页的逻辑序列位置小于日志中的位置，则会从"),e("code",[_._v("check point")]),_._v("开始恢复。如果宕机的时候，正处于"),e("code",[_._v("check point")]),_._v("的刷盘过程中，且数据页的刷盘进度超过了日志页的刷盘进度，此时会出现数据页中记录的逻辑序列位置大于日志中的逻辑序列位置，这时超出日志进度的部分将不会重做，因为这本身就表示已经做过的事情，无需再重做。")]),_._v(" "),e("p",[e("strong",[e("code",[_._v("redo log")]),_._v(" 和 "),e("code",[_._v("binlog")]),_._v("的区别")])]),_._v(" "),e("p",[e("code",[_._v("redo log")]),_._v("不是二进制日志。虽然二进制日志中也记录的"),e("code",[_._v("innodb")]),_._v("表的很多操作，也能实现重做的功能。但是二者之间有很大的区别。")]),_._v(" "),e("ul",[e("li",[e("p",[_._v("二进制日志是在存储引擎的上层产生的，不管是什么存储引擎，对数据库进行了修改都会产生二进制日志。而"),e("code",[_._v("redo log")]),_._v("是"),e("code",[_._v("innodb")]),_._v("层产生的，只记录该存储引擎中表的修改。并且二进制日志先于"),e("code",[_._v("redo log")]),_._v("被记录。")])]),_._v(" "),e("li",[e("p",[_._v("二进制日志记录操作的方法是逻辑性的语句。即便它是基于行格式的记录方式，其本质也还是逻辑的"),e("code",[_._v("SQL")]),_._v("设置，如该行记录的每列的值是多少。而"),e("code",[_._v("redo log")]),_._v("是物理格式上的日志，它记录的是数据库中每个页的修改。")])]),_._v(" "),e("li",[e("p",[_._v("二进制日志只在每次事务提交的时候一次性写入缓存中的日志“文件”（对于非事务表的操作，则是每次执行语句成功后就直接写入）。而"),e("code",[_._v("redo log")]),_._v("在数据准备修改前写入缓存中的"),e("code",[_._v("redo log")]),_._v("中，然后才对缓存中的数据执行修改操作；而且保存在发出事务提交指令时，先向缓存中的"),e("code",[_._v("redo log")]),_._v("写入日志，写入完成后才执行提交操作。")])]),_._v(" "),e("li",[e("p",[_._v("因为二进制日志只在提交的时候一次性写入，所以二进制日志中的记录方式和提交顺序有关，且一次提交对应一次记录。而"),e("code",[_._v("redo log")]),_._v("中是记录的物理页的修改，"),e("code",[_._v("redo log")]),_._v("文件中同一个事务可能多次记录，最后一个提交的事务记录会覆盖所有未提交的事务记录。例如事务"),e("code",[_._v("T1")]),_._v("，可能在"),e("code",[_._v("redo log")]),_._v("中记录了 "),e("code",[_._v("T1-1,T1-2,T1-3，T1*")]),_._v("共4个操作，其中 "),e("code",[_._v("T1*")]),_._v(" 表示最后提交时的日志记录，所以对应的数据页最终状态是"),e("code",[_._v("T1*")]),_._v("对应的操作结果。而且"),e("code",[_._v("redo log")]),_._v("是并发写入的，不同事务之间的不同版本的记录会穿插写入到"),e("code",[_._v("redo log")]),_._v("文件中，例如可能"),e("code",[_._v("redo log")]),_._v("的记录方式如下： "),e("code",[_._v("T1-1,T1-2,T2-1,T2-2,T2*,T1-3,T1*")]),_._v("。")])]),_._v(" "),e("li",[e("p",[_._v("事务日志记录的是物理页的情况，它具有幂等性，因此记录日志的方式极其简练。幂等性的意思是多次操作前后状态是一样的，例如新插入一行后又删除该行，前后状态没有变化。而二进制日志记录的是所有影响数据的操作，记录的内容较多。例如插入一行记录一次，删除该行又记录一次。")])])]),_._v(" "),e("h2",{attrs:{id:"undo-log"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#undo-log"}},[_._v("#")]),_._v(" undo log")]),_._v(" "),e("p",[_._v("在数据修改时，不仅记录了"),e("code",[_._v("redo log")]),_._v("，还记录的相对应的"),e("code",[_._v("undo log")]),_._v("，如果因为某些原因导致事务失败或回滚了，可以借助"),e("code",[_._v("undo log")]),_._v(" 进行回滚。")]),_._v(" "),e("p",[e("code",[_._v("undo log")]),_._v(" 和"),e("code",[_._v("redo log")]),_._v("记录物理日志不一样，它是逻辑日志。可以认为当"),e("code",[_._v("delete")]),_._v("一条记录时，"),e("code",[_._v("undo log")]),_._v(" 中会记录一条对应的"),e("code",[_._v("insert")]),_._v("记录。反之亦然")]),_._v(" "),e("p",[_._v("当执行"),e("code",[_._v("roollback")]),_._v("时，就可以从"),e("code",[_._v("undo log")]),_._v(" 中的逻辑记录读取到相应的内存并进行回滚。有时候应用到行版本控制的时候，也是通过"),e("code",[_._v("undo log")]),_._v("来实现的，当读取的某一行被其他事务锁定时，它可以从"),e("code",[_._v("undo log")]),_._v(" 中分析出该行记录以前的数据时什么，从而提供该行的版本信息，让用户实现非锁定一致性读取。")]),_._v(" "),e("p",[e("a",{attrs:{href:"https://www.cnblogs.com/wy123/p/8365234.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("MySQL中的重做日志（redo log），回滚日志（undo log），以及二进制日志（binlog）的简单总结"),e("OutboundLink")],1)]),_._v(" "),e("p",[e("a",{attrs:{href:"https://www.cnblogs.com/f-ck-need-u/archive/2018/05/08/9010872.html",target:"_blank",rel:"noopener noreferrer"}},[_._v("详细分析MySQL事务日志(redo log和undo log)"),e("OutboundLink")],1)]),_._v(" "),e("p",[e("a",{attrs:{href:"https://mp.weixin.qq.com/s/XTpoYW--6PTqotcC8tpF2A",target:"_blank",rel:"noopener noreferrer"}},[_._v("面试不用慌！跟着老司机吃透Redo log 与 Binlog"),e("OutboundLink")],1)]),_._v(" "),e("h1",{attrs:{id:"事务"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#事务"}},[_._v("#")]),_._v(" 事务")]),_._v(" "),e("p",[e("a",{attrs:{href:"https://blog.csdn.net/D_A_I_H_A_O/article/details/107235568",target:"_blank",rel:"noopener noreferrer"}},[_._v("学不会的数据库事务"),e("OutboundLink")],1)]),_._v(" "),e("h1",{attrs:{id:"主从复制"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#主从复制"}},[_._v("#")]),_._v(" 主从复制")]),_._v(" "),e("p",[_._v("主要涉及三个线程:"),e("code",[_._v("binlog")]),_._v("线程、"),e("code",[_._v("I/O")]),_._v("线程和 "),e("code",[_._v("SQL")]),_._v(" 线程。")]),_._v(" "),e("ul",[e("li",[e("p",[e("code",[_._v("binlog")]),_._v(" 线程 : 负责将主服务器上的数据更改写入二进制日志中。")])]),_._v(" "),e("li",[e("p",[e("code",[_._v("I/O")]),_._v("线程 : 负责从主服务器上读取二进制日志，并写入从服务器的中继日志中。")])]),_._v(" "),e("li",[e("p",[e("code",[_._v("SQL")]),_._v(" 线程 : 负责读取中继日志并重放其中的 SQL 语句。\n"),e("img",{attrs:{src:"https://img-blog.csdnimg.cn/56c64e3e263b4243b5acbf327941e930.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfQV9JX0hfQV9P,size_16,color_FFFFFF,t_70",alt:"在这里插入图片描述"}})])])]),_._v(" "),e("p",[e("strong",[_._v("读写分离")])]),_._v(" "),e("p",[_._v("主服务器处理写操作以及实时性要求比较高的读操作，而从服务器处理读操作。")]),_._v(" "),e("p",[_._v("读写分离能提高性能的原因在于:")]),_._v(" "),e("ul",[e("li",[_._v("主从服务器负责各自的读和写，极大程度缓解了锁的争用；")]),_._v(" "),e("li",[_._v("从服务器可以使用 "),e("code",[_._v("MyISAM")]),_._v("，提升查询性能以及节约系统开销；")]),_._v(" "),e("li",[_._v("增加冗余，提高可用性。")])]),_._v(" "),e("p",[_._v("读写分离常用代理方式来实现，代理服务器接收应用层传来的读写请求，然后决定转发到哪个服务器。")]),_._v(" "),e("p",[e("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/96212530",target:"_blank",rel:"noopener noreferrer"}},[_._v("mysql主从复制原理"),e("OutboundLink")],1)]),_._v(" "),e("h1",{attrs:{id:"explain"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#explain"}},[_._v("#")]),_._v(" Explain")]),_._v(" "),e("p",[e("a",{attrs:{href:"https://juejin.cn/post/6991355319825727496",target:"_blank",rel:"noopener noreferrer"}},[_._v("Explain你真的会用吗"),e("OutboundLink")],1)])])}),[],!1,null,null,null);e.default=t.exports}}]);