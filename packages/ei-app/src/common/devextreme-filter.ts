export const reconfigureFilterPanelStyles = (containerRef, isActiveFilter) => {
    const filterPanelFilter = containerRef.current?.querySelector(".dx-icon-filter");
    const filterPanelClearButton = containerRef.current?.querySelector(".dx-datagrid-filter-panel-clear-filter");
    const filterPanelCheckBox = containerRef.current?.querySelector(".dx-datagrid-filter-panel-checkbox");
    const tablePanel = containerRef.current?.querySelector(".dx-datagrid-header-panel");
    const filterPanel = containerRef.current?.querySelector(".dx-datagrid-filter-panel");
    const filterText = containerRef.current?.querySelector(".dx-datagrid-filter-panel-text");

    if (filterPanelClearButton) {
      filterPanelClearButton.style.display = "none";
    }

    if (filterPanelCheckBox) {
      filterPanelCheckBox.style.display = "none";
    }

    if (filterPanelFilter) {
      filterPanelFilter.style.display = "none";
    }

    if (tablePanel) {
      tablePanel.style.padding = 0;
    }
    
    if (filterPanel) {
      filterPanel.style.border =  "1px solid #219a83";
      filterPanel.style.borderRadius = "4px"
    }

    if (filterText) {
      filterText.style.color = isActiveFilter ? "#219a83" : "#808080";
    }
}

export const descOrderingAfterClick = (e) => {
  if (e.rowType === "header" && e.column && !e.column.sortOrder) {
    setTimeout(() => {
      e.component.columnOption(e.column.dataField, "sortOrder", "desc");  
    });
  }
}