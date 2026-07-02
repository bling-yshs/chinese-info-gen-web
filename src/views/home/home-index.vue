<template>
  <div class="min-h-screen bg-surface-50 text-surface-800 dark:bg-surface-950 dark:text-surface-0">
    <div class="mx-auto flex min-h-screen max-w-[1600px]">
      <aside
        class="shrink-0 overflow-hidden border-r border-surface-200 bg-surface-0 transition-[width] duration-200 dark:border-surface-700 dark:bg-surface-900"
        :class="isSidebarOpen ? 'w-80' : 'w-0 border-r-0'"
      >
        <div v-if="isSidebarOpen" class="flex h-screen flex-col gap-4 overflow-y-auto p-4">
          <Card>
            <template #title>
              生成条件
            </template>
            <template #content>
              <div class="grid gap-4">
                <div class="grid gap-2">
                  <label class="text-sm font-medium">生成数量</label>
                  <InputText
                    :model-value="String(generatorOptions.count)"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="1 - 50"
                    @update:model-value="handleCountChange"
                  />
                </div>

                <div class="grid gap-2">
                  <label class="text-sm font-medium">性别</label>
                  <Select
                    :model-value="generatorOptions.gender"
                    :options="genderOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="随机"
                    @update:model-value="handleGenderChange"
                  />
                </div>

                <div class="grid gap-2">
                  <label class="text-sm font-medium">姓名长度</label>
                  <Select
                    :model-value="generatorOptions.nameLength"
                    :options="nameLengthOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="随机"
                    @update:model-value="handleNameLengthChange"
                  />
                </div>

                <div class="grid gap-2">
                  <label class="text-sm font-medium">出生日期</label>
                  <div class="grid gap-3 sm:grid-cols-3">
                    <Select
                      :model-value="generatorOptions.birthYear"
                      :options="yearOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="年份"
                      show-clear
                      @update:model-value="handleBirthYearChange"
                    />
                    <Select
                      :model-value="generatorOptions.birthMonth"
                      :options="monthOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="月份"
                      show-clear
                      @update:model-value="handleBirthMonthChange"
                    />
                    <Select
                      :model-value="generatorOptions.birthDay"
                      :options="dayOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="日期"
                      show-clear
                      :disabled="!dayOptions.length"
                      @update:model-value="handleBirthDayChange"
                    />
                  </div>
                </div>

                <div class="grid gap-2">
                  <label class="text-sm font-medium">省市区</label>
                  <div class="grid gap-3">
                    <Select
                      :model-value="generatorOptions.provinceCode"
                      :options="provinceOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="省份"
                      show-clear
                      filter
                      @update:model-value="handleProvinceChange"
                    />
                    <Select
                      :model-value="generatorOptions.cityCode"
                      :options="cityOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="城市"
                      show-clear
                      filter
                      :disabled="!generatorOptions.provinceCode || isCityAutoLocked"
                      @update:model-value="handleCityChange"
                    />
                    <Select
                      :model-value="generatorOptions.districtCode"
                      :options="districtOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="区县"
                      show-clear
                      filter
                      :disabled="!generatorOptions.provinceCode"
                      @update:model-value="handleDistrictChange"
                    />
                  </div>
                </div>

                <Button
                  label="重置条件"
                  outlined
                  @click="handleResetGenerator"
                />
              </div>
            </template>
          </Card>

          <Card>
            <template #title>
              字段显示与排序
            </template>
            <template #content>
              <VueDraggable
                v-model="draggableFieldConfigs"
                class="flex flex-col gap-2"
                handle=".field-drag-handle"
                :animation="150"
              >
                <div
                  v-for="field in draggableFieldConfigs"
                  :key="field.key"
                  class="flex items-center justify-between gap-3 rounded-lg border border-surface-200 bg-surface-0 px-3 py-2 dark:border-surface-700 dark:bg-surface-900"
                >
                  <label class="flex min-w-0 flex-1 items-center gap-3">
                    <Checkbox
                      :model-value="field.enabled"
                      binary
                      @update:model-value="handleFieldEnabledChange(field.key, $event)"
                    />
                    <span class="truncate text-sm">{{ field.label }}</span>
                  </label>

                  <div class="flex shrink-0 items-center gap-1">
                    <button
                      v-if="isCustomFieldKey(field.key)"
                      type="button"
                      class="inline-flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium text-primary transition hover:bg-primary-50 dark:hover:bg-primary/15"
                      aria-label="编辑自定义字段"
                      title="编辑自定义字段"
                      @click.stop="openEditCustomFieldDialog(field)"
                    >
                      编辑
                    </button>
                    <button
                      v-if="isCustomFieldKey(field.key)"
                      type="button"
                      class="inline-flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30"
                      aria-label="删除自定义字段"
                      title="删除自定义字段"
                      @click.stop="handleRemoveCustomField(field.key)"
                    >
                      删除
                    </button>
                    <button
                      type="button"
                      class="field-drag-handle inline-flex h-8 w-8 cursor-move items-center justify-center rounded-md text-surface-500 transition hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200"
                      aria-label="拖拽排序"
                      title="拖拽排序"
                    >
                      <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <circle cx="5" cy="4" r="1.25" />
                        <circle cx="5" cy="8" r="1.25" />
                        <circle cx="5" cy="12" r="1.25" />
                        <circle cx="11" cy="4" r="1.25" />
                        <circle cx="11" cy="8" r="1.25" />
                        <circle cx="11" cy="12" r="1.25" />
                      </svg>
                    </button>
                  </div>
                </div>
              </VueDraggable>
            </template>
            <template #footer>
              <div class="flex flex-wrap gap-2 pt-4">
                <Button
                  label="添加自定义字段"
                  text
                  @click="openAddCustomFieldDialog"
                />
                <Button
                  label="恢复列宽"
                  text
                  @click="handleResetColumnWidths"
                />
              </div>
            </template>
          </Card>
        </div>
      </aside>

      <main class="min-w-0 flex-1 px-3 py-3 md:px-4">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-2">
              <button
                type="button"
                class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-surface-200 bg-surface-0 text-surface-600 transition hover:bg-surface-100 hover:text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-0"
                :aria-label="isSidebarOpen ? '收起侧边栏' : '展开侧边栏'"
                :title="isSidebarOpen ? '收起侧边栏' : '展开侧边栏'"
                @click="toggleSidebar"
              >
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M3 4.75A1.75 1.75 0 0 1 4.75 3h10.5A1.75 1.75 0 0 1 17 4.75v10.5A1.75 1.75 0 0 1 15.25 17H4.75A1.75 1.75 0 0 1 3 15.25V4.75Zm4.5-.25h-2.75A.25.25 0 0 0 4.5 4.75v10.5c0 .138.112.25.25.25H7.5V4.5Zm1.5 11h6.25a.25.25 0 0 0 .25-.25V4.75a.25.25 0 0 0-.25-.25H9v11Z" />
                </svg>
              </button>

              <Tabs :value="activeTab" class="min-w-0">
                <TabList>
                  <Tab value="generate" @click="store.setActiveTab('generate')">
                    主页
                  </Tab>
                  <Tab value="favorites" @click="store.setActiveTab('favorites')">
                    收藏
                  </Tab>
                </TabList>
              </Tabs>
            </div>

            <Button
              v-if="activeTab === 'generate'"
              label="生成数据"
              :loading="isGenerating"
              @click="handleGenerate"
            />
          </div>

          <div class="overflow-hidden rounded-xl border border-surface-200 bg-surface-0 shadow-sm dark:border-surface-700 dark:bg-surface-900">
            <div class="flex items-center justify-between gap-3 border-b border-surface-200 px-3 py-2 dark:border-surface-700">
              <div class="text-sm text-surface-600 dark:text-surface-300">
                已选 {{ selectedRowCount }} 条
              </div>
              <div class="flex items-center gap-2">
                <Button
                  v-if="selectedRowCount"
                  label="清空选择"
                  text
                  size="small"
                  @click="clearCurrentSelection"
                />
                <div class="relative">
                  <Button
                    :label="selectedRowCount ? `复制已选(${selectedRowCount})` : '复制已选'"
                    size="small"
                    outlined
                    :disabled="!selectedRowCount"
                    @click="toggleBulkCopyMenu"
                  />
                  <Menu
                    ref="bulkCopyMenuRef"
                    :model="bulkCopyMenuItems"
                    popup
                  />
                </div>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="table-fixed border-collapse text-sm">
                <thead class="bg-surface-100 dark:bg-surface-800">
                  <tr>
                    <th class="w-14 min-w-14 max-w-14 border-b border-surface-200 px-3 py-2 text-center font-medium text-surface-700 dark:border-surface-700 dark:text-surface-200">
                      <Checkbox
                        binary
                        :model-value="allCurrentRowsSelected"
                        :indeterminate="isCurrentSelectionPartial"
                        :disabled="!currentRows.length"
                        @update:model-value="handleSelectAllRows(Boolean($event))"
                      />
                    </th>
                    <th
                      v-for="field in visibleFieldConfigs"
                      :key="field.key"
                      :style="getColumnStyle(field.key)"
                      class="group relative border-b border-surface-200 px-3 py-2 text-left font-medium text-surface-700 dark:border-surface-700 dark:text-surface-200"
                    >
                      <div class="flex items-center justify-between gap-2 pr-3">
                        <span class="truncate">{{ field.label }}</span>
                        <button
                          v-if="currentRows.length"
                          type="button"
                          class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded opacity-0 transition hover:bg-surface-200 group-hover:opacity-100 dark:hover:bg-surface-700"
                          :aria-label="`复制${field.label}列`"
                          :title="`复制${field.label}列`"
                          @click="handleCopyColumn(field.key, field.label)"
                        >
                          <svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z" />
                            <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        type="button"
                        class="absolute right-0 top-0 h-full w-2 cursor-col-resize opacity-0 transition group-hover:opacity-100"
                        aria-label="调整列宽"
                        title="调整列宽"
                        @mousedown="startColumnResize($event, field.key)"
                      />
                    </th>
                    <th
                      :style="getColumnStyle('actions')"
                      class="group sticky right-0 z-10 border-b border-surface-200 bg-surface-100 px-3 py-2 text-left font-medium text-surface-700 shadow-[-6px_0_8px_-8px_rgba(15,23,42,0.25)] dark:border-surface-700 dark:bg-surface-800 dark:text-surface-200"
                    >
                      <div class="truncate pr-3">
                        操作
                      </div>
                      <button
                        type="button"
                        class="absolute right-0 top-0 h-full w-2 cursor-col-resize opacity-0 transition group-hover:opacity-100"
                        aria-label="调整操作列宽"
                        title="调整操作列宽"
                        @mousedown="startColumnResize($event, 'actions')"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!currentRows.length">
                    <td
                      :colspan="visibleFieldConfigs.length + 2"
                      class="px-4 py-10 text-center text-surface-500 dark:text-surface-400"
                    >
                      {{ activeTab === 'generate' ? '还没有生成结果，请点击“生成资料”。' : '还没有收藏记录。' }}
                    </td>
                  </tr>

                  <tr
                    v-for="row in currentRows"
                    :key="row.idCard"
                    :class="getRowClasses(row.idCard)"
                  >
                    <td class="border-b border-surface-200 px-3 py-2 text-center dark:border-surface-700">
                      <Checkbox
                        binary
                        :model-value="isRowSelected(row.idCard)"
                        @update:model-value="handleRowSelectionChange(row.idCard, Boolean($event))"
                      />
                    </td>
                    <td
                      v-for="field in visibleFieldConfigs"
                      :key="`${row.idCard}-${field.key}`"
                      :style="getColumnStyle(field.key)"
                      class="border-b border-surface-200 px-3 py-2 text-surface-700 dark:border-surface-700 dark:text-surface-100"
                    >
                      <button
                        type="button"
                        class="block w-full overflow-hidden text-ellipsis whitespace-nowrap rounded px-1 py-1 text-left transition hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary/15 dark:hover:text-primary-300"
                        :title="getFieldValue(row, field.key)"
                        @click="handleCopyCell(getFieldValue(row, field.key), field.label)"
                      >
                        {{ getFieldValue(row, field.key) }}
                      </button>
                    </td>
                    <td
                      :style="getColumnStyle('actions')"
                      :class="getActionCellClasses(row.idCard)"
                    >
                      <div class="flex min-w-0 flex-wrap gap-2">
                        <div class="relative">
                          <Button
                            :label="copyActionLabel"
                            size="small"
                            outlined
                            @click="toggleCopyMenu($event, row.idCard)"
                          />
                          <Menu
                            :ref="setCopyMenuRef(row.idCard)"
                            :model="buildCopyMenuItems(row)"
                            popup
                          />
                        </div>
                        <Button
                          v-if="activeTab === 'generate'"
                          :label="store.isFavorite(row.idCard) ? '取消收藏' : '收藏'"
                          size="small"
                          @click="handleToggleFavorite(row)"
                        />
                        <Button
                          v-else
                          label="移除"
                          size="small"
                          @click="store.removeFavorite(row.idCard)"
                        />
                      </div>
                      <div v-if="activeTab === 'favorites'" class="mt-2">
                        <Textarea
                          :model-value="getFavoriteNote(row)"
                          rows="2"
                          auto-resize
                          placeholder="备注"
                          @update:model-value="handleFavoriteNoteChange(row.idCard, $event)"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    <Dialog
      v-model:visible="isCustomFieldDialogVisible"
      modal
      :header="customFieldDialogTitle"
      :style="{ width: 'min(92vw, 560px)' }"
      @hide="resetCustomFieldDialog"
    >
      <div class="grid gap-4">
        <div class="grid gap-2">
          <label class="text-sm font-medium">字段名称</label>
          <InputText
            v-model="customFieldDraftLabel"
            placeholder="例如：随机密码"
          />
        </div>

        <div class="grid gap-2">
          <label class="text-sm font-medium">JS 代码</label>
          <Textarea
            v-model="customFieldDraftCode"
            rows="10"
            auto-resize
            spellcheck="false"
            placeholder="return `${pickOne(['A', 'B', 'C'])}-${randomInt(1000, 9999)}`"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="取消"
          text
          @click="closeCustomFieldDialog"
        />
        <Button
          label="保存"
          @click="saveCustomFieldDialog"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type {
  ExportFormat,
  FavoriteIdentityRecord,
  GeneratorOptions,
  IdentityColumnKey,
  IdentityCustomFieldKey,
  IdentityFieldConfig,
  IdentityFieldKey,
  IdentityGenderOption,
  IdentityNameLengthOption,
  IdentityRecord,
  SelectOption,
} from '@/utils/identity-generator'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { toast } from 'vue-sonner'
import { useIdentityGeneratorStore } from '@/stores/identity-generator'
import {
  createDayOptions,
  createMonthOptions,
  createYearOptions,
  getDefaultColumnWidth,
  getEnabledFieldConfigs,
  getFieldValue,
  isCustomFieldKey,
  listCityOptions,
  listDistrictOptions,
  listProvinceOptions,
  serializeRows,
} from '@/utils/identity-generator'
import Button from '@/volt/Button.vue'
import Card from '@/volt/Card.vue'
import Checkbox from '@/volt/Checkbox.vue'
import Dialog from '@/volt/Dialog.vue'
import InputText from '@/volt/InputText.vue'
import Menu from '@/volt/Menu.vue'
import Select from '@/volt/Select.vue'
import Tab from '@/volt/Tab.vue'
import TabList from '@/volt/TabList.vue'
import Tabs from '@/volt/Tabs.vue'
import Textarea from '@/volt/Textarea.vue'

