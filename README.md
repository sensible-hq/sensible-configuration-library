# Sensible Configuration Library

Open-source SenseML configurations for public use by [Sensible](https://www.sensible.so/)

![Sensible-Logo-Landscape-Purple-Dark-RGB@3x](https://user-images.githubusercontent.com/7003213/124295939-46df5a80-db0e-11eb-9b40-82629ffbd013.png)

## Intro to SenseML
SenseML is Sensible's document query language. SenseML gives you a easy way to describe what data you want to extract from a document and where to look for that data. With SenseML, you have full control over how the parsing is performed -- leveraging heuristics, rules, and ML.

## List of available templates: 
### Insurance
#### Policy declaration pages:
##### Auto:
- [Allstate](./insurance/policy_dec_pages/auto_policy/allstate.json)
- [Branch](./insurance/policy_dec_pages/auto_policy/branch.json)
- [Farmer's](./insurance/policy_dec_pages/auto_policy/farmers.json)
- [Geico](./insurance/policy_dec_pages/auto_policy/geico.json)
- [LibertyMutual](./insurance/policy_dec_pages/auto_policy/liberty_mutual.json)
- [Nationwide](./insurance/policy_dec_pages/auto_policy/nationwide.json)
- [Progressive](./insurance/policy_dec_pages/auto_policy/progressive.json)
- [StateFarm](./insurance/policy_dec_pages/auto_policy/statefarm.json)
- [Traveler's](./insurance/policy_dec_pages/auto_policy/travelers.json)
- [USAA](./insurance/policy_dec_pages/auto_policy/usaa)
- [USAA(2017)](./insurance/policy_dec_pages/auto_policy/usaa)
##### Home:
- [Allstate](./insurance/policy_dec_pages/home_policy/allstate.json)
- [Hanover](./insurance/policy_dec_pages/home_policy/hanover.json)
- [Hartford](./insurance/policy_dec_pages/home_policy/hartford.json)
- [Lemonade](./insurance/policy_dec_pages/home_policy/lemonade.json)
- [Liberty Mutual](./insurance/policy_dec_pages/home_policy/liberty_mutual.json)
- [Nationwide](./insurance/policy_dec_pages/home_policy/nationwide.json)
- [State Farm](./insurance/policy_dec_pages/home_policy/statefarm)
- [State Farm (2018)](./insurance/policy_dec_pages/home_policy/statefarm)
- [Traveler's](./insurance/policy_dec_pages/home_policy/travelers)
- [Traveler's (Geico)](./insurance/policy_dec_pages/home_policy/travelers)
- [Traveler's (High Value)](./insurance/policy_dec_pages/home_policy/travelers)
- [USAA](./insurance/policy_dec_pages/home_policy/usaa.json)

##### Renter:
- [Lemonade](./insurance/policy_dec_pages/renters_policy/lemonade.json)
- [Liberty Mutual](./insurance/policy_dec_pages/renters_policy/liberty_mutual.json)
- [State Farm ](./insurance/policy_dec_pages/renters_policy/statefarm.json)
- [USAA](./insurance/policy_dec_pages/renters_policy/usaa.json)


##### Pet:
- [Healthy Paws](./insurance/policy_dec_pages/pets_policy/healthy_paws.json)

#### ACORD:
Find the Acord number/year/month at the bottom left corner of each Acord page.

- [Acord 25 (03/2016)](./insurance/acords/acord_25_03_2016.json)
- [Acord 75 (03/2016)](./insurance/acords/acord_75_03_2016.json)
- [Acord 125 (04/2014)](./insurance/acords/acord_125_04_2014.json)
- [Acord 126 (05/2007)](./insurance/acords/acord_126_05_2007.json)
- [Acord 130 (09/2013)](./insurance/acords/acord_130)
- [Acord 130 (05/2017)](./insurance/acords/acord_130)
- [Acord 140 (09/2007)](./insurance/acords/acord_140_09_2007.json)


## Using a configuration
To use the library, you'll need a Sensible account. If you don't have an account, please reach out to hello@sensible.so with a short description of your use case. 

Once you have a Sensible account, copy and paste the configuration you want to use into your configuration editor and publish it. Upload PDFs corresponding to the configuration, and changes field names, add fields, or remove fields to extract the  data you want from your PDFs.

To get an overview of how to use Sensible and SenseML, check out our [quickstart guide](https://docs.sensible.so/docs/quickstart). You can also find our full SenseML reference [here](https://docs.sensible.so/docs/senseml-reference-introduction) and our API reference docs [here](https://docs.sensible.so/reference). 

## Contributing to the library
If you'd like to contribute to library by adding new configurations or improving existing configurations, please open a PR. The Sensible team will review PRs periodically and pull in changes. 

For other questions, please email support@sensible.so. 
