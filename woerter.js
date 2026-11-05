'use strict';
const classes = ['Nomen', 'Verb', 'Adjektiv', 'Pronomen', 'Partikel'];
const tints = ['#ffdb86', '#d8c9ff', '#b8eed8', '#ffc9bb', '#bde6ff'];
// Jede Stufe enthält zwölf Beispiele pro Wortart. Ein * markiert das Zielwort im Satz.
const vocabulary = [
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
      "dessen|Der Baum, * Äste abbrechen, ist morsch.|Relativpronomen im Genitiv", "kein|Heute fährt * Zug.|Negativartikel im Fünf-Wortarten-Modell", "jenes|Wir besuchen * Museum.|Demonstrativpronomen", "derselbe|Es war * Fahrer wie gestern.|Demonstrativpronomen", "einander|Sie helfen * beim Umzug.|Reziprokpronomen", "sich|Die Katze putzt *.|Reflexivpronomen"],
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

const stations = {
  change: ['Ist das Wort veränderbar?', ['Veränderbar', 'Unveränderbar']],
  form: ['Wie lässt sich das Wort verändern?', ['Konjugierbar', 'Deklinierbar']],
  gender: ['Welches Genus hat das Wort?', ['Festes Genus', 'Kein festes Genus']],
  article: ['Artikelprobe: Passt es zwischen Artikel und Nomen?', ['Probe gelingt', 'Probe gelingt nicht']]
};
const routes = [
  [['change',0],['form',1],['gender',0]],
  [['change',0],['form',0]],
  [['change',0],['form',1],['gender',1],['article',0]],
  [['change',0],['form',1],['gender',1],['article',1]],
  [['change',1]]
];
