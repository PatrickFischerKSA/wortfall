'use strict';
const classes = ['Nomen', 'Verb', 'Adjektiv', 'Pronomen', 'Partikel'];
const tints = ['#ffdb86', '#d8c9ff', '#b8eed8', '#ffc9bb', '#bde6ff'];
// Ein * markiert das Zielwort im Satz.
const starterVocabulary = [
  [
    ['Baum|der Baum, die Bäume', 'Wolke|die Wolke, die Wolken', 'Schule|die Schule, die Schulen', 'Huhn|das Huhn, die Hühner', 'Fahrrad|das Fahrrad, die Fahrräder', 'Berg|der Berg, die Berge',
      "Fluss|der Fluss, die Flüsse", "Schlüssel|der Schlüssel, die Schlüssel", "Stern|der Stern, die Sterne", "Brücke|die Brücke, die Brücken", "Messer|das Messer, die Messer", "Fenster|das Fenster, die Fenster"],
    ['laufen|ich laufe, du läufst', 'schreiben|ich schreibe, du schreibst', 'fliegen|ich fliege, du fliegst', 'lesen|ich lese, du liest', 'springen|ich springe, du springst', 'singen|ich singe, du singst',
      "tanzen|ich tanze, du tanzt", "malen|ich male, du malst", "suchen|ich suche, du suchst", "backen|ich backe, du backst", "schwimmen|ich schwimme, du schwimmst", "frieren|ich friere, du frierst"],
    ['hell|die helle Lampe', 'laut|das laute Lied', 'klein|der kleine Hund', 'kalt|der kalte Wind', 'mutig|die mutige Katze', 'weich|das weiche Kissen',
      "rund|der runde Tisch", "warm|der warme Tee", "müde|das müde Kind", "schwer|die schwere Tasche", "breit|der breite Weg", "hungrig|der hungrige Hund"],
    ['ich|ersetzt die sprechende Person', 'du|ersetzt die angesprochene Person', 'wir|steht für die sprechende Gruppe', 'ihm|steht im Dativ: Ich helfe ihm', 'euch|steht für die angesprochene Gruppe', 'niemand|steht für keine Person',
      "mir|steht für die sprechende Person im Dativ", "dich|steht für die angesprochene Person im Akkusativ", "jemand|steht für eine unbestimmte Person", "ihren|Possessivpronomen: ihren Hund, ihre Katze", "uns|steht für die sprechende Gruppe", "manche|steht für einen Teil einer Gruppe"],
    ['gestern|unveränderbares Adverb', 'aber|unveränderbare Konjunktion', 'mit|unveränderbare Präposition', 'und|unveränderbare Konjunktion', 'nicht|unveränderbares Wort der Verneinung', 'wegen|unveränderbare Präposition',
      "heute|unveränderbares Adverb", "oder|unveränderbare Konjunktion", "ohne|unveränderbare Präposition", "weil|unveränderbare Konjunktion", "hier|unveränderbares Adverb", "zwischen|unveränderbare Präposition"]
  ],
  [
    ['Geduld|Die * hilft dir beim Üben.|die Geduld: festes Genus', 'Freude|Die * war gross.|die Freude: festes Genus', 'Regen|Der * liess nach.|der Regen: festes Genus', 'Entscheid|Der * fiel gestern.|der Entscheid: festes Genus', 'Mut|Ihr * beeindruckt mich.|der Mut: festes Genus', 'Antwort|Deine * stimmt.|die Antwort: festes Genus',
      "Zweifel|Der * blieb bestehen.|der Zweifel: festes Genus", "Erkenntnis|Diese * half uns weiter.|die Erkenntnis: festes Genus", "Vorrat|Unser * reicht für drei Tage.|der Vorrat: festes Genus", "Hindernis|Sie überwand das *.|das Hindernis: festes Genus", "Gerücht|Das * verbreitete sich schnell.|das Gerücht: festes Genus", "Absicht|Das war meine *.|die Absicht: festes Genus"],
    ['liest|Sie * einen Krimi.|ich lese, sie liest', 'wäre|Das * schön.|Form von sein', 'kam|Er * zu spät.|Form von kommen', 'hilft|Wer * uns?|ich helfe, er hilft', 'sah|Ich * einen Fuchs.|Form von sehen', 'könnte|Das * stimmen.|Form von können',
      "wich|Sie * dem Ball aus.|Präteritum von ausweichen", "müsste|Das * reichen.|Konjunktiv II von müssen", "riet|Er * mir zur Vorsicht.|Präteritum von raten", "wirf|Bitte * mir den Ball zu!|Imperativ von zuwerfen", "gefiel|Der Film * mir.|Präteritum von gefallen", "erlosch|Die Kerze * plötzlich.|Präteritum von erlöschen"],
    ['freundlich|Sie grüssen *.|die freundlichen Leute', 'besser|Das klingt *.|die bessere Lösung', 'mündlich|Die Prüfung ist *.|die mündliche Prüfung', 'leise|Wir gehen * hinaus.|die leisen Schritte', 'grüner|Dort wächst ein * Busch.|der grüne Busch', 'schnell|Sie läuft *.|die schnelle Läuferin',
      "denkwürdiges|Das war ein * Ereignis.|das denkwürdige Ereignis", "tadellos|Sie sang *.|der tadellose Gesang", "nützlich|Das Werkzeug ist *.|das nützliche Werkzeug", "äusserste|Sie sah die * Kante.|die äusserste Kante", "zufrieden|Er war mit dem Ergebnis *.|der zufriedene Teilnehmer", "unversehrt|Das Paket kam * an.|das unversehrte Paket"],
    ['eine|Wir sehen * Katze.|unbestimmter Artikel', 'das|Ich öffne * Fenster.|bestimmter Artikel', 'mein|Wo ist * Heft?|Possessivpronomen; mein Heft, meine Tasche', 'dieser|* Bus hält hier.|Demonstrativpronomen; dieser Bus, diese Bahn', 'wem|* gehört der Stift?|Fragepronomen; wer, wem, wen', 'welche|* Tür ist offen?|Fragepronomen; welcher, welche, welches',
      "dessen|Der Baum, * Äste abbrechen, ist morsch.|Relativpronomen im Genitiv", "kein|Heute fährt * Zug.|Indefinitpronomen nach der Vorlage", "jenes|Wir besuchen * Museum.|Demonstrativpronomen", "derselbe|Es war * Fahrer wie gestern.|Demonstrativpronomen", "einander|Sie helfen * beim Umzug.|Reflexivpronomen mit gegenseitiger Bedeutung", "sich|Die Katze putzt *.|Reflexivpronomen"],
    ['obwohl|Ich gehe, * es regnet.|unveränderbare Konjunktion', 'auf|Das Buch liegt * dem Tisch.|unveränderbare Präposition', 'dort|Wir treffen uns *.|unveränderbares Adverb', 'sehr|Das freut mich *.|unveränderbares Gradwort', 'als|Ich war schon da, * du kamst.|unveränderbare Konjunktion', 'zu|Es beginnt * schneien.|unveränderbarer Infinitivmarker',
      "dennoch|Es regnete, * gingen wir hinaus.|unveränderbares Adverb", "trotz|* der Kälte gingen wir baden.|unveränderbare Präposition", "sobald|Ruf mich an, * du da bist.|unveränderbare Konjunktion", "bloss|Was soll ich * tun?|unveränderbare Modalpartikel", "hingegen|Am Dienstag * hat das Museum offen.|unveränderbares Adverb", "ausserhalb|Wir wohnen * der Stadt.|unveränderbare Präposition"]
  ],
  [
    ['Laufen|Das * macht ihm Spass.|das Laufen: nominalisierter Infinitiv', 'Grün|Das * der Blätter leuchtet.|das Grün: nominalisierte Farbbezeichnung', 'Lesen|Beim * vergesse ich die Zeit.|beim = bei dem; das Lesen', 'Schweigen|Das * dauerte lange.|das Schweigen: nominalisierter Infinitiv', 'Nichts|Der Nebel kam aus dem *.|das Nichts: festes Genus', 'Heute|Das * zählt.|das Heute: festes Genus',
      "Zögern|Nach kurzem * stimmte sie zu.|das Zögern: nominalisierter Infinitiv", "Durcheinander|Nach dem Umzug herrschte ein grosses *.|das Durcheinander: festes Genus", "Unbehagen|Ein leises * machte sich breit.|das Unbehagen: festes Genus", "Aufsehen|Die Meldung erregte grosses *.|das Aufsehen: festes Genus", "Widerspruch|Er legte * ein.|der Widerspruch: festes Genus", "Morgen|Der * war ungewöhnlich still.|der Morgen: festes Genus"],
    ['laufen|Morgen * wir gemeinsam.|wir laufen, du läufst', 'liebe|Ich * diese Musik.|ich liebe, du liebst', 'werden|Die Tage * kürzer.|die Tage werden, der Tag wird', 'sein|Wir wollen pünktlich *.|ich bin, du bist', 'mag|Er * Schokolade.|ich mag, wir mögen', 'wurde|Es * dunkel.|Form von werden',
      "stünde|Wenn die Tür offen *, könnten wir hinein.|Konjunktiv II von stehen", "wiche|Ohne Hindernis * sie nicht aus.|Konjunktiv II von ausweichen", "hiesse|Das * im Klartext, dass wir umkehren müssen.|Konjunktiv II von heissen", "misslang|Der erste Versuch *.|Präteritum von misslingen", "widerriefe|Sie * ihre Zusage nur im Notfall.|Konjunktiv II von widerrufen", "obliege|Er sagte, die Wahl * dem Ausschuss.|Konjunktiv I von obliegen"],
    ['zwölf|Die * Kinder warten.|die zwölf Kinder: Zahladjektiv nach der Artikelprobe', 'erste|Sie liest den * Satz.|der erste Satz: Ordnungszahl nach der Artikelprobe', 'viel|Ich brauche * Zeit.|die viele Zeit: Artikelprobe gelingt', 'nackt|Das Kind ist *.|das nackte Kind: Artikelprobe gelingt ohne Steigerung', 'liebe|Die * Nachbarin winkt.|die liebe Nachbarin: Artikelprobe gelingt', 'stumm|Der Fisch bleibt *.|der stumme Fisch: Artikelprobe gelingt',
      "anfängliche|Ihre * Sorge erwies sich als unbegründet.|die anfängliche Sorge: Artikelprobe gelingt", "dutzendfach|Der Fehler wurde * wiederholt.|die dutzendfache Wiederholung: Artikelprobe gelingt", "abhold|Er war jeder Neuerung *.|die Neuerungen abholde Person: Artikelprobe gelingt", "unerlässlich|Die Kontrolle ist *.|die unerlässliche Kontrolle", "äussersten|Er betrachtete den * Rand.|der äusserste Rand: Artikelprobe gelingt", "spröde|Das Material wurde *.|das spröde Material: Artikelprobe gelingt"],
    ['sein|Er nimmt * Buch mit.|Possessivpronomen: sein Buch, seine Bücher', 'eines|* der Fenster ist offen.|ersetzt ein Fenster', 'alle|* Kinder sind bereit.|«die alle Kinder» besteht die Artikelprobe nicht', 'der|Der Hund, * bellt, ist jung.|Relativpronomen; der Hund, die Katze, das Tier', 'man|Hier darf * spielen.|unbestimmtes Pronomen für Personen', 'sie|* nehmen den Zug.|ersetzt hier mehrere Personen',
      "derer|Wir gedachten *, die nicht zurückgekehrt waren.|Demonstrativpronomen im Genitiv Plural", "deren|Die Autorin, * Buch wir besprechen, kommt heute.|Relativpronomen im Genitiv", "wessen|* Tasche liegt auf dem Tisch?|Fragepronomen im Genitiv", "denjenigen|Ich danke *, die geholfen haben.|Demonstrativpronomen im Dativ Plural", "jedwede|Sie lehnte * Hilfe ab.|Indefinitpronomen: jedwede Hilfe, jedweden Rat", "wer|* zuerst ankommt, erhält den Schlüssel.|freies Relativpronomen"],
    ['morgen|Wir kommen * wieder.|unveränderbares Adverb', 'während|Er las, * sie schlief.|unveränderbare Konjunktion', 'während|Sie schwieg * des Films.|unveränderbare Präposition', 'doch|Ich rief, * niemand hörte mich.|unveränderbare Konjunktion', 'seit|* Montag ist sie da.|unveränderbare Präposition', 'zu|Die Musik ist * laut.|unveränderbares Gradwort',
      "obschon|Sie ging hinaus, * es schneite.|unveränderbare Konjunktion", "infolge|* des Unwetters fiel der Zug aus.|unveränderbare Präposition", "schier|Die Aufgabe war * unmöglich.|unveränderbares Gradwort", "äusserst|Das Ergebnis ist * erfreulich.|unveränderbares Gradwort", "zumal|Wir blieben zu Hause, * es schon dunkel war.|unveränderbare Konjunktion", "freilich|Das war * leichter gesagt als getan.|unveränderbares Adverb"]
  ]
].map((level, l) => level.flatMap((words, type) => words.map(entry => {
  const [word, middle, last] = entry.split('|');
  return { word, type, sentence: l ? middle : '', clue: l ? last : middle };
})));

