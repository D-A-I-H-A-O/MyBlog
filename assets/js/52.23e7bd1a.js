(window.webpackJsonp=window.webpackJsonp||[]).push([[52],{476:function(s,n,e){"use strict";e.r(n);var a=e(0),t=Object(a.a)({},(function(){var s=this,n=s._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("p",[s._v("## idea64.exe.vmoptions")]),s._v(" "),n("p",[n("code",[s._v("idea64.exe.vmoptions")]),s._v("针对的是 "),n("code",[s._v("IDEA")]),s._v(" 环境。"),n("code",[s._v("IDEA")]),s._v(" 本身就是一个 "),n("code",[s._v("Java")]),s._v(" 应用，所以也必须运行于 "),n("code",[s._v("JVM")]),s._v(" 之上。此处的"),n("code",[s._v("idea64.exe.vmoptions")]),s._v("文件就是用来配置 "),n("code",[s._v("64")]),s._v(" 位的 "),n("code",[s._v("IDEA")]),s._v(" 所使用的 "),n("code",[s._v("JVM")]),s._v(" 参数。是 "),n("code",[s._v("IDEA")]),s._v(" 运行时用的配置，并不是项目运行的配置。\n"),n("img",{attrs:{src:"https://img-blog.csdnimg.cn/960cfe93632e41ca80a738fabd506f67.png",alt:"在这里插入图片描述"}}),s._v(" "),n("img",{attrs:{src:"https://img-blog.csdnimg.cn/d6caee40c613400fad14c9f50c8b4f08.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBARF9BX0lfSF9BX08=,size_19,color_FFFFFF,t_70,g_se,x_16",alt:"在这里插入图片描述"}})]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v("\n# custom IntelliJ IDEA VM options\n\n##################JVM模式############################\n\n# IDEA的JVM以Server模式启动（新生代默认使用ParNew）\n-server\n\n\n##################内存分配############################\n\n# 堆初始值占用3G，意味着IDEA启动即分配3G内存\n-Xms3g\n\n# 堆最大值占用3G\n-Xmx3g\n\n# 强制JVM在启动时申请到足够的堆内存（否则IDEA启动时堆初始大小不足3g）\n-XX:+AlwaysPreTouch\n\n# 年轻代与老年代比例为1:3（默认值是1:4），降低年轻代的回收频率\n-XX:NewRatio=3\n\n# 栈帧大小为16m\n-Xss16m\n\n\n##################老年代回收器############################\n\n# 使用CMS老年代回收器\n-XX:+UseConcMarkSweepGC\n\n# CMS的重新标记步骤：多线程一起执行\n-XX:+CMSParallelRemarkEnabled\n\n# CMS的并发标记步骤：启用4个线程并发标记（理论上越多越好，前提是CPU核心足够多）\n-XX:ConcGCThreads=4\n\n\n##################JIT编译器############################\n\n# 代码缓存，用于存放Just In Time编译后的本地代码，如果塞满，JVM将只解释执行，不再编译native代码。\n-XX:ReservedCodeCacheSize=512m\n\n# 分层编译，JIT编译优化越来越好，IDEA运行时间越久越快\n-XX:+TieredCompilation\n\n# 节省64位指针占用的空间，代价是JVM额外开销\n-XX:+UseCompressedOops\n\n# 增大软引用在JVM中的存活时长（堆空闲空间越大越久）\n-XX:SoftRefLRUPolicyMSPerMB=50\n\n\n-Dsun.io.useCanonCaches=false\n\n-Djava.net.preferIPv4Stack=true\n\n-Djsse.enableSNIExtension=false\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br"),n("span",{staticClass:"line-number"},[s._v("24")]),n("br"),n("span",{staticClass:"line-number"},[s._v("25")]),n("br"),n("span",{staticClass:"line-number"},[s._v("26")]),n("br"),n("span",{staticClass:"line-number"},[s._v("27")]),n("br"),n("span",{staticClass:"line-number"},[s._v("28")]),n("br"),n("span",{staticClass:"line-number"},[s._v("29")]),n("br"),n("span",{staticClass:"line-number"},[s._v("30")]),n("br"),n("span",{staticClass:"line-number"},[s._v("31")]),n("br"),n("span",{staticClass:"line-number"},[s._v("32")]),n("br"),n("span",{staticClass:"line-number"},[s._v("33")]),n("br"),n("span",{staticClass:"line-number"},[s._v("34")]),n("br"),n("span",{staticClass:"line-number"},[s._v("35")]),n("br"),n("span",{staticClass:"line-number"},[s._v("36")]),n("br"),n("span",{staticClass:"line-number"},[s._v("37")]),n("br"),n("span",{staticClass:"line-number"},[s._v("38")]),n("br"),n("span",{staticClass:"line-number"},[s._v("39")]),n("br"),n("span",{staticClass:"line-number"},[s._v("40")]),n("br"),n("span",{staticClass:"line-number"},[s._v("41")]),n("br"),n("span",{staticClass:"line-number"},[s._v("42")]),n("br"),n("span",{staticClass:"line-number"},[s._v("43")]),n("br"),n("span",{staticClass:"line-number"},[s._v("44")]),n("br"),n("span",{staticClass:"line-number"},[s._v("45")]),n("br"),n("span",{staticClass:"line-number"},[s._v("46")]),n("br"),n("span",{staticClass:"line-number"},[s._v("47")]),n("br"),n("span",{staticClass:"line-number"},[s._v("48")]),n("br"),n("span",{staticClass:"line-number"},[s._v("49")]),n("br"),n("span",{staticClass:"line-number"},[s._v("50")]),n("br"),n("span",{staticClass:"line-number"},[s._v("51")]),n("br"),n("span",{staticClass:"line-number"},[s._v("52")]),n("br"),n("span",{staticClass:"line-number"},[s._v("53")]),n("br"),n("span",{staticClass:"line-number"},[s._v("54")]),n("br"),n("span",{staticClass:"line-number"},[s._v("55")]),n("br"),n("span",{staticClass:"line-number"},[s._v("56")]),n("br"),n("span",{staticClass:"line-number"},[s._v("57")]),n("br"),n("span",{staticClass:"line-number"},[s._v("58")]),n("br"),n("span",{staticClass:"line-number"},[s._v("59")]),n("br")])]),n("h2",{attrs:{id:"idea-properties配置"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#idea-properties配置"}},[s._v("#")]),s._v(" idea.properties配置")]),s._v(" "),n("p",[s._v("常修改的就是下面 4 个参数：\n"),n("code",[s._v("idea.config.path=${user.home}/.IntelliJIdea/config")]),s._v("，该属性主要用于指向 "),n("code",[s._v("IntelliJ IDEA")]),s._v(" 的个性化配置目录，默认是被注释，打开注释之后才算启用该属性，这里需要特别注意的是斜杠方向，这里用的是正斜杠。")]),s._v(" "),n("p",[n("code",[s._v("idea.system.path=${user.home}/.IntelliJIdea/system")]),s._v("，该属性主要用于指向 "),n("code",[s._v("IntelliJ IDEA")]),s._v(" 的系统文件目录，默认是被注释，打开注释之后才算启用该属性，这里需要特别注意的是斜杠方向，这里用的是正斜杠。如果你的项目很多，则该目录会很大，如果你的 C 盘空间不够的时候，还是建议把该目录转移到其他盘符下。")]),s._v(" "),n("p",[n("code",[s._v("idea.max.intellisense.filesize=2500")]),s._v("，该属性主要用于提高在编辑大文件时候的代码帮助。"),n("code",[s._v("IntelliJ IDEA")]),s._v(" 在编辑大文件的时候还是很容易卡顿的。")]),s._v(" "),n("p",[n("code",[s._v("idea.cycle.buffer.size=1024")]),s._v("，该属性主要用于控制控制台输出缓存。有遇到一些项目开启很多输出，控制台很快就被刷满了没办法再自动输出后面内容，这种项目建议增大该值或是直接禁用掉，禁用语句 "),n("code",[s._v("idea.cycle.buffer.size=disabled")]),s._v("。")])])}),[],!1,null,null,null);n.default=t.exports}}]);