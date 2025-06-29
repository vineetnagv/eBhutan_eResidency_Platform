export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country: string;
  kycLevel: KYCLevel;
  eResidencyStatus: EResidencyStatus;
  digitalId?: string;
  companies: Company[];
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  registrationNumber: string;
  status: CompanyStatus;
  incorporationDate: string;
  virtualOffice: VirtualOffice;
  documents: Document[];
  taxId?: string;
}

export interface VirtualOffice {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
}

export interface KYCDocument {
  id: string;
  type: DocumentType;
  file: File;
  status: 'pending' | 'processing' | 'verified' | 'rejected';
  extractedData?: any;
  verificationScore?: number;
}

export interface GovernmentService {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'tax' | 'licensing' | 'permits';
  status: 'available' | 'maintenance' | 'unavailable';
  processingTime: string;
  fee: number;
}

export type KYCLevel = 'basic' | 'enhanced' | 'premium' | 'enterprise';
export type EResidencyStatus = 'not_applied' | 'pending' | 'approved' | 'active' | 'suspended';
export type CompanyType = 'llc' | 'corporation' | 'non_profit' | 'dao_wrapper';
export type CompanyStatus = 'forming' | 'active' | 'suspended' | 'dissolved';
export type DocumentType = 'passport' | 'national_id' | 'utility_bill' | 'bank_statement' | 'incorporation_doc' | 'tax_cert';

export interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  estimatedTime: string;
  requiredDocuments?: DocumentType[];
}

export interface BusinessFormData {
  companyName: string;
  companyType: CompanyType;
  businessActivity: string;
  authorizedCapital: number;
  shareholders: Shareholder[];
  directors: Director[];
  virtualOfficePreference: string;
}

export interface Shareholder {
  name: string;
  email: string;
  sharePercentage: number;
  nationality: string;
}

export interface Director {
  name: string;
  email: string;
  nationality: string;
  isResident: boolean;
}

export interface TaxBenefit {
  country: string;
  treatyExists: boolean;
  corporateTaxRate: number;
  witholdingTaxRate: number;
  estimatedSavings: number;
}