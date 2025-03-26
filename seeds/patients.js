"user strict";

const patients = [

	{
		"_id": "63fff7a252a0bc910ada5584",
		"nom": "Powlowski",
		"prenom": "Lavern",
		"dateNaissance": "1980-03-22T00:00:00.000Z",
		"telephone": "261-839-4823",
		"courriel": "Perry_Stamm77@gmail.com",
		"adresse": "9701 Moore Hills",
		"codePostal": "G1S 4S3",
		"historique": [
			{
				"information": "Prise de sang pour bilan annuel",
				"medecinId": "63ffb25bed74f02562cf23ad",
				"created_at": "2023-03-02T13:20:27.158Z",
				"_id": "63fff7fbc9c0242b93854899"
			}
		]
	},
	{
		"_id": "63fff7dcc9c0242b93854896",
		"nom": "Kozey",
		"prenom": "Colin",
		"dateNaissance": "2018-07-10T00:00:00.000Z",
		"telephone": "988-856-0971",
		"courriel": "Gust.Konopelski18@yahoo.com",
		"adresse": "88165 Wilderman Trafficway",
		"codePostal": "G1S 4S3",
		"historique": [
			{
				"information": "Ottite, prescription de céfuroxime axétil : 500 mg par jour en 2 prises par jour pendant 5 jours",
				"medecinId": "63ffb2a1ffde1a368763cf44",
				"created_at": "2022-03-02T08:10:00.158Z",
				"_id": "63fff7fbc9c0242b93854899"
			},
			{
				"information": "Varicelle",
				"medecinId": "63ffb2a1ffde1a368763cf44",
				"created_at": "2021-11-09T10:10:32.852Z",
				"_id": "63fff81e16247658760d91b7"
			}
		]
	},
	{
		"nom": "Williamson",
		"prenom": "Jesus",
		"dateNaissance": "1970-05-03T00:00:00.000Z",
		"telephone": "774-661-4139",
		"courriel": "Orlo30@gmail.com",
		"adresse": "80586 Mante Spurs",
		"codePostal": "G1S 4S3",
		"_id": "63fffacaad0c9380ed34b904",
		"historique": [
			{
				"information": "Pression 160/100, prescription de Valsartan 100mg une fois par jour",
				"medecinId": "63ffb221723c8e36189d7fbd",
				"created_at": "2023-01-20T09:20:27.158Z",
				"_id": "63fff7fbc9c0242b93854899"
			}
		]
		
	}
    
];

module.exports = patients;