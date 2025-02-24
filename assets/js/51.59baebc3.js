(window.webpackJsonp=window.webpackJsonp||[]).push([[51],{474:function(s,t,a){"use strict";a.r(t);var n=a(0),e=Object(n.a)({},(function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("p",[t("code",[s._v("FastDFS")]),s._v("内置防盗链采用"),t("code",[s._v("Token")]),s._v("的方式。"),t("code",[s._v("Token")]),s._v("是带时效的，也就是说在设定的时间范围内，比如1分钟，"),t("code",[s._v("token")]),s._v("是有效的。"),t("code",[s._v("token")]),s._v("包含了"),t("code",[s._v("文件id")]),s._v("、"),t("code",[s._v("时间戳ts")]),s._v("和"),t("code",[s._v("密钥")]),s._v("。"),t("code",[s._v("FastDFS")]),s._v("在"),t("code",[s._v("URL")]),s._v("中带上当前时间戳和带时效的"),t("code",[s._v("token")]),s._v("，参数名分别为"),t("code",[s._v("ts")]),s._v("和"),t("code",[s._v("token")]),s._v("。"),t("code",[s._v("Token")]),s._v("的生成和校验都是在服务端，因此不会存在安全问题。")]),s._v(" "),t("div",{staticClass:"language-go line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-go"}},[t("code",[s._v("http"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".1")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".250")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("80")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("group1"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("M00"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("00")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("00")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("wKgB9WJzhVyANDPsAABXnhfXmqQ24"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("xlsx?token"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("08a6f962effff0a839411b1ab2359caa"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("ts"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1651894588")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[t("code",[s._v("http.conf")]),s._v("配置文件说明")]),s._v(" "),t("p",[t("code",[s._v("http.anti_steal.check_token:")]),s._v("是否做"),t("code",[s._v("token")]),s._v("检查，缺省值为"),t("code",[s._v("false")]),s._v("。")]),s._v(" "),t("p",[t("code",[s._v("http.anti_steal.token_ttl：")]),s._v(" "),t("code",[s._v("token TTL")]),s._v("，即生成"),t("code",[s._v("token")]),s._v("的有效时长")]),s._v(" "),t("p",[t("code",[s._v("http.anti_steal.secret_key：")]),s._v("生成"),t("code",[s._v("token")]),s._v("的密钥，尽量设置得长一些，千万不要泄露出去")]),s._v(" "),t("p",[t("code",[s._v("http.anti_steal.token_check_fail：")]),s._v(" "),t("code",[s._v("token")]),s._v("检查失败，返回的文件内容，需指定本地文件名")]),s._v(" "),t("p",[s._v("配置示例：")]),s._v(" "),t("div",{staticClass:"language-go line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-go"}},[t("code",[s._v("# HTTP "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("default")]),s._v(" content "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("type")]),s._v("\nhttp"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("default_content_type "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" application"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("octet"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("stream\n\n# MIME types mapping filename\n# MIME types file format"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" MIME_type  extensions\n# such as"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("  image"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("jpeg\tjpeg jpg jpe\n# you can use apache's MIME file"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" mime"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("types\nhttp"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("mime_types_filename"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("mime"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("types\n\n# "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" use token to anti"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("steal\n# "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("default")]),s._v(" value is "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\nhttp"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("anti_steal"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("check_token"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),s._v("\n\n# token TTL "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("time to live"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" seconds\n# "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("default")]),s._v(" value is "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("600")]),s._v("\nhttp"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("anti_steal"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("token_ttl"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("60")]),s._v("\n\n# secret key to generate anti"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("steal token\n# this parameter must be set when http"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("anti_steal"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("check_token set to "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),s._v("\n# the length of the secret key should not exceed "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("128")]),s._v(" bytes\nhttp"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("anti_steal"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("secret_key"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("FastDFS1234567890\n\n# "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" the content of the file when check token fail\n# "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("default")]),s._v(" value is empty "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("no file sepecified"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nhttp"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("anti_steal"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("token_check_fail"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("etc"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("fdfs"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("anti"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("steal"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("jpg\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br")])]),t("p",[t("strong",[s._v("java 方法")])]),s._v(" "),t("div",{staticClass:"language-java line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-java"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("/**\nfileId:group1/M00/00/00/wKgB9WJzhVyANDPsAABXnhfXmqQ24.xlsx\nsecretKey:FastDFS1234567890\n**/")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getToken")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),s._v(" fileId"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),s._v(" secretKey"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),s._v(" url "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" fileId"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("substring")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("fileId"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("indexOf")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\n      "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" lts "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("System")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("currentTimeMillis")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1000")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("String")]),s._v(" token "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('""')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("try")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n          token "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("ProtoCommon")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("getToken")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("url"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" lts"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("secretKey"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n          token "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" fileId "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"?token="')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" token "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"&ts="')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" lts"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("catch")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Exception")]),s._v(" e"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n          log"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("error")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"文件Token获取失败："')]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("+")]),s._v(" e"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//group1/M00/00/00/wKgB9WJzhVyANDPsAABXnhfXmqQ24.xlsx?token=08a6f962effff0a839411b1ab2359caa&ts=1651894588")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" token"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br")])]),t("p",[t("strong",[s._v("生成的"),t("code",[s._v("token")]),s._v("验证无法通过")])]),s._v(" "),t("p",[s._v("出现这样的问题请进行如下两项检查：")]),s._v(" "),t("p",[s._v("1、  确认调用"),t("code",[s._v("token")]),s._v("生成函数，传递的文件"),t("code",[s._v("id")]),s._v("中没有包含"),t("code",[s._v("group name")]),s._v(",传递的文件id形如：")]),s._v(" "),t("div",{staticClass:"language-go line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-go"}},[t("code",[s._v("M00"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("00")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("00")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("wKgB9WJzhVyANDPsAABXnhfXmqQ24"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("xlsx\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("2、  确认服务器时间基本是一致的，注意服务器时间不能相差太多，不要相差到分钟级别")])])}),[],!1,null,null,null);t.default=e.exports}}]);