# Sensible Configuration Library
Open-source SenseML configurations for public use by [Sensible](https://www.sensible.so/).

## About SenseML
SenseML is Sensible's document query language. SenseML provides a set of [primitives](https://docs.sensible.so/docs/methods) (such as `label`, `row`, and `table`) that make it easy to describe the data you'd like to extract from documents.

## Verticals

### Insurance

#### Policy declaration pages

##### Auto
- [Allstate](./insurance/policy_dec_pages/auto_policy/allstate.json)
- [Branch](./insurance/policy_dec_pages/auto_policy/branch.json)
- [Farmer's](./insurance/policy_dec_pages/auto_policy/farmers.json)
- [Geico](./insurance/policy_dec_pages/auto_policy/geico.json)
- [Liberty Mutual](./insurance/policy_dec_pages/auto_policy/liberty_mutual.json)
- [Nationwide](./insurance/policy_dec_pages/auto_policy/nationwide.json)
- [Progressive](./insurance/policy_dec_pages/auto_policy/progressive.json)
- [State Farm](./insurance/policy_dec_pages/auto_policy/state_farm.json)
- [Traveler's](./insurance/policy_dec_pages/auto_policy/travelers.json)
- [USAA](./insurance/policy_dec_pages/auto_policy/usaa/usaa.json)
- [USAA (MA)](./insurance/policy_dec_pages/auto_policy/usaa/usaa_ma.json)

##### Home
- [Allstate](./insurance/policy_dec_pages/home_policy/allstate.json)
- [Hanover](./insurance/policy_dec_pages/home_policy/hanover.json)
- [Hartford](./insurance/policy_dec_pages/home_policy/hartford.json)
- [Lemonade](./insurance/policy_dec_pages/home_policy/lemonade.json)
- [Liberty Mutual](./insurance/policy_dec_pages/home_policy/liberty_mutual.json)
- [Nationwide](./insurance/policy_dec_pages/home_policy/nationwide.json)
- [State Farm](./insurance/policy_dec_pages/home_policy/state_farm/state_farm.json)
- [State Farm (Short)](./insurance/policy_dec_pages/home_policy/state_farm/state_farm_short.json)
- [Traveler's](./insurance/policy_dec_pages/home_policy/travelers/travelers.json)
- [Traveler's (Geico)](./insurance/policy_dec_pages/home_policy/travelers/travelers_geico.json)
- [Traveler's (High Value)](./insurance/policy_dec_pages/home_policy/travelers/travelers_high_value.json)
- [USAA](./insurance/policy_dec_pages/home_policy/usaa.json)

##### Renters
- [Lemonade](./insurance/policy_dec_pages/renters_policy/lemonade.json)
- [Liberty Mutual](./insurance/policy_dec_pages/renters_policy/liberty_mutual.json)
- [State Farm ](./insurance/policy_dec_pages/renters_policy/state_farm.json)
- [USAA](./insurance/policy_dec_pages/renters_policy/usaa.json)

##### Pet
- [Healthy Paws](./insurance/policy_dec_pages/pet_policy/healthy_paws.json)

#### ACORDs
Find the ACORD year/month at the bottom left corner of each ACORD page. Often the differences between versions are minor and can use the same configuration.

- [ACORD 25 (03/2016)](./insurance/acords/acord_25/2016_03.json)
- [ACORD 75 (09/2013)](./insurance/acords/acord_75/2013_09.json)
- [ACORD 125 (12/2014)](./insurance/acords/acord_125/2014_12.json)
- [ACORD 126 (05/2007)](./insurance/acords/acord_126/2007_05.json)
- [ACORD 130 (09/2013)](./insurance/acords/acord_130/2013_09.json)
- [ACORD 130 (05/2017)](./insurance/acords/acord_130/2017_05.json)
- [ACORD 140 (09/2007)](./insurance/acords/acord_140/2007_09.json)

#### Loss Runs
- [Amtrust](./insurance/loss_runs/amtrust.json)
- [Applied Underwriters](./insurance/loss_runs/applied_underwriters.json)
- [Atlas](./insurance/loss_runs/atlas.json)
- [Benchmark](./insurance/loss_runs/benchmark.json)
- [Compwest](./insurance/loss_runs/compwest.json)
- [ICW](./insurance/loss_runs/icw.json)
- [Statefund](./insurance/loss_runs/statefund.json)
- [Travelers](./insurance/loss_runs/travelers.json)
- [Zenith](./insurance/loss_runs/zenith.json)

### Tax Forms
- [1040](./tax_forms/1040.json)
- [1065](./tax_forms/1065.json)
- [1099](./tax_forms/1099.json)
- [1120](./tax_forms/1120.json)
- [w-2](./tax_forms/w-2.json)
- [w-9](./tax_forms/w-9.json)


## Using a configuration
To use the library, you'll need a Sensible account. If you don't have an account, please reach out to hello@sensible.so with a short description of your use case to start a free trial. 

Once you have a Sensible account, copy and paste the configuration you want to use into your configuration editor and publish it. Upload PDFs corresponding to the configuration, and changes field names, add fields, or remove fields to extract the data you want from your PDFs.

To get an overview of how to use Sensible and SenseML, check out our [quickstart guide](https://docs.sensible.so/docs/quickstart). You can also find our full SenseML reference [here](https://docs.sensible.so/docs/senseml-reference-introduction) and our API reference docs [here](https://docs.sensible.so/reference). 

## Contributing to the library
If you'd like to contribute to library by adding new configurations or improving existing configurations, please open a PR. The Sensible team will review PRs periodically and pull in changes. 

For other questions, please email support@sensible.so. 
