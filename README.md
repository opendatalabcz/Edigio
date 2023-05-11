# Edigio
Platforma pro řešení katastrof. Jejím cílem je zprostředkovat nabídku a poptávku pomoci při různých katastrofách. Jak registrování, tak neregistrovaní uživatelé mají možnost vytvořit nabídku či poptávku, a také mají možnost. Pro registrované uživatele je proces zjednodušen tím, že nemusejí stále dokola vyplňovat kontaktní informace a souhlas se zpracování osobním osobních údajů a podmínkami užití služby. Navíc nemusí při každém vytvoření nabídky, poptávky či odpovědi na ně znovu potvrzovat svoji emailovou adresu. Inzeráty a projekty (katastrofy) je možné prohlížet, filtrovat a sdílet. Při vytvoření inzerátu lze využít jednu ze šablon, které je možné vložit do databáze, a které specifikují běžný obsah různých typů inzerátů pro danou katastrofu.  Inzerent může specifikovat, jaká úroveň detailů má být zveřejněná. Aplikace je plně lokalizována (jak její statické části, tak dynamické)

# Podmínky služby a zásady zpracování OU
Pro zásady zpracování OU a podmínky užití služby byly vytvořeny dvě komponenty - PrivacyPolicyComponent a TermsOfServicesComponent.\
Obsah těchto dokumentů nebyl vytvořen. Je na provozovateli, aby obsah těchto dokumentů vyplnil. \
Zásady zpracování OU se vyplňují v dokumentu "source/frontend/src/app/components/privacy-policy/privacy-policy.component.html" a podmínky užití služby v dokumentu "source/frontend/src/app/components/terms-of-services/terms-of-services.component.html". Oba dokumenty mají následující strukturu, z obsahu divů je již zřejmé co a kam doplnit.

```html
<div class="col-12">
  <div *ngIf="displayEnglishVariant">
    Sem doplňte text v Angličtině
  </div>

  <div *ngIf="displayCzechVariant">
    Sem doplňte text v Češtině
  </div>
</div>
```

# Instalace
Pro jednoduchou instalaci byl vytvořen docker-compose soubor. Pro jeho použití stačí mít na svém počítači (či cílovém serveru) zprovozněný Docker a Docker Compose. Je potřeba vyplnit textový soubor '.env', který musí být ve stejné složce, jako docker compose soubor. Jsou očekávány následující proměnné

#Uzivatelske jmeno k emailové adrese \
EGIDIO_EMAIL_USERNAME=UZIVATELSKEJMENO \
#Heslo k emailové adrese \
EGIDIO_EMAIL_PASSWORD=HESLO \
#Host emailové schránky
EGIDIO_EMAIL_HOST=smtp.gmail.com
#Port pro email
EGIDIO_EMAIL_PORT=587
#Protokol používaný pro email aplikace
EGIDIO_EMAIL_PROTOCOL=smtp

#Cesta k databázi, ve které jsou data aplikace. Pokud používáte nezměněný docker-compose, můžete ponechat tak jak je.
EGIDIO_DATASOURCE_URL=jdbc:postgresql://egidio-database:5432/postgres
#Heslo k databázi, ve které jsou data aplikace.
EGIDIO_DATASOURCE_PASSWORD=postgres
#Uživatelské jméno k databázi, ve které jsou data aplikace.
EGIDIO_DATASOURCE_USERNAME=postgres

#Port na kterém je z vnější dostupná databáze
POSTGRES_EXTERNAL_PORT=5433

#Externí URL frontendu využívaná backendem pro tvorbu linků
EGIDIO_FRONTEND_URL="localhost"

Během verzování si dávejte pozor, abyste tento soubor neodeslali do repozitáře. Mohlo by dojít k úniku Vašich informací!
Je nutné, aby byl vorný port 80, se kterým aplikace počítá!

Pokud používáte jiné než výchozí nastavení docker compose, je ještě nutné v souboru 'source/frontend/src/app/api-config/common-api-config.ts' vyplnit adresu URL, která je v tuto chvíli relativní vůči adrese, na které klient stránku otevřel. To se může hodit například i při lokálním spuštění frontendu mimo docker. Ještě je potřeba upravit nastavení CORS. To se provadí v backendovém kódu ve třídě cz.opendatalab.egidio.backend.configs.SecurityConfiguration (resp. její metodě corsConfigurer). Je potřeba změnit seznam ve volané metodě registry#allowedOrigins podle toho, z jakých adres bude frontend dostupný. 

V tuto chvíli by již vše mělo být připraveno ke spuštění. Stačí zavolat příkaz docker compose up ve složce 'source'. Po sestavení jednotlivých obrazů by již aplikace měla být spuštěná s parametry, které byly zadány.