// Gruppen teilen sich einen Satzrahmen. Bei Nomen steht der bestimmte Artikel
// im Beispiel, bei Verben markiert ein Modalverb die Infinitivkonstruktion.
const nounGroups = [
  {
    der: 'Apfel Ast Bach Bäcker Ball Bauch Besen Brief Brunnen Bus Daumen Deckel Durst Eimer Elefant Engel Faden Finger Fisch Frosch Fuss Garten Hahn Hafen Hammer Herbst Himmel Hund Hut Käfer Kamm Kasten Keller Koffer Korb Kuchen Löffel Mond Morgenrock Nagel Nebel Ofen Park Pfad Pilz Pinsel Rock Saft Sand Schirm Schuh See Stein Stiefel Stuhl Teller Teppich Tiger Tisch Turm Vogel Wald Weg Wind Zaun Zug',
    die: 'Ampel Banane Bank Birne Blume Brille Bürste Decke Dose Ente Fahne Flasche Fliege Gabel Gans Gasse Glocke Grotte Gurke Halle Hand Hose Insel Jacke Kanne Karte Kette Kirsche Kiste Klingel Krone Küche Lampe Leiter Maus Mütze Nadel Nase Nuss Palme Pfanne Puppe Raupe Rose Schale Schere Schnecke Seife Socke Sonne Tasse Tasche Treppe Tür Uhr Vase Wiese Zahnbürste Zange Zitrone',
    das: 'Auge Bad Bett Bild Boot Brot Buch Dach Dorf Ei Eis Fass Feld Feuer Flugzeug Glas Gras Haar Haus Heft Hemd Kabel Kamel Kanu Kissen Kleid Knie Kraut Küken Land Licht Loch Meer Netz Nest Obst Ohr Paket Papier Pferd Rad Regal Salz Schaf Schiff Schloss Seil Sofa Spiel Tal Tuch Ufer Wasser Zelt Zimmer'
  },
  {
    der: 'Abdruck Abhang Absender Abstand Abstecher Abzweig Anbau Anblick Anfang Anhänger Anlauf Anruf Ansatz Anstoss Antrag Antrieb Anteil Apparat Aufbruch Aufgang Aufprall Aufstieg Auftakt Auftritt Aufwind Aufzug Ausblick Ausschnitt Ausstieg Ausweg Bachlauf Bahnhof Bahnsteig Bauplan Becher Behälter Berggipfel Bericht Beruf Besuch Beutel Beweis Binnenhafen Blumentopf Bote Brand Buntstift Deckelrand Dienst Dunst Durchgang Einband Eindruck Einfall Eingriff Einlass Eintrag Empfang Entwurf Erlass Ertrag Fahrplan Feiertag Fund Gang Gedanke Gipfel Griff Gruss Halt Handgriff Hang Helm Hinweis Inhalt Irrtum Kauf Knoten Kratzer Lauf Laut Lehrgang Leuchtturm',
    die: 'Abfahrt Abfolge Abfrage Abgabe Abkürzung Ablehnung Abreise Absage Abteilung Abwechslung Anleitung Anlage Ankunft Anrede Ansage Ansicht Anweisung Anzeige Anzeigeleuchte Aufgabe Aufnahme Aufschrift Aussicht Ausstellung Auswahl Auskunft Aussage Ausgabe Ausnahme Ausrede Bahnlinie Bedingung Begegnung Beilage Bemerkung Beratung Beschwerde Bestellung Bewegung Bewerbung Beziehung Bitte Dämmerung Darstellung Dauer Deutung Drehscheibe Einfahrt Einigung Einladung Einschätzung Einsicht Einstellung Einteilung Entdeckung Entfernung Entscheidung Entschuldigung Ergänzung Erholung Erklärung Erlaubnis Erfahrung Erinnerung Eröffnung Fährte Fassung Fuge Herkunft Hoffnung Hülle Kenntnis Klammer',
    das: 'Abbild Abenteuer Abkommen Abteil Alter Andenken Angebot Anliegen Anrecht Ansehen Anzeichen Arbeitsblatt Argument Aufgebot Aufsehen Ausmass Badeufer Bauwerk Bedürfnis Befinden Beispiel Bekenntnis Besteck Betriebssystem Bildnis Bündel Denkmal Diktat Drittel Eckfenster Einkommen Ereignis Ergebnis Erlebnis Etikett Fach Fernrohr Fahrzeug Formular Gefäss Geflecht Gehege Geheimnis Gehör Gelände Geländer Gemälde Gepäck Gerüst Geschirr Geschenk Gewässer Gewebe Gewitter Gleichgewicht Gleis Handbuch Handwerk Heizwerk Hindernislauf Jahrzehnt Kaufhaus Kiesbett Kleingeld'
  },
  {
    der: 'Abgesang Abgrund Ablass Abnehmer Abzug Affront Akkord Algorithmus Almanach Amboss Anachronismus Anklang Ansporn Anstrich Antiquar Anverwandte Applaus Archivbestand Argwohn Aufschluss Aufschub Aufschwung Augenblick Ausgleich Ausschlag Ausspruch Befund Begriff Behelf Belag Beleg Beisatz Beistand Beweggrund Bruchteil Damm Denkanstoss Drehpunkt Dreiklang Dreisatz Dünkel Eifer Eigenbrötler Eigenwert Einbruch Einwand Einzugsbereich Engpass Erlös Fadenriss Fehlschluss Felsvorsprung Fingerzeig Fluchtpunkt Freiraum Freispruch Frohsinn Fürsprecher Gegenentwurf Gegenpol Gegensinn Gehalt Geistesblitz Grenzfall Grundriss Grundsatz',
    die: 'Abbitte Abbruchkante Abneigung Abnutzung Abscheu Abspaltung Abstufung Abwägung Abweichung Aktennotiz Allegorie Ambivalenz Anbahnung Anfechtung Anhäufung Anmassung Anmut Anordnung Anspannung Anspielung Anstrengung Anziehung Aufarbeitung Aufbewahrung Aufdeckung Auffassung Aufhebung Aufklärung Auflage Auflösung Aufteilung Ausarbeitung Ausbeute Ausdehnung Ausflucht Ausführung Auslegung Ausprägung Ausrichtung Ausschreibung Ausweitung Bannmeile Bauchrednerei Bedrängnis Befangenheit Befugnis Begebenheit Begehrlichkeit Beharrlichkeit Behelfslösung Beklommenheit Belanglosigkeit Belastbarkeit Beliebigkeit Benachteiligung Berechtigung Bescheidenheit Beschaffenheit Besonnenheit Beständigkeit Bestrebung Betroffenheit Beugung Bewandtnis Bezugsgrösse Bildsprache Bindekraft Brisanz',
    das: 'Abhandenkommen Abseits Abwarten Adagio Aggregat Allerlei Altertum Amalgam Amtssiegel Analogon Angesicht Anschauungsmaterial Ansinnen Antragsrecht Aufbegehren Aufgebotsschreiben Aufschäumen Auftreten Ausbleiben Aushängeschild Auskommen Ausscheiden Aussetzen Aussterben Auswärtsspiel Beiwerk Beisammensein Behagen Beiheft Beharrungsvermögen Bestreben Binnenland Blendwerk Bollwerk Bruchstück Bruttoeinkommen Dasein Debakel Dickicht Dilemma Dingwort Dispositiv Druckmittel Durchhaltevermögen Durchwursteln Ebenbild Echo Eiland Einmaleins Einsehen Einspruchsrecht Einvernehmen Eigenleben Elend Emblem Entgegenkommen Entgelt Entsetzen Entweder-oder Erbe Erbgut Ermessen Ersuchen Erwachen Exemplar Exil Faksimile Feingefühl'
  }
];

