# Compression-Oriented Programming

A web programmer goes on a soul searching journey where he comes face to face with the big lie of web programming and discovers the truth was deep inside him all along.

This repo is inspired by Casey Muratori's Compression Oriented Programming methodology.
https://mollyrocket.com/casey/stream_0019.html

# The Big ie of Web Programming Rant

Here's the big lie of web programming:

If you don't like the technology you're building on, the solution is to build an abstracted layer on top of it.

This idea is so normalized in our industry, that it's not even controversial. It's the reason you can't do a PHP project without using a framework that abstracts everything into unfathomable black boxes. It's the reason you need a package manager for javascript - ending up with 100s of dependencies to do trivial tasks.  It's the reason you can read the above statements without blinking an eye.

If this idea worked, then we wouldn't have a completely new javascript framework every 2 years. C programming has been around 45 years and it is still the go-to language for coding some of the most performance intensive software on the planet, doing hundreds of complex calculations and rendering 60 times per second. Meanwhile, we web programers are literally rending static text and bitmaps to the screen, and we're happy if we can serve a webpage in under 4 seconds. 

It's embarrassing. 


# Configuration

Since this project is for demoing work, I've set it up on my Mac. Here's my config if that's helpful.

/etc/hosts
```
127.0.0.1 compression.app
```

nginx
```
server {
	listen 80;
	root /usr/local/var/www/compression_oriented_programming/public;
	server_name compression.app;

	index index.php;
	location / {
			try_files $uri /index.php;
	}

	location ~ \.php$ {
			try_files $uri /index.php =404;
			fastcgi_split_path_info ^(.+\.php)(/.+)$;
			fastcgi_pass 127.0.0.1:9000;
			fastcgi_index index.php;
			fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
			include fastcgi_params;
	}
}
```