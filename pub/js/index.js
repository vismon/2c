function fileChange()
	{
		//FileList Objekt aus dem Input Element mit der ID "fileA"
		var fileList = document.getElementById("fileA").files;
		//File Objekt (erstes Element der FileList)
		var file = fileList[0];
 
		//File Objekt nicht vorhanden = keine Datei ausgewählt oder vom Browser nicht unterstützt
		if(!file)
		return;

		if ((file.type == "") || (file.type.search(/text/i) != -1) || (file.type.search(/excel/i) != -1 ))
		{
			document.getElementById("fileType").innerHTML = 'Dateitype: ' + file.type;
			document.getElementById("fileName").innerHTML = 'Dateiname: ' + file.name;
			document.getElementById("progress").value = 0;
			document.getElementById("prozent").innerHTML = "0%";
			return;
		}
		else
		{
			alert("Dateityp: \n" + file.type + "\n ungueltig! Bitte laden Sie eine CSV, LDIF oder Testdatei hoch!")
		}
	} 
var client = null;
function uploadFile()
	{
		//Wieder unser File Objekt
		var file = document.getElementById("fileA").files[0];
		//FormData Objekt erzeugen
		var formData = new FormData();
		//XMLHttpRequest Objekt erzeugen
		client = new XMLHttpRequest();
		var prog = document.getElementById("progress");

		if(!file)
		return;
 
		prog.value = 0;
		prog.max = 100;
 
		//Fügt dem formData Objekt unser File Objekt hinzu
		formData.append("file", file);

		client.onerror = function(e) {
			alert("onError");
		};
 
		client.onload = function(e) {
		        document.getElementById("prozent").innerHTML = "100%";
		        prog.value = prog.max;
		};
 
		client.upload.onprogress = function(e) {
		var p = Math.round(100 / e.total * e.loaded);
			document.getElementById("progress").value = p;
			document.getElementById("prozent").innerHTML = p + "%";
		};
 
		client.onabort = function(e) {
		        alert("Upload abgebrochen");
		};
		// Wenn der mit der Uebertragung fertig ist
		// wird diese funktion
		client.onreadystatechange = resultHandler
		client.open("POST","cgi-bin/ul.py", true)
		client.send(formData);
	}

// Funktion, die ausgeführt wird, wenn dre ebertratungsstatus sich aendert
function resultHandler() 
	{
		// fortsetzen, wenn die übertragung abgeschlossen ist
		if (client.readyState == 4)
		{
			// nur wenn HTTP Status "OK"
			if (client.status == 200) 
			{
				try
				{
					// Antwort empfangen
					response = client.responseText;
					// Whitespaces entfernen
					response.replace(/^(\s*)|(\s*)$/g, '').replace(/\s+/g, ' ');
					// Dateinamen extrahieren
					fn = response.split(": ")[1];
					
					if (response.search(/erfolg/i) != -1)
					{
						$( '#ul-result' ).html( "<p>Datei " + fn + " wurde erfolgreich hochgeladen.</p>")

						// Zeitstempel als prefix fuer jedes element einer Zeile :)
						TrId = (new Date).getTime().toString()

						// neue Tabellenzeile zusammensetzen
						button = "<input name=\"Konvertieren\" id=\"button-" + TrId + "\" value=\"Konvertieren\" type=\"button\" onclick=\"convertFile();\" />";
						tr = 	"<tr>" + 
								"<td>" + fn + "</td>" + 
								"<td>" + button + "</td>" +
								"<td id=\"link-" + TrId + "\"></td> " +
							"</tr>";
						// wenn da schon Zeilen drin stehen, schreiben wir die 
						// und die neu erstellte Zeile in das aktuelle 
						// html-Dokument
						$( '#ul-table' ).append( tr );
					}
					else //dann lief wohl etwas schief, bei dem upload
					{
						$( '#ul-result' ).html( "<p>Fehler! Antwort vom Server: <br /> " + response + "</p>" );
					}
					// Antwort anzeigen, wenn da schon was steht, einfach dranhaengen
				}
				catch(e)
				{
					// scheinbar ist ein Fehler aufgetreten
					$( "#ul-result" ).html( "<p>Fehler beim lesen der Antwort: " + e.toString() + "</p>" );
				}
					
			}
			else
			{
				$( "#ul-result" ).html( "<p> Fehler beim Uebertragen der Datei.<br />Bitte geben Sie Ihrer Datei einen anderen Namen und versuchen Sie es erneut.</p>" );
			}
		}
		else if ( (client.statusText.search(/error/i) != -1 ) && (client.readyState == 4) )
		{
			$( "#ul-result" ).html( "<p> Fehler! <br />  XMLHttp-Request-Status: " + client.readyState + "<br /> Details: " + client.statusText + "</p>" );
		}
	}

function uploadAbort() {
	if(client instanceof XMLHttpRequest)
		//Briecht die aktuelle uebertragung ab
		client.abort();
	}

function countString(str, search){
	var count = 0;
	var index = str.indexOf(search);
	while(index != -1){
		count++;
		index = str.indexOf(search,index + 1);
		}
	return count;
	}
