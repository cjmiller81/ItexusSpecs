import { openSnackbar } from "@/api/snackbar";
import { setOpenedItem } from "@/features/nav-bar/navBarSlice";
import { ChangePasswordSection } from "@/features/profile/ChangePasswordSection";
import ProfileCard from "@/features/profile/ProfileCard";
import ProfileEditSection, { ProfileModel } from "@/features/profile/ProfileEditSection";
import { TotpSection } from "@/features/profile/TotpSection";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { SnackbarProps } from "@/types/snackbar";
import { Grid } from "@mui/material";
import { profileService, useOry } from "components";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CryptoBalance } from "components/CryptoBalance";
import { FiatBalance } from "components/FiatBalance";

export default function ProfilePage() {
  const { t } = useTranslation("ProfilePage");
  const router = useRouter();
  const routeParams = (router.query.tab as string[]) || undefined;

  const tab = routeParams && (router.query.tab as string[]).length ? routeParams[0] : "personal";
  const [isAvatarUploading, setIsAvatarUploading] = useState<boolean>(false);
  const [isProfileDetailsUpdating, setIsProfileDetailsUpdating] = useState<boolean>(false);
  const {
    onUpdateAvatar,
    onUpdateProfile,
    onTotpUnlink,
    onTotpSubmit,
    settingsFlow,
    createSettingsFow,
    onChangePassword,
  } = useOry();
  const [codeLoading, setCodeLoading] = useState(false);
  const [newPasswordLoading, setNewPasswordLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const openedItem = useAppSelector(state => state.ui.openedItem);
  useEffect(() => {
    if (settingsFlow) return;
    createSettingsFow().then();
  }, []);

  const onAvatarChanged = (file: File) => {
    setIsAvatarUploading(true);
    profileService
      .uploadAvatart(file)
      .then(url => onUpdateAvatar(url))
      .catch((error: any) => {
        const message = error?.response?.data?.error?.reason ?? t("AvatarUploadingError");
        openSnackbar({
          open: true,
          message: message,
          variant: "alert",
          alert: {
            color: "error",
          },
        } as SnackbarProps);
      })
      .finally(() => setIsAvatarUploading(false));
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const onChangeDetails = ({ firstName, lastName }: ProfileModel) => {
    setIsProfileDetailsUpdating(true);
    onUpdateProfile(firstName, lastName)
      .then()
      .catch((error: any) => {
        openSnackbar({
          open: true,
          message: error?.response?.data?.error?.reason ?? t("ProfileUpdatingError"),
          alert: {
            color: "error",
          },
        } as SnackbarProps);
      })
      .finally(() => setIsProfileDetailsUpdating(false));
  };

  const onSubmitCode = async (code: string) => {
    setCodeLoading(true);
    onTotpSubmit(code)
      .then(() => {
        openSnackbar({
          open: true,
          message: t("ApplicationLinked"),
          variant: "alert",
          alert: {
            color: "success",
          },
        } as SnackbarProps);
      })
      .catch(error => {
        const message = error?.response?.data?.error?.reason ?? t("invalidCode", { ns: "ErrorMessages" });
        openSnackbar({
          open: true,
          message: message,
          variant: "alert",
          alert: {
            color: "error",
          },
        } as SnackbarProps);
      })
      .finally(() => {
        setCodeLoading(false);
      });
  };

  useEffect(() => {
    if (tab !== openedItem) dispatch(setOpenedItem({ openedItem: tab }));
  }, [tab]);

  const onTotpUnlinkHandle = async () => {
    setCodeLoading(true);
    onTotpUnlink()
      .then(() => {
        openSnackbar({
          open: true,
          message: t("ApplicationUnlinked", "SecurityContainer"),
          alert: {
            color: "success",
          },
        } as SnackbarProps);
      })
      .catch(error => {
        const message = error?.response?.data?.error?.reason ?? t("invalidCode", { ns: "ErrorMessages" });
        openSnackbar({
          open: true,
          message: message,
          alert: {
            color: "error",
          },
        } as SnackbarProps);
      })
      .finally(() => {
        setCodeLoading(false);
      });
  };

  const onSubmitNewPassword = async (passsword: string) => {
    setNewPasswordLoading(true);
    onChangePassword(passsword)
      .then(() => {
        openSnackbar({
          open: true,
          message: t("NewPasswordMessage", { ns: "SecurityContainer" }),
          alert: {
            color: "success",
          },
        } as SnackbarProps);
      })
      .catch(error => {
        const message = error?.response?.data?.error?.reason ?? t("invalidPasswordFormat", { ns: "ErrorMessages" });
        openSnackbar({
          open: true,
          message: message,
          variant: "alert",
          alert: {
            color: "error",
          },
        } as SnackbarProps);
      })
      .finally(() => {
        setNewPasswordLoading(false);
      });
  };

  const mockFiatData = [{ currency: "USD", quantity: "2345000" }];
  const mockCryptoData = [
    { coin: "BTC", quantity: "16000" },
    { coin: "ETH", quantity: "25000" },
    { coin: "USDT", quantity: "22565000" },
  ];

  return (
    <Grid
      container
      spacing={3}>
      <Grid
        item
        container
        spacing={3}
        xs={10}>
        <Grid
          item
          xs={12}
          md={3}>
          <ProfileCard
            isAvatarLoading={isAvatarUploading}
            avatarLoading={isAvatarUploading}
            onChangeAvatar={onAvatarChanged}
            focusInput={focusInput}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={9}>
          {tab === "details" && (
            <ProfileEditSection
              isProfileUpdating={isProfileDetailsUpdating}
              onProfileUpdated={onChangeDetails}
            />
          )}
          {tab === "password" && (
            <>
              <ChangePasswordSection
                isLoading={newPasswordLoading}
                settingsFlow={settingsFlow}
                onChangePassword={onSubmitNewPassword}
              />
              <TotpSection
                onSubmitCode={onSubmitCode}
                onTotpUnlinkHandle={onTotpUnlinkHandle}
                settingsFlow={settingsFlow}
                isCodeSubmitting={codeLoading}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </Grid>
      </Grid>
      <Grid
        item
        xs={2}
        container
        sx={{ pt: 0, mt: 0 }}
        direction="column"
        spacing={2}>
        <Grid item>
          <CryptoBalance data={mockCryptoData} />
        </Grid>
        <Grid item>
          <FiatBalance data={mockFiatData} />
        </Grid>
      </Grid>
    </Grid>
  );
}
