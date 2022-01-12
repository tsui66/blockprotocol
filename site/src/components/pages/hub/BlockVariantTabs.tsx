import { VoidFunctionComponent } from "react";
import { Tabs, Tab } from "@mui/material";

type BlockVariantTabsProps = {
  activeTab: number;
  setActiveTab: (newValue: number) => void;
  tabItems: { label: string; value: number }[];
};

export const BlockVariantTabs: VoidFunctionComponent<BlockVariantTabsProps> = ({
  activeTab,
  setActiveTab,
  tabItems,
}) => {
  return (
    <Tabs
      TabIndicatorProps={{
        style: { display: "none" },
      }}
      sx={{
        "& .MuiTab-root": {
          textTransform: "none",
          color: "#64778C",
        },
        "& .MuiTab-root.Mui-selected": {
          backgroundColor: ({ palette }) => palette.gray[10],
          color: ({ palette }) => palette.purple[700],
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        },
      }}
      value={activeTab}
      onChange={(_event, newValue: number) => setActiveTab(newValue)}
    >
      {tabItems.map(({ label, value }) => (
        <Tab key={value} label={label} value={value} />
      ))}
    </Tabs>
  );
};
