import { getLocale, intl } from 'components/i18n';
import messages from 'locales/messages';

export interface FormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export type Formatter = (value: number, units: string, options?: FormatOptions) => string;
export type PercentageFormatter = (value: number, options?: FormatOptions) => string;
type UnitsFormatter = (value: number, options?: FormatOptions) => string;

// Returns the number of decimals for given string
export const countDecimals = (value: string, useLocale: boolean = true) => {
  const decimalSeparator = useLocale ? Number('1.1').toLocaleString(getLocale(), {}).substring(1, 2) : '.';
  const decimals = value.split(decimalSeparator);
  return decimals[1] ? decimals[1].length : 0;
};

// Returns the Intl narrow currency symbol for the given currency code
const getNarrowCurrencySymbol = (currency: string) => {
  const parts = intl.formatNumberToParts(0, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  });
  return parts.find(part => part.type === 'currency')?.value || currency;
};

// Prefer narrowSymbol unless it collides with USD's narrow symbol (e.g., CAD → "$")
const shouldUseNarrowSymbol = (currency: string) => {
  return currency === 'USD' || getNarrowCurrencySymbol(currency) !== getNarrowCurrencySymbol('USD');
};

/**
 * Returns currency symbols based on browser's preferred locale -- used with i18n messages.
 * Uses narrowSymbol for all currencies, except when that symbol matches USD's narrow symbol.
 * In that case, fall back to the default currency symbol (e.g., HKD → "HK$", not "$" or "HKD").
 *
 * Examples:
 *
 * ADP (ADP) - Andorran Peseta
 * AED (AED) - United Arab Emirates Dirham
 * AFA (AFA) - Afghan Afghani (1927–2002)
 * AFN (؋) - Afghan Afghani
 * ALK (ALK) - Albanian Lek (1946–1965)
 * ALL (ALL) - Albanian Lek
 * AMD (֏) - Armenian Dram
 * ANG (ANG) - Netherlands Antillean Guilder
 * AOA (Kz) - Angolan Kwanza
 * AOK (AOK) - Angolan Kwanza (1977–1991)
 * AON (AON) - Angolan New Kwanza (1990–2000)
 * AOR (AOR) - Angolan Readjusted Kwanza (1995–1999)
 * ARA (ARA) - Argentine Austral
 * ARL (ARL) - Argentine Peso Ley (1970–1983)
 * ARM (ARM) - Argentine Peso (1881–1970)
 * ARP (ARP) - Argentine Peso (1983–1985)
 * ARS (ARS) - Argentine Peso (narrow would be "$")
 * ATS (ATS) - Austrian Schilling
 * AUD (A$) - Australian Dollar (narrow would be "$")
 * AWG (AWG) - Aruban Florin
 * AZM (AZM) - Azerbaijani Manat (1993–2006)
 * AZN (₼) - Azerbaijani Manat
 * BAD (BAD) - Bosnia-Herzegovina Dinar (1992–1994)
 * BAM (KM) - Bosnia-Herzegovina Convertible Mark
 * BAN (BAN) - Bosnia-Herzegovina New Dinar (1994–1997)
 * BBD (BBD) - Barbadian Dollar (narrow would be "$")
 * BDT (৳) - Bangladeshi Taka
 * BEC (BEC) - Belgian Franc (convertible)
 * BEF (BEF) - Belgian Franc
 * BEL (BEL) - Belgian Franc (financial)
 * BGL (BGL) - Bulgarian Hard Lev
 * BGM (BGM) - Bulgarian Socialist Lev
 * BGN (BGN) - Bulgarian Lev
 * BGO (BGO) - Bulgarian Lev (1879–1952)
 * BHD (BHD) - Bahraini Dinar
 * BIF (BIF) - Burundian Franc
 * BMD (BMD) - Bermudan Dollar (narrow would be "$")
 * BND (BND) - Brunei Dollar (narrow would be "$")
 * BOB (Bs) - Bolivian Boliviano
 * BOL (BOL) - Bolivian Boliviano (1863–1963)
 * BOP (BOP) - Bolivian Peso
 * BOV (BOV) - Bolivian Mvdol
 * BRB (BRB) - Brazilian New Cruzeiro (1967–1986)
 * BRC (BRC) - Brazilian Cruzado (1986–1989)
 * BRE (BRE) - Brazilian Cruzeiro (1990–1993)
 * BRL (R$) - Brazilian Real
 * BRN (BRN) - Brazilian New Cruzado (1989–1990)
 * BRR (BRR) - Brazilian Cruzeiro (1993–1994)
 * BRZ (BRZ) - Brazilian Cruzeiro (1942–1967)
 * BSD (BSD) - Bahamian Dollar (narrow would be "$")
 * BTN (BTN) - Bhutanese Ngultrum
 * BUK (BUK) - Burmese Kyat
 * BWP (P) - Botswanan Pula
 * BYB (BYB) - Belarusian Ruble (1994–1999)
 * BYN (BYN) - Belarusian Ruble
 * BYR (BYR) - Belarusian Ruble (2000–2016)
 * BZD (BZD) - Belize Dollar (narrow would be "$")
 * CAD (CA$) - Canadian Dollar (narrow would be "$")
 * CDF (CDF) - Congolese Franc
 * CHE (CHE) - WIR Euro
 * CHF (CHF) - Swiss Franc
 * CHW (CHW) - WIR Franc
 * CLE (CLE) - Chilean Escudo
 * CLF (CLF) - Chilean Unit of Account (UF)
 * CLP (CLP) - Chilean Peso (narrow would be "$")
 * CNH (CNH) - Chinese Yuan (offshore)
 * CNX (CNX) - Chinese People’s Bank Dollar
 * CNY (¥) - Chinese Yuan
 * COP (COP) - Colombian Peso (narrow would be "$")
 * COU (COU) - Colombian Real Value Unit
 * CRC (₡) - Costa Rican Colón
 * CSD (CSD) - Serbian Dinar (2002–2006)
 * CSK (CSK) - Czechoslovak Hard Koruna
 * CUC (CUC) - Cuban Convertible Peso (narrow would be "$")
 * CUP (CUP) - Cuban Peso (narrow would be "$")
 * CVE (CVE) - Cape Verdean Escudo
 * CYP (CYP) - Cypriot Pound
 * CZK (Kč) - Czech Koruna
 * DDM (DDM) - East German Mark
 * DEM (DEM) - German Mark
 * DJF (DJF) - Djiboutian Franc
 * DKK (kr) - Danish Krone
 * DOP (DOP) - Dominican Peso (narrow would be "$")
 * DZD (DZD) - Algerian Dinar
 * ECS (ECS) - Ecuadorian Sucre
 * ECV (ECV) - Ecuadorian Unit of Constant Value
 * EEK (EEK) - Estonian Kroon
 * EGP (E£) - Egyptian Pound
 * ERN (ERN) - Eritrean Nakfa
 * ESA (ESA) - Spanish Peseta (A account)
 * ESB (ESB) - Spanish Peseta (convertible account)
 * ESP (ESP) - Spanish Peseta
 * ETB (ETB) - Ethiopian Birr
 * EUR (€) - Euro
 * FIM (FIM) - Finnish Markka
 * FJD (FJD) - Fijian Dollar (narrow would be "$")
 * FKP (£) - Falkland Islands Pound
 * FRF (FRF) - French Franc
 * GBP (£) - British Pound
 * GEK (GEK) - Georgian Kupon Larit
 * GEL (₾) - Georgian Lari
 * GHC (GHC) - Ghanaian Cedi (1979–2007)
 * GHS (GH₵) - Ghanaian Cedi
 * GIP (£) - Gibraltar Pound
 * GMD (GMD) - Gambian Dalasi
 * GNF (FG) - Guinean Franc
 * GNS (GNS) - Guinean Syli
 * GQE (GQE) - Equatorial Guinean Ekwele
 * GRD (GRD) - Greek Drachma
 * GTQ (Q) - Guatemalan Quetzal
 * GWE (GWE) - Portuguese Guinea Escudo
 * GWP (GWP) - Guinea-Bissau Peso
 * GYD (GYD) - Guyanaese Dollar (narrow would be "$")
 * HKD (HK$) - Hong Kong Dollar (narrow would be "$")
 * HNL (L) - Honduran Lempira
 * HRD (HRD) - Croatian Dinar
 * HRK (kn) - Croatian Kuna
 * HTG (HTG) - Haitian Gourde
 * HUF (Ft) - Hungarian Forint
 * IDR (Rp) - Indonesian Rupiah
 * IEP (IEP) - Irish Pound
 * ILP (ILP) - Israeli Pound
 * ILR (ILR) - Israeli Shekel (1980–1985)
 * ILS (₪) - Israeli New Shekel
 * INR (₹) - Indian Rupee
 * IQD (IQD) - Iraqi Dinar
 * IRR (IRR) - Iranian Rial
 * ISJ (ISJ) - Icelandic Króna (1918–1981)
 * ISK (kr) - Icelandic Króna
 * ITL (ITL) - Italian Lira
 * JMD (JMD) - Jamaican Dollar (narrow would be "$")
 * JOD (JOD) - Jordanian Dinar
 * JPY (¥) - Japanese Yen
 * KES (KES) - Kenyan Shilling
 * KGS (⃀) - Kyrgystani Som
 * KHR (៛) - Cambodian Riel
 * KMF (CF) - Comorian Franc
 * KPW (₩) - North Korean Won
 * KRH (KRH) - South Korean Hwan (1953–1962)
 * KRO (KRO) - South Korean Won (1945–1953)
 * KRW (₩) - South Korean Won
 * KWD (KWD) - Kuwaiti Dinar
 * KYD (KYD) - Cayman Islands Dollar (narrow would be "$")
 * KZT (₸) - Kazakhstani Tenge
 * LAK (₭) - Laotian Kip
 * LBP (L£) - Lebanese Pound
 * LKR (Rs) - Sri Lankan Rupee
 * LRD (LRD) - Liberian Dollar (narrow would be "$")
 * LSL (LSL) - Lesotho Loti
 * LTL (LTL) - Lithuanian Litas
 * LTT (LTT) - Lithuanian Talonas
 * LUC (LUC) - Luxembourgian Convertible Franc
 * LUF (LUF) - Luxembourgian Franc
 * LUL (LUL) - Luxembourg Financial Franc
 * LVL (LVL) - Latvian Lats
 * LVR (LVR) - Latvian Ruble
 * LYD (LYD) - Libyan Dinar
 * MAD (MAD) - Moroccan Dirham
 * MAF (MAF) - Moroccan Franc
 * MCF (MCF) - Monegasque Franc
 * MDC (MDC) - Moldovan Cupon
 * MDL (MDL) - Moldovan Leu
 * MGA (Ar) - Malagasy Ariary
 * MGF (MGF) - Malagasy Franc
 * MKD (MKD) - Macedonian Denar
 * MKN (MKN) - Macedonian Denar (1992–1993)
 * MLF (MLF) - Malian Franc
 * MMK (K) - Myanmar Kyat
 * MNT (₮) - Mongolian Tugrik
 * MOP (MOP) - Macanese Pataca
 * MRO (MRO) - Mauritanian Ouguiya (1973–2017)
 * MRU (MRU) - Mauritanian Ouguiya
 * MTL (MTL) - Maltese Lira
 * MTP (MTP) - Maltese Pound
 * MUR (Rs) - Mauritian Rupee
 * MVP (MVP) - Maldivian Rupee (1947–1981)
 * MVR (MVR) - Maldivian Rufiyaa
 * MWK (MWK) - Malawian Kwacha
 * MXN (MX$) - Mexican Peso (narrow would be "$")
 * MXP (MXP) - Mexican Silver Peso (1861–1992)
 * MXV (MXV) - Mexican Investment Unit
 * MYR (RM) - Malaysian Ringgit
 * MZE (MZE) - Mozambican Escudo
 * MZM (MZM) - Mozambican Metical (1980–2006)
 * MZN (MZN) - Mozambican Metical
 * NAD (NAD) - Namibian Dollar (narrow would be "$")
 * NGN (₦) - Nigerian Naira
 * NIC (NIC) - Nicaraguan Córdoba (1988–1991)
 * NIO (C$) - Nicaraguan Córdoba
 * NLG (NLG) - Dutch Guilder
 * NOK (kr) - Norwegian Krone
 * NPR (Rs) - Nepalese Rupee
 * NZD (NZ$) - New Zealand Dollar (narrow would be "$")
 * OMR (OMR) - Omani Rial
 * PAB (PAB) - Panamanian Balboa
 * PEI (PEI) - Peruvian Inti
 * PEN (PEN) - Peruvian Sol
 * PES (PES) - Peruvian Sol (1863–1965)
 * PGK (PGK) - Papua New Guinean Kina
 * PHP (₱) - Philippine Peso
 * PKR (Rs) - Pakistani Rupee
 * PLN (zł) - Polish Zloty
 * PLZ (PLZ) - Polish Zloty (1950–1995)
 * PTE (PTE) - Portuguese Escudo
 * PYG (₲) - Paraguayan Guarani
 * QAR (QAR) - Qatari Riyal
 * RHD (RHD) - Rhodesian Dollar
 * ROL (ROL) - Romanian Leu (1952–2006)
 * RON (lei) - Romanian Leu
 * RSD (RSD) - Serbian Dinar
 * RUB (₽) - Russian Ruble
 * RUR (RUR) - Russian Ruble (1991–1998)
 * RWF (RF) - Rwandan Franc
 * SAR (SAR) - Saudi Riyal
 * SBD (SBD) - Solomon Islands Dollar (narrow would be "$")
 * SCR (SCR) - Seychellois Rupee
 * SDD (SDD) - Sudanese Dinar (1992–2007)
 * SDG (SDG) - Sudanese Pound
 * SDP (SDP) - Sudanese Pound (1957–1998)
 * SEK (kr) - Swedish Krona
 * SGD (S$) - Singapore Dollar (narrow would be "$")
 * SHP (£) - St. Helena Pound
 * SIT (SIT) - Slovenian Tolar
 * SKK (SKK) - Slovak Koruna
 * SLE (SLE) - Sierra Leonean Leone
 * SLL (SLL) - Sierra Leonean Leone (1964—2022)
 * SOS (SOS) - Somali Shilling
 * SRD (SRD) - Surinamese Dollar (narrow would be "$")
 * SRG (SRG) - Surinamese Guilder
 * SSP (£) - South Sudanese Pound
 * STD (STD) - São Tomé & Príncipe Dobra (1977–2017)
 * STN (Db) - São Tomé & Príncipe Dobra
 * SUR (SUR) - Soviet Rouble
 * SVC (SVC) - Salvadoran Colón
 * SYP (£) - Syrian Pound
 * SZL (SZL) - Swazi Lilangeni
 * THB (฿) - Thai Baht
 * TJR (TJR) - Tajikistani Ruble
 * TJS (TJS) - Tajikistani Somoni
 * TMM (TMM) - Turkmenistani Manat (1993–2009)
 * TMT (TMT) - Turkmenistani Manat
 * TND (TND) - Tunisian Dinar
 * TOP (T$) - Tongan Paʻanga
 * TPE (TPE) - Timorese Escudo
 * TRL (TRL) - Turkish Lira (1922–2005)
 * TRY (₺) - Turkish Lira
 * TTD (TTD) - Trinidad & Tobago Dollar (narrow would be "$")
 * TWD (NT$) - New Taiwan Dollar (narrow would be "$")
 * TZS (TZS) - Tanzanian Shilling
 * UAH (₴) - Ukrainian Hryvnia
 * UAK (UAK) - Ukrainian Karbovanets
 * UGS (UGS) - Ugandan Shilling (1966–1987)
 * UGX (UGX) - Ugandan Shilling
 * USD ($) - United States Dollar
 * USN (USN) - United States Dollar (Next day)
 * USS (USS) - United States Dollar (Same day)
 * UYI (UYI) - Uruguayan Peso (Indexed Units)
 * UYP (UYP) - Uruguayan Peso (1975–1993)
 * UYU (UYU) - Uruguayan Peso (narrow would be "$")
 * UYW (UYW) - Uruguayan Nominal Wage Index Unit
 * UZS (UZS) - Uzbekistani Som
 * VEB (VEB) - Venezuelan Bolívar (1871–2008)
 * VED (VED) - Bolívar Soberano
 * VEF (VEF) - Venezuelan Bolívar (2008–2018)
 * VES (VES) - Venezuelan Bolívar
 * VND (₫) - Vietnamese Dong
 * VNN (VNN) - Vietnamese Dong (1978–1985)
 * VUV (VUV) - Vanuatu Vatu
 * WST (WST) - Samoan Tala
 * XAF (FCFA) - Central African CFA Franc
 * XAG (XAG) - Silver
 * XAU (XAU) - Gold
 * XBA (XBA) - European Composite Unit
 * XBB (XBB) - European Monetary Unit
 * XBC (XBC) - European Unit of Account (XBC)
 * XBD (XBD) - European Unit of Account (XBD)
 * XCD (EC$) - East Caribbean Dollar (narrow would be "$")
 * XCG (XCG) - Caribbean guilder
 * XDR (XDR) - Special Drawing Rights
 * XEU (XEU) - European Currency Unit
 * XFO (XFO) - French Gold Franc
 * XFU (XFU) - French UIC-Franc
 * XOF (F CFA) - West African CFA Franc
 * XPD (XPD) - Palladium
 * XPF (CFPF) - CFP Franc
 * XPT (XPT) - Platinum
 * XRE (XRE) - RINET Funds
 * XSU (XSU) - Sucre
 * XTS (XTS) - Testing Currency Code
 * XUA (XUA) - ADB Unit of Account
 * XXX (XXX) - Unknown Currency
 * YDD (YDD) - Yemeni Dinar
 * YER (YER) - Yemeni Rial
 * YUD (YUD) - Yugoslavian Hard Dinar (1966–1990)
 * YUM (YUM) - Yugoslavian New Dinar (1994–2002)
 * YUN (YUN) - Yugoslavian Convertible Dinar (1990–1992)
 * YUR (YUR) - Yugoslavian Reformed Dinar (1992–1993)
 * ZAL (ZAL) - South African Rand (financial)
 * ZAR (R) - South African Rand
 * ZMK (ZMK) - Zambian Kwacha (1968–2012)
 * ZMW (ZK) - Zambian Kwacha
 * ZRN (ZRN) - Zairean New Zaire (1993–1998)
 * ZRZ (ZRZ) - Zairean Zaire (1971–1993)
 * ZWD (ZWD) - Zimbabwean Dollar (1980–2008)
 * ZWG (ZWG) - Zimbabwean Gold
 * ZWL (ZWL) - Zimbabwean Dollar (2009–2024)
 * ZWR (ZWR) - Zimbabwean Dollar (2008)
 */