type CustomFieldDialogMode = 'add' | 'edit'

const store = useIdentityGeneratorStore()
const {
  activeTab,
  columnWidths,
  favorites,
  fieldConfigs,
  generatedRows,
  generatorOptions,
  isGenerating,
  lastCustomFieldErrorCount,
} = storeToRefs(store)

const provinceOptions = ref<SelectOption<string>[]>([])
const cityOptions = ref<SelectOption<string>[]>([])
const districtOptions = ref<SelectOption<string>[]>([])
const isSidebarOpen = ref(false)
const bulkCopyMenuRef = ref<InstanceType<typeof Menu> | null>(null)
const copyMenuRefs = ref<Record<string, InstanceType<typeof Menu> | null>>({})
const resizingColumnKey = ref<IdentityColumnKey | null>(null)
const resizeStartX = ref(0)
const resizeStartWidth = ref(0)
const isCustomFieldDialogVisible = ref(false)
const customFieldDialogMode = ref<CustomFieldDialogMode>('add')
const editingCustomFieldKey = ref<IdentityCustomFieldKey | null>(null)
const customFieldDraftLabel = ref('')
const customFieldDraftCode = ref('')
const selectedRowIdsByTab = ref<Record<'generate' | 'favorites', string[]>>({
  generate: [],
  favorites: [],
})

