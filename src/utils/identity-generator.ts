import { fakerZH_CN } from '@faker-js/faker'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export type IdentityTab = 'generate' | 'favorites'
export type IdentityGender = 'male' | 'female'
export type IdentityGenderOption = IdentityGender | 'random'
export type ExportFormat = 'json' | 'csv' | 'tsv'
export type IdentityFieldKey
  = | 'idCard'
    | 'name'
    | 'companyName'
    | 'socialCreditCode'
    | 'gender'
    | 'birthDate'
    | 'address'
    | 'postalCode'
    | 'phone'
    | 'email'
export type IdentityColumnKey = IdentityFieldKey | 'actions'
export type IdentityColumnWidths = Record<IdentityColumnKey, number>

export interface SelectOption<T = string | number> {
  label: string
  value: T
}

export interface IdentityFieldConfig {
  key: IdentityFieldKey
  label: string
  enabled: boolean
}

export interface GeneratorOptions {
  count: number
  gender: IdentityGenderOption
  birthYear: number | null
  birthMonth: number | null
  birthDay: number | null
  provinceCode: string | null
  cityCode: string | null
  districtCode: string | null
}

export interface IdentityRecord {
  uid: string
  idCard: string
  name: string
  companyName: string
  socialCreditCode: string
  gender: '男' | '女'
  birthDate: string
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  districtCode: string
  districtName: string
  address: string
  postalCode: string
  phone: string
  email: string
  createdAt: string
}

export interface FavoriteIdentityRecord extends IdentityRecord {
  favoriteAt: string
  note: string
}

interface LevelRoot {
  code: string
  name: string
  children: LevelRootChild[]
}

interface LevelRootChild {
  code: string
  name: string
  children: LevelChildChild[]
}

interface LevelChildChild {
  code: string
  name: string
}

export interface ResolvedArea {
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  districtCode: string
  districtName: string
}

export interface AreaDataset {
  provinceOptions: SelectOption<string>[]
  citiesByProvince: Record<string, SelectOption<string>[]>
  districtsByProvince: Record<string, ResolvedArea[]>
  districtsByCity: Record<string, ResolvedArea[]>
  areaNameMap: Record<string, string>
  allDistricts: ResolvedArea[]
}

const DEFAULT_FIELD_CONFIGS: IdentityFieldConfig[] = [
  { key: 'idCard', label: '身份证', enabled: true },
  { key: 'name', label: '姓名', enabled: true },
  { key: 'companyName', label: '企业名称', enabled: true },
  { key: 'socialCreditCode', label: '统一社会信用代码', enabled: true },
  { key: 'gender', label: '性别', enabled: true },
  { key: 'birthDate', label: '出生日期', enabled: true },
  { key: 'address', label: '地址', enabled: true },
  { key: 'postalCode', label: '邮编', enabled: true },
  { key: 'phone', label: '手机号', enabled: true },
  { key: 'email', label: '邮箱', enabled: true },
]

const DEFAULT_GENERATOR_OPTIONS: GeneratorOptions = {
  count: 10,
  gender: 'random',
  birthYear: null,
  birthMonth: null,
  birthDay: null,
  provinceCode: null,
  cityCode: null,
  districtCode: null,
}

const DEFAULT_COLUMN_WIDTHS: IdentityColumnWidths = {
  idCard: 185,
  name: 100,
  companyName: 240,
  socialCreditCode: 190,
  gender: 105,
  birthDate: 130,
  address: 290,
  postalCode: 100,
  phone: 130,
  email: 220,
  actions: 150,
}