export const getCurrencySymbol = (units: string, options: FormatOptions = {}) => {
  const currency = units ? units.toUpperCase() : 'USD';
  const fValue = 0;

  const parts = intl.formatNumberToParts(fValue, {
    style: 'currency',
    currency,
    ...(shouldUseNarrowSymbol(currency) ? { currencyDisplay: 'narrowSymbol' } : {}),
    ...options,
  });

  const symbol = parts.find(part => part.type === 'currency')?.value || currency;
  return currency === 'SGD' ? formatSGD(symbol) : symbol;
};

// Currencies are formatted differently, depending on the locale you're using. For example, the dollar
// sign may appear on the left or the right of the currency symbol for French Vs German.
//
// Using the ISO currency code AUD, $12.34 USD is formatted per the locales below.
// See ICU currencies https://www.localeplanet.com/icu/currency.html
//
// en: A$12.34
// fr: 12,34 $AU
// de: 12,34 AU$
//
// Note: Some currencies do not have decimals, such as JPY, and some have 3 decimals such as IQD.
// See https://docs.adyen.com/development-resources/currency-codes
export const formatCurrency: Formatter = (value: number, units: string, options: FormatOptions = {}) => {
  const currency = units ? units.toUpperCase() : 'USD';
  let fValue = value;

  // Don't show negative zero -- https://redhat.atlassian.net/browse/COST-3087
  if (!value || Number(value).toFixed(2) === '-0.00') {
    fValue = 0;
  }

  // Don't specify default fraction digits here, rely on react-intl instead.
  // Default to narrowSymbol unless it would collide with USD's narrow symbol.
  const formattedValue = intl.formatNumber(fValue, {
    style: 'currency',
    currency,
    ...(shouldUseNarrowSymbol(currency) ? { currencyDisplay: 'narrowSymbol' } : {}),
    ...options,
  });
  return currency === 'SGD' ? formatSGD(formattedValue) : formattedValue;
};

export const formatCurrencyAbbreviation: Formatter = (value, units = 'USD') => {
  let fValue = value;
  if (!value) {
    fValue = 0;
  }

  // Derived from https://stackoverflow.com/questions/37799955/how-can-i-format-big-numbers-with-tolocalestring
  const abbreviationFormats = [
    { val: 1e15, symbol: 'quadrillion' },
    { val: 1e12, symbol: 'trillion' },
    { val: 1e9, symbol: 'billion' },
    { val: 1e6, symbol: 'million' },
    { val: 1e3, symbol: 'thousand' },
  ];

  // Find the proper format to use
  let format;
  if (abbreviationFormats != null) {
    format = abbreviationFormats.find(f => fValue >= f.val);
  }

  // Apply format and insert symbol next to the numeric portion of the formatted string
  if (format != null) {
    const { val, symbol } = format;
    return intl.formatMessage(messages.currencyAbbreviations, {
      symbol,
      value: formatCurrency(fValue / val, units, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    }) as string;
  }

  // If no format was found, format value without abbreviation
  return formatCurrency(value, units, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

// Formats cost model rates with 0 to 10 decimals
// https://redhat.atlassian.net/browse/COST-1884
export const formatCurrencyRate: Formatter = (
  value: number,
  units: string,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
  }
) => {
  return formatCurrency(value, units, options);
};

// Formats cost model rates with 0 to 10 decimals
// https://redhat.atlassian.net/browse/COST-1884
export const formatCurrencyRateRaw: Formatter = (
  value: number,
  units: string,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
  }
) => {
  return formatCurrencyRaw(value, units, options);
};

// Formats without currency symbol
export const formatCurrencyRaw: Formatter = (value: number, units: string, options: FormatOptions = {}) => {
  return formatCurrency(value, units, {
    currencyDisplay: 'code',
    ...options,
  } as any)
    .toString()
    .trim()
    .replace(units, '')
    .replace(/\u202f/g, '') // Small non-breaking space for group separator
    .replace(/\xa0/g, ''); // Non-breaking space before currency
};

export const formatPercentage: PercentageFormatter = (
  value,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }
) => {
  return value.toLocaleString(getLocale(), options);
};

