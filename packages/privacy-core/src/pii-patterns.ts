import type { PIICategory } from '@privacy-agent/shared-types';

export interface PIIPatternDefinition {
  category: PIICategory;
  name: string;
  regex: RegExp;
  confidence: number;
}

export const PII_PATTERNS: PIIPatternDefinition[] = [
  // Email patterns (RFC 5322 standard)
  {
    category: 'EMAIL',
    name: 'Standard Email',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    confidence: 0.98,
  },
  // Indian & International Phone Numbers (+91 ..., 10 digits, dashes, spaces)
  {
    category: 'PHONE',
    name: 'Phone Number',
    regex: /(?:(?:\+?91|0091)[\s-]?)?[6-9]\d{9}\b|(?:\+?1[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
    confidence: 0.95,
  },
  // Government / Identification Numbers (Aadhaar 12-digit, PAN 10-char, Passport, SSN)
  {
    category: 'GOV_ID',
    name: 'Aadhaar / National ID',
    regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    confidence: 0.92,
  },
  {
    category: 'GOV_ID',
    name: 'PAN Card / Tax ID',
    regex: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g,
    confidence: 0.96,
  },
  {
    category: 'GOV_ID',
    name: 'Passport Number',
    regex: /\b[A-Z][0-9]{7,8}\b/g,
    confidence: 0.90,
  },
  // Financial / Credit Card (Visa, MasterCard, Amex, generic 16-digit)
  {
    category: 'FINANCIAL',
    name: 'Payment Card Number',
    regex: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
    confidence: 0.94,
  },
  // Date of Birth (YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY)
  {
    category: 'DOB',
    name: 'Date of Birth',
    regex: /\b(?:19|20)\d{2}[-/](?:0[1-9]|1[0-2])[-/](?:0[1-9]|[12]\d|3[01])\b|\b(?:0[1-9]|[12]\d|3[01])[-/](?:0[1-9]|1[0-2])[-/](?:19|20)\d{2}\b/g,
    confidence: 0.88,
  },
  // Synthetic Canary Secrets (used for zero-leakage test verification)
  {
    category: 'SECRET',
    name: 'Canary Secret Tag',
    regex: /\bSUPER_SECRET_[A-Z0-9_]+\b/g,
    confidence: 1.0,
  },
];

export const SENSITIVE_DOM_KEYWORDS: Record<PIICategory, string[]> = {
  PERSON: ['person', 'name', 'full_name', 'fullname', 'first_name', 'firstname', 'last_name', 'lastname', 'fname', 'lname', 'applicant_name', 'patient_name', 'passenger_name', 'policyholder_name', 'user'],
  EMAIL: ['email', 'e-mail', 'mail_addr', 'user_email', 'contact_email', 'mail'],
  PHONE: ['phone', 'tel', 'telephone', 'mobile', 'cell', 'contact_number', 'phone_number'],
  ADDRESS: ['address', 'street', 'city', 'state', 'pincode', 'zipcode', 'zip', 'postal', 'residence', 'address_line_1', 'shipping_address', 'billing_address'],
  DOB: ['dob', 'date_of_birth', 'birthdate', 'birth_date', 'bday', 'birth'],
  GOV_ID: ['gov_id', 'ssn', 'aadhaar', 'pan', 'passport', 'national_id', 'tax_id', 'id_number', 'license', 'driving_license'],
  FINANCIAL: ['financial', 'card', 'credit_card', 'debit_card', 'cvv', 'cvc', 'expiry', 'account_number', 'bank_account', 'salary', 'income'],
  SECRET: ['secret', 'token', 'api_key', 'canary', 'password', 'pin'],
};

export const SENSITIVE_AUTOCOMPLETE_VALUES: Record<string, PIICategory> = {
  'name': 'PERSON',
  'given-name': 'PERSON',
  'family-name': 'PERSON',
  'email': 'EMAIL',
  'tel': 'PHONE',
  'tel-national': 'PHONE',
  'street-address': 'ADDRESS',
  'address-line1': 'ADDRESS',
  'postal-code': 'ADDRESS',
  'bday': 'DOB',
  'cc-number': 'FINANCIAL',
  'cc-csc': 'FINANCIAL',
  'current-password': 'SECRET',
  'new-password': 'SECRET',
};