const verbGroups = [
  ['Wir können gemeinsam *.', 'arbeiten angeln basteln baden beten blinzeln boxen brüllen campen chatten duschen eilen feiern filmen fischen flüstern fotografieren friemeln gähnen gärtnern grillen grinsen grummeln hämmern häkeln heulen hocken hoffen hüpfen jubeln joggen kichern klagen klatschen klettern klingeln klopfen knien kochen kraulen kreischen lachen lächeln lauschen leben lernen lügen marschieren nicken nähen packen pfeifen plaudern planschen pokern putzen radeln rasten raten rechnen reisen reiten rennen rollen rudern ruhen rufen sammeln scherzen schimpfen schlendern schlitteln schluchzen schmunzeln schnarchen schnaufen schnippen segeln seufzen sitzen skaten staunen steppen strahlen stricken stöhnen streiten studieren surfen tippen träumen trommeln trödeln turnen üben wandern warten winken wippen witzeln wohnen zeichnen zittern zögern zuhören zuschauen'],
  ['Das können wir *.', 'abbauen abbilden abdecken abdichten abdrucken abfragen abgeben abhaken abholen abklären ablehnen ablesen abmessen abnehmen abrunden absagen abschicken abschliessen abschneiden abschreiben abspülen abstimmen abtasten abtrennen abwaschen abwiegen abzeichnen ändern anfeuchten angeben angleichen anheben ankleben ankreuzen anmalen anmerken annehmen anordnen anpassen anprobieren anrühren anschalten anschauen anschieben anschliessen anstecken anstreichen antippen anzeigen aufbewahren aufdecken auffalten auffangen auffüllen aufheben aufklappen aufkleben auflösen aufmachen aufräumen aufschreiben aufstellen aufteilen aufwärmen aufzeichnen ausbessern ausbreiten ausdrucken ausfüllen ausgleichen ausleihen ausliefern ausmessen ausprobieren ausräumen ausrechnen ausrichten ausschalten ausschneiden aussortieren aussprechen austauschen auswählen auswerten beantworten bearbeiten beachten beantragen beaufsichtigen bebildern bedrucken beenden befolgen befragen begründen behalten benennen beobachten beraten berichten beschreiben bestätigen betrachten bewerten bewundern'],
  ['Das lässt sich *.', 'abändern aberkennen abfedern abgrenzen abkürzen abmildern abstrahieren abwägen adaptieren akzentuieren analysieren andeuten anerkennen anfechten anonymisieren antizipieren arrangieren aufarbeiten aufdröseln aufgliedern aufschlüsseln ausarbeiten ausblenden ausdeuten ausgleichen ausklammern aushandeln auslegen ausloten ausmustern aussetzen ausstaffieren bekräftigen beanstanden beauftragen bedingen beeinspruchen begradigen begutachten beilegen beimessen bekunden bemängeln bemessen bemustern benachrichtigen benachteiligen bereinigen bereuen berichtigen beschwichtigen beseitigen besiegeln bespötteln bestreiten beziffern bilanzieren binden boykottieren chiffrieren dementieren demontieren diagnostizieren differenzieren digitalisieren diskreditieren dokumentieren durchdenken durchdringen durchleuchten durchsetzen einbeziehen einbetten eindämmen eingrenzen einordnen einräumen einsehen einstufen einwenden entbehren entbinden entflechten entkräften entlarven entmachten enträtseln entwirren erachten erahnen erbeuten ergründen erhellen erlassen ermitteln erörtern erschliessen erschweren erspähen erwidern erwägen extrapolieren falsifizieren folgern forcieren']
];

