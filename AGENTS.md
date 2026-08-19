## 依赖规范

- 使用 vite,vue3,typescript,tailwind css,volt(primevue tailwind version),vue-router,pinia,dayjs

## 编辑规范

- 编辑完代码后，必须立刻运行命令 `vpr check:fix` 来进行代码格式化

## UI 组件规范

- 所有组件必须使用 volt 的组件
- 添加组件请运行命令，比如 `pnpx volt-vue add Button` 来添加按钮组件
- 需要添加什么组件，在添加之前使用 context7 mcp 进行查询

## 格式规范

- 代码缩进两格
- script 内的函数请优先使用 function 而不是 `const xxx = () =>` 的箭头函数

## 页面结构规范

- 每个页面单独存放在 `views` 目录下的独立文件夹中
- 页面文件命名格式为：`{页面名}-index.vue`
- 例如：home 页面存放在 `views/home/home-index.vue`，foo 页面存放在 `views/foo/foo-index.vue`
