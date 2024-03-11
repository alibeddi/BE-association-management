import { Office } from './offices';

export interface Analytics {
  nbStatClients: number;
  nbStatClientResponses: number;
  nbEmployees: number;
  nbOffices: number;
  nbKpis: number;
}

export interface NbStatClientResponses {
  nbStatClientResponses: number;
  office: Office;
}
