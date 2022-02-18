import * as React from "react";
import { SvgIcon, BoxProps } from "@mui/material";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type FontAwesomeSvgIconProps = {
  icon: IconDefinition;
  sx?: BoxProps["sx"];
};

// gotten from https://mui.com/components/icons/#font-awesome
export const FontAwesomeSvgIcon = React.forwardRef<
  SVGSVGElement,
  FontAwesomeSvgIconProps
>((props, ref) => {
  const { icon, sx } = props;

  const {
    icon: [width, height, , , svgPathData],
  } = icon;

  return (
    <SvgIcon
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      sx={{
        color: "currentColor",
        ...sx,
      }}
    >
      {typeof svgPathData === "string" ? (
        <path d={svgPathData} />
      ) : (
        /**
         * A multi-path Font Awesome icon seems to imply a duotune icon. The 0th path seems to
         * be the faded element (referred to as the "secondary" path in the Font Awesome docs)
         * of a duotone icon. 40% is the default opacity.
         *
         * @see https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons#changing-opacity
         */
        svgPathData.map((pathData: string, i: number) => (
          <path
            key={pathData}
            style={{ opacity: i === 0 ? 0.4 : 1 }}
            d={pathData}
          />
        ))
      )}
    </SvgIcon>
  );
});
