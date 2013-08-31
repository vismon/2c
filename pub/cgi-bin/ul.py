#!/usr/bin/env python
#
#	File uploader
#
import cgi, os
import cgitb; cgitb.enable()

# Aus dem Post-Request-CGI-FieldStorage objekt holen wir uns die Datei, die ueber das Formular uebergeben wurde
try:
	form = cgi.FieldStorage()
	fileitem = form['file']
except:
	fileitem = None
	message = "Fehler 0xc0ffee: Formularelemen ->file<- wurde nicht gefunden!"

# wurde die Datei hochgeladen?
if fileitem is not None and fileitem.filename:
   # um "directory traversal attacks" vorzubeugen, entferne ich fuehrende Pfadangaben z. B. "../../../"
   fn = os.path.basename(fileitem.filename)
   fp = "../uploaded-files/%s" % fn
   if os.path.exists(fp):
   	try:
   		os.remove(fp)
   	except:
   		message = "Fehler 0xa991e: Habe ein Datei auf dem Server gefunden, die genauso heisst, wie Ihre<br />Der Versuch diese zu loeschen scheiterte. Dateipfad: %s" % fp
   try:
   	open(fp, "wb").write(fileitem.file.read())
   	message = "Erfolg: %s" % fn
   except:
   	message = "Fehler 0xbabe: Datei konnte nicht hochgeladen werden, versuchen Sie es bitte erneut."

print "Content-type: text/html\n"
print """\
%s
""" % (message)
