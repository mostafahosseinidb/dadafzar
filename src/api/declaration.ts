/* eslint-disable @typescript-eslint/no-explicit-any */
import  api  from './axios';

// Types for declaration API
export interface StatementAttachment {
  name: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  isAuthorizationDocument: boolean;
  type: string;
}

export interface PersonData {
  nationalId: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  genderKey: 'Male' | 'Female';
  address: string;
  birthdate: string;
  landlines: string[];
  mobiles: string[];
  authorizationDocuments: any[];
  type?: string;
}

export interface BusinessData {
  nationalId: string;
  name: string;
  ceo: PersonData;
  landlines: string[];
  mobiles: string[];
}

export interface PlaintiffsData {
  mainPerson: PersonData;
  relatedPersons: PersonData[];
  relatedBusinesses: BusinessData[];
}

export interface DefendantData {
  type: 'Person' | 'Business';
  firstName: string;
  lastName: string;
  fatherName: string;
  nationalId: string;
  genderKey: 'Male' | 'Female';
  address: string;
  birthdate: string;
  landlines: string[];
  mobiles: string[];
  name: string;
  registrationdate: string;
}

export interface StatementOfClaimRequest {
  simulate: boolean;
  sequence: number;
  type: 'StatementOfClaim';
  subject: string;
  content: string;
  attachments: StatementAttachment[];
  plaintiffs: PlaintiffsData;
  defendants: DefendantData[];
  officeCode: string;
}

export interface StatementOfClaimResponse {
  success: boolean;
  message: string;
  data?: {
    statementId: string;
    trackingNumber: string;
    status: string;
  };
}

export interface OfficeCode {
  officeCode: string;
  officeTitle: string;
}

// API Functions

/**
 * Submit a statement of claim to the judicial office
 */
export const submitStatementOfClaim = async (
  data: StatementOfClaimRequest
): Promise<StatementOfClaimResponse> => {
  const response = await api.post('/v1/userpanel/declaration', data);
  return response.data;
};

/**
 * Get available office codes from userpanel
 */
export const getOfficeCodes = async (): Promise<OfficeCode[]> => {
  const response = await api.get('/v1/userpanel/bi/officeCodes');
  return response.data.data;
};