const ID_CARD_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const ID_CARD_CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
const SOCIAL_CREDIT_CODE_CHARS = '0123456789ABCDEFGHJKLMNPQRTUWXY'
const SOCIAL_CREDIT_CODE_CHAR_POOL = SOCIAL_CREDIT_CODE_CHARS.split('')
const SOCIAL_CREDIT_CODE_WEIGHTS = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]
const SOCIAL_CREDIT_CODE_PREFIX = '91'
const PHONE_PREFIXES = [
  '130',
  '131',
  '132',
  '133',
  '134',
  '135',
  '136',
  '137',
  '138',
  '139',
  '147',
  '150',
  '151',
  '152',
  '153',
  '155',
  '156',
  '157',
  '158',
  '159',
  '166',
  '171',
  '172',
  '173',
  '175',
  '176',
  '177',
  '178',
  '180',
  '181',
  '182',
  '183',
  '184',
  '185',
  '186',
  '187',
  '188',
  '189',
  '198',
  '199',
]
const EMAIL_DOMAINS = ['qq.com', '163.com', 'gmail.com', 'outlook.com', 'hotmail.com']
const STREET_NAMES = [
  '人民路',
  '解放路',
  '建设路',
  '和平路',
  '中山路',
  '新华路',
  '长安街',
  '朝阳路',
  '幸福街',
  '文化路',
  '青年路',
  '振兴路',
  '兴业街',
  '康乐路',
  '锦绣路',
  '学府路',
]
const SURNAMES = [
  '王',
  '李',
  '张',
  '刘',
  '陈',
  '杨',
  '黄',
  '赵',
  '吴',
  '周',
  '徐',
  '孙',
  '马',
  '朱',
  '胡',
  '郭',
  '何',
  '高',
  '林',
  '罗',
  '郑',
  '梁',
  '谢',
  '宋',
  '唐',
  '许',
  '韩',
  '冯',
  '邓',
  '曹',
  '彭',
  '曾',
  '肖',
  '田',
  '董',
  '袁',
  '潘',
  '于',
  '蒋',
  '蔡',
  '余',
  '杜',
]
const MALE_NAME_CHARS = [
  '伟',
  '强',
  '磊',
  '洋',
  '勇',
  '军',
  '杰',
  '涛',
  '超',
  '明',
  '刚',
  '平',
  '峰',
  '健',
  '鑫',
  '鹏',
  '宇',
  '浩',
  '博',
  '凯',
  '俊',
  '晨',
  '翔',
  '瑞',
  '阳',
  '诚',
  '泽',
  '昊',
]
const FEMALE_NAME_CHARS = [
  '芳',
  '娜',
  '敏',
  '静',
  '丽',
  '艳',
  '娟',
  '洁',
  '琳',
  '雪',
  '颖',
  '慧',
  '婷',
  '丹',
  '倩',
  '璐',
  '怡',
  '颖',
  '欣',
  '妍',
  '彤',
  '雅',
  '琪',
  '雯',
  '可',
  '瑶',
  '菲',
  '悦',
]
const EMAIL_NAME_PARTS = [
  'sun',
  'moon',
  'river',
  'forest',
  'cloud',
  'stone',
  'light',
  'green',
  'snow',
  'wind',
]
const MAX_GENERATE_COUNT = 50
const MIN_BIRTH_YEAR = 1960
const MAX_BIRTH_YEAR = dayjs().year() - 18

let areaDatasetPromise: Promise<AreaDataset> | null = null

export function createDefaultFieldConfigs(): IdentityFieldConfig[] {
  return DEFAULT_FIELD_CONFIGS.map(item => ({ ...item }))
}

export function createDefaultGeneratorOptions(): GeneratorOptions {
  return { ...DEFAULT_GENERATOR_OPTIONS }
}

export function createYearOptions(): SelectOption<number>[] {
  const options: SelectOption<number>[] = []

  for (let year = MAX_BIRTH_YEAR; year >= MIN_BIRTH_YEAR; year -= 1) {
    options.push({
      label: `${year}年`,
      value: year,
    })
  }

  return options
}

export function createMonthOptions(): SelectOption<number>[] {
  const options: SelectOption<number>[] = []

  for (let month = 1; month <= 12; month += 1) {
    options.push({
      label: `${month}月`,
      value: month,
    })
  }

  return options
}

export function createDayOptions(year: number | null, month: number | null): SelectOption<number>[] {
  if (!year || !month) {
    return []
  }

  const totalDays = dayjs(`${year}-${padNumber(month)}-01`).daysInMonth()
  const options: SelectOption<number>[] = []

  for (let day = 1; day <= totalDays; day += 1) {
    options.push({
      label: `${day}日`,
      value: day,
    })
  }

  return options
}

export async function getAreaDataset(): Promise<AreaDataset> {
  if (!areaDatasetPromise) {
    areaDatasetPromise = loadAreaDataset()
  }

  return areaDatasetPromise
}

export async function listProvinceOptions(): Promise<SelectOption<string>[]> {
  const dataset = await getAreaDataset()
  return dataset.provinceOptions
}

