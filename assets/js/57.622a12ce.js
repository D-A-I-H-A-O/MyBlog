(window.webpackJsonp=window.webpackJsonp||[]).push([[57],{458:function(v,_,o){"use strict";o.r(_);var e=o(0),c=Object(e.a)({},(function(){var v=this,_=v._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("p",[v._v("更新流程涉及两个重要的日志模块："),_("code",[v._v("redo log")]),v._v("日志和 "),_("code",[v._v("binlog")]),v._v("日志")]),v._v(" "),_("h1",{attrs:{id:"redo-log"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#redo-log"}},[v._v("#")]),v._v(" redo log")]),v._v(" "),_("p",[_("code",[v._v("redo log")]),v._v(" 是 "),_("code",[v._v("InnoDB")]),v._v(" 引擎特有的日志")]),v._v(" "),_("p",[_("code",[v._v("WAL")]),v._v(" 技术 "),_("code",[v._v("Write-Ahead Logging")]),v._v("：当有一条记录需要更新的时候，"),_("code",[v._v("InnoDB")]),v._v(" 引擎就会先把记录写到 "),_("code",[v._v("redo log")]),v._v(" 里面，并更新内存，这个时候更新就算完成了。同时，"),_("code",[v._v("InnoDB")]),v._v(" 引擎会在适当的时候，将这个操作记录更新到磁盘里面，而这个更新往往是在系统比较空闲的时候做。")]),v._v(" "),_("p",[_("code",[v._v("InnoDB")]),v._v(" 的 "),_("code",[v._v("redo log")]),v._v(" 是固定大小的，比如可以配置为一组 "),_("code",[v._v("4")]),v._v(" 个文件，每个文件的大小是 "),_("code",[v._v("1GB")]),v._v("，那么总共就可以记录 "),_("code",[v._v("4GB")]),v._v(" 的操作。从头开始写，写到末尾就又回到开头循环写，如下面这个图所示。")]),v._v(" "),_("p",[_("img",{attrs:{src:"https://img-blog.csdnimg.cn/d9dca840dd8e479096205344e3ba7ee9.png",alt:"在这里插入图片描述"}})]),v._v(" "),_("p",[_("code",[v._v("write pos")]),v._v(" 是当前记录的位置，一边写一边后移，写到第 "),_("code",[v._v("3")]),v._v(" 号文件末尾后就回到 "),_("code",[v._v("0")]),v._v(" 号文件开头。"),_("code",[v._v("checkpoint")]),v._v(" 是当前要擦除的位置，也是往后推移并且循环的，擦除记录前要把记录更新到数据文件。")]),v._v(" "),_("p",[_("code",[v._v("write pos")]),v._v(" 和 "),_("code",[v._v("checkpoint")]),v._v(" 之间的是还空着的部分，可以用来记录新的操作。如果 "),_("code",[v._v("write pos")]),v._v(" 追上 "),_("code",[v._v("checkpoint")]),v._v("，表示满了，这时候不能再执行新的更新，得停下来先擦掉一些记录，把 "),_("code",[v._v("checkpoint")]),v._v(" 推进一下。")]),v._v(" "),_("p",[v._v("有了 "),_("code",[v._v("redo log")]),v._v("，"),_("code",[v._v("InnoDB")]),v._v(" 就可以保证即使数据库发生异常重启，之前提交的记录都不会丢失，这个能力称为"),_("code",[v._v("crash-safe")]),v._v("。")]),v._v(" "),_("h1",{attrs:{id:"binlog"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#binlog"}},[v._v("#")]),v._v(" binlog")]),v._v(" "),_("ol",[_("li",[_("p",[_("code",[v._v("redo log")]),v._v(" 是 "),_("code",[v._v("InnoDB")]),v._v(" 引擎特有的；"),_("code",[v._v("binlog")]),v._v(" 是 "),_("code",[v._v("MySQL")]),v._v(" 的 "),_("code",[v._v("Server")]),v._v(" 层实现的，所有引擎都可以使用。")])]),v._v(" "),_("li",[_("p",[_("code",[v._v("redo log")]),v._v(" 是物理日志，记录的是“在某个数据页上做了什么修改”；"),_("code",[v._v("binlog")]),v._v(" 是逻辑日志，记录的是这个语句的原始逻辑，比如“给 "),_("code",[v._v("ID=2")]),v._v(" 这一行的 "),_("code",[v._v("c")]),v._v(" 字段加 1 ”。")])]),v._v(" "),_("li",[_("p",[_("code",[v._v("redo log")]),v._v(" 是循环写的，空间固定会用完；"),_("code",[v._v("binlog")]),v._v(" 是可以追加写入的。“追加写”是指 "),_("code",[v._v("binlog")]),v._v(" 文件写到一定大小后会切换到下一个，并不会覆盖以前的日志。")])])]),v._v(" "),_("p",[_("img",{attrs:{src:"https://img-blog.csdnimg.cn/9fba391e83a8475cb2ac98526ec8b912.png",alt:"在这里插入图片描述"}})]),v._v(" "),_("h1",{attrs:{id:"更新语句流程"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#更新语句流程"}},[v._v("#")]),v._v(" 更新语句流程")]),v._v(" "),_("div",{staticClass:"language-sql line-numbers-mode"},[_("pre",{pre:!0,attrs:{class:"language-sql"}},[_("code",[_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("update")]),v._v(" T "),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("set")]),v._v(" c"),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("=")]),v._v("c"),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("+")]),_("span",{pre:!0,attrs:{class:"token number"}},[v._v("1")]),v._v(" "),_("span",{pre:!0,attrs:{class:"token keyword"}},[v._v("where")]),v._v(" ID"),_("span",{pre:!0,attrs:{class:"token operator"}},[v._v("=")]),_("span",{pre:!0,attrs:{class:"token number"}},[v._v("2")]),_("span",{pre:!0,attrs:{class:"token punctuation"}},[v._v(";")]),v._v("\n")])]),v._v(" "),_("div",{staticClass:"line-numbers-wrapper"},[_("span",{staticClass:"line-number"},[v._v("1")]),_("br")])]),_("p",[v._v("1、执行器先找引擎取 "),_("code",[v._v("ID=2")]),v._v(" 这一行。"),_("code",[v._v("ID")]),v._v(" 是主键，引擎直接用树搜索找到这一行。如果 "),_("code",[v._v("ID=2")]),v._v(" 这一行所在的数据页本来就在内存中，就直接返回给执行器；否则，需要先从磁盘读入内存，然后再返回。")]),v._v(" "),_("p",[v._v("2、执行器拿到引擎给的行数据，把这个值加上 "),_("code",[v._v("1")]),v._v("，比如原来是 "),_("code",[v._v("N")]),v._v("，现在就是 "),_("code",[v._v("N+1")]),v._v("，得到新的一行数据，再调用引擎接口写入这行新数据。")]),v._v(" "),_("p",[v._v("3、引擎将这行新数据更新到内存中，同时将这个更新操作记录到 "),_("code",[v._v("redo log")]),v._v(" 里面，此时 "),_("code",[v._v("redo log")]),v._v(" 处于 "),_("code",[v._v("prepare")]),v._v(" 状态。然后告知执行器执行完成了，随时可以提交事务。")]),v._v(" "),_("p",[v._v("4、执行器生成这个操作的 "),_("code",[v._v("binlog")]),v._v("，并把 "),_("code",[v._v("binlog")]),v._v(" 写入磁盘。")]),v._v(" "),_("p",[v._v("5、执行器调用引擎的提交事务接口，引擎把刚刚写入的 "),_("code",[v._v("redo log")]),v._v(" 改成提交（"),_("code",[v._v("commit")]),v._v("）状态，更新完成")]),v._v(" "),_("p",[_("img",{attrs:{src:"https://img-blog.csdnimg.cn/21401e1029ec4d05be9836bf05bbb26a.png",alt:"在这里插入图片描述"}}),v._v(" "),_("img",{attrs:{src:"https://img-blog.csdnimg.cn/0889ce7be4c144cfb5d9813f5d41a6d7.png",alt:"在这里插入图片描述"}})]),v._v(" "),_("h1",{attrs:{id:"两阶段提交"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#两阶段提交"}},[v._v("#")]),v._v(" 两阶段提交")]),v._v(" "),_("p",[v._v("两阶段提交的第一阶段 （"),_("code",[v._v("prepare")]),v._v("阶段）：写"),_("code",[v._v("rodo-log")]),v._v(" 并将其标记为"),_("code",[v._v("prepare")]),v._v("状态。")]),v._v(" "),_("p",[v._v("紧接着写"),_("code",[v._v("binlog")])]),v._v(" "),_("p",[v._v("两阶段提交的第二阶段（"),_("code",[v._v("commit")]),v._v("阶段）：写"),_("code",[v._v("bin-log")]),v._v(" 并将其标记为"),_("code",[v._v("commit")]),v._v("状态。")]),v._v(" "),_("p",[v._v("两阶段提交的主要用意是：为了保证"),_("code",[v._v("redolog")]),v._v("和"),_("code",[v._v("binlog")]),v._v("数据的安全一致性。只有在这两个日志文件逻辑上高度一致了。你才能放心地使用"),_("code",[v._v("redolog")]),v._v("帮你将数据库中的状态恢复成"),_("code",[v._v("crash")]),v._v("之前的状态，使用"),_("code",[v._v("binlog")]),v._v("实现数据备份、恢复、以及主从复制。而两阶段提交的机制可以保证这两个日志文件的逻辑是高度一致的，没有错误、没有冲突。")]),v._v(" "),_("ul",[_("li",[v._v("如果没有两阶段提交，那么 "),_("code",[v._v("binlog")]),v._v(" 和 "),_("code",[v._v("redolog")]),v._v(" 的提交，无非就是两种形式：")])]),v._v(" "),_("p",[v._v("1、先写 "),_("code",[v._v("binlog")]),v._v(" 再写 "),_("code",[v._v("redolog")]),v._v("。\n2、 先写 "),_("code",[v._v("redolog")]),v._v(" 再写 "),_("code",[v._v("binlog")]),v._v("。")]),v._v(" "),_("p",[v._v("假设我们要向表中插入一条记录 "),_("code",[v._v("R")]),v._v("，如果是先写 "),_("code",[v._v("binlog")]),v._v(" 再写 "),_("code",[v._v("redolog")]),v._v("，那么假设 "),_("code",[v._v("binlog")]),v._v(" 写完后崩溃了，此时 "),_("code",[v._v("redolog")]),v._v(" 还没写。那么重启恢复的时候就会出问题："),_("code",[v._v("binlog")]),v._v(" 中已经有 "),_("code",[v._v("R")]),v._v(" 的记录了，当从机从主机同步数据的时候或者我们使用 "),_("code",[v._v("binlog")]),v._v(" 恢复数据的时候，就会同步到 "),_("code",[v._v("R")]),v._v(" 这条记录；但是 "),_("code",[v._v("redolog")]),v._v(" 中没有关于 "),_("code",[v._v("R")]),v._v(" 的记录，所以崩溃恢复之后，插入 "),_("code",[v._v("R")]),v._v(" 记录的这个事务是无效的，即数据库中没有该行记录，这就造成了数据不一致。")]),v._v(" "),_("p",[v._v("相反，假设我们要向表中插入一条记录 "),_("code",[v._v("R")]),v._v("，如果是先写 "),_("code",[v._v("redolog")]),v._v(" 再写 "),_("code",[v._v("binlog")]),v._v("，那么假设 "),_("code",[v._v("redolog")]),v._v(" 写完后崩溃了，此时 "),_("code",[v._v("binlog")]),v._v(" 还没写。那么重启恢复的时候也会出问题："),_("code",[v._v("redolog")]),v._v(" 中已经有 "),_("code",[v._v("R")]),v._v(" 的记录了，所以崩溃恢复之后，插入 "),_("code",[v._v("R")]),v._v(" 记录的这个事务是有效的，通过该记录将数据恢复到数据库中；但是 "),_("code",[v._v("binlog")]),v._v(" 中还没有关于 "),_("code",[v._v("R")]),v._v(" 的记录，所以当"),_("strong",[v._v("从机")]),v._v("从"),_("strong",[v._v("主机")]),v._v("同步数据的时候或者我们使用 "),_("code",[v._v("binlog")]),v._v(" 恢复数据的时候，就不会同步到 "),_("code",[v._v("R")]),v._v(" 这条记录，这就造成了数据不一致。")]),v._v(" "),_("p",[v._v("那么按照前面说的两阶段提交就能解决问题吗？")]),v._v(" "),_("p",[v._v("我们来看如下三种情况：")]),v._v(" "),_("p",[v._v("情况一：一阶段提交之后崩溃了，即写入 "),_("code",[v._v("redo log")]),v._v("，处于 "),_("code",[v._v("prepare")]),v._v(" 状态 的时候崩溃了，此时：")]),v._v(" "),_("p",[v._v("由于 "),_("code",[v._v("binlog")]),v._v(" 还没写，"),_("code",[v._v("redo log")]),v._v(" 处于 "),_("code",[v._v("prepare")]),v._v(" 状态还没提交，所以崩溃恢复的时候，这个事务会回滚，此时 "),_("code",[v._v("binlog")]),v._v(" 还没写，所以也不会传到备库。")]),v._v(" "),_("p",[v._v("情况二：假设写完 "),_("code",[v._v("binlog")]),v._v(" 之后崩溃了，此时：")]),v._v(" "),_("p",[_("code",[v._v("redolog")]),v._v(" 中的日志是不完整的，处于 "),_("code",[v._v("prepare")]),v._v(" 状态，还没有提交，那么恢复的时候，首先检查 "),_("code",[v._v("binlog")]),v._v(" 中的事务是否存在并且完整，如果存在且完整，则直接提交事务，如果不存在或者不完整，则回滚事务。")]),v._v(" "),_("p",[v._v("情况三：假设 "),_("code",[v._v("redolog")]),v._v(" 处于 "),_("code",[v._v("commit")]),v._v(" 状态的时候崩溃了，那么重启后的处理方案同情况二。")]),v._v(" "),_("p",[v._v("由此可见，两阶段提交能够确保数据的一致性。")])])}),[],!1,null,null,null);_.default=c.exports}}]);