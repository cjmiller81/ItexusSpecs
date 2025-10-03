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
        <Typography variant="body1" paragraph>
          {t('BetaHasThreeParts')}
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {t('ExploreEntryPortal')}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2">{t('ExploreEntryPortalDesc1')}</Typography>
                  <Typography variant="body2">{t('ExploreEntryPortalDesc2')}</Typography>
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
                  {t('UseWebApp')}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2">{t('WalletsDesc')}</Typography>
                  <Typography variant="body2">{t('DEXTradeAggregatorDesc')}</Typography>
                  <Typography variant="body2">{t('CEXTradeAggregatorDesc')}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>{t('AnalyticsPlatforms')}</Typography>
                  <Typography variant="body2">{t('InvestingDesc')}</Typography>
                  <Typography variant="body2">{t('IncomeDesc')}</Typography>
                  <Typography variant="body2">{t('TradingDesc')}</Typography>
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
                  {t('GiveUsFeedback')}
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

        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          {t('NextSteps')}
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={t('NextStep1')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={t('NextStep2')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={t('NextStep3')}
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