// Formats cost model markup with 0 to 10 decimals
// https://redhat.atlassian.net/browse/COST-1884
export const formatPercentageMarkup: PercentageFormatter = (
  value,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
  }
) => {
  return value
    .toLocaleString(getLocale(), options)
    .trim()
    .replace(/\u202f/g, '') // Small non-breaking space for group separator
    .replace(/\xa0/g, ''); // Non-breaking space before currency;
};

// Format optimization metrics
export const formatOptimization: PercentageFormatter = (
  value,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20, // Allow the API to set the number of decimal places
  }
) => {
  const val = value.toLocaleString(getLocale(), options);
  return val;
};

// Workaround to show S$ currency symbol
export const formatSGD = (value: string) => {
  // If the value already contains "S$", return as-is
  if (value.includes('S$')) {
    return value;
  }
  // Insert "S" immediately before the dollar sign, preserving locale-specific spacing/signs
  const dollarIndex = value.indexOf('$');
  if (dollarIndex !== -1) {
    return `${value.slice(0, dollarIndex)}S${value.slice(dollarIndex)}`;
  }
  // Fall back to replacing the currency code with "S$" while keeping the amount formatting
  const codeIndex = value.indexOf('SGD');
  if (codeIndex !== -1) {
    return `${value.slice(0, codeIndex)}S$${value.slice(codeIndex + 3)}`;
  }
  return value;
};

