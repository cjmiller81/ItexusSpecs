import React, { useCallback, useMemo } from "react";

import Form, { Item, Label } from "devextreme-react/form";
import { FieldDataChangedEvent } from "devextreme/ui/form";

import "./NumberField.scss";

const LabelTemplate = () => {
  return function template(data: any) {
    return (<div className="dx-font-s number-field-label-text">{ data.text }</div>);
  };
};

interface NumberFieldProps {
  value?: number;
  onChange?: ((value: number) => void);
};

const NumberField = ({
  value = 0,
  onChange,
  ...props
}: NumberFieldProps) => {
  const data = useMemo(() => {
    return {
      capital: value,
    };
  }, [value]);

  const handleFieldDataChanged = useCallback((e: FieldDataChangedEvent): void => {
    if (onChange) {
      onChange(e.value);
    }
  }, [onChange]);

  const editorOptions = {
    format: {
      currency: "USD",
      precision: 0,
      type: "currency",
    }, //"$ #,##0.##",
    min: 1,
    showSpinButtons: true,
    step: 1,
    stylingMode: "outlined",
  };

  return (
    <div className={"number-field"}>
      <Form
        id="form"
        labelMode="outside"
        formData={data}
        labelLocation="top"
        minColWidth={200}
        colCount={1}
        onFieldDataChanged={handleFieldDataChanged}
        width={200}
      >
        <Item
          dataField="capital"
          editorType="dxNumberBox"
          editorOptions={editorOptions}
        >
          <Label text="FREE CAPITAL" render={LabelTemplate()} />
        </Item>
      </Form>
    </div>
  )
};

export default NumberField;
