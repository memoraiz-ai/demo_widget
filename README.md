# MemorAIz Demo Widget

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

Demo interattiva dei widget educativi di **MemorAIz**: quiz, flashcard, mindmap, podcast e crossword, completamente personalizzabili in stile e funzionalita.

[Live Demo](https://demo-memoraiz.vercel.app/)

</div>

## Panoramica

Questa applicazione mostra una suite di componenti educativi interattivi, ciascuno configurabile tramite un pannello laterale. L'utente puo esplorare diverse modalita, stili visivi e opzioni, per poi esportare la configurazione scelta in formato JSON.

## Funzionalita

### Quiz

Quattro modalita di quiz, ciascuna con timer configurabile, feedback immediato e punteggi personalizzabili:

- **Risposta singola** — classico quiz a scelta singola con radio button
- **Risposta multipla** — piu risposte corrette per domanda con checkbox
- **Vero/Falso** — formato binario con pulsanti stilizzati
- **Riquadri contornati** — variante visiva con layout a card e checkmark

### Flashcard

Carte interattive con animazione flip, timer indipendente e shuffle:

- **Classica** — domanda e risposta con flip della carta
- **Riempi lo spazio** — completamento con parola mancante
- **Mix** — combinazione delle due modalita

### Mindmap

Mappa concettuale interattiva per l'apprendimento visivo:

- Tre livelli di dettaglio: basso, medio, alto
- Nodi espandibili con tooltip informativi
- Etichette sulle connessioni tra i concetti
- Minimap per la navigazione
- Modalita statica o dinamica

### Podcast

Player audio integrato con supporto alla trascrizione:

- Trascrizione semplice o dettagliata
- Configurazione voce e lingua
- Supporto multispeaker
- Musica di sottofondo opzionale

### Crossword

Griglia interattiva di parole crociate con timer e suggerimenti:

- Tre livelli di difficolta: facile, medio, difficile
- Timer configurabile con avviso di scadenza
- Pulsante di risoluzione e di restart
- Navigazione tra definizioni

### Stili visivi

8 temi applicabili indipendentemente a ogni widget:

Playful | Tech | Corporate | Picasso | Illustrated | Schoolr | PLAI | Studenti

### Export

Pagina riepilogativa con anteprima live di tutti i widget nella configurazione scelta. Possibilita di esportare l'intera configurazione in formato JSON.

## Quick Start

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm start
```

L'app sara disponibile su [http://localhost:3000](http://localhost:3000).

## Struttura del progetto

```
src/
├── App.js                    # Componente principale, stato globale e routing
├── components/
│   ├── Quiz/                 # Single, Multi, TrueFalse, Outlined
│   ├── Flashcard/            # Flashcard con flip e fill-the-blank
│   ├── Mindmap/              # Mappa concettuale interattiva
│   │   ├── components/       # Nodi, tooltip, controlli, minimap
│   │   ├── hooks/            # useMindmapState, useMindmapHandlers
│   │   └── utils/            # Utility per layout e calcoli
│   ├── Podcast/              # Player audio con trascrizione
│   ├── Crossword/            # Griglia interattiva di parole crociate
│   ├── SidePanel/            # Pannello di configurazione laterale
│   └── ExportView/           # Pagina di export e riepilogo
├── data/                     # Dati statici (quiz, flashcard, mindmap,transcript e crossword)
└── styles/                   # Fogli di stile CSS per componenti e temi
```

## Tech Stack

- **React 18** — UI framework
- **Lucide React** — libreria icone
- **CSS custom** — stili per ogni componente e tema visivo

## Licenza

Progetto proprietario di MemorAIz.