const genderOptions: SelectOption<IdentityGenderOption>[] = [
  { label: '随机', value: 'random' },
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
]

const nameLengthOptions: SelectOption<IdentityNameLengthOption>[] = [
  { label: '随机', value: 'random' },
  { label: '2 个字', value: 2 },
  { label: '3 个字', value: 3 },
]

const copyActionLabel = '复制'

const yearOptions = createYearOptions()
const monthOptions = createMonthOptions()

const dayOptions = computed(() => {
  return createDayOptions(generatorOptions.value.birthYear, generatorOptions.value.birthMonth)
})

const visibleFieldConfigs = computed(() => {
  return getEnabledFieldConfigs(fieldConfigs.value)
})

const customFieldDialogTitle = computed(() => {
  if (customFieldDialogMode.value === 'edit') {
    return '编辑自定义字段'
  }

  return '添加自定义字段'
})

const draggableFieldConfigs = computed({
  get() {
    return fieldConfigs.value
  },
  set(value: IdentityFieldConfig[]) {
    store.replaceFieldConfigs(value)
  },
})

const currentRows = computed<Array<IdentityRecord | FavoriteIdentityRecord>>(() => {
  if (activeTab.value === 'generate') {
    return generatedRows.value
  }

  return favorites.value
})

const currentSelectedRowIds = computed({
  get() {
    return selectedRowIdsByTab.value[activeTab.value]
  },
  set(value: string[]) {
    selectedRowIdsByTab.value[activeTab.value] = value
  },
})