export async function listCityOptions(provinceCode: string | null): Promise<SelectOption<string>[]> {
  if (!provinceCode) {
    return []
  }

  const dataset = await getAreaDataset()
  return dataset.citiesByProvince[provinceCode] ?? []
}

export async function listDistrictOptions(
  provinceCode: string | null,
  cityCode: string | null,
): Promise<SelectOption<string>[]> {
  const dataset = await getAreaDataset()
  const districts = getDistrictCandidates(dataset, provinceCode, cityCode)

  return districts.map((district) => {
    const label = cityCode || district.cityName === district.provinceName
      ? district.districtName
      : `${district.cityName} / ${district.districtName}`

    return {
      label,
      value: district.districtCode,
    }
  })
}

export async function generateIdentityRows(options: GeneratorOptions): Promise<IdentityRecord[]> {
  const dataset = await getAreaDataset()
  const count = sanitizeCount(options.count)
  const rows: IdentityRecord[] = []
  const usedIdCards = new Set<string>()
  const usedSocialCreditCodes = new Set<string>()
  let attempts = 0

  while (rows.length < count && attempts < count * 30) {
    const row = generateSingleIdentity(options, dataset)
    attempts += 1

    if (usedIdCards.has(row.idCard) || usedSocialCreditCodes.has(row.socialCreditCode)) {
      continue
    }

    if (!validateIdentityRecord(row)) {
      continue
    }

    usedIdCards.add(row.idCard)
    usedSocialCreditCodes.add(row.socialCreditCode)
    rows.push(row)
  }

  return rows
}

export function validateIdentityRecord(row: IdentityRecord): boolean {
  if (!dayjs(row.birthDate, 'YYYY-MM-DD', true).isValid()) {
    return false
  }

  if (!isValidIdCard(row.idCard)) {
    return false
  }

  const genderCode = Number.parseInt(row.idCard[16] ?? '', 10)
  if (Number.isNaN(genderCode)) {
    return false
  }

  if (row.gender === '男' && genderCode % 2 === 0) {
    return false
  }

  if (row.gender === '女' && genderCode % 2 !== 0) {
    return false
  }

  if (row.idCard.slice(0, 6) !== row.districtCode) {
    return false
  }

  if (row.idCard.slice(6, 14) !== row.birthDate.replaceAll('-', '')) {
    return false
  }

  if (!row.address.startsWith(row.provinceName) || !row.address.includes(row.districtName)) {
    return false
  }

  if (!isValidSocialCreditCode(row.socialCreditCode)) {
    return false
  }

  if (!row.socialCreditCode.startsWith(SOCIAL_CREDIT_CODE_PREFIX)) {
    return false
  }

  if (row.socialCreditCode.slice(2, 8) !== row.districtCode) {
    return false
  }

  return true
}

export function getEnabledFieldConfigs(fieldConfigs: IdentityFieldConfig[]): IdentityFieldConfig[] {
  return fieldConfigs.filter(item => item.enabled)
}

export function getFieldValue(row: IdentityRecord | FavoriteIdentityRecord, key: IdentityFieldKey): string {
  return String(row[key] ?? '')
}

export function toJsonText(
  rows: Array<IdentityRecord | FavoriteIdentityRecord>,
  fieldConfigs: IdentityFieldConfig[],
): string {
  const enabledFields = getEnabledFieldConfigs(fieldConfigs)
  const payload = rows.map((row) => {
    const result = {} as Record<string, string>

    for (const field of enabledFields) {
      result[field.label] = getFieldValue(row, field.key)
    }

    return result
  })

  return JSON.stringify(payload, null, 2)
}

export function toCsvText(
  rows: Array<IdentityRecord | FavoriteIdentityRecord>,
  fieldConfigs: IdentityFieldConfig[],
): string {
  return toDelimitedText(rows, fieldConfigs, ',')
}

export function toTsvText(
  rows: Array<IdentityRecord | FavoriteIdentityRecord>,
  fieldConfigs: IdentityFieldConfig[],
): string {
  return toDelimitedText(rows, fieldConfigs, '\t')
}

