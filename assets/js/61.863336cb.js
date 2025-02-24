(window.webpackJsonp=window.webpackJsonp||[]).push([[61],{485:function(s,t,a){"use strict";a.r(t);var n=a(0),e=Object(n.a)({},(function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("p",[t("code",[s._v("FastDFS")]),s._v("是没有"),t("code",[s._v("Windows")]),s._v("版本的，所以采取了"),t("code",[s._v("Docker")]),s._v("去安装,不同"),t("code",[s._v("Windows")]),s._v("系统，"),t("code",[s._v("Docker")]),s._v("安装不尽相同。")]),s._v(" "),t("p",[t("a",{attrs:{href:"https://blog.csdn.net/zou_hailin226/article/details/121278799",target:"_blank",rel:"noopener noreferrer"}},[s._v("Windows11下安装Docker"),t("OutboundLink")],1)]),s._v(" "),t("p",[t("strong",[s._v("克隆项目")])]),s._v(" "),t("div",{staticClass:"language-txt line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-txt"}},[t("code",[s._v("git clone https://qbanxiaoli@github.com/qbanxiaoli/fastdfs.git \n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("修改"),t("code",[s._v("docker-compose.yml")]),s._v("，指定IP(多个IP集群用逗号分割)")]),s._v(" "),t("div",{staticClass:"language-yml line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-yml"}},[t("code",[t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("version")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'3'")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("services")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("fastdfs")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("build")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" .\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("image")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" qbanxiaoli/fastdfs\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 该容器是否需要开机启动+自动重启。若需要，则取消注释。")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("restart")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" always\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("container_name")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" fastdfs\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ports")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"80:80"')]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"22122:22122"')]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"23000:23000"')]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("environment")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# nginx服务端口,默认80端口，可修改")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("WEB_PORT")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("80")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# tracker_server服务端口，默认22122端口，可修改")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("FDFS_PORT")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("22122")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# storage_server服务端口，默认23000端口，可修改")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("STORAGE_PORT")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("23000")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# fastdht服务端口，默认11411端口，可修改")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("FDHT_PORT")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("11411")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# docker所在宿主机IP内网地址，默认使用eth0网卡的地址（这里用windows主机ip）")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("IP")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" 192.168.1.250\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 防盗链配置")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 是否做token检查，缺省值为false")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("CHECK_TOKEN")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 生成token的有效时长，默认900s")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("TOKEN_TTL")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("900")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 生成token的密钥")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("SECRET_KEY")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" FastDFS1234567890\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# token检查失败，返回的本地文件内容，可以通过文件挂载的方式进行修改")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("TOKEN_CHECK_FAIL")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" /etc/fdfs/anti"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v("steal.jpg\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("volumes")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 将本地目录映射到docker容器内的fastdfs数据存储目录，将fastdfs文件存储到主机上，以免每次重建docker容器，之前存储的文件就丢失了。")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" ./fastdfs"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("/var/local\n    "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 由于windows和unix识别不了host网络，目前需要新建网段，强制指定容器ip与宿主机ip一致（这里同样用windows主机ip）")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("networks")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("fastdfs_net")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ipv4_address")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" 192.168.1.250\n\n "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#新建一个网段，名称fastdfs_net，bridge类型。要和windows主机ip网段一致（192.168.1-192.168.1）")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("networks")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("fastdfs_net")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("driver")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" bridge\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("ipam")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("config")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("subnet")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" 192.168.1.0/24\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br"),t("span",{staticClass:"line-number"},[s._v("27")]),t("br"),t("span",{staticClass:"line-number"},[s._v("28")]),t("br"),t("span",{staticClass:"line-number"},[s._v("29")]),t("br"),t("span",{staticClass:"line-number"},[s._v("30")]),t("br"),t("span",{staticClass:"line-number"},[s._v("31")]),t("br"),t("span",{staticClass:"line-number"},[s._v("32")]),t("br"),t("span",{staticClass:"line-number"},[s._v("33")]),t("br"),t("span",{staticClass:"line-number"},[s._v("34")]),t("br"),t("span",{staticClass:"line-number"},[s._v("35")]),t("br"),t("span",{staticClass:"line-number"},[s._v("36")]),t("br"),t("span",{staticClass:"line-number"},[s._v("37")]),t("br"),t("span",{staticClass:"line-number"},[s._v("38")]),t("br"),t("span",{staticClass:"line-number"},[s._v("39")]),t("br"),t("span",{staticClass:"line-number"},[s._v("40")]),t("br"),t("span",{staticClass:"line-number"},[s._v("41")]),t("br"),t("span",{staticClass:"line-number"},[s._v("42")]),t("br"),t("span",{staticClass:"line-number"},[s._v("43")]),t("br"),t("span",{staticClass:"line-number"},[s._v("44")]),t("br"),t("span",{staticClass:"line-number"},[s._v("45")]),t("br"),t("span",{staticClass:"line-number"},[s._v("46")]),t("br"),t("span",{staticClass:"line-number"},[s._v("47")]),t("br")])]),t("p",[s._v("执行"),t("code",[s._v("docker-compose")]),s._v("命令，"),t("code",[s._v("linux")]),s._v("环境下需要指定使用"),t("code",[s._v("docker-compose-linux.yml")]),s._v("文件")]),s._v(" "),t("div",{staticClass:"language-go line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-go"}},[t("code",[s._v(" docker"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("compose up "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("d 或者 docker"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("compose "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("f docker"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("compose"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("linux"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("yml up "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("d\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("不用"),t("code",[s._v("docker-compose.yml")]),s._v("，或者其他镜像搭建也是同样道理，"),t("strong",[s._v("需要新建网段，强制指定容器ip与宿主机ip一致")]),s._v("。\n这样"),t("code",[s._v("tracker_server")]),s._v("才能连到"),t("code",[s._v("storage_server")]),s._v("，外部服务才能连到"),t("code",[s._v("tracker_server")]),s._v("。")])])}),[],!1,null,null,null);t.default=e.exports}}]);