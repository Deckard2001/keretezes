# Három döntés – keretezés-labor órai használatra

**Élő oldal:** [hallgatói felület](https://deckard2001.github.io/keretezes/) · [kivetítő nézet](https://deckard2001.github.io/keretezes/tanar.html)

Három klasszikus kísérlet órai változata a keretezésről és a kategorizálásról. A kivetítőn először a csoport eredménye jelenik meg, utána az eredeti kísérleté.

| Feladat | Eredeti kísérlet | Mit csinálnak a hallgatók? |
|---|---|---|
| 1. A szegénység | Iyengar (1991) | a csoport fele egy anya történetét (epizodikus keret), a másik fele területi statisztikát (tematikus keret) olvas; utána két 1–7-es kérdés a felelősségről |
| 2. Hogyan látja őket a társadalom? | Fiske et al. (2002) | nyolc társadalmi csoportot helyeznek el egy 5×5-ös négyzetben: mennyire látja őket a társadalom rátermettnek (vízszintes) és barátságosnak (függőleges); a kivetítőn a csoportátlagok térképe jelenik meg, az eredeti kísérlet gombra a négy érzelmi negyed (csodálat, sajnálat, irigység, megvetés) is |
| 3. Zöldek és Lilák | Tajfel et al. (1971) | képválasztás után „csoportba kerülnek” (valójában véletlenül), majd négy elosztás közül választanak egy saját és egy másik csoportbeli névtelen társ között: 13–13, 11–9, 9–5 vagy 7–1 |

## Fájlok

| Fájl | Mire való |
|---|---|
| `index.html` | Hallgatói felület (mobilra) |
| `tanar.html` | Kivetítő: QR-kód, élő eredmények, eredeti kísérletek, CSV-export |
| `assets/config.js` | **Egyetlen beállítófájl** (háttér URL, alap csoportkód) |
| `assets/labor.js` | A feladatok szövege, a véletlen beosztás és az összesítés |
| `apps_script/Code.gs` | Háttér a csoportos módhoz (Google Táblázat) |

## Órai menet

1. A kivetítőn nyisd meg a `tanar.html` oldalt. A QR-kód az `index.html?s=<csoportkód>` címre mutat. Az **Új csoport** gomb minden órához új kódot ad.
2. Mondd el, hogy a szomszédok más szöveget kaphatnak, ezért amíg mindenki nem végzett, ne beszéljék meg a feladatokat.
3. Kitöltés: kb. 4 perc.
4. Feladatonként nyomd meg az **Eredmény mutatása** gombot. Kérdezd meg a csoportot, szerintük mi okozza a különbséget. Utána nyomd meg **Az eredeti kísérlet** gombot.
5. A 3. feladat után mondd el, hogy a csoportbeosztás véletlen volt, és nem a képválasztástól függött. Ez a kísérlet része, az eredeti Tajfel-kísérletben is így volt.

A **Demó adatok** gombbal háttér nélkül is kipróbálhatod a kivetítőt (36 szimulált kitöltő, sárga sáv jelzi).

## 1. Feltöltés GitHub Pagesre

1. Hozz létre egy új repót, és töltsd fel a mappa teljes tartalmát.
2. Settings → Pages → Source: *Deploy from a branch*, majd `main` / `root`.
3. Pár perc múlva elérhető:
   - hallgatói oldal: `https://<felhasznalo>.github.io/<repo>/`
   - kivetítő: `https://<felhasznalo>.github.io/<repo>/tanar.html`

## 2. A háttér beállítása (kb. 5 perc)

Háttér nélkül a hallgatók ki tudják tölteni, de a válaszok nem jutnak el a kivetítőhöz.

1. Hozz létre egy üres Google Táblázatot, és nyisd meg: Bővítmények → Apps Script.
2. Másold be az `apps_script/Code.gs` tartalmát, és mentsd el.
3. Telepítés → Új telepítés → típus: **Webalkalmazás**. Futtatás mint: *Én*. Hozzáférés: **Bárki**. Engedélyezd a hozzáférést.
4. A kapott `…/exec` URL-t írd be az `assets/config.js` fájlba (`APPS_SCRIPT_URL`), és commitold.

A háttér csak a csoportkódot, egy véletlen eszközazonosítót és a válaszokat tárolja, nevet és IP-címet nem. Ugyanarról az eszközről a legutolsó kitöltés számít.

## A csoportlista szerkesztése

A 2. feladat nyolc csoportja az `assets/labor.js` elején, az `R2_GROUPS` tömbben van. Bármelyik átírható, törölhető vagy kiegészíthető. A mellettük álló két szám csak a demóadatok várható helye: rátermettség és barátságosság, 1–5 között. A tengelyek szándékosan „rátermettség” és „barátságosság” néven szerepelnek, nem az eredeti „kompetencia” és „melegség” néven, hogy a hallgatók ne ismerjék fel előre a modellt.

## Kipróbálás helyben

```bash
python -m http.server 8000
# majd: http://localhost:8000/  és  http://localhost:8000/tanar.html
```