const selectedRows = computed<Array<IdentityRecord | FavoriteIdentityRecord>>(() => {
  const selectedIdSet = new Set(currentSelectedRowIds.value)
  return currentRows.value.filter((row) => {
    return selectedIdSet.has(row.idCard)
  })
})

const selectedRowCount = computed(() => {
  return selectedRows.value.length
})

const allCurrentRowsSelected = computed(() => {
  return currentRows.value.length > 0 && selectedRowCount.value === currentRows.value.length
})

const isCurrentSelectionPartial = computed(() => {
  return selectedRowCount.value > 0 && !allCurrentRowsSelected.value
})

const bulkCopyMenuItems = computed(() => {
  return [
    {
      label: '复制已选 JSON',
      command: () => {
        void handleCopySelectedRowsWithFormat('json')
      },
    },
    {
      label: '复制已选 Excel(TSV)',
      command: () => {
        void handleCopySelectedRowsWithFormat('tsv')
      },
    },
    {
      label: '复制已选 CSV',
      command: () => {
        void handleCopySelectedRowsWithFormat('csv')
      },
    },
  ]
})

const isCityAutoLocked = computed(() => {
  return Boolean(generatorOptions.value.provinceCode) && cityOptions.value.length === 1
})

watch(
  () => {
    return generatorOptions.value.provinceCode
  },
  async (provinceCode) => {
    cityOptions.value = await listCityOptions(provinceCode)

    if (cityOptions.value.length === 1) {
      const onlyCityCode = cityOptions.value[0]?.value ?? null
      if (generatorOptions.value.cityCode !== onlyCityCode) {
        store.setCityCode(onlyCityCode)
      }
    }
    else if (generatorOptions.value.cityCode) {
      const exists = cityOptions.value.some((item) => {
        return item.value === generatorOptions.value.cityCode
      })

      if (!exists) {
        store.setCityCode(null)
      }
    }

    districtOptions.value = await listDistrictOptions(provinceCode, generatorOptions.value.cityCode)
  },
  { immediate: true },
)