const adjectiveGroups = [
  [
    ['Das Kind wirkt *.', 'aufmerksam aufgeregt ausgeglichen ausgelassen beleidigt blass brav durstig ehrlich eifrig faul frech froh geduldig geizig gelassen gemütlich gesund geschickt gesprächig glücklich grosszügig höflich hitzig hilfsbereit jung klug krank lebhaft munter neugierig nervös ordentlich ruhig schüchtern schlau schläfrig stolz tapfer traurig treu ungeduldig verlegen wach wütend'],
    ['Die Oberfläche wirkt *.', 'blank blau braun bunt dunkel eben feucht fleckig flach gelb glatt grau grün hart heiss klebrig körnig matt nass orange rosa rot rau rötlich rutschig sauber scharf schmutzig schwarz seidig silbrig stumpf trocken wellig weiss zerkratzt'],
    ['Das Bauwerk wirkt *.', 'alt baufällig dicht dick dünn eng fest gross hoch hübsch krumm kühl leicht niedrig neu riesig schief schmal schlicht stabil steil winzig']
  ],
  [
    ['Die Person wirkt *.', 'abgelenkt abwesend albern angespannt ängstlich anständig ansprechbar anwesend arbeitsscheu arglos bedächtig bedrohlich bedürftig belesen beredt bescheiden besorgt bestimmt chaotisch dankbar dickköpfig eigensinnig empfindlich enttäuscht entschlossen entspannt ernst erschöpft erfahren fähig fair furchtlos gereizt gesellig gewissenhaft gutgläubig heiter hilflos impulsiv launisch misstrauisch nachdenklich nachsichtig ratlos redselig rücksichtsvoll schlagfertig schlampig selbstbewusst sorglos sportlich stur taktvoll unerschrocken unfreundlich ungehalten unsicher verschlossen verständnisvoll verträumt wortkarg zögerlich zuversichtlich zuverlässig'],
    ['Das Ergebnis wirkt *.', 'ähnlich anschaulich ansehnlich brauchbar dauerhaft deutlich einheitlich erfreulich erstaunlich fehlerfrei fehlerhaft fraglich gründlich haltbar jämmerlich knapp lückenhaft mängelfrei merkwürdig passend plausibel präzise rätselhaft sorgfältig tragbar überzeugend unauffällig ungewöhnlich unklar unpassend verblüffend vorläufig zweifelhaft']
  ],
  [
    ['Die Begründung wirkt *.', 'abenteuerlich abwegig abstrus anfechtbar anmassend anrüchig aussagekräftig bedenkenlos bedenklich befremdlich belanglos belastbar bestechend brisant fadenscheinig fundiert gehaltvoll gehässig gekünstelt geschraubt gewagt gewichtig haarsträubend hiebfest hinfällig irreführend karg kleinkariert lapidar logisch lückenlos hanebüchen nachprüfbar nebulös oberflächlich ominös polemisch pointiert redlich redundant raffiniert sachfremd schlüssig seicht selektiv spekulativ stichhaltig strittig suggestiv tendenziös trivial unaufrichtig unbestimmt undurchschaubar unfundiert unhaltbar unlauter unverbindlich unvoreingenommen vage verfehlt vermessen verschroben verständlich widersprüchlich willkürlich zweideutig'],
    ['Die Stimmung wirkt *.', 'ambivalent andächtig bedrückt befangen beklemmend besinnlich ausgelaugt ausgelassen distanziert düster elegisch feierlich frostig gedrückt gereizt gespenstisch gravitätisch harsch herzlich hitzig melancholisch nüchtern pathetisch rastlos resigniert ruppig schwermütig spannungsgeladen überschwänglich unterkühlt verhalten verkrampft versöhnlich wehmütig zermürbend zerrissen']
  ]
];

