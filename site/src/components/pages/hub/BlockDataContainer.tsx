import {
  Box,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
} from "@mui/material";
import { Validator } from "jsonschema";
import { useMemo, useState, VoidFunctionComponent } from "react";

import { BlockMetadata } from "../../../pages/api/blocks.api";
import { BlockDataTabPanels } from "./BlockDataTabPanels";
import { BlockDataTabs } from "./BlockDataTabs";
import { BlockVariantTabs } from "./BlockVariantTabs";
import { BlockModalButton } from "./BlockModalButton";
import { BlockTabsModal } from "./BlockTabsModal";
import {
  BlockExports,
  BlockSchema,
  dummyUploadFile,
  getEmbedBlock,
} from "./HubUtils";
import { TabPanel } from "./TabPanel";

type BlockDataContainerProps = {
  metadata: BlockMetadata;
  schema: BlockSchema;
  blockModule: BlockExports | undefined;
};

const validator = new Validator();

enum MobileTab {
  Preview,
  Source,
}

enum BlockDataTab {
  DataSource,
  Schema,
}

const BlockDataTabItems = [
  { label: "Data Source", value: BlockDataTab.DataSource },
  { label: "Block Schema", value: BlockDataTab.Schema },
];

export const BlockDataContainer: VoidFunctionComponent<
  BlockDataContainerProps
> = ({ metadata, schema, blockModule }) => {
  const [blockDataTab, setBlockDataTab] = useState<BlockDataTab>(
    BlockDataTab.DataSource,
  );
  const [blockVariantTab, setBlockVariantTab] = useState(0);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [text, setText] = useState("{}");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>(
    MobileTab.Preview,
  );

  /** used to recompute props and errors on dep changes (caching has no benefit here) */
  const [props, errors] = useMemo<[object | undefined, string[]]>(() => {
    let result;

    try {
      result = JSON.parse(text);
      result.accountId = "test-account-id";
      result.entityId = "test-entity-id";
      result.uploadFile = dummyUploadFile;
      result.getEmbedBlock = getEmbedBlock;
    } catch (err) {
      return [result, [(err as Error).message]];
    }

    const errorsToEat = ["uploadFile", "getEmbedBlock"];

    const errorMessages = validator
      .validate(result, schema ?? {})
      .errors.map((err) => `ValidationError: ${err.stack}`)
      .filter(
        (err) => !errorsToEat.some((errorToEat) => err.includes(errorToEat)),
      );

    return [result, errorMessages];
  }, [text, schema]);

  return (
    <>
      {isMobile && (
        <Tabs
          value={activeMobileTab}
          onChange={(_event, newValue: MobileTab) =>
            setActiveMobileTab(newValue)
          }
          sx={{
            "&.MuiTabs-root": {
              backgroundColor: theme.palette.gray[10],
              border: `1px solid ${theme.palette.gray[20]}`,
              borderRadius: "6px",
              display: "flex",
              position: "relative",
              mb: 2,
            },
            "& .MuiTab-root": {
              flex: 1,
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              marginRight: 0,
            },
            ".MuiTabs-indicator": {
              backgroundColor: theme.palette.common.white,
              borderRadius: "6px",
              position: "absolute",
              top: 4,
              bottom: 4,
              marginLeft: "4px",
              height: "unset",
              boxShadow: 1,
              width: "48% !important",
            },
          }}
        >
          <Tab label="Preview" value={MobileTab.Preview} />
          <Tab label="Source Code" value={MobileTab.Source} />
        </Tabs>
      )}

      <Box
        sx={{
          display: { xs: "flex", md: "grid" },
          flexDirection: { xs: "column", md: "unset" },
          gridTemplateColumns: { md: "60% 40%" },
        }}
      >
        <Box
          sx={{
            ...(isMobile && {
              display: activeMobileTab === MobileTab.Preview ? "block" : "none",
            }),
          }}
        >
          <Box sx={{ height: 320, backgroundColor: "white" }}>
            {!isMobile && (
              <BlockVariantTabs
                activeTab={blockVariantTab}
                setActiveTab={setBlockVariantTab}
                tabItems={[{ label: metadata.displayName, value: 1 }]}
              />
            )}
            {/* @todo: create custom select component */}
            {isMobile && (
              <Box>
                <Select
                  value={0}
                  sx={{
                    width: "100%",
                    height: 42,
                    fontSize: 16,
                    mb: 1,
                  }}
                  MenuProps={{
                    sx: {
                      ".MuiList-root": {
                        padding: 0,
                      },
                      ".MuiMenuItem-root": {
                        fontSize: 16,
                        padding: "0px 16px",

                        "&.Mui-selected": {
                          backgroundColor: ({ palette }) => palette.purple[700],
                          color: "white",
                        },
                      },
                    },
                  }}
                >
                  {[{ label: metadata.displayName, value: 1 }].map(
                    ({ label, value }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </Box>
            )}
            <TabPanel value={blockVariantTab} index={0}>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  backgroundColor: "#F7FAFC",
                  height: "100%",
                  padding: theme.spacing(0, 4),
                  overflow: "auto",
                }}
              >
                {blockModule && <blockModule.default {...props} />}
              </Box>
            </TabPanel>
          </Box>
        </Box>
        <Box
          sx={{
            ...(isMobile && {
              display: activeMobileTab === MobileTab.Source ? "block" : "none",
            }),
          }}
        >
          {!isMobile && (
            <BlockDataTabs
              blockDataTab={blockDataTab}
              setBlockDataTab={setBlockDataTab}
              tabItems={BlockDataTabItems}
            />
          )}

          {isMobile && (
            <Box>
              <Select
                value={blockDataTab}
                onChange={(evt) => setBlockDataTab(Number(evt.target.value))}
                sx={{
                  width: "100%",
                  height: 42,
                  fontSize: 16,
                  mb: 1,
                }}
                MenuProps={{
                  sx: {
                    ".MuiList-root": {
                      padding: 0,
                    },
                    ".MuiMenuItem-root": {
                      fontSize: 16,
                      padding: "0px 16px",

                      "&.Mui-selected": {
                        backgroundColor: ({ palette }) => palette.purple[700],
                        color: "white",
                      },
                    },
                  },
                }}
              >
                {BlockDataTabItems.map(({ label, value }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          <Box
            sx={{
              position: "relative",
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
            }}
          >
            <BlockDataTabPanels
              blockDataTab={blockDataTab}
              text={text}
              setText={setText}
              schema={schema}
            />
            <Box
              sx={{
                position: "absolute",
                height: 80,
                width: "100%",
                bottom: 0,
                background:
                  "linear-gradient(0deg, #39444F 18.14%, rgba(57, 68, 79, 0) 100%)",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                textAlign: "right",
              }}
            >
              <BlockModalButton setBlockModalOpen={setBlockModalOpen} />
              <BlockTabsModal
                open={blockModalOpen}
                setOpen={setBlockModalOpen}
                blockDataTab={blockDataTab}
                setBlockDataTab={setBlockDataTab}
                schema={schema}
                text={text}
                setText={setText}
              />
            </Box>
          </Box>
          {/* errors */}
          {errors.length > 0 && (
            <Box
              component="details"
              mt={2}
              px={3}
              py={1}
              sx={{ borderRadius: "6px", backgroundColor: "#fecaca" }}
            >
              <Box component="summary" sx={{ cursor: "pointer" }}>
                Errors
              </Box>
              <Box
                component="ul"
                px={4}
                py={2}
                sx={{ listStyleType: "square" }}
              >
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