export function serializeRows(
  rows: Array<IdentityRecord | FavoriteIdentityRecord>,
  fieldConfigs: IdentityFieldConfig[],
  format: ExportFormat,
): string {
  if (format === 'json') {
    return toJsonText(rows, fieldConfigs)
  }

  if (format === 'csv') {
    return toCsvText(rows, fieldConfigs)
  }

  return toTsvText(rows, fieldConfigs)
}

export function createFavoriteRow(row: IdentityRecord): FavoriteIdentityRecord {
  return {
    ...row,
    favoriteAt: new Date().toISOString(),
    note: '',
  }
}

export function createDefaultColumnWidths(): IdentityColumnWidths {
  return { ...DEFAULT_COLUMN_WIDTHS }
}

export function sanitizeCount(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_GENERATOR_OPTIONS.count
  }

  return Math.min(MAX_GENERATE_COUNT, Math.max(1, Math.trunc(value)))
}

function generateSingleIdentity(options: GeneratorOptions, dataset: AreaDataset): IdentityRecord {
  const area = resolveArea(options, dataset)
  const birthDate = resolveBirthDate(options)
  const gender = resolveGender(options.gender)
  const idCard = buildIdCard(area.districtCode, birthDate.compact, gender)
  const name = buildName(gender)
  const companyName = buildCompanyName()
  const socialCreditCode = buildSocialCreditCode(area.districtCode)
  const address = buildAddress(area)
  const postalCode = buildPostalCode(area.districtCode)
  const phone = buildPhoneNumber()
  const email = buildEmail(name, idCard)

  return {
    uid: crypto.randomUUID(),
    idCard,
    name,
    companyName,
    socialCreditCode,
    gender: gender === 'male' ? '男' : '女',
    birthDate: birthDate.display,
    provinceCode: area.provinceCode,
    provinceName: area.provinceName,
    cityCode: area.cityCode,
    cityName: area.cityName,
    districtCode: area.districtCode,
    districtName: area.districtName,
    address,
    postalCode,
    phone,
    email,
    createdAt: new Date().toISOString(),
  }
}

function resolveArea(options: GeneratorOptions, dataset: AreaDataset): ResolvedArea {
  if (options.districtCode) {
    const district = dataset.allDistricts.find(item => item.districtCode === options.districtCode)
    if (district) {
      return district
    }
  }

  const candidates = getDistrictCandidates(dataset, options.provinceCode, options.cityCode)
  return pickOne(candidates)
}

function getDistrictCandidates(
  dataset: AreaDataset,
  provinceCode: string | null,
  cityCode: string | null,
): ResolvedArea[] {
  if (cityCode) {
    const cityDistricts = dataset.districtsByCity[cityCode] ?? []
    if (cityDistricts.length > 0) {
      return cityDistricts
    }
  }

  if (provinceCode) {
    const provinceDistricts = dataset.districtsByProvince[provinceCode] ?? []
    if (provinceDistricts.length > 0) {
      return provinceDistricts
    }
  }

  return dataset.allDistricts
}

function resolveBirthDate(options: GeneratorOptions): { compact: string, display: string } {
  const year = options.birthYear ?? randomInt(MIN_BIRTH_YEAR, MAX_BIRTH_YEAR)
  const month = options.birthMonth ?? randomInt(1, 12)
  const totalDays = dayjs(`${year}-${padNumber(month)}-01`).daysInMonth()
  const day = options.birthDay ?? randomInt(1, totalDays)
  const compact = `${year}${padNumber(month)}${padNumber(day)}`

  if (!dayjs(compact, 'YYYYMMDD', true).isValid()) {
    throw new Error('生成了非法生日')
  }

  return {
    compact,
    display: `${year}-${padNumber(month)}-${padNumber(day)}`,
  }
}

function resolveGender(gender: IdentityGenderOption): IdentityGender {
  if (gender === 'male' || gender === 'female') {
    return gender
  }

  return Math.random() > 0.5 ? 'male' : 'female'
}

function buildIdCard(districtCode: string, birthday: string, gender: IdentityGender): string {
  const sequenceCode = buildSequenceCode(gender)
  const base = `${districtCode}${birthday}${sequenceCode}`
  return `${base}${calculateCheckCode(base)}`
}

function buildSequenceCode(gender: IdentityGender): string {
  const body = randomInt(0, 99).toString().padStart(2, '0')
  const lastDigitPool = gender === 'male' ? ['1', '3', '5', '7', '9'] : ['0', '2', '4', '6', '8']
  return `${body}${pickOne(lastDigitPool)}`
}