watch(
  () => {
    return generatorOptions.value.cityCode
  },
  async (cityCode) => {
    districtOptions.value = await listDistrictOptions(generatorOptions.value.provinceCode, cityCode)
  },
  { immediate: true },
)

watch(
  () => {
    return [generatorOptions.value.birthYear, generatorOptions.value.birthMonth]
  },
  () => {
    syncBirthDay()
  },
  { immediate: true },
)

watch(
  currentRows,
  (rows) => {
    const validIdSet = new Set(rows.map(row => row.idCard))
    const nextSelectedIds = currentSelectedRowIds.value.filter((id) => {
      return validIdSet.has(id)
    })

    if (nextSelectedIds.length !== currentSelectedRowIds.value.length) {
      currentSelectedRowIds.value = nextSelectedIds
    }
  },
  { immediate: true },
)

onMounted(async () => {
  provinceOptions.value = await listProvinceOptions()
})

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function setCopyMenuRef(idCard: string) {
  return (instance: Element | ComponentPublicInstance | null) => {
    copyMenuRefs.value[idCard] = instance as InstanceType<typeof Menu> | null
  }
}

function toggleCopyMenu(event: Event, idCard: string) {
  copyMenuRefs.value[idCard]?.toggle(event)
}

function toggleBulkCopyMenu(event: Event) {
  bulkCopyMenuRef.value?.toggle(event)
}

