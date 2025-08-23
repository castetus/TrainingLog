import { Stack, Typography, Box, Container } from '@mui/material';
import type { ReactNode } from 'react';

import { BackButton } from '@/components/Common';

interface NestedPageLayoutProps {
  /** Where the back button should navigate to */
  backTo: string;
  /** Page title to display */
  title: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Main content of the page */
  children: ReactNode;
  /** Optional custom back button behavior */
  onBack?: () => void;
}

export default function NestedPageLayout({
  backTo,
  title,
  subtitle,
  children,
  onBack,
}: NestedPageLayoutProps) {
  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Stack spacing={3}>
        {/* Header with back button and title */}
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <BackButton to={backTo} onClick={onBack} sx={{ mt: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Main content */}
        <Box>{children}</Box>
      </Stack>
    </Container>
  );
}