// Returns formatted units or currency with given currency-code
export const formatUnits: Formatter = (value, units, options) => {
  const lookup = unitsLookupKey(units);
  const fValue = value || 0;

  switch (lookup) {
    case 'byte_ms':
    case 'cluser_month':
    case 'core':
    case 'core_hours':
    case 'gb':
    case 'gb_hours':
    case 'gb_month':
    case 'gb_ms':
    case 'gib':
    case 'gib_hours':
    case 'gib_month':
    case 'gibibyte_month':
    case 'gpu':
    case 'gpus':
    case 'hour':
    case 'hrs':
    case 'ms':
    case 'pvc_month':
    case 'tag_month':
    case 'vm_hours':
      return formatUsage(fValue, options);
  }
  return unknownTypeFormatter(fValue, options);
};

export const formatUsage: UnitsFormatter = (
  value,
  options: FormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }
) => {
  return value.toLocaleString(getLocale(), options);
};

// Returns true if given percentage or currency format is valid for current locale
export const isCurrencyFormatValid = (value: string) => {
  const decimalSeparator = intl.formatNumber(1.1).toString().replace(/1/g, '');

  // ^[0-9] The number must start with 0-9
  // \d* The number can then have any number of any digits
  // (...)$ look at the next group from the end (...)$
  // (...)*(...)? Look for groups optionally. The first is for the comma, the second is for the decimal.
  // (,\d{3})* Look for one or more occurrences of a comma followed by three digits
  // \.\d* Look for a decimal followed by any number of any digits
  //
  // Based on https://stackoverflow.com/questions/2227370/currency-validation
  const regex = decimalSeparator === ',' ? /^-?[0-9]\d*((\.\d{3})*(,\d*)?)$/ : /^-?[0-9]\d*((,\d{3})*(\.\d*)?)$/;

  const test = regex.test(value);
  return test;
};