function calculateCheckCode(baseCode: string): string {
  const sum = baseCode
    .split('')
    .reduce((total, current, index) => total + Number(current) * (ID_CARD_WEIGHTS[index] ?? 0), 0)

  const checkCode = ID_CARD_CHECK_CODES[sum % 11]

  if (!checkCode) {
    throw new Error('生成校验码失败')
  }

  return checkCode
}

function isValidIdCard(idCard: string): boolean {
  if (!/^\d{17}[0-9X]$/.test(idCard)) {
    return false
  }

  return calculateCheckCode(idCard.slice(0, 17)) === idCard[17]
}

function buildName(gender: IdentityGender): string {
  const surname = pickOne(SURNAMES)
  const pool = gender === 'male' ? MALE_NAME_CHARS : FEMALE_NAME_CHARS
  const givenNameLength = Math.random() > 0.45 ? 2 : 1
  let givenName = ''

  for (let index = 0; index < givenNameLength; index += 1) {
    givenName += pickOne(pool)
  }

  return `${surname}${givenName}`
}

function buildCompanyName(): string {
  return fakerZH_CN.company.name()
}

function buildSocialCreditCode(districtCode: string): string {
  const body = `${SOCIAL_CREDIT_CODE_PREFIX}${districtCode}${buildSocialCreditCodeBody()}`
  return `${body}${calculateSocialCreditCodeCheckChar(body)}`
}

function buildSocialCreditCodeBody(): string {
  let result = ''

  for (let index = 0; index < 9; index += 1) {
    result += pickOne(SOCIAL_CREDIT_CODE_CHAR_POOL)
  }

  return result
}

function calculateSocialCreditCodeCheckChar(baseCode: string): string {
  const sum = baseCode
    .split('')
    .reduce((total, current, index) => {
      return total + getSocialCreditCodeValue(current) * (SOCIAL_CREDIT_CODE_WEIGHTS[index] ?? 0)
    }, 0)
  const checkValue = (31 - sum % 31) % 31
  const checkChar = SOCIAL_CREDIT_CODE_CHARS[checkValue]

  if (!checkChar) {
    throw new Error('生成统一社会信用代码校验码失败')
  }

  return checkChar
}

function getSocialCreditCodeValue(char: string): number {
  const value = SOCIAL_CREDIT_CODE_CHARS.indexOf(char)

  if (value < 0) {
    throw new Error('统一社会信用代码包含非法字符')
  }

  return value
}

function isValidSocialCreditCode(code: string): boolean {
  if (!/^[0-9A-Z]{18}$/.test(code)) {
    return false
  }

  if (/[IOSVZ]/.test(code)) {
    return false
  }

  return calculateSocialCreditCodeCheckChar(code.slice(0, 17)) === code[17]
}

function buildAddress(area: ResolvedArea): string {
  const road = pickOne(STREET_NAMES)
  const lane = randomInt(1, 999)
  const room = randomInt(101, 2802)
  const cityPart = area.cityName === area.provinceName ? '' : area.cityName

  return `${area.provinceName}${cityPart}${area.districtName}${road}${lane}号${room}室`
}

function buildPostalCode(districtCode: string): string {
  return `${districtCode.slice(0, 3)}${randomInt(0, 999).toString().padStart(3, '0')}`
}

function buildPhoneNumber(): string {
  return `${pickOne(PHONE_PREFIXES)}${randomInt(0, 99999999).toString().padStart(8, '0')}`
}

function buildEmail(name: string, idCard: string): string {
  const safeName = name.replaceAll(/[^\u4E00-\u9FA5]/g, '')
  const prefix = `${pickOne(EMAIL_NAME_PARTS)}${safeName.length}${idCard.slice(-4)}`.toLowerCase()
  return `${prefix}@${pickOne(EMAIL_DOMAINS)}`
}

async function loadAreaDataset(): Promise<AreaDataset> {
  const response = await fetch(new URL('../assets/level.json', import.meta.url))

  if (!response.ok) {
    throw new Error('地区数据加载失败')
  }

  const roots = await response.json() as LevelRoot[]
  return buildAreaDatasetFromLevelTree(roots)
}

