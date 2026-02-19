import citiesMap from "../utils/cities.json";

export type Map = {
  value: string,
  label: string
}
const states = [
  {"state": "Acre", "shortState": "AC"},
  {"state": "Alagoas", "shortState": "AL"},
  {"state": "Amapá", "shortState": "AP"},
  {"state": "Amazonas", "shortState": "AM"},
  {"state": "Bahia", "shortState": "BA"},
  {"state": "Ceará", "shortState": "CE"},
  {"state": "Distrito Federal", "shortState": "DF"},
  {"state": "Espírito Santo", "shortState": "ES"},
  {"state": "Goiás", "shortState": "GO"},
  {"state": "Maranhão", "shortState": "MA"},
  {"state": "Mato Grosso", "shortState": "MT"},
  {"state": "Mato Grosso do Sul", "shortState": "MS"},
  {"state": "Minas Gerais", "shortState": "MG"},
  {"state": "Pará", "shortState": "PA"},
  {"state": "Paraíba", "shortState": "PB"},
  {"state": "Paraná", "shortState": "PR"},
  {"state": "Pernambuco", "shortState": "PE"},
  {"state": "Piauí", "shortState": "PI"},
  {"state": "Rio de Janeiro", "shortState": "RJ"},
  {"state": "Rio Grande do Norte", "shortState": "RN"},
  {"state": "Rio Grande do Sul", "shortState": "RS"},
  {"state": "Rondônia", "shortState": "RO"},
  {"state": "Roraima", "shortState": "RR"},
  {"state": "Santa Catarina", "shortState": "SC"},
  {"state": "São Paulo", "shortState": "SP"},
  {"state": "Sergipe", "shortState": "SE"},
  {"state": "Tocantins", "shortState": "TO"}
];
export const statesMaps = (): Map[] => {
  return states.map((entry) => {
    return {value: entry.shortState, label: entry.state}
  })
}
export const getCitiesFromState = (state: string): Map[] => {
  if (!state) return []; 
  const eligibleCities = citiesMap.find(entry => entry.shortState.toUpperCase() === state.toUpperCase());
  // console.log("Estado selecionado:", state);
  // console.log("Cidades encontradas:", eligibleCities);
  return eligibleCities?.cities.map((entry) => ({
    value: entry,
    label: entry, 
  })) || [];
};