// Returns true if given percentage is valid for current locale
export const isPercentageFormatValid = (value: string) => {
  return isCurrencyFormatValid(value);
};

// This function normalizes a given currency or percentage.
//
// Some locales us a comma as the decimal separator (e.g., "1.234,56" in German), which must be
// replaced for APIs where USD decimal format is expected.
//
// Note that the group separator (e.g., "1,234.56" in USD) must also be removed when formatting
// currencies and percentages to display in the browser's locale.
export const unFormat = (value: string) => {
  if (!value) {
    return value;
  }

  const decimalSeparator = intl.formatNumber(1.1).toString().replace(/1/g, '');

  let rawValue = value.toString();
  if (decimalSeparator === ',') {
    rawValue = rawValue.replace(/\./g, ''); // Remove group separator
    rawValue = rawValue.replace(/,/g, '.'); // Replace decimal separator
  } else {
    rawValue = rawValue.replace(/,/g, ''); // Remove group separator
  }
  return rawValue;
};

const unknownTypeFormatter = (value: number, options: FormatOptions) => {
  return value.toLocaleString(getLocale(), options);
};

// Returns i18n key for given units
export const unitsLookupKey = (units): string => {
  const lookup = units ? units.replace(/[- ]/g, '_').toLowerCase() : '';

  switch (lookup) {
    case 'byte_ms':
    case 'cluser_month':
    case 'core':
    case 'core_hours':
    case 'g':
    case 'gb':
    case 'gb_hours':
    case 'gb_ms':
    case 'gib':
    case 'gib_hours':
    case 'gib_month':
    case 'gibibyte_month':
    case 'gpu':
    case 'gpus':
    case 'hour':
    case 'hrs':
    case 'ms':
    case 'pvc_month':
    case 'vm_hours':
      return lookup;
    case 'gib_mo':
      return 'gib_month';
    case 'gb_mo':
      return 'gb_month';
    case 'tag_mo':
      return 'tag_month';
    default:
      return undefined;
  }
};