function buildCopyMenuItems(row: IdentityRecord | FavoriteIdentityRecord) {
  return [
    {
      label: '复制 JSON',
      command: () => {
        void handleCopyRowWithFormat(row, 'json')
      },
    },
    {
      label: '复制 Excel(TSV)',
      command: () => {
        void handleCopyRowWithFormat(row, 'tsv')
      },
    },
    {
      label: '复制 CSV',
      command: () => {
        void handleCopyRowWithFormat(row, 'csv')
      },
    },
  ]
}

function syncBirthDay() {
  if (!generatorOptions.value.birthDay) {
    return
  }

  const validDays = createDayOptions(generatorOptions.value.birthYear, generatorOptions.value.birthMonth)
  const exists = validDays.some((item) => {
    return item.value === generatorOptions.value.birthDay
  })

  if (!exists) {
    store.updateGeneratorOptions({ birthDay: null })
  }
}

function handleCountChange(value: string | number | undefined) {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    store.setCount(1)
    return
  }

  store.setCount(parsed)
}

function handleGenderChange(value: IdentityGenderOption) {
  store.updateGeneratorOptions({ gender: value })
}

/**
 * 更新生成姓名的完整长度。
 */
function handleNameLengthChange(value: IdentityNameLengthOption) {
  store.updateGeneratorOptions({ nameLength: value })
}

function handleBirthYearChange(value: GeneratorOptions['birthYear']) {
  store.updateGeneratorOptions({ birthYear: value })
}

function handleBirthMonthChange(value: GeneratorOptions['birthMonth']) {
  store.updateGeneratorOptions({ birthMonth: value })
}

function handleBirthDayChange(value: GeneratorOptions['birthDay']) {
  store.updateGeneratorOptions({ birthDay: value })
}

function handleProvinceChange(value: GeneratorOptions['provinceCode']) {
  store.setProvinceCode(value)
}

function handleCityChange(value: GeneratorOptions['cityCode']) {
  store.setCityCode(value)
}

