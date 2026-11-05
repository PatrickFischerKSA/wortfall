'use strict';
const classes = ['Nomen', 'Verb', 'Adjektiv', 'Pronomen', 'Partikel'];
const tints = ['#ffdb86', '#d8c9ff', '#b8eed8', '#ffc9bb', '#bde6ff'];
// Jede Stufe enthält sechs Beispiele pro Wortart. Ein * markiert das Zielwort im Satz.
const vocabulary = [
  [
    ['Baum|der Baum, die Bäume', 'Wolke|die Wolke, die Wolken', 'Schule|die Schule, die Schulen', 'Huhn|das Huhn, die Hühner', 'Fahrrad|das Fahrrad, die Fahrräder', 'Berg|der Berg, die Berge'],
    ['laufen|ich laufe, du läufst', 'schreiben|ich schreibe, du schreibst', 'fliegen|ich fliege, du fliegst', 'lesen|ich lese, du liest', 'springen|ich springe, du springst', 'singen|ich singe, du singst'],
    ['hell|die helle Lampe', 'laut|das laute Lied', 'klein|der kleine Hund', 'kalt|der kalte Wind', 'mutig|die mutige Katze', 'weich|das weiche Kissen'],
    ['ich|ersetzt die sprechende Person', 'du|ersetzt die angesprochene Person', 'wir|steht für die sprechende Gruppe', 'ihm|steht im Dativ: Ich helfe ihm', 'euch|steht für die angesprochene Gruppe', 'niemand|steht für keine Person'],
    ['gestern|unveränderbares Adverb', 'aber|unveränderbare Konjunktion', 'mit|unveränderbare Präposition', 'und|unveränderbare Konjunktion', 'nicht|unveränderbares Wort der Verneinung', 'wegen|unveränderbare Präposition']
  ],
  [
    ['Geduld|Die * hilft dir beim Üben.|die Geduld: festes Genus', 'Freude|Die * war gross.|die Freude: festes Genus', 'Regen|Der * liess nach.|der Regen: festes Genus', 'Entscheid|Der * fiel gestern.|der Entscheid: festes Genus', 'Mut|Ihr * beeindruckt mich.|der Mut: festes Genus', 'Antwort|Deine * stimmt.|die Antwort: festes Genus'],
    ['liest|Sie * einen Krimi.|ich lese, sie liest', 'wäre|Das * schön.|Form von sein', 'kam|Er * zu spät.|Form von kommen', 'hilft|Wer * uns?|ich helfe, er hilft', 'sah|Ich * einen Fuchs.|Form von sehen', 'könnte|Das * stimmen.|Form von können'],
    ['freundlich|Sie grüssen *.|die freundlichen Leute', 'besser|Das klingt *.|die bessere Lösung', 'mündlich|Die Prüfung ist *.|die mündliche Prüfung', 'leise|Wir gehen * hinaus.|die leisen Schritte', 'grüner|Dort wächst ein * Busch.|der grüne Busch', 'schnell|Sie läuft *.|die schnelle Läuferin'],
    ['eine|Wir sehen * Katze.|unbestimmter Artikel', 'das|Ich öffne * Fenster.|bestimmter Artikel', 'mein|Wo ist * Heft?|Possessivpronomen; mein Heft, meine Tasche', 'dieser|* Bus hält hier.|Demonstrativpronomen; dieser Bus, diese Bahn', 'wem|* gehört der Stift?|Fragepronomen; wer, wem, wen', 'welche|* Tür ist offen?|Fragepronomen; welcher, welche, welches'],
    ['obwohl|Ich gehe, * es regnet.|unveränderbare Konjunktion', 'auf|Das Buch liegt * dem Tisch.|unveränderbare Präposition', 'dort|Wir treffen uns *.|unveränderbares Adverb', 'sehr|Das freut mich *.|unveränderbares Gradwort', 'als|Ich war schon da, * du kamst.|unveränderbare Konjunktion', 'zu|Es beginnt * schneien.|unveränderbarer Infinitivmarker']
  ],
  [
    ['Laufen|Das * macht ihm Spass.|das Laufen: nominalisierter Infinitiv', 'Grün|Das * der Blätter leuchtet.|das Grün: nominalisierte Farbbezeichnung', 'Lesen|Beim * vergesse ich die Zeit.|beim = bei dem; das Lesen', 'Schweigen|Das * dauerte lange.|das Schweigen: nominalisierter Infinitiv', 'Nichts|Der Nebel kam aus dem *.|das Nichts: festes Genus', 'Heute|Das * zählt.|das Heute: festes Genus'],
    ['laufen|Morgen * wir gemeinsam.|wir laufen, du läufst', 'liebe|Ich * diese Musik.|ich liebe, du liebst', 'werden|Die Tage * kürzer.|die Tage werden, der Tag wird', 'sein|Wir wollen pünktlich *.|ich bin, du bist', 'mag|Er * Schokolade.|ich mag, wir mögen', 'wurde|Es * dunkel.|Form von werden'],
    ['zwölf|Die * Kinder warten.|die zwölf Kinder: Zahladjektiv nach der Artikelprobe', 'erste|Sie liest den * Satz.|der erste Satz: Ordnungszahl nach der Artikelprobe', 'viel|Ich brauche * Zeit.|die viele Zeit: Artikelprobe gelingt', 'nackt|Das Kind ist *.|das nackte Kind: Artikelprobe gelingt ohne Steigerung', 'liebe|Die * Nachbarin winkt.|die liebe Nachbarin: Artikelprobe gelingt', 'stumm|Der Fisch bleibt *.|der stumme Fisch: Artikelprobe gelingt'],
    ['sein|Er nimmt * Buch mit.|Possessivpronomen: sein Buch, seine Bücher', 'eines|* der Fenster ist offen.|ersetzt ein Fenster', 'alle|* Kinder sind bereit.|«die alle Kinder» besteht die Artikelprobe nicht', 'der|Der Hund, * bellt, ist jung.|Relativpronomen; der Hund, die Katze, das Tier', 'man|Hier darf * spielen.|unbestimmtes Pronomen für Personen', 'sie|* nehmen den Zug.|ersetzt hier mehrere Personen'],
    ['morgen|Wir kommen * wieder.|unveränderbares Adverb', 'während|Er las, * sie schlief.|unveränderbare Konjunktion', 'während|Sie schwieg * des Films.|unveränderbare Präposition', 'doch|Ich rief, * niemand hörte mich.|unveränderbare Konjunktion', 'seit|* Montag ist sie da.|unveränderbare Präposition', 'zu|Die Musik ist * laut.|unveränderbares Gradwort']
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
