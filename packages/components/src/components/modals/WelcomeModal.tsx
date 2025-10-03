import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

const SurveyButton = () => {
  return (
    <Button
      variant="contained"
      size="small"
      sx={{
        ml: 2,
        textTransform: "none",
        backgroundColor: "#109EEF",
        color: "white",
        "&:hover": {
          backgroundColor: "#0E8BD6"
        }
      }}
      onClick={() => {
        // Open survey link in new tab: https://forms.gle/NhcLMGVZZyphnsK8A
        window.open("https://forms.gle/NhcLMGVZZyphnsK8A", "_blank");
      }}
    >
      Beta Survey
    </Button>
  );
};

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation('WelcomeModal');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
      sx={{ zIndex: 10001 }} // Even higher than PasswordResetModal
    >
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {t('Title')}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" paragraph>
          {t('IntroText')}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          {t('AboutBetaTest')}
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {t('UseWebApp')}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>{t('Profile')}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>{t('AnalyticsPlatforms')}</Typography>
                  <Typography variant="body2">{t('InvestingDesc')}</Typography>
                  <Typography variant="body2">{t('IncomeDesc')}</Typography>
                  <Typography variant="body2">{t('TradingDesc')}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>{t('Tools')}</Typography>
                  <Typography variant="body2">{t('DEXTradeAggregatorDesc')}</Typography>
                  <Typography variant="body2">{t('CEXTradeAggregatorDesc')}</Typography>
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {t('GiveUsFeedback')} <SurveyButton />
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2">{t('FeedbackDesc1')}</Typography>
                  <Typography variant="body2">{t('FeedbackDesc2')}</Typography>
                  <Typography variant="body2">{t('FeedbackDesc3')}</Typography>
                </>
              }
            />
          </ListItem>
        </List>

        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          {t('RewardsForYourTime')}
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {t('LifetimeDiscount')}
                </Typography>
              }
              secondary={t('LifetimeDiscountDesc')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {t('BetaTesterBadge')}
                </Typography>
              }
              secondary={t('BetaTesterBadgeDesc')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {t('FreeTrial')}
                </Typography>
              }
              secondary={t('FreeTrialDesc')}
            />
          </ListItem>
        </List>

        <Typography variant="body1" sx={{ mt: 3, fontStyle: 'italic' }}>
          {t('ThankYouMessage')}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {t('FounderSignature')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          {t('CloseButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
