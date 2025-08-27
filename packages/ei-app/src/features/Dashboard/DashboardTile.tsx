import { CircularProgress, Paper, Typography } from "@mui/material";
import { Box, Stack, StackProps, useTheme } from "@mui/system";
import { FC, ReactNode, useState } from "react";
import { SectionLink } from "./SectionLink";

export type DashboardTileProps = Omit<StackProps, 'title'> & {
  title: string;
  icon: ReactNode;
  loading?: boolean;
  datePicker?: ReactNode;
  afterTitleComponent?: ReactNode;
  rightHeaderContent?: ReactNode;
  sectionLink?: {
    href: string;
    text?: string;
  };
};

export const DashboardTile: FC<DashboardTileProps> = ({
  title,
  icon,
  children,
  loading,
  afterTitleComponent,
  datePicker,
  rightHeaderContent,
  sectionLink,
  ...props
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Stack {...props}>
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between" 
        gap={1}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ position: 'relative' }}
      >
        <Stack 
          direction="row" 
          alignItems="center" 
          gap={1} 
          flex="1 1 auto" 
          minWidth={0}
        >
          {icon}
          <Typography
            sx={{
              pt: "2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "1.020rem",
              letterSpacing: "0.04em",
            }}
            variant="h6">
            {title}
          </Typography>
          {afterTitleComponent}
          {loading && (
            <CircularProgress
              sx={{ color: "success.main", ml: "auto", mr: 0 }}
              size="1rem"
            />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          {rightHeaderContent}
          {datePicker && <Box>{datePicker}</Box>}
        </Stack>
        
        {sectionLink && isHovered && (
          <Box sx={{ 
            position: 'absolute', 
            right: '22%', 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 10,
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '4px'
          }}>
            <SectionLink href={sectionLink.href} text={sectionLink.text} />
          </Box>
        )}
        
        {sectionLink && isHovered && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: '-4px',
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            borderRadius: '2px',
            zIndex: 5
          }} />
        )}
      </Stack>
      <Paper sx={{ boxShadow: theme.shadows?.[8] }}>{children}</Paper>
    </Stack>
  );
};
