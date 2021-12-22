import slugify from "slugify";
import { HTMLAttributes, HTMLProps, ReactNode, VFC } from "react";
import { TypographyProps, Typography, Box, Paper, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "../components/Link";
import { InfoCardWrapper } from "../components/InfoCard/InfoCardWrapper";
import { InfoCard } from "../components/InfoCard/InfoCard";
import { Snippet } from "../components/Snippet";

const useCodeSnippetStyles = makeStyles<Theme>((theme) => ({
  snippet: {
    overflow: "scroll",
    display: "block",
    fontSize: "80%",
    background: "#000",
    padding: theme.spacing(3),
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: "8px",
    textShadow: "none",
    marginBottom: 2,
  },
}));

const MdxCodeBlock: VFC<HTMLAttributes<HTMLElement>> = ({
  className,
  children,
}) => {
  const isLanguageBlockFunction = className === "language-block-function";
  const { snippet: snippetClassNames } = useCodeSnippetStyles();

  if (isLanguageBlockFunction) {
    const anchor = `${children}`.match(/^[\w]+/)?.[0] ?? "";
    return (
      <Box
        id={anchor}
        component="code"
        sx={{ fontWeight: "bold", color: "#d18d5b" }}
      >
        <Link href={`#${anchor}`}>{children}</Link>
      </Box>
    );
  }

  return (
    <Snippet
      className={`${snippetClassNames} ${className}`}
      source={`${children}`}
      language={className?.replace("language-", "") ?? ""}
    />
  );
};

const stringifyChildren = (node: ReactNode): string => {
  if (typeof node === "string") {
    return node;
  } else if (Array.isArray(node)) {
    return node.map(stringifyChildren).join("");
  } else if (!!node && typeof node === "object" && "props" in node) {
    return stringifyChildren(node.props.children);
  }
  return "";
};

const HEADING_MARGIN_TOP = 6;
const HEADING_MARGIN_BOTTOM = 2;

export const mdxComponents: Record<string, React.ReactNode> = {
  Box,
  Paper,
  Typography,
  InfoCardWrapper,
  InfoCard,
  h1: (props: TypographyProps) => {
    return (
      <Link
        href="#"
        sx={{
          "&:first-child": {
            "& > h1": {
              marginTop: 0,
            },
          },
        }}
      >
        <Typography
          mt={HEADING_MARGIN_TOP}
          mb={HEADING_MARGIN_BOTTOM}
          variant="bpHeading1"
          {...props}
        />
      </Link>
    );
  },
  h2: (props: TypographyProps) => {
    const anchor = slugify(stringifyChildren(props.children), {
      lower: true,
    });
    return (
      <Link href={`#${anchor}`}>
        <Typography
          mt={HEADING_MARGIN_TOP}
          mb={HEADING_MARGIN_BOTTOM}
          id={anchor}
          variant="bpHeading2"
          {...props}
        />
      </Link>
    );
  },
  h3: (props: TypographyProps) => {
    const anchor = slugify(stringifyChildren(props.children), {
      lower: true,
    });
    return (
      <Link href={`#${anchor}`}>
        <Typography
          mt={HEADING_MARGIN_TOP}
          mb={HEADING_MARGIN_BOTTOM}
          id={anchor}
          variant="bpHeading3"
          {...props}
        />
      </Link>
    );
  },
  h4: (props: TypographyProps) => (
    <Typography
      mt={HEADING_MARGIN_TOP}
      mb={HEADING_MARGIN_BOTTOM}
      variant="bpHeading4"
      {...props}
    />
  ),
  p: (props: TypographyProps) => (
    <Typography mb={2} variant="bpBodyCopy" {...props} />
  ),
  a: (props: HTMLProps<HTMLAnchorElement>) => {
    const { href, ref, ...rest } = props;
    void ref;
    return href ? (
      <Link {...rest} href={href} />
    ) : (
      // eslint-disable-next-line jsx-a11y/anchor-has-content -- special case for creating bookmarks (for cross-linking)
      <a id={props.id} />
    );
  },

  // TODO: Improve style & implementation of below components

  Frame: ({ children, emoji }: { children?: ReactNode; emoji?: ReactNode }) => {
    return (
      <Paper
        variant="teal"
        sx={{
          marginBottom: 3,
          padding: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Box sx={{ fontSize: "3em", textAlign: "center" }}>{emoji}</Box>
        {children}
      </Paper>
    );
  },
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <Box
      component="ol"
      sx={(theme) => ({
        marginBottom: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        listStyle: "auto",
      })}
      {...props}
    />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <Box
      component="ul"
      sx={(theme) => ({
        marginBottom: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        listStyle: "unset",
      })}
      {...props}
    />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <Box {...props} component="li">
      <Typography variant="bpBodyCopy">{props.children}</Typography>
    </Box>
  ),
  inlineCode: (props: HTMLAttributes<HTMLElement>) => (
    <Box
      component="code"
      sx={(theme) => ({
        fontSize: "80%",
        color: theme.palette.purple[700],
        background: theme.palette.purple[100],
        padding: theme.spacing(0.25, 0.5),
        borderColor: theme.palette.purple[200],
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "4px",
      })}
      {...props}
    />
  ),
  pre: (props: HTMLAttributes<HTMLElement>) => {
    // Delegate full control to code for more styling options
    return props.children;
  },
  code: MdxCodeBlock,
};
