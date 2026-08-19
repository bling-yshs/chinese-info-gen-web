import type {
  FavoriteIdentityRecord,
  GeneratorOptions,
  IdentityColumnKey,
  IdentityColumnWidths,
  IdentityCustomFieldKey,
  IdentityFieldConfig,
  IdentityRecord,
  IdentityTab,
} from '@/utils/identity-generator'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  countCustomFieldExecutionErrors,
  createDefaultCustomFieldConfig,
  createDefaultColumnWidths,
  createDefaultFieldConfigs,
  createDefaultGeneratorOptions,
  createFavoriteRow,
  getDefaultColumnWidth,
  generateIdentityRows,
  isCustomFieldKey,
  sanitizeCount,
} from '@/utils/identity-generator'

/**
 * 归一化自定义字段配置。
 */
function normalizeCustomFieldConfig(fieldConfig: IdentityFieldConfig): IdentityFieldConfig | null {
  if (!isCustomFieldKey(fieldConfig.key)) {
    return null
  }

  return {
    key: fieldConfig.key,
    label: fieldConfig.label?.trim() || '自定义字段',
    enabled: Boolean(fieldConfig.enabled),
    code: fieldConfig.code ?? '',
  }
}

/**
 * 归一化字段显示配置。
 */
function normalizeFieldConfigs(fieldConfigs: IdentityFieldConfig[]): IdentityFieldConfig[] {
  const defaultFieldConfigs = createDefaultFieldConfigs()
  const defaultFieldConfigMap = new Map(defaultFieldConfigs.map((item) => [item.key, item]))
  const nextFieldConfigs: IdentityFieldConfig[] = []

  for (const fieldConfig of fieldConfigs) {
    const customFieldConfig = normalizeCustomFieldConfig(fieldConfig)
    if (customFieldConfig) {
      nextFieldConfigs.push(customFieldConfig)
      continue
    }

    const defaultFieldConfig = defaultFieldConfigMap.get(fieldConfig.key)
    if (!defaultFieldConfig) {
      continue
    }

    nextFieldConfigs.push({
      ...defaultFieldConfig,
      enabled: fieldConfig.enabled,
    })

    defaultFieldConfigMap.delete(fieldConfig.key)
  }

  for (const fieldConfig of defaultFieldConfigs) {
    if (defaultFieldConfigMap.has(fieldConfig.key)) {
      nextFieldConfigs.push(fieldConfig)
    }
  }

  return nextFieldConfigs
}

/**
 * 归一化表格列宽配置。
 */
function normalizeColumnWidths(columnWidths: IdentityColumnWidths): IdentityColumnWidths {
  return {
    ...createDefaultColumnWidths(),
    ...columnWidths,
  }
}

/**
 * 补齐旧缓存缺失的生成条件字段。
 */
function normalizeGeneratorOptions(generatorOptions: Partial<GeneratorOptions>): GeneratorOptions {
  const nextGeneratorOptions = {
    ...createDefaultGeneratorOptions(),
    ...generatorOptions,
  }

  nextGeneratorOptions.count = sanitizeCount(nextGeneratorOptions.count)

  if (![2, 3, 'random'].includes(nextGeneratorOptions.nameLength)) {
    nextGeneratorOptions.nameLength = 'random'
  }

  return nextGeneratorOptions
}

/**
 * 补齐旧收藏记录缺失的字段。
 */
function normalizeFavorites(favorites: FavoriteIdentityRecord[]): FavoriteIdentityRecord[] {
  return favorites.map((favorite) => {
    return {
      ...favorite,
      companyName: favorite.companyName ?? '',
      socialCreditCode: favorite.socialCreditCode ?? '',
      customValues: favorite.customValues ?? {},
    }
  })
}

