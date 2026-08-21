/**
 * Corporate identity registry (TBD).
 *
 * Holds legal/registration data that the public site references in legal pages,
 * footer fine print, KVKK aydınlatma metni and structured data. Real values are
 * filled by the Legal/Finance team; the schema is stable so consumers can
 * depend on shape without waiting for the data.
 */
export interface CorporateIdentity {
  /** Resmi ticari unvan. */
  legalName: string;
  /** Kısa marka adı. */
  tradeName: string;
  /** MERSİS no — 16 hane. */
  mersis: string | null;
  /** Vergi dairesi. */
  taxOffice: string | null;
  /** Vergi numarası — 10 hane. */
  taxNumber: string | null;
  /** Ticaret sicil numarası. */
  tradeRegisterNo: string | null;
  /** KEP adresi (resmi yazışmalar). */
  kep: string | null;
  /** Şirket türü (A.Ş., Ltd. Şti., vb.). */
  entityType: "A.Ş." | "Ltd. Şti." | "Şahıs İşletmesi" | null;
  registeredAddress: {
    street: string | null;
    city: string | null;
    postalCode: string | null;
    country: "TR";
  };
  /** Müşteri başvurularının yöneltileceği KVKK irtibat noktası. */
  dataProtectionContact: {
    /** İrtibat kişisi adı veya birim adı. */
    name: string | null;
    email: string | null;
    /** VERBIS kayıt numarası varsa. */
    verbisRegistration: string | null;
  };
}

/**
 * TBD — gerçek değerler hukuk/finans tarafından doldurulacak.
 * `null` alanları doldurulmadan production yayını yapılmamalıdır.
 */
export const corporate: CorporateIdentity = {
  legalName: "Sitre Yapı İnşaat A.Ş.",
  tradeName: "Sitre Yapı",
  mersis: null,
  taxOffice: null,
  taxNumber: null,
  tradeRegisterNo: null,
  kep: null,
  entityType: "A.Ş.",
  registeredAddress: {
    street: null,
    city: null,
    postalCode: null,
    country: "TR",
  },
  dataProtectionContact: {
    name: null,
    email: null,
    verbisRegistration: null,
  },
};

/** True when every required field is filled (production gate). */
export function isCorporateIdentityComplete(c: CorporateIdentity = corporate): boolean {
  return Boolean(
    c.mersis &&
      c.taxOffice &&
      c.taxNumber &&
      c.tradeRegisterNo &&
      c.kep &&
      c.registeredAddress.street &&
      c.registeredAddress.city &&
      c.registeredAddress.postalCode &&
      c.dataProtectionContact.email
  );
}