function handleDistrictChange(value: GeneratorOptions['districtCode']) {
  store.setDistrictCode(value)
}

function handleFieldEnabledChange(key: IdentityFieldKey, value: boolean) {
  store.setFieldEnabled(key, value)
}

function isRowSelected(idCard: string) {
  return currentSelectedRowIds.value.includes(idCard)
}

function handleRowSelectionChange(idCard: string, checked: boolean) {
  if (checked) {
    if (isRowSelected(idCard)) {
      return
    }

    currentSelectedRowIds.value = [...currentSelectedRowIds.value, idCard]
    return
  }

  currentSelectedRowIds.value = currentSelectedRowIds.value.filter(id => id !== idCard)
}

function handleSelectAllRows(checked: boolean) {
  if (!checked) {
    clearCurrentSelection()
    return
  }

  currentSelectedRowIds.value = currentRows.value.map(row => row.idCard)
}

function clearCurrentSelection() {
  currentSelectedRowIds.value = []
}

function getRowClasses(idCard: string) {
  if (isRowSelected(idCard)) {
    return 'align-top bg-primary-50/70 dark:bg-primary/10'
  }

  return 'align-top odd:bg-surface-0 even:bg-surface-50/70 dark:odd:bg-surface-900 dark:even:bg-surface-900/60'
}

function getActionCellClasses(idCard: string) {
  if (isRowSelected(idCard)) {
    return 'sticky right-0 z-10 border-b border-surface-200 bg-primary-50/70 px-3 py-2 shadow-[-6px_0_8px_-8px_rgba(15,23,42,0.25)] dark:border-surface-700 dark:bg-primary/10'
  }

  return 'sticky right-0 z-10 border-b border-surface-200 bg-surface-0 px-3 py-2 shadow-[-6px_0_8px_-8px_rgba(15,23,42,0.25)] dark:border-surface-700 dark:bg-surface-900'
}

function getColumnStyle(key: IdentityColumnKey) {
  const width = columnWidths.value[key] ?? getDefaultColumnWidth(key)
  return {
    width: `${width}px`,
    minWidth: `${width}px`,
    maxWidth: `${width}px`,
  }
}

function startColumnResize(event: MouseEvent, key: IdentityColumnKey) {
  event.preventDefault()
  resizingColumnKey.value = key
  resizeStartX.value = event.clientX
  resizeStartWidth.value = columnWidths.value[key] ?? getDefaultColumnWidth(key)
  window.addEventListener('mousemove', handleColumnResize)
  window.addEventListener('mouseup', stopColumnResize)
}

function handleColumnResize(event: MouseEvent) {
  if (!resizingColumnKey.value) {
    return
  }

  const nextWidth = resizeStartWidth.value + event.clientX - resizeStartX.value
  store.setColumnWidth(resizingColumnKey.value, clampColumnWidth(resizingColumnKey.value, nextWidth))
}

function stopColumnResize() {
  resizingColumnKey.value = null
  window.removeEventListener('mousemove', handleColumnResize)
  window.removeEventListener('mouseup', stopColumnResize)
}

function clampColumnWidth(key: IdentityColumnKey, width: number) {
  return Math.max(40, width)
}

async function handleGenerate() {
  await store.generateRows()

  if (lastCustomFieldErrorCount.value > 0) {
    toast.success(`已生成 ${generatedRows.value.length} 条资料，${lastCustomFieldErrorCount.value} 个自定义值执行失败`)
    return
  }

  toast.success(`已生成 ${generatedRows.value.length} 条资料`)
}

function handleResetGenerator() {
  store.resetGeneratorOptions()
  toast.success('已重置生成条件')
}

function handleResetColumnWidths() {
  store.resetColumnWidths()
  toast.success('已恢复默认列宽')
}

/**
 * 打开新增自定义字段弹窗。
 */
function openAddCustomFieldDialog() {
  customFieldDialogMode.value = 'add'
  editingCustomFieldKey.value = null
  customFieldDraftLabel.value = ''
  customFieldDraftCode.value = ''
  isCustomFieldDialogVisible.value = true
}

