import { isValidCPF } from "../lib/utils";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  OWNER = "OWNER",
}

export class User {
  constructor(
    public id: string,

    public name: string,
    public credential: string,

    public role: string | null,
    public company_id?: string | null,
    public company?: any,

    public created_at?: Date,
    public updated_at?: Date
  ) {
    const credentialIsValid = isValidCPF(credential);

    if (!credentialIsValid) {
      throw new Error("CPF inválido.");
    }
  }
}
