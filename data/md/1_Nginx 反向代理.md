　　要在一台服务器上运行多个后端程序，且需要链接为类似 bbs.xx.com / blog.xx.com，则需要 Nginx 反向代理。

下面以 Ubuntu 为例

### 1，安装 Nginx ###


    $ sudo apt-get install nginx


### 2， 修改 Nginx 配置文件 ###

配置文件在　`/etc/nginx/nginx.conf`

修改 `nginx.conf`
修改其中的 `http{}`中的内容
<!-- more -->
    user www-data;
    worker_processes auto;
    pid /run/nginx.pid;
    events {
    	worker_connections 768;
    	# multi_accept on;
    }
    http {
        ##
        #  前面的代码再此不展示了,在 http{} 中补上以下代码
        ##
    	##
    	# 反向代理配置代码
    	##
        # 注意端口号 8081 为 bbs 服务, 8082 为 blog 服务,8083 为 www 服务
    	upstream bbs {
            server 127.0.0.1:8081 weight=1;
        }
        upstream blog {
            server 127.0.0.1:8082 weight=1;
        }
        upstream www {
            server 127.0.0.1:8083 weight=1;
        }
        server{
            listen 80;
            # 配置 www.bigbananas.cn
            server_name www.bigbananas.cn;
            access_log  /var/log/nginx/www.log;
            location / {
                root /home/website_root;
            }
        }
        server{
            listen 80;
            # 配置 blog.bigbananas.cn
            server_name blog.bigbananas.cn;
            access_log  /var/log/nginx/blog_access.log;
            location / {
                root /home/todo_root;
                # proxy_pass 为反向代理后的 网站
                proxy_pass http://127.0.0.1:8082/;
                proxy_read_timeout 300;
                proxy_connect_timeout 300;
                proxy_redirect     off;
                proxy_set_header   X-Forwarded-Proto $scheme;
                proxy_set_header   Host              $http_host;
                proxy_set_header   X-Real-IP         $remote_addr;
            }
        }
        server{
            listen 80;
            # 配置 bbs.bigbananas.cn
            server_name bbs.bigbananas.cn;
            access_log  /var/log/nginx/bbs_access.log;
            location / {
                root /home/todo_root;
                # proxy_pass 为反向代理后的 网站
                proxy_pass http://127.0.0.1:8081/;
                proxy_read_timeout 300;
                proxy_connect_timeout 300;
                proxy_redirect     off;
                proxy_set_header   X-Forwarded-Proto $scheme;
                proxy_set_header   Host              $http_host;
                proxy_set_header   X-Real-IP         $remote_addr;
            }
        }
    }

### 3，重启 Nginx 服务###

    $ sudo nginx -s reload

### 4,在服务器启动bbs、blog、www等相应的服务 ###



---
##### 参考文章 #####
  [http://bigbananas.cn/2017/02/18/%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86/](http://bigbananas.cn/2017/02/18/%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86/)
