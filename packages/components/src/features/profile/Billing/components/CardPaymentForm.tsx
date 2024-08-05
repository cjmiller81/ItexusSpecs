import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Form, Formik } from "formik";
import i18next from "i18next";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { PatternFormat } from "react-number-format";
import * as Yup from "yup";
import { InferType } from "yup";
import AppTextField from "../../../../components/common/inputs/AppTextField";
import { SaveChancelButtons } from "./SaveChancelButtons";

const requiredError = i18next.t("mandatoryField", { ns: "ErrorMessages" });

const cardModelSchema = Yup.object().shape({
  expiry: Yup.string().trim().length(5, " ").required(requiredError),
  number: Yup.string().trim().length(19, " ").required(requiredError),
  cvc: Yup.string().trim().length(3, " ").required(requiredError),
});

type CardModel = InferType<typeof cardModelSchema>;

type Props = React.FormHTMLAttributes<HTMLFormElement> & {
  onAttachCard: (cardData: CardModel) => void;
  onClose: () => void;
};

export const CardPaymentForm: FC<Props> = ({ onClose, onAttachCard, style, ...props }) => {
  const { t } = useTranslation("CardPaymentForm");
  return (
    <Formik<CardModel>
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={{
        number: "",
        cvc: "",
        expiry: "",
      }}
      validate={values => {
        console.log(values);
      }}
      validationSchema={cardModelSchema}
      onSubmit={values => {
        onAttachCard(values);
      }}>
      {({ errors, handleBlur, handleChange, handleSubmit, values }) => (
        <Form
          style={{ marginTop: "20px", height: "100%", display: "flex", flexDirection: "column", ...style }}
          noValidate
          onSubmit={handleSubmit}
          {...props}>
          <Grid
            container
            spacing={2}>
            <Grid
              item
              xs={12}>
              <PatternFormat
                autoComplete="cc-number"
                inputProps={{
                  size: "small",
                  placeholder: "#### #### #### ####",
                  InputProps: {
                    name: "number",
                    endAdornment: (
                      <Stack
                        direction="row"
                        spacing="2px">
                        <img
                          width={32}
                          src="/visa.svg"
                        />
                        <img
                          width={32}
                          src="/mastercard.svg"
                        />
                        <img
                          width={32}
                          src="/american-express.svg"
                        />
                        <img
                          width={32}
                          src="/discover.svg"
                        />
                      </Stack>
                    ),
                  },
                }}
                label={t("CardNumber")}
                name="number"
                format="#### #### #### ####"
                prefix=""
                fullWidth
                value={values.number}
                onBlur={handleBlur}
                onChange={handleChange}
                customInput={AppTextField}
                fieldError={errors.number}
              />
            </Grid>
            <Grid
              item
              xs={5}>
              <PatternFormat
                sx={{ width: "100px" }}
                autoComplete="cc-exp"
                inputProps={{ size: "small", placeholder: "MM/YY", name: "expiry" }}
                label="Expiry Date"
                format="##/##"
                prefix=""
                fullWidth
                customInput={AppTextField}
                value={values.expiry}
                onBlur={handleBlur}
                onChange={handleChange}
                fieldError={errors.expiry}
              />
            </Grid>
            <Grid
              item
              xs={7}>
              <PatternFormat
                sx={{ width: "100px" }}
                autoComplete="cc-exp"
                inputProps={{ size: "small", placeholder: t("CVC"), name: "cvc" }}
                label={t("CVC")}
                format="###"
                prefix=""
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                customInput={AppTextField}
                fieldError={errors.cvc}
              />
            </Grid>
          </Grid>
          <SaveChancelButtons
            sx={{ position: "absolute", bottom: theme => theme.spacing(2), right: theme => theme.spacing(2) }}
            onCancel={onClose}
          />
        </Form>
      )}
    </Formik>
  );
};