/**
 * 打开编辑自定义字段弹窗。
 */
function openEditCustomFieldDialog(fieldConfig: IdentityFieldConfig) {
  if (!isCustomFieldKey(fieldConfig.key)) {
    return
  }

  customFieldDialogMode.value = 'edit'
  editingCustomFieldKey.value = fieldConfig.key
  customFieldDraftLabel.value = fieldConfig.label
  customFieldDraftCode.value = fieldConfig.code ?? ''
  isCustomFieldDialogVisible.value = true
}

/**
 * 关闭自定义字段弹窗。
 */
function closeCustomFieldDialog() {
  isCustomFieldDialogVisible.value = false
}

/**
 * 重置自定义字段弹窗状态。
 */
function resetCustomFieldDialog() {
  customFieldDialogMode.value = 'add'
  editingCustomFieldKey.value = null
  customFieldDraftLabel.value = ''
  customFieldDraftCode.value = ''
}

/**
 * 保存自定义字段弹窗内容。
 */
function saveCustomFieldDialog() {
  const label = customFieldDraftLabel.value.trim()
  if (!label) {
    toast.error('请输入字段名称')
    return
  }

  if (customFieldDialogMode.value === 'edit' && editingCustomFieldKey.value) {
    store.updateCustomField(editingCustomFieldKey.value, {
      label,
      code: customFieldDraftCode.value,
    })
    toast.success('已更新自定义字段')
  }
  else {
    store.addCustomField({
      label,
      code: customFieldDraftCode.value,
    })
    toast.success('已添加自定义字段')
  }

  closeCustomFieldDialog()
}

/**
 * 删除自定义字段配置。
 */
function handleRemoveCustomField(key: IdentityFieldKey) {
  if (!isCustomFieldKey(key)) {
    return
  }

  store.removeCustomField(key)
  toast.success('已删除自定义字段')
}

function handleToggleFavorite(row: IdentityRecord | FavoriteIdentityRecord) {
  if (store.isFavorite(row.idCard)) {
    store.removeFavorite(row.idCard)
    toast.success(`已取消收藏 ${row.name}`)
    return
  }

  store.addFavorite(row)
  toast.success(`已收藏 ${row.name}`)
}

function handleFavoriteNoteChange(idCard: string, value: string | undefined) {
  store.updateFavoriteNote(idCard, value ?? '')
}

async function handleCopyCell(value: string, label: string) {
  await writeText(value)
  toast.success(`已复制${label}`)
}

async function handleCopyColumn(fieldKey: IdentityFieldKey, label: string) {
  if (!currentRows.value.length) {
    return
  }

  const columnValues = currentRows.value.map((row) => {
    return getFieldValue(row, fieldKey)
  })

  const text = columnValues.join('\n')
  await writeText(text)
  toast.success(`已复制${label}列 (${columnValues.length} 条)`)
}

async function handleCopyRowWithFormat(row: IdentityRecord | FavoriteIdentityRecord, format: ExportFormat) {
  const text = serializeRows([row], fieldConfigs.value, format)
  await writeText(text)
  toast.success(`已复制 ${row.name} 的 ${getFormatName(format)}`)
}

async function handleCopySelectedRowsWithFormat(format: ExportFormat) {
  if (!selectedRows.value.length) {
    return
  }

  const text = serializeRows(selectedRows.value, fieldConfigs.value, format)
  await writeText(text)
  toast.success(`已复制 ${selectedRows.value.length} 条数据的 ${getFormatName(format)}`)
}

async function writeText(value: string) {
  await navigator.clipboard.writeText(value)
}

function getFavoriteNote(row: IdentityRecord | FavoriteIdentityRecord): string {
  if ('note' in row) {
    return row.note
  }

  return ''
}

function getFormatName(format: ExportFormat): string {
  if (format === 'json') {
    return 'JSON'
  }

  if (format === 'csv') {
    return 'CSV'
  }

  return 'Excel(TSV)'
}
</script>