const shortWordGroups = [
  [
    'er|* liest ein Buch.|Personalpronomen für eine männliche Person',
    'ihr|Kommt * mit?|Personalpronomen für mehrere angesprochene Personen',
    'dich|Ich sehe * dort drüben.|Personalpronomen im Akkusativ',
    'mich|Hörst du *?|Personalpronomen im Akkusativ',
    'ihn|Wir rufen * an.|Personalpronomen im Akkusativ',
    'ihnen|Wir helfen * beim Tragen.|Personalpronomen im Dativ',
    'dein|Ist das * Stift?|Possessivpronomen: dein Stift, deine Tasche',
    'unser|Hier steht * Bus.|Possessivpronomen: unser Bus, unsere Bahn',
    'euer|Wo liegt * Heft?|Possessivpronomen: euer Heft, eure Hefte',
    'einem|Wir gehen mit * Hund spazieren.|Unbestimmter Artikel im Dativ',
    'diese|Ich nehme * Tasse.|Demonstrativpronomen: diese Tasse, dieser Becher',
    'wen|* suchst du?|Fragepronomen im Akkusativ',
    'aus|Sie kommt * der Schule.|Unveränderbare Präposition',
    'bei|Ich warte * der Tür.|Unveränderbare Präposition',
    'bis|Wir bleiben * morgen.|Unveränderbare Präposition',
    'für|Das Geschenk ist * dich.|Unveränderbare Präposition',
    'nach|Wir fahren * Bern.|Unveränderbare Präposition',
    'vor|Wir stehen * der Tür.|Unveränderbare Präposition',
    'über|Der Ball fliegt * den Zaun.|Unveränderbare Präposition',
    'oft|Ich spiele * draussen.|Unveränderbares Adverb',
    'nie|Hier war ich noch *.|Unveränderbares Adverb',
    'immer|Er kommt * pünktlich.|Unveränderbares Adverb',
    'jetzt|Wir gehen * los.|Unveränderbares Adverb',
    'bald|Der Bus kommt *.|Unveränderbares Adverb'
  ],
  [
    'diesem|Mit * Werkzeug geht es leichter.|Demonstrativpronomen im Dativ',
    'einen|Sie hat * Hund gesehen.|Unbestimmter Artikel im Akkusativ',
    'keinem|Wir haben * Menschen davon erzählt.|Indefinitpronomen im Dativ',
    'einer|Sie half * Nachbarin.|Unbestimmter Artikel im Dativ',
    'solche|* Fragen höre ich oft.|Demonstrativpronomen: solche Fragen, solcher Lärm',
    'jedem|Er gab * Kind einen Apfel.|Indefinitpronomen im Dativ',
    'manchen|Die Übung fiel * Kindern leicht.|Indefinitpronomen im Dativ Plural',
    'unserem|Die Katze schläft auf * Sofa.|Possessivpronomen im Dativ',
    'meines|Das ist das Fahrrad * Bruders.|Possessivpronomen im Genitiv',
    'ihrem|Wir standen vor * Haus.|Possessivpronomen im Dativ',
    'eure|Ich habe * Bücher gefunden.|Possessivpronomen: eure Bücher, euer Buch',
    'welchem|Mit * Bus seid ihr gekommen?|Fragepronomen im Dativ',
    'falls|Ruf an, * du dich verspätest.|Unveränderbare Konjunktion',
    'damit|Sie übt, * der Vortrag gelingt.|Unveränderbare Konjunktion',
    'sondern|Er läuft nicht, * fährt mit dem Velo.|Unveränderbare Konjunktion',
    'bevor|Pack ein, * es regnet.|Unveränderbare Konjunktion',
    'seitdem|Sie übt täglich, * sie im Chor singt.|Unveränderbare Konjunktion',
    'entlang|Wir gingen den Fluss *.|Unveränderbare nachgestellte Präposition',
    'gegenüber|Die Apotheke liegt * dem Bahnhof.|Unveränderbare Präposition',
    'unterhalb|Die Hütte steht * der Baumgrenze.|Unveränderbare Präposition',
    'beinahe|Sie hätte * den Zug verpasst.|Unveränderbares Adverb',
    'mittlerweile|Der Schnee ist * geschmolzen.|Unveränderbares Adverb',
    'sogar|Er lernte * in den Ferien.|Unveränderbares Fokuswort',
    'nämlich|Ich kenne sie * schon seit Jahren.|Unveränderbares Adverb'
  ],
  [
    'dieselbe|Er stellte * Frage noch einmal.|Demonstrativpronomen: dieselbe Frage, derselbe Einwand',
    'denselben|Wir wiederholten * Versuch.|Demonstrativpronomen im Akkusativ',
    'demselben|Beide Teams folgten * Plan.|Demonstrativpronomen im Dativ',
    'derjenige|Wer ist *, der Einspruch erhoben hat?|Demonstrativpronomen: derjenige, diejenige, dasjenige',
    'demjenigen|Der Preis gebührt *, der gewonnen hat.|Demonstrativpronomen im Dativ',
    'diejenigen|Sie bat *, die schon fertig waren, um Hilfe.|Demonstrativpronomen im Akkusativ Plural',
    'mancher|* Einwand erwies sich als berechtigt.|Indefinitpronomen im Nominativ',
    'manchem|Das macht * Verein zu schaffen.|Indefinitpronomen im Dativ',
    'keiner|* der Berichte erwähnt den Fehler.|Indefinitpronomen im Nominativ',
    'jeglichen|Sie widersprach * Einwänden.|Indefinitpronomen im Dativ Plural',
    'jedweden|Er vermied * Streit.|Indefinitpronomen im Akkusativ',
    'jenem|Die Geschichte spielt in * Tal.|Demonstrativpronomen im Dativ',
    'angesichts|* der Beweislage zog er den Einwand zurück.|Unveränderbare Präposition',
    'anlässlich|* des Jubiläums erschien eine Festschrift.|Unveränderbare Präposition',
    'einschliesslich|Der Preis gilt * der Gebühren.|Unveränderbare Präposition',
    'ungeachtet|* der Warnung setzte sie ihren Weg fort.|Unveränderbare Präposition',
    'willen|Um des Friedens * gab er nach.|Teil der unveränderbaren zweiteiligen Präposition um … willen',
    'mithin|Die Frist ist abgelaufen, der Antrag ist * verspätet.|Unveränderbares Adverb',
    'gleichwohl|Es gab Zweifel, * stimmte der Rat zu.|Unveränderbares Adverb',
    'indessen|Sie wartete noch, * war der Zug längst abgefahren.|Unveränderbares Adverb',
    'beileibe|Das war * kein Zufall.|Unveränderbares Adverb',
    'allein|Er wollte helfen, * es war zu spät.|Unveränderbare Konjunktion in der Bedeutung aber',
    'sofern|Die Regel gilt, * nichts anderes vereinbart wurde.|Unveränderbare Konjunktion',
    'obgleich|Sie übte weiter, * sie schon müde war.|Unveränderbare Konjunktion'
  ]
];

