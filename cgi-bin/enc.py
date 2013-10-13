#!/usr/bin/python
#
# Reincode file by filename
from __future__ import with_statement
import cgi, os
import cgitb; cgitb.enable()
import icu
import sys
import pdb; 

targetFormat = 'UTF-8'
uploadDir = '../uploaded-files'
outputDir = uploadDir + '/' + 'converted'

def convertFile(fileName):
    try:
        with open(uploadDir + '/' + fileName, 'rU') as file:
            writeConversion(file, fileName)
            os.remove(uploadDir + '/' + fileName)
            return "Erfolg: Datei %s in UTF-8 konvertiert." % fileName
    except:
        # ... oh dear ... the user must convert his file by hand ... sorry user, my program is too stupid... or your file :-P 
        if os.path.exists(outputDir + '/' + fileName):
            os.remove(outputDir + '/' + fileName)
        return "Fehler e0c099: Datei-Encoding wurde nicht erkannt - Ein manueller Eingriff ist notwendig. Bitte wenden Sie sich an ihren Systemadministrator."

def writeConversion(file, fileName):
    # read the source file and convert it to a string
    data = file.read()
    # uncomment for debugging
    #pdb.set_trace()
    # re-encode
    data = convertData(data)

    with open(outputDir + '/' + fileName, 'wb') as targetFile:
        targetFile.write(data)
    return

def convertData(data):
    # detect encoding with IBMs ICU Detector... python wrapper of the system lib :)
    coding = icu.CharsetDetector(data).detect().getName()
    if targetFormat.upper() != coding.upper():
        data = unicode(data, coding).encode(targetFormat)
    return data

message = ""

# Aus dem Post-Request-CGI-FieldStorage objekt holen wir uns den Dateinamen, 
# die ueber das Formular uebergeben wurde ... natuerlich werde ich den dateinamen noch filtern
try:
	# um "directory traversal attacks" vorzubeugen, entferne ich fuehrende Pfadangaben z. B. "../../../"
	fn = cgi.FieldStorage()['fileName']
except:
	fn = 'noFile.here'
	message = 'Fehler 0xe0c102: Formularelement ->fileName<- wurde nicht gefunden !'

if os.path.exists( uploadDir + '/' + fn ):
#	try:
	message = message + convertFile(fn)
#	except:
#		message = message + 'Fehler 0xe0c103: Datei-Encoding konnte nicht bestimmt werden, Quelldatei: %s Ordner: %s' % (fn, uploadDir)
else:
	message = 'Fehler 0xe0c104: Datei auf dem Server nicht gefunden!'

print 'Content-type: text/html\n'
print '''\
%s
''' % (message)
