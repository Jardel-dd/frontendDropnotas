export interface State {
    state: string;
    shortState: string;
  }
  
  export interface CityData {
    shortState: string;
    state: string;
    cities: string[];
  }
  export const states: State[] = [
    { state: "Acre", shortState: "AC" },
    { state: "Alagoas", shortState: "AL" },
    { state: "Amapá", shortState: "AP" },
    { state: "Amazonas", shortState: "AM" },
    { state: "Bahia", shortState: "BA" },
    { state: "Ceará", shortState: "CE" },
    { state: "Distrito Federal", shortState: "DF" },
    { state: "Espírito Santo", shortState: "ES" },
    { state: "Goiás", shortState: "GO" },
    { state: "Maranhão", shortState: "MA" },
    { state: "Mato Grosso", shortState: "MT" },
    { state: "Mato Grosso do Sul", shortState: "MS" },
    { state: "Minas Gerais", shortState: "MG" },
    { state: "Pará", shortState: "PA" },
    { state: "Paraíba", shortState: "PB" },
    { state: "Paraná", shortState: "PR" },
    { state: "Pernambuco", shortState: "PE" },
    { state: "Piauí", shortState: "PI" },
    { state: "Rio de Janeiro", shortState: "RJ" },
    { state: "Rio Grande do Norte", shortState: "RN" },
    { state: "Rio Grande do Sul", shortState: "RS" },
    { state: "Rondônia", shortState: "RO" },
    { state: "Roraima", shortState: "RR" },
    { state: "Santa Catarina", shortState: "SC" },
    { state: "São Paulo", shortState: "SP" },
    { state: "Sergipe", shortState: "SE" },
    { state: "Tocantins", shortState: "TO" }
  ];
  