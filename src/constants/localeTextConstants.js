const russian = {
  columnMenuLabel: "Меню",
  columnMenuSortAsc: "По возрастанию",
  columnMenuSortDesc: "По убыванию",
  columnMenuFilter: "Фильтр",
  columnMenuHideColumn: "Скрыть",
  columnMenuShowColumns: "Показать колонки",
  columnMenuUnsort: "Не сортировать",
  toolbarDensity: "Плотность",
  toolbarDensityLabel: "Плотность",
  toolbarDensityCompact: "Компактный",
  toolbarDensityStandard: "Стандартный",
  toolbarDensityComfortable: "Комфортный",
  toolbarColumns: "Колонки",
  toolbarColumnsLabel: "Выбрать колонки",
  toolbarFilters: "Фильтры",
  toolbarFiltersLabel: "Показать филтры",
  toolbarFiltersTooltipHide: "Скрыть фильтры",
  toolbarFiltersTooltipShow: "Показать филтры",
  toolbarFiltersTooltipActive: count =>
    count !== 1 ? `${count} активные фильтры` : `${count} активный фильтр`,
  columnsPanelTextFieldLabel: "Найти колонку",
  columnsPanelTextFieldPlaceholder: "Название колонки",
  columnsPanelDragIconLabel: "Подвижка колонки",
  columnsPanelShowAllButton: "Показать все",
  columnsPanelHideAllButton: "Скрыть все",
  filterPanelAddFilter: "Добавить фильтр",
  filterPanelDeleteIconLabel: "Удалить",
  filterPanelOperators: "Оераторы",
  filterPanelOperatorAnd: "И",
  filterPanelOperatorOr: "Или",
  filterPanelColumns: "Колонки",
  filterPanelInputLabel: "Значение",
  filterPanelInputPlaceholder: "Значение фильтра",
  filterOperatorContains: "включает",
  filterOperatorEquals: "совпадает",
  filterOperatorStartsWith: "в начале",
  filterOperatorEndsWith: "в конце",
  filterOperatorIs: "является",
  filterOperatorNot: "не является",
  filterOperatorAfter: "следует",
  filterOperatorOnOrAfter: "нинешьный или следующий",
  filterOperatorBefore: "предыдущий",
  filterOperatorOnOrBefore: "нинешьный или предыдущий",
  columnHeaderFiltersTooltipActive: count =>
    count !== 1 ? `${count} активные фильтры` : `${count} активные фильтр`,
  columnHeaderFiltersLabel: "показать фильтры",
  columnHeaderSortIconLabel: "Сортировать",

  // Rows selected footer text
  footerRowSelected: count =>
    count !== 1
      ? `${count.toLocaleString()} строк выбран`
      : `${count.toLocaleString()} строка выбрана`,

  // Total rows footer text
  footerTotalRows: "Всего строк:",

  // Pagination footer text
  footerPaginationRowsPerPage: "Строк на странице :"
};
export default russian;