function expandGroup(words, type, sentence, explain) {
  return words.trim().split(/\s+/).map(word => ({word, type, sentence, clue: explain(word)}));
}

const objectArticles = {der: 'den', die: 'die', das: 'das'};
const vocabulary = starterVocabulary.map((starter, level) => {
  const nouns = Object.entries(nounGroups[level]).flatMap(([article, words]) =>
    expandGroup(words, 0, `Im Gespräch geht es um ${objectArticles[article]} *.`,
      word => `${article} ${word}: Das Nomen hat ein festes Genus`));
  const [verbSentence, verbs] = verbGroups[level];
  const actions = expandGroup(verbs, 1, verbSentence,
    word => `${word} ist hier der Infinitiv und gehört zum Verbgefüge`);
  const adjectives = adjectiveGroups[level].flatMap(([sentence, words]) =>
    expandGroup(words, 2, sentence, word => `Hier beschreibt ${word} eine Eigenschaft. Nach «wirkt» bleibt das Adjektiv ungebeugt`));

  const shortWords = shortWordGroups[level].map((entry, index) => {
    const [word, sentence, clue] = entry.split('|');
    const type = index < 12 ? 3 : 4;
    return {word, type, sentence, clue};
  });
  const seen = new Set(starter.map(card => card.word));
  const extra = [...nouns, ...actions, ...adjectives, ...shortWords].filter(card => {
    if (seen.has(card.word)) return false;
    seen.add(card.word);
    return true;
  });
  return [...starter, ...extra];
});