export const useIdentityGeneratorStore = defineStore(
  'identity-generator',
  () => {
    const activeTab = ref<IdentityTab>('generate')
    const generatorOptions = ref<GeneratorOptions>(createDefaultGeneratorOptions())
    const fieldConfigs = ref<IdentityFieldConfig[]>(createDefaultFieldConfigs())
    const columnWidths = ref<IdentityColumnWidths>(createDefaultColumnWidths())
    const generatedRows = ref<IdentityRecord[]>([])
    const favorites = ref<FavoriteIdentityRecord[]>([])
    const isGenerating = ref(false)
    const lastCustomFieldErrorCount = ref(0)

    const favoriteIdCardSet = computed(() => {
      return new Set(favorites.value.map((item) => item.idCard))
    })

    function setActiveTab(tab: IdentityTab) {
      activeTab.value = tab
    }

    function setCount(count: number) {
      generatorOptions.value.count = sanitizeCount(count)
    }

    function updateGeneratorOptions(payload: Partial<GeneratorOptions>) {
      generatorOptions.value = {
        ...generatorOptions.value,
        ...payload,
      }

      generatorOptions.value.count = sanitizeCount(generatorOptions.value.count)
    }

    function setProvinceCode(provinceCode: string | null) {
      generatorOptions.value.provinceCode = provinceCode
      generatorOptions.value.cityCode = null
      generatorOptions.value.districtCode = null
    }

    function setCityCode(cityCode: string | null) {
      generatorOptions.value.cityCode = cityCode
      generatorOptions.value.districtCode = null
    }

    function setDistrictCode(districtCode: string | null) {
      generatorOptions.value.districtCode = districtCode
    }

    function toggleFieldEnabled(key: IdentityFieldConfig['key']) {
      const target = fieldConfigs.value.find((item) => item.key === key)
      if (!target) {
        return
      }

      target.enabled = !target.enabled
    }

    function setFieldEnabled(key: IdentityFieldConfig['key'], enabled: boolean) {
      const target = fieldConfigs.value.find((item) => item.key === key)
      if (!target) {
        return
      }

      target.enabled = enabled
    }

    function replaceFieldConfigs(nextFieldConfigs: IdentityFieldConfig[]) {
      fieldConfigs.value = normalizeFieldConfigs(nextFieldConfigs.map((item) => ({ ...item })))
    }

    function setColumnWidth(key: IdentityColumnKey, width: number) {
      columnWidths.value[key] = width
    }

    function resetColumnWidths() {
      columnWidths.value = createDefaultColumnWidths()
    }

    /**
     * 添加一个自定义字段。
     */
    function addCustomField(payload: Partial<Pick<IdentityFieldConfig, 'label' | 'code'>> = {}) {
      const fieldConfig = createDefaultCustomFieldConfig()
      fieldConfig.label = payload.label?.trim() || fieldConfig.label
      fieldConfig.code = payload.code ?? fieldConfig.code
      fieldConfigs.value.push(fieldConfig)
      columnWidths.value[fieldConfig.key] = getDefaultColumnWidth(fieldConfig.key)
    }

    /**
     * 更新自定义字段配置。
     */
    function updateCustomField(
      key: IdentityCustomFieldKey,
      payload: Partial<Pick<IdentityFieldConfig, 'label' | 'code'>>,
    ) {
      const target = fieldConfigs.value.find((fieldConfig) => {
        return fieldConfig.key === key && isCustomFieldKey(fieldConfig.key)
      })

      if (!target) {
        return
      }

      target.label = payload.label?.trim() || target.label
      target.code = payload.code ?? target.code
    }

    /**
     * 移除自定义字段配置。
     */
    function removeCustomField(key: IdentityCustomFieldKey) {
      fieldConfigs.value = fieldConfigs.value.filter((fieldConfig) => {
        return fieldConfig.key !== key
      })
      delete columnWidths.value[key]
    }

    async function generateRows() {
      isGenerating.value = true
      lastCustomFieldErrorCount.value = 0

      try {
        generatedRows.value = await generateIdentityRows(generatorOptions.value, fieldConfigs.value)
        lastCustomFieldErrorCount.value = countCustomFieldExecutionErrors(
          generatedRows.value,
          fieldConfigs.value,
        )
      } finally {
        isGenerating.value = false
      }
    }

    function clearGeneratedRows() {
      generatedRows.value = []
    }

    function isFavorite(idCard: string): boolean {
      return favoriteIdCardSet.value.has(idCard)
    }

    function addFavorite(row: IdentityRecord) {
      if (isFavorite(row.idCard)) {
        return
      }

      favorites.value.unshift(createFavoriteRow(row))
    }

    function removeFavorite(idCard: string) {
      favorites.value = favorites.value.filter((item) => item.idCard !== idCard)
    }

    function updateFavoriteNote(idCard: string, note: string) {
      const target = favorites.value.find((item) => item.idCard === idCard)
      if (!target) {
        return
      }

      target.note = note
    }

    function resetGeneratorOptions() {
      generatorOptions.value = createDefaultGeneratorOptions()
    }

    function resetFieldConfigs() {
      fieldConfigs.value = createDefaultFieldConfigs()
    }

    return {
      activeTab,
      generatorOptions,
      fieldConfigs,
      columnWidths,
      generatedRows,
      favorites,
      isGenerating,
      lastCustomFieldErrorCount,
      favoriteIdCardSet,
      setActiveTab,
      setCount,
      updateGeneratorOptions,
      setProvinceCode,
      setCityCode,
      setDistrictCode,
      toggleFieldEnabled,
      setFieldEnabled,
      replaceFieldConfigs,
      setColumnWidth,
      resetColumnWidths,
      addCustomField,
      updateCustomField,
      removeCustomField,
      generateRows,
      clearGeneratedRows,
      isFavorite,
      addFavorite,
      removeFavorite,
      updateFavoriteNote,
      resetGeneratorOptions,
      resetFieldConfigs,
    }
  },
  {
    persist: {
      pick: [
        'activeTab',
        'generatorOptions',
        'fieldConfigs',
        'columnWidths',
        'favorites',
        'generatedRows',
      ],
      afterHydrate: (context) => {
        const store = context.store as {
          generatorOptions: GeneratorOptions
          fieldConfigs: IdentityFieldConfig[]
          columnWidths: IdentityColumnWidths
          favorites: FavoriteIdentityRecord[]
          generatedRows: IdentityRecord[]
        }

        store.generatorOptions = normalizeGeneratorOptions(store.generatorOptions ?? {})
        store.fieldConfigs = normalizeFieldConfigs(store.fieldConfigs ?? [])
        store.columnWidths = normalizeColumnWidths(store.columnWidths ?? {})
        store.favorites = normalizeFavorites(store.favorites ?? [])
        store.generatedRows = (store.generatedRows ?? []).map((row) => {
          return {
            ...row,
            customValues: row.customValues ?? {},
          }
        })
      },
    },
  },
)
