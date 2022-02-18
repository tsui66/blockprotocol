import { FC } from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

export const TableTreeIcon: FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M10.5 11.25C10.5 10.875 10.8281 10.5 11.25 10.5H18.75C19.125 10.5 19.5 10.875 19.5 11.25V12.75C19.5 13.1719 19.125 13.5 18.75 13.5H11.25C10.8281 13.5 10.5 13.1719 10.5 12.75V11.25ZM18.75 15C19.125 15 19.5 15.375 19.5 15.75V17.25C19.5 17.6719 19.125 18 18.75 18H14.25C13.8281 18 13.5 17.6719 13.5 17.25V15.75C13.5 15.375 13.8281 15 14.25 15H18.75ZM0 4.5C0 2.85938 1.3125 1.5 3 1.5H21C22.6406 1.5 24 2.85938 24 4.5V19.5C24 21.1875 22.6406 22.5 21 22.5H3C1.3125 22.5 0 21.1875 0 19.5V4.5ZM2.25 7.5V19.5C2.25 19.9219 2.57812 20.25 3 20.25H21C21.375 20.25 21.75 19.9219 21.75 19.5V7.5H6V10.5C6 10.9219 6.32812 11.25 6.75 11.25H8.25C8.625 11.25 9 11.625 9 12C9 12.4219 8.625 12.75 8.25 12.75H6.75C6.46875 12.75 6.23438 12.7031 6 12.6562V15C6 15.4219 6.32812 15.75 6.75 15.75H11.25C11.625 15.75 12 16.125 12 16.5C12 16.9219 11.625 17.25 11.25 17.25H6.75C5.48438 17.25 4.5 16.2656 4.5 15V7.5H2.25Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};
