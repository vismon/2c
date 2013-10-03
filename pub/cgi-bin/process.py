#!/usr/bin/python
#
# /* Process the uploaded file */
#
# 	1. reencode to UTF-8
#	2. convert file into CSV format
#	3. remap CSV cols
#	4. move the result-file in the publishing folder
#	5. remove the file from the publishing folder as soon as possible
#
# 
#
import cgi, os
import cgitb; cgitb.enable()
import icu
import sys
import pdb;
message = ""

print 'Content-type: text/html\n'
print '''\
%s
''' % (message)
