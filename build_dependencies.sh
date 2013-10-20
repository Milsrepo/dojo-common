#!/bin/bash

full="";
for i in `find . -name "*.js" -print | grep -v './common.profile.js'`;
  do 
    i=${i:2};
    i=${i%.*};
    full=$full"\"common/"$i"\", "
done;
echo "define(["${full%,*}"], function(){});" > Deps.js;