function buildAreaDatasetFromLevelTree(roots: LevelRoot[]): AreaDataset {
  const areaNameMap = {} as Record<string, string>
  const provinceOptions: SelectOption<string>[] = []
  const citiesByProvince = {} as Record<string, SelectOption<string>[]>
  const districtsByProvince = {} as Record<string, ResolvedArea[]>
  const districtsByCity = {} as Record<string, ResolvedArea[]>
  const allDistricts: ResolvedArea[] = []

  for (const province of roots) {
    const provinceCode = normalizeProvinceCode(province.code)
    areaNameMap[provinceCode] = province.name
    provinceOptions.push({
      label: province.name,
      value: provinceCode,
    })

    const cityOptions: SelectOption<string>[] = []
    const provinceDistricts: ResolvedArea[] = []

    for (const city of province.children ?? []) {
      const cityCode = normalizeCityCode(city.code)
      const cityName = normalizeCityName(province.name, city.name)
      areaNameMap[cityCode] = cityName
      cityOptions.push({
        label: cityName,
        value: cityCode,
      })

      const cityDistricts: ResolvedArea[] = []

      for (const district of city.children ?? []) {
        areaNameMap[district.code] = district.name

        const resolved = {
          provinceCode,
          provinceName: province.name,
          cityCode,
          cityName,
          districtCode: district.code,
          districtName: district.name,
        }

        cityDistricts.push(resolved)
        provinceDistricts.push(resolved)
        allDistricts.push(resolved)
      }

      districtsByCity[cityCode] = cityDistricts
    }

    citiesByProvince[provinceCode] = cityOptions
    districtsByProvince[provinceCode] = provinceDistricts
  }

  sortAreaCollections(citiesByProvince, districtsByProvince, districtsByCity)

  return {
    provinceOptions,
    citiesByProvince,
    districtsByProvince,
    districtsByCity,
    areaNameMap,
    allDistricts,
  }
}

function normalizeProvinceCode(code: string): string {
  if (code.length === 2) {
    return `${code}0000`
  }

  return code
}

function normalizeCityCode(code: string): string {
  if (code.length === 4) {
    return `${code}00`
  }

  return code
}

function normalizeCityName(provinceName: string, cityName: string): string {
  if (cityName === '市辖区' || cityName === '县' || cityName === '省直辖县级行政区划') {
    return provinceName
  }

  return cityName
}

function sortAreaCollections(
  citiesByProvince: Record<string, SelectOption<string>[]>,
  districtsByProvince: Record<string, ResolvedArea[]>,
  districtsByCity: Record<string, ResolvedArea[]>,
): void {
  for (const provinceCode of Object.keys(citiesByProvince)) {
    const cityOptions = citiesByProvince[provinceCode]
    cityOptions?.sort((left, right) => left.value.localeCompare(right.value))
  }

  for (const provinceCode of Object.keys(districtsByProvince)) {
    const districtOptions = districtsByProvince[provinceCode]
    districtOptions?.sort((left, right) => left.districtCode.localeCompare(right.districtCode))
  }

  for (const cityCode of Object.keys(districtsByCity)) {
    const districtOptions = districtsByCity[cityCode]
    districtOptions?.sort((left, right) => left.districtCode.localeCompare(right.districtCode))
  }
}

function escapeDelimitedCell(value: string, delimiter: string): string {
  const normalized = value.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
  if (!normalized.includes(delimiter) && !normalized.includes('"') && !normalized.includes('\n')) {
    return normalized
  }

  return `"${normalized.replaceAll('"', '""')}"`
}

function toDelimitedText(
  rows: Array<IdentityRecord | FavoriteIdentityRecord>,
  fieldConfigs: IdentityFieldConfig[],
  delimiter: string,
): string {
  const enabledFields = getEnabledFieldConfigs(fieldConfigs)
  const lines = rows.map((row) => {
    return enabledFields
      .map(field => escapeDelimitedCell(getFieldValue(row, field.key), delimiter))
      .join(delimiter)
  })

  return lines.join('\n')
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickOne<T>(items: T[]): T {
  const item = items[randomInt(0, items.length - 1)]

  if (item === undefined) {
    throw new Error('随机取值失败')
  }

  return item
}

function padNumber(value: number): string {
  return value.toString().padStart(2, '0')
}
