　　Ubuntu开启BBR的前提是内核必须等于高于4.9，所以需要先看看你的内核是否是4.9或者以上。  

　　查看内核命令：`uname -a`  

　　如果是4.9或者以上，那么升级内核这一步就可以跳过了，如果在4.9以下，那就需要更新一下内核了。  
  
### 一、Ubuntu升级内核 ###
  
　　先确定你的系统是32位还是64位的，可用以下命令查看。  
  
　　查看命令：`getconf LONG_BIT`  
  
　　确定系统之后，需要下载内核升级包，下面网站可以找到最新包，根据自己的需要用wget命令来下载到服务器。http://kernel.ubuntu.com/~kernel-ppa/mainline/  
  <!--more-->
　　比如我的服务器是64位，要安装4.10.2的内核：  
  
```
sudo wget http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.10.2/linux-image-4.10.2-041002-generic_4.10.2-041002.201703120131_amd64.deb
```
  
　　然后切换到你刚刚下载的目录，执行以下命令升级：  

```
sudo dpkg -i linux-image-4.10.2-041002-generic_4.10.2-041002.201703120131_amd64.deb
```
  
  
　　最后，执行`sudo update-grub`，更新grub引导装入程序。  
  
　　重启服务器，执行`uname -a`检查内核是否成功更新。  
  
  
### 二、开启BBR加速 ###
  
　　执行下面两行命令修改系统变量:  
    `echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf`  
`echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf`  
  
  
保存生效：  
    `sysctl -p`  
  
执行：  
    `sysctl net.ipv4.tcp_available_congestion_control
`    

如果返回结果：  
    `net.ipv4.tcp_available_congestion_control = bbr cubic reno
`  
  
那么BBR开启成功！
