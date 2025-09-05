/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Types for the declaration data
interface Person {
  name: string;
  nationalId: string;
  address: string;
  phone: string;
  email: string;
}

interface Evidence {
  type: string;
  description: string;
  file: File | null;
}

// Step 1 - Company and CEO Information
interface Step1Data {
  // Company Information
  companyName: string;
  companyNationalId: string;
  companyEstablishmentDate: string;
  representativeFirstName: string;
  representativeLastName: string;
  articlesOfAssociation: File | null;
  officialGazette: File | null;
  representationLetter: File | null;
  
  // CEO Information
  ceoFirstName: string;
  ceoLastName: string;
  ceoNationalId: string;
  ceoGender: string;
  ceoPhone: string;
  ceoBirthDate: string;
  ceoFatherName: string;
  
  // Judicial Office
  judicialOffice: string;
}

// Step 2 - Contact Information
interface ContactData {
  contactType: 'real' | 'legal';
  nationalId: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  fatherName: string;
  address: string;
}

// Step 3 - Document Information
interface Step3Data {
  selectedTemplate: string;
  subject: string;
  documentText: string;
  attachments: File[];
}

interface DeclarationData {
  // Legacy fields for backward compatibility
  title?: string;
  declarationType?: string;
  subject?: string;
  description?: string;
  caseType?: string;
  legalBasis?: string;
  requestedRelief?: string;
  jurisdiction?: string;
  plaintiff?: Person;
  defendant?: Person;
  evidence?: Evidence[];
  documents?: File[];
  
  // New step-based data
  step1Data?: Step1Data;
  step2Data?: ContactData[];
  step3Data?: Step3Data;
  
  [key: string]: any; // Allow additional properties
}

interface DeclarationContextType {
  declarationData: DeclarationData;
  updateDeclarationData: (data: Partial<DeclarationData>) => void;
  resetDeclarationData: () => void;
}

// Create the context
const DeclarationContext = createContext<DeclarationContextType | undefined>(undefined);

// Initial state
const initialDeclarationData: DeclarationData = {
  title: '',
  declarationType: '',
  subject: '',
  description: '',
  caseType: '',
  legalBasis: '',
  requestedRelief: '',
  jurisdiction: '',
  plaintiff: {
    name: '',
    nationalId: '',
    address: '',
    phone: '',
    email: '',
  },
  defendant: {
    name: '',
    nationalId: '',
    address: '',
    phone: '',
    email: '',
  },
  evidence: [],
  documents: [],
  
  // Step-based data
  step1Data: {
    companyName: '',
    companyNationalId: '',
    companyEstablishmentDate: '',
    representativeFirstName: '',
    representativeLastName: '',
    articlesOfAssociation: null,
    officialGazette: null,
    representationLetter: null,
    ceoFirstName: '',
    ceoLastName: '',
    ceoNationalId: '',
    ceoGender: '',
    ceoPhone: '',
    ceoBirthDate: '',
    ceoFatherName: '',
    judicialOffice: '',
  },
  step2Data: [],
  step3Data: {
    selectedTemplate: 'بدون تمپلیت',
    subject: '',
    documentText: '',
    attachments: [],
  },
};

// Provider component
interface DeclarationProviderProps {
  children: ReactNode;
}

export const DeclarationProvider: React.FC<DeclarationProviderProps> = ({ children }) => {
  const [declarationData, setDeclarationData] = useState<DeclarationData>(initialDeclarationData);

  const updateDeclarationData = (data: Partial<DeclarationData>) => {
    setDeclarationData(prev => ({
      ...prev,
      ...data,
    }));
  };

  const resetDeclarationData = () => {
    setDeclarationData(initialDeclarationData);
  };

  const value: DeclarationContextType = {
    declarationData,
    updateDeclarationData,
    resetDeclarationData,
  };

  return (
    <DeclarationContext.Provider value={value}>
      {children}
    </DeclarationContext.Provider>
  );
};

// Custom hook to use the context
export const useDeclaration = (): DeclarationContextType => {
  const context = useContext(DeclarationContext);
  if (context === undefined) {
    throw new Error('useDeclaration must be used within a DeclarationProvider');
  }
  return context;
};

export default DeclarationContext;
