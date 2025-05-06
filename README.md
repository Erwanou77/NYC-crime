# Données sur les Crimes à NYC avec GraphQL et MongoDB

Ce projet met en place un **serveur GraphQL** utilisant **Apollo Server**, connecté à **MongoDB** pour fournir des données sur les crimes à New York. Les données sont récupérées depuis l'API ouverte de la ville de New York et insérées dans MongoDB, où elles peuvent être interrogées via GraphQL.

## Prérequis

- **Docker**
- **Docker Compose**

## Structure du projet

- docker-compose.yml # Configuration Docker pour démarrer MongoDB Mongo Express, GraphQL et Python ingest

- graphql-server # Dossier du serveur GraphQL

  - index.js # Point d'entrée pour le serveur GraphQL
- ingest # Dossier du serveur Python ingest
  - insert_data.py # Script Python pour récupérer et insérer les données dans MongoDB
- README.md # Documentation du projet (ce fichier)



## Démarrage

Suivez ces étapes pour configurer et exécuter le projet localement.

### 1. Clonez le dépôt

Clonez ce dépôt sur votre machine locale :

```bash
git clone https://github.com/Erwanou77/NYC-crime.git
cd NYC-crime
```

### 2. Configurez MongoDB avec Docker
Pour configurer rapidement MongoDB et Mongo Express, vous pouvez utiliser Docker avec le fichier docker-compose.yml fourni.

Exécutez la commande suivante pour démarrer MongoDB et Mongo Express :

```bash
docker-compose up -d
```
Cela démarrera les services suivants :

- MongoDB : Disponible sur le port 27017

- Mongo Express : Interface web pour MongoDB, disponible sur le port 8081
- GraphQL : Interface web et API de Apollo sur le port 4000

### 3. Interrogez les données via GraphQL

Une fois que le serveur GraphQL est en cours d'exécution, vous pouvez ouvrir http://localhost:4000/graphql dans votre navigateur ou utiliser un client GraphQL (comme Apollo Studio ou Postman) pour interroger les données.

#Exemple de requête :
```bash
query {
  crimes(limit: 1) {
    cmplnt_num
    addr_pct_cd
    boro_nm
    cmplnt_fr_dt
    cmplnt_fr_tm
    cmplnt_to_dt
    cmplnt_to_tm
    crm_atpt_cptd_cd
    jurisdiction_code
    juris_desc
    ofns_desc
    pd_desc
    latitude
    longitude
  }
}
```
Exemple de réponse :
```json
{
  "data": {
    "crimes": [
      {
        "cmplnt_num": "301189557",
        "addr_pct_cd": "122",
        "boro_nm": "STATEN ISLAND",
        "cmplnt_fr_dt": "2025-02-16T00:00:00.000",
        "cmplnt_fr_tm": "21:45:00",
        "cmplnt_to_dt": "2025-02-16T00:00:00.000",
        "cmplnt_to_tm": "22:04:00",
        "crm_atpt_cptd_cd": "COMPLETED",
        "jurisdiction_code": "0",
        "juris_desc": "N.Y. POLICE DEPT",
        "ofns_desc": "DANGEROUS DRUGS",
        "pd_desc": "CONTROLLED SUBSTANCE,INTENT TO",
        "latitude": "40.603899",
        "longitude": "-74.118892"
      }
    ]
  }
}
```
### 4. Arrêtez les conteneurs Docker
Une fois que vous avez terminé, vous pouvez arrêter les conteneurs Docker avec la commande suivante :

```bash
docker-compose down
```
Cela arrêtera et supprimera les conteneurs en cours d'exécution.