const stations = {
  change: ['Ist das Wort veränderbar?', ['Veränderbar', 'Unveränderbar']],
  form: ['Wie lässt sich das Wort verändern?', ['Konjugierbar', 'Deklinierbar']],
  gender: ['Welches Genus hat das Wort?', ['Festes Genus', 'Kein festes Genus']],
  article: ['Passt das Wort zwischen einen Artikel und ein Nomen? Du darfst die Endung anpassen.', ['Ja, es passt', 'Nein, es passt nicht']]
};
const routes = [
  [['change',0],['form',1],['gender',0]],
  [['change',0],['form',0]],
  [['change',0],['form',1],['gender',1],['article',0]],
  [['change',0],['form',1],['gender',1],['article',1]],
  [['change',1]]
];

// Das Zehn-Wortarten-Modell in diesem Niveau trennt Artikel und Zahlwörter
// sowie die vier bisher unter Partikeln zusammengefassten Wortarten.
const tenClasses = ['Nomen', 'Verb', 'Adjektiv', 'Pronomen', 'Artikel', 'Numerale', 'Adverb', 'Präposition', 'Konjunktion', 'Interjektion'];
const tenShortLabels = ['Nom.', 'Verb', 'Adj.', 'Pron.', 'Art.', 'Num.', 'Adv.', 'Präp.', 'Konj.', 'Int.'];
const tenTints = [...tints, '#ffe4a9', '#a5f7ec', '#e2b8ff', '#ffb6dd', '#d5f58f'];
const conjunctionKinds = ['Nebenordnend', 'Unterordnend'];
const adjectiveUses = ['Attributiv', 'Prädikativ', 'Adverbial'];
const pronounKinds = ['Personalpronomen', 'Reflexivpronomen', 'Possessivpronomen', 'Demonstrativpronomen', 'Relativpronomen', 'Interrogativpronomen', 'Indefinitpronomen'];

