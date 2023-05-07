# Edigio
Platforma pro řešení katastrof. Jejím cílem je zprostředkovat nabídku a poptávku pomoci při různých katastrofách. Jak registrování, tak neregistrovaní uživatelé mají možnost vytvořit nabídku či poptávku, a také mají možnost. Pro registrované uživatele je proces zjednodušen tím, že nemusejí stále dokola vyplňovat kontaktní informace a souhlas se zpracování osobním osobních údajů a podmínkami užití služby. Navíc nemusí při každém vytvoření nabídky, poptávky či odpovědi na ně znovu potvrzovat svoji emailovou adresu. Inzeráty a projekty (katastrofy) je možné prohlížet, filtrovat a sdílet. Při vytvoření inzerátu lze využít jednu ze šablon, které je možné vložit do databáze, a které specifikují běžný obsah různých typů inzerátů pro danou katastrofu.  Inzerent může specifikovat, jaká úroveň detailů má být zveřejněná. Aplikace je plně lokalizována (jak její statické části, tak dynamické)

# Instalace
Pro jednoduchou instalaci byl vytvořen docker-compose soubor. Pro jeho použití stačí mít na svém počítači (či cílovém serveru) zprovozněný Docker a Docker Compose. Je potřeba vyplnit textový soubor '.env', který musí být ve stejné složce, jako docker compose soubor. Jsou očekávány následující proměnné

#Uzivatelske jmeno k emailové adrese
EGIDIO_EMAIL_USERNAME=UZIVATELSKEJMENO
#Heslo k emailové adrese
EGIDIO_EMAIL_PASSWORD=HESLO
#Host emailové schránky
EGIDIO_EMAIL_HOST=smtp.gmail.com
#Port pro email
EGIDIO_EMAIL_PORT=587
#Protokol používaný pro email aplikace
EGIDIO_EMAIL_PROTOCOL=smtp

#Cesta k databázi, ve které jsou data aplikace. Pokud používáte nezměněný docker-compose, můžete ponechat tak jak je.
EGIDIO_DATASOURCE_URL=jdbc:postgresql://database:5432/postgres
#Heslo k databázi, ve které jsou data aplikace.
EGIDIO_DATASOURCE_PASSWORD=EGDHESLO
#Uživatelské jméno k databázi, ve které jsou data aplikace.
EGIDIO_DATASOURCE_USERNAME=EGDUSERNAME

#Port na kterém je z vnější dostupná databáze
POSTGRES_EXTERNAL_PORT=5433

#Port backendového serveru
#Můžete ponechat tak jak je
EGIDIO_BACKEND_PORT=80

#Externí URL frontendu. V tuto chvíli použito pouze pro generování odkazů v emailových zprávách.
EGIDIO_FRONTEND_URL="YOUR-FRONTEND-URL"

Během verzování si dávejte pozor, abyste tento soubor neodeslali do repozitáře. Mohlo by dojít k úniku Vašich informací!

Pokud používáte jiné než výchozí nastavení docker compose, je ještě nutné v souboru 'source/frontend/src/app/api-config/common-api-config.ts' vyplnit adresu URL, která je v tuto chvíli relativní vůči adrese, na které klient stránku otevřel. To se může hodit například i při lokálním spuštění frontendu mimo docker. Ještě je potřeba upravit nastavení CORS. To se provadí v backendovém kódu ve třídě cz.opendatalab.egidio.backend.configs.SecurityConfiguration (resp. její metodě corsConfigurer). Je potřeba změnit seznam ve volané metodě registry#allowedOrigins podle toho, z jakých adres bude frotnend dostupný. 

V tuto chvíli by již vše mělo být připraveno ke spuštění. Stačí zavolat příkaz docker compose up ve složce 'source'. Po sestavení jednotlivých obrazů by již aplikace měla být spuštěná s parametry, které byly zadány.
