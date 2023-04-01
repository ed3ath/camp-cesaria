export interface IRegistration {
  id?: number;
  adults: string[];
  kids: string[];
  email: string;
  mobile: string;
  paid?: boolean;
  checkedIn?: boolean;
}

export interface ILog {
  id?: number;
  regNo: string;
  kidIndex: number;
  kioskIndex: number;
  timestamp: number;
}