const tenExamples = [
  [
    'Lesen|Das * beruhigt sie.|Der Artikel «das» begleitet den nominalisierten Infinitiv',
    'Morgen|Der * war kühl.|«Morgen» bezeichnet hier eine Tageszeit und steht mit Artikel',
    'Dank|Der * galt dem ganzen Team.|«Dank» ist hier das Subjekt und hat das feste Genus maskulin',
    'Aufsehen|Das Experiment erregte *.|«Das Aufsehen» ist ein Nomen mit festem Genus',
    'Blau|Das tiefe * gefiel ihm.|Die Farbbezeichnung ist hier nominalisiert'
  ],
  [
    'lesen|Die Kinder * im Garten.|Die Form lässt sich nach der Person verändern. Ich lese, sie lesen',
    'sei|Sie sagte, der Weg * frei.|«Sei» ist Konjunktiv I von «sein»',
    'wäre|Das * eine Überraschung.|«Wäre» ist Konjunktiv II von «sein»',
    'stehen|Die Gläser * auf dem Tisch.|Die Form lässt sich konjugieren. Das Glas steht, die Gläser stehen',
    'widerriefe|Er * seine Zusage nur im Notfall.|Konjunktiv II von «widerrufen»'
  ],
  [
    'schnelle|Der * Zug hält hier.|0|«Schnelle» steht direkt beim Nomen «Zug» und hat eine Endung',
    'kalten|Wir trinken den * Tee.|0|«Kalten» beschreibt das Nomen «Tee» direkt',
    'schwer|Der Koffer ist *.|1|«Schwer» beschreibt das Subjekt über das Verb «ist»',
    'ruhig|Das Meer bleibt *.|1|«Ruhig» beschreibt das Subjekt über das Verb «bleibt»',
    'leise|Sie spricht *.|2|«Leise» beschreibt, wie sie spricht',
    'schnell|Der Zug fährt *.|2|«Schnell» beschreibt, wie der Zug fährt',
    'sorgfältig|Er prüft die Lösung *.|2|«Sorgfältig» beschreibt, wie er prüft'
  ],
  [
    'ihm|Wir helfen * beim Umzug.|0|«Ihm» steht für eine Person im Dativ',
    'sie|Heute kommen * mit dem Zug.|0|«Sie» steht hier für mehrere Personen',
    'mein|Wo liegt * Heft?|2|«Mein» drückt aus, wem das Heft gehört',
    'ihren|Sie rief * Bruder an.|2|«Ihren» bezeichnet hier eine Zugehörigkeit',
    'sich|Die Katze putzt *.|1|«Sich» bezieht sich auf das Subjekt «die Katze» zurück',
    'mich|Ich freue * auf morgen.|1|«Mich» bezieht sich hier auf das Subjekt «ich» zurück',
    'dieser|* Weg führt zum Bahnhof.|3|«Dieser» weist auf einen bestimmten Weg hin',
    'jene|Ich meine * dort hinten.|3|«Jene» weist auf eine bestimmte Person oder Sache hin',
    'deren|Die Autorin, * Buch wir lesen, kommt heute.|4|«Deren» leitet einen Relativsatz ein und bezieht sich auf «Autorin»',
    'der|Der Hund, * bellt, ist jung.|4|«Der» bezieht sich auf «Hund» und leitet einen Relativsatz ein',
    'wem|* gehört das Velo?|5|«Wem» fragt nach einer Person im Dativ',
    'welches|* Buch möchtest du lesen?|5|«Welches» fragt nach einer Auswahl',
    'niemand|Heute war * im Büro.|6|«Niemand» bezeichnet eine unbestimmte Menge von null Personen',
    'jemand|Hat * geklopft?|6|«Jemand» steht für eine unbestimmte Person',
    'kein|Heute fährt * Zug.|6|«Kein» gehört nach der Vorlage zu den Indefinitpronomen',
    'einander|Die Nachbarn helfen *.|1|«Einander» ist hier ein Reflexivpronomen mit gegenseitiger Bedeutung'
  ],
  [
    'das|Ich öffne * Fenster.|«Das» steht vor einem Nomen und bestimmt es',
    'eine|Sie liest * Geschichte.|«Eine» ist ein unbestimmter Artikel',
    'dem|Wir geben * Kind den Ball.|«Dem» ist ein bestimmter Artikel im Dativ',
    'den|Ich kenne * Weg.|«Den» ist ein bestimmter Artikel im Akkusativ',
    'einem|Er fährt mit * Velo zur Schule.|«Einem» ist ein unbestimmter Artikel im Dativ'
  ],
  [
    'zwölf|Die * Kinder warten.|«Zwölf» gibt eine Anzahl an',
    'drei|Auf dem Tisch liegen * Äpfel.|«Drei» gibt eine Anzahl an',
    'erste|Sie liest den * Satz.|«Erste» gibt einen Platz in einer Reihenfolge an',
    'dritten|Sie sitzt in der * Reihe.|«Dritten» bezeichnet die Position der Reihe',
    'hundert|Im Saal sitzen * Personen.|«Hundert» bezeichnet eine Anzahl'
  ],
  [
    'morgen|Wir kommen * wieder.|«Morgen» gibt an, wann wir kommen',
    'dort|Wir treffen uns *.|«Dort» gibt den Ort an',
    'gestern|Sie kam * an.|«Gestern» ist eine Zeitangabe',
    'oft|Er fährt * mit dem Zug.|«Oft» bezeichnet die Häufigkeit',
    'trotzdem|Es regnet. Wir gehen * hinaus.|«Trotzdem» ist hier ein Adverb und steht im Hauptsatz'
  ],
  [
    'mit|Wir fahren * dem Zug.|«Mit» steht vor einer Wortgruppe im Dativ',
    'trotz|* des Regens spielen wir draussen.|«Trotz» leitet eine Wortgruppe im Genitiv ein',
    'während|Sie schwieg * des Films.|«Während» steht hier vor einer Wortgruppe im Genitiv',
    'ohne|Sie ging * ihren Mantel hinaus.|«Ohne» verlangt hier den Akkusativ',
    'wegen|* der Hitze blieb das Fenster offen.|«Wegen» leitet die Wortgruppe «der Hitze» ein'
  ],
  [
    'während|Er las, * sie schlief.|1|«Während» leitet hier einen Nebensatz ein',
    'weil|Er blieb zu Hause, * er krank war.|1|«Weil» leitet einen Nebensatz ein',
    'und|Mia * Leo warten draussen.|0|«Und» verbindet zwei gleichrangige Namen',
    'obwohl|Sie ging hinaus, * es schneite.|1|«Obwohl» leitet einen Nebensatz ein',
    'aber|Es regnet, * wir gehen hinaus.|0|«Aber» verbindet zwei gleichrangige Hauptsätze'
  ],
  [
    'Aua|*, das tut weh!|«Aua» ist ein selbstständiger Ausruf',
    'Hurra|*, wir haben gewonnen!|«Hurra» drückt Freude aus und steht als Ausruf ausserhalb des Satzes',
    'Pst|*, da kommt jemand.|«Pst» ist ein selbstständiger Ruf zur Ruhe',
    'Igitt|*, das riecht unangenehm!|«Igitt» ist ein Ausruf des Ekels',
    'Oje|*, jetzt regnet es schon wieder.|«Oje» ist ein selbstständiger Ausruf'
  ]
];

vocabulary.push(tenExamples.flatMap((entries, type) => entries.map(entry => {
  const [word, sentence, third, fourth] = entry.split('|');
  return {word, type, sentence, subtype: fourth ? Number(third) : null, clue: fourth ?? third};
})));
