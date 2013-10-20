#!/bin/bash

full="";
for i in `find . -name "*.js" -print | grep -v './mils.profile.js'`;
  do 
    i=${i:2};
    i=${i%.*};
    full=$full"\"mils/"$i"\", "
done;
echo "define(["${full%,*}"], function(){});" > Deps.js;
