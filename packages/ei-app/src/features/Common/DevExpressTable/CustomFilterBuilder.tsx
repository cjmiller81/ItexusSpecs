/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterBuilderItems } from "@/constants/PrefilterTokensTable";
import { CreateFilterModel } from "@/libs/redux/Slices/AllTokensTableSlice";
import { isDeepEqual } from "@/utils/utils";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { YesNoDialog } from "components";
import { FilterType, IPrefilterTokensFilterValues } from "components/src/models/token/IPrefilterTokensFilterValues";
import FilterBuilderDef from "devextreme-react/filter-builder";
import { ValueChangedEvent } from "devextreme/ui/filter_builder";
import React, { forwardRef, Ref, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

export interface ICustomFilterBuilderProps {
  predefinedFilters: IPrefilterTokensFilterValues[];
  onCreateFilter: (filter: CreateFilterModel) => void;
  onUpdateFilter: (filter: IPrefilterTokensFilterValues) => void;
  onDeleteFilter: (filterId: string) => void;
  onDisableFilter: () => void;
  filterToAppply?: object | null;
  onApply: (filterValue: object[]) => void;
  filterType: FilterType;
  filterLoading?: boolean;
  filterDeletingLoading?: boolean;
  filterBuilderFields: FilterBuilderItems[];
}

export interface CustomFilterBuilderRef {
  onUpdateFilter: (filter: string | any[] | (() => any) | null) => void;
  onOpenBuilder: (status: boolean) => void;
}

const CustomFilterBuilder: React.FC<ICustomFilterBuilderProps & React.RefAttributes<CustomFilterBuilderRef>> = forwardRef<CustomFilterBuilderRef, ICustomFilterBuilderProps>(({
  predefinedFilters,
  onCreateFilter,
  onUpdateFilter,
  onDeleteFilter,
  onDisableFilter,
  filterToAppply,
  onApply,
  filterLoading,
  filterDeletingLoading,
  filterBuilderFields,
  filterType
}, ref) => {
  const [filterBuilderOpen, setFilterBuilderOpen] = useState(false);
  const [selectedSavedFilter, setSelectedSavedFilter] = useState<IPrefilterTokensFilterValues | null>(null);
  const [filterName, setFilterName] = useState<string | undefined>("");
  const [filterValue, setFilterValue] = useState<object[] | undefined | null>();
  const [filterToDelete, setFilterToDelete] = useState<IPrefilterTokensFilterValues | undefined>();
  const [isDeleteFilterModalOpened, setIsDeleteFilterModalOpened] = useState<boolean>(false);
  const { t } = useTranslation("CustomFilterBuilder");
  const theme = useTheme();
  const [openIntroduction, setOpenIntroduction] = useState(false);
  const [openLogicGate, setOpenLogicGate] = useState(false);
  const [openBuildFilter, setOpenBuildFilter] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  useImperativeHandle(ref, () => ({
    onUpdateFilter: (filter) => {
      if (filter && !Array.isArray(filter)) {
        setFilterValue([filter] as object[]);
      } else {
        setFilterValue(filter as object[]);
      }

      const isPredefinedFilter = predefinedFilters.find(filter => filter.filter.toString() == filter?.toString());
      if (isPredefinedFilter) {
        setSelectedSavedFilter(isPredefinedFilter);
        setFilterName(isPredefinedFilter.name);
      } else {
        setSelectedSavedFilter(null);
        setFilterName("");
      }
    },
    onOpenBuilder: (status) => {
      setFilterBuilderOpen(status);
    }
  }));

  useEffect(() => {
    if (filterToAppply && !Array.isArray(filterToAppply)) {
      setFilterValue([filterToAppply]);
    } else {
      setFilterValue(filterToAppply);
    }

    const isPredefinedFilter = predefinedFilters.find(filter => filter.filter.toString() == filterToAppply?.toString());
    if (isPredefinedFilter) {
      setSelectedSavedFilter(isPredefinedFilter);
      setFilterName(isPredefinedFilter.name);
    } else {
      setSelectedSavedFilter(null);
      setFilterName("");
    }
  }, [filterToAppply, open, predefinedFilters]);

  useEffect(() => {
    if (!selectedSavedFilter) return;
    const updatedFilter = predefinedFilters.find(filter => filter.id == selectedSavedFilter?.id);
    if (updatedFilter) setSelectedSavedFilter(updatedFilter);
  }, [predefinedFilters, selectedSavedFilter]);

  const handleFilterValueChanged = (event: ValueChangedEvent) => {
    if (isDeepEqual(event.value, filterValue)) {
      return;
    }

    setFilterValue(event.value);
  };

  const handleApplyFilter = () => {
    if (filterValue) { 
      onApply(filterValue); 
      setFilterBuilderOpen(false);
    }
    else setFilterBuilderOpen(false);
  };

  const handleSavedFilterChange = (event: SelectChangeEvent<string>) => {
    const predefinedFilter = predefinedFilters.find(filter => filter.id === event.target.value[0]);
    if (predefinedFilter) {
      setSelectedSavedFilter(predefinedFilter);
      setFilterValue(predefinedFilter.filter);
      setFilterName(predefinedFilter.name);
    }
  };

  const videoLinks = {
    introduction: "https://www.youtube.com/embed/HMoJuK9mNtw",
    buildFilter: "https://www.youtube.com/embed/e1tWUwDouiw",
    nandGate: "https://www.youtube.com/embed/wYhxPBvQL1g",
    buildingNORGate: "https://www.youtube.com/embed/IMm88o07GLg",
    buildingORGate: "https://www.youtube.com/embed/PW-5hBCggu8",    
    logicGateDiagramAND: "https://www.youtube.com/embed/pS3erHfCcY8",
    logicGateDiagramNOTAND: "https://www.youtube.com/embed/SI1gUt3xNFU",
    logicGateDiagramNorGate: "https://www.youtube.com/embed/xfSR3MgBWrc",
    logicGateDiagramOR: "https://www.youtube.com/embed/c48K1wqo5ow",
};

  const handleVideoChange = (videoKey) => {
    setCurrentVideo(videoLinks[videoKey]);
  };

  const handleClearFilters = () => {
    onDisableFilter();
    setSelectedSavedFilter(null);
    setFilterValue(undefined);
    setFilterName("");
  };

  const handleSaveFilter = () => {
    if (!filterName) return;
    if (selectedSavedFilter) {
      onUpdateFilter({
        id: selectedSavedFilter.id,
        name: filterName,
        filterType: filterType,
        description: filterName,
        icon: "filter",
        isPublic: true,
        OwnerUserId: "",
        isPublished: false,
        accessPlanName: "",
        filter: filterValue || [],
      });
    } else {
      onCreateFilter({
        name: filterName,
        description: filterName,
        filterType: filterType,
        icon: "filter",
        isPublic: true,
        OwnerUserId: "",
        isPublished: false,
        accessPlanName: "",
        filter: filterValue || [],
      });
    }
  };

  const handleApplyFilterChange = (event: SelectChangeEvent<string>) => {
    const predefinedFilter = predefinedFilters.find(filter => filter.id === event.target.value[0]);
    if (predefinedFilter) {
      onApply([predefinedFilter.filter]);
      setSelectedSavedFilter(predefinedFilter);
      setFilterValue(predefinedFilter.filter);
      setFilterName(predefinedFilter.name);
    }
  };

  const handleDeleteFilter = (
    filter: IPrefilterTokensFilterValues,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setFilterToDelete(filter);
    setIsDeleteFilterModalOpened(true);
  };

  const onAgree = () => {
    if (!filterToDelete) {
      return;
    }

    onDeleteFilter(filterToDelete.id);
    setIsDeleteFilterModalOpened(false);

    if (filterToDelete.id === selectedSavedFilter?.id) {
      setSelectedSavedFilter(null);
      setFilterValue(null);
    }
  };

  const mapFilterName = (filter: string | null | undefined) => `Personal - ${filter}`;
  const mapButtonFilterName = (filter: string | null | undefined) => {
    return filter ? `Personal - ${filter}` : "SELECT PRE-BUILT FILTER";
  };

  const handleToggle = () => {
    setOpenIntroduction(prev => !prev);
  };

  const handleToggleBuildFilter = () => {
    setOpenBuildFilter(prev => !prev);
  };

  const handleToggleLogicGate = () => {
    setOpenLogicGate(prev => !prev);
  };

  return (
    <>
      <StyledAdaptivePageBox sx={{ width: "100%" }}>
        <Select
          fullWidth
          size="small"
          displayEmpty
          onChange={handleApplyFilterChange}
          sx={{
            minWidth: 250,
            maxWidth: 250,
            maxHeight: 32,
            marginRight: 1,
            backgroundColor: "#03A9F4",
            color: theme.palette.mode === "dark" ? "#363640" : "white",
            fontWeight: 600,
            textAlign: "center",
            borderColor: "#03A9F4",
            "@media (max-width: 1030px) and (min-width: 900px)": {
              width: "210px",
              minWidth: 200,
            },
            "@media (max-width: 900px)": {
              mt: 1,
            },
            "& .MuiSelect-icon": {
              fill: theme.palette.mode === "dark" ? "#363640" : "white",
            },
          }}
          renderValue={_value => mapButtonFilterName(selectedSavedFilter?.name)}>
          {predefinedFilters.map(filter => (
            <MenuItem
              selected={false}
              key={filter.id}
              value={[filter.id, filter.name]}>
              <ListItemText primary={mapFilterName(filter?.name)} />
              <LoadingButton
                loading={filter.id === filterToDelete?.id && filterDeletingLoading}
                onClick={event => handleDeleteFilter(filter, event)}
                variant="contained"
                color="error">
                {t("Delete", { ns: "Common" })}
              </LoadingButton>
            </MenuItem>
          ))}
        </Select>
        <StyledFilterButton
          variant="contained"
          sx={{
            minWidth: 250,
            maxHeight: 32,
            "@media (min-width: 900px) and (max-width: 1030px)": {
              width: "210px",
              minWidth: 200,
            },
            "@media (max-width: 900px)": {
              mt: 1,
            },
          }}
          color={"success"}
          onClick={() => setFilterBuilderOpen(true)}
          startIcon={<TuneIcon />}>
          {t("BuildStrategyFilter")}
        </StyledFilterButton>
        <StyledFilterButton
          sx={{
            width: "150px",
            minWidth: 80,
            "@media (max-width: 1030px) and (min-width: 900px)": {
              width: "113px",
              minWidth: 80,
              fontSize: "12px",
            },
            "@media (max-width: 900px)": {
              mt: 1,
            },
          }}
          variant="contained"
          color={"error"}
          disabled={!filterValue || filterValue?.length == 0}
          onClick={() => handleClearFilters()}>
          {t("ClearFilter")}
        </StyledFilterButton>
      </StyledAdaptivePageBox>
      <YesNoDialog
        content={t("DeleteDialogContent")}
        title={t("DeleteDialogTitle")}
        onAgree={onAgree}
        open={isDeleteFilterModalOpened}
        onClose={() => setIsDeleteFilterModalOpened(false)}
      />
      <Dialog
        fullWidth
        open={filterBuilderOpen!}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              minHeight: "80%",
              minWidth: "90%",
            },
          },
        }}
        onClose={() => setFilterBuilderOpen(false)}>
        <IconButton
          sx={{ position: "absolute", right: "10px", top: "10px" }}
          onClick={() => setFilterBuilderOpen(false)}>
          <CloseIcon />
        </IconButton>
        <DialogTitle sx={{ bgcolor: "background.paper" }}>
          <Typography variant="h6">{t("FilterTokens")}</Typography>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "background.paper" }}>
          <Box sx={{ width: "100%" }}>
            <ContentContainer>
              <Stack>
                <FilterBuilderComponentContainer>
                  <FilterBuilderDef
                    value={filterValue as any[]}
                    fields={filterBuilderFields}
                    onValueChanged={handleFilterValueChanged}
                  />
                </FilterBuilderComponentContainer>
                <ClearButton
                  disabled={!filterValue || !filterValue.length || filterValue.length == 0}
                  onClick={handleClearFilters}
                  variant="contained"
                  color="warning">
                  {t("Clear", { ns: "Common" })}
                </ClearButton>

                <StyledDivider />
                <FilterControlsContainer>
                  <Stack
                    gap={2}
                    alignItems={"center"}
                    direction={"row"}>
                    <Typography
                      noWrap
                      fontWeight={500}
                      variant="body1"
                      minWidth={90}>
                      {t("SaveFilterAs")}
                    </Typography>
                    <TextField
                      sx={{ width: "100%" }}
                      onChange={event => setFilterName(event.target.value)}
                      value={filterName}
                      size="small"
                    />
                  </Stack>
                  <Stack
                    minWidth={300}
                    direction={"row"}
                    gap={2}
                    justifyContent="space-between"
                    height={24}>
                    <LoadingButton
                      loading={filterLoading}
                      sx={{ minWidth: 90 }}
                      color="primary"
                      disabled={!filterName}
                      onClick={handleSaveFilter}
                      variant="contained">
                      {t("Save", { ns: "Common" })}
                    </LoadingButton>
                    <Button
                      sx={{ width: "100%" }}
                      disabled={!filterValue}
                      onClick={handleApplyFilter}
                      variant="contained"
                      color={"success"}>
                      {t("ApplyFilter")}
                    </Button>
                  </Stack>
                  
                  <Stack direction="row" spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        {t("FilterBuilderTrainingVideos")}
                      </Typography>

                      <Box>
                        <Box
                          sx={{
                            backgroundColor: "#5a5a5a",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{t("IntroductionVideos")}</Typography>
                          <IconButton onClick={handleToggle}>
                            <ExpandMoreIcon sx={{ color: "#fff" }} />
                          </IconButton>
                        </Box>

                        <Collapse in={openIntroduction}>
                          <Box sx={{ padding: "8px 16px" }}>
                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("introduction")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  color: "#2196F3",
                                  textDecoration: "none",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("FilterBuilderIntroGuide")}
                              </a>
                            </Typography>
                          </Box>
                        </Collapse>
                      </Box>

                      <Box>
                        <Box
                          sx={{
                            backgroundColor: "#5a5a5a",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{t("HowBuildFilter")}</Typography>
                          <IconButton onClick={handleToggleBuildFilter}>
                            <ExpandMoreIcon sx={{ color: "#fff" }} />
                          </IconButton>
                        </Box>

                        <Collapse in={openBuildFilter}>
                          <Box sx={{ padding: "8px 16px" }}>
                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("buildFilter")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("BuildingANDGate")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("nandGate")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("BuildingNANDGate")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("buildingNORGate")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("BuildingNORGate")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("buildingORGate")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("BuildingORGate")}
                              </a>
                            </Typography>
                          </Box>
                        </Collapse>
                      </Box>

                      <Box>
                        <Box
                          sx={{
                            backgroundColor: "#5a5a5a",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{t("HowBuildLogicGate")}</Typography>
                          <IconButton onClick={handleToggleLogicGate}>
                            <ExpandMoreIcon sx={{ color: "#fff" }} />
                          </IconButton>
                        </Box>

                        <Collapse in={openLogicGate}>
                          <Box sx={{ padding: "8px 16px" }}>
                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("logicGateDiagramAND")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("LogicGateDiagramAND")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("logicGateDiagramNOTAND")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("LogicGateDiagramNOTAND")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("logicGateDiagramNorGate")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("LogicGateDiagramNORGate")}
                              </a>
                            </Typography>

                            <Typography>
                              <a
                                href="#"
                                onClick={() => handleVideoChange("logicGateDiagramOR")}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  textDecoration: "none",
                                  color: "#2196F3",
                                }}
                              >
                                <YouTubeIcon sx={{ color: "#FF0000" }} />
                                {t("LogicGateDiagramOR")}
                              </a>
                            </Typography>
                          </Box>
                        </Collapse>
                      </Box>
                    </Box>

                    
                  </Stack>
                </FilterControlsContainer>
              </Stack>
              <Stack width="100%">
                <FilterSelectorContainer>
                  <Typography
                    noWrap
                    fontWeight={500}
                    variant="body1"
                    minWidth={150}>
                    {t("SelectFilter")}
                  </Typography>
                  <Select
                    fullWidth
                    size="small"
                    onChange={handleSavedFilterChange}
                    renderValue={_value => {
                      return <ListItemText primary={mapFilterName(selectedSavedFilter?.name)} />;
                    }}>
                    {predefinedFilters.map(filter => (
                      <MenuItem
                        selected={false}
                        key={filter.id}
                        value={[filter.id, filter.name]}>
                        <ListItemText primary={mapFilterName(filter?.name)} />
                        <LoadingButton
                          loading={filter.id === filterToDelete?.id && filterDeletingLoading}
                          onClick={event => handleDeleteFilter(filter, event)}
                          variant="contained"
                          color="error">
                          {t("Delete", { ns: "Common" })}
                        </LoadingButton>
                      </MenuItem>
                    ))}
                  </Select>
                </FilterSelectorContainer>
                <Box sx={{ width: "auto", display: "flex", justifyContent: "center", marginTop:"50px", marginLeft:"50px" }}>
                      {currentVideo && (
                        <iframe
                          width="100%"
                          height="515"        
                          src={currentVideo}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                  </Box>
              </Stack>
            </ContentContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
});

CustomFilterBuilder.displayName = 'CustomFilterBuilder';

export default CustomFilterBuilder;

const FilterBuilderComponentContainer = styled(Box)(({ theme }) => ({
  minHeight: theme.spacing(16),
  minWidth: theme.spacing(60),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  alignSelf: "center",
  width: "80%",
}));

const ClearButton = styled(Button)(({ theme }) => ({
  alignSelf: "center",
  width: "50%",
  marginTop: theme.spacing(2),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const FilterControlsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const FilterSelectorContainer = styled(Box)(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(2),
  },
}));

const StyledAdaptivePageBox = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "30px",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "self-start",
    justifyContent: "flex-start",
  },
}));

const StyledFilterButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  [theme.breakpoints.down("md")]: {
    marginRight: theme.spacing(2),
  },
}));
