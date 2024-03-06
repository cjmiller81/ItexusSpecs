import React, { useCallback, useEffect, useRef, useState } from "react";

import Gallery from "devextreme-react/gallery";
import { OptionChangedEvent } from "devextreme/ui/gallery";

import service from "./sampleData";
import useResizeObserver from "../../../../utils/resizeObserver";

import "./OptionsSeriesCarrosselPicker.scss";

interface ItemPickerProps {
  "underlying-symbol": string;
  "expiration-date": string;
  "days-to-expiration": string;
  "expiration-type": string;
  "option-contract-symbol": string;
}

const ItemPicker = ({ ...props }: ItemPickerProps) => {
  return (
    <div className="options-series-carrossel-item-picker">
      <div className="expiration-date">{props["expiration-date"]}</div>
      <div className="days-to-expiration">
        {props["days-to-expiration"]} DTE
      </div>
      <div className="expiration-type">{props["expiration-type"]}</div>
      <div className="underlying-symbol">{props["underlying-symbol"]}</div>
      <div className="option-contract-symbol">
        ({props["option-contract-symbol"]})
      </div>
    </div>
  );
};

interface OptionsSeriesCarrosselPickerProps {
  dte?: number;
  onChange?: (dte: number, expirationDate: string) => void;
}

const OptionsSeriesCarrosselPicker = ({
  dte = 45,
  onChange,
  ...props
}: OptionsSeriesCarrosselPickerProps) => {
  const [localDte, setLocalDte] = useState(dte);
  const [dteIndex, setDteIndex] = useState(0);
  const [optionsChain, setOptionsChain] = useState<any[]>([]);
  const [galleryKey, setGalleryKey] = useState<number>(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const handleOptionChanged = useCallback(
    (e: OptionChangedEvent) => {
      if (
        onChange &&
        e.name === "selectedItem" &&
        e.previousValue &&
        e.previousValue["days-to-expiration"] !== e.value["days-to-expiration"]
      ) {
        setLocalDte(e.value["days-to-expiration"]);
        onChange(e.value["days-to-expiration"], e.value["expiration-date"]);
      }
    },
    [onChange]
  );

  useEffect(() => {
    const chainDteIndex = optionsChain.findIndex((chain, index) => {
      if (chain && chain["days-to-expiration"] === localDte) {
        return true;
      }

      return false;
    });

    setDteIndex(chainDteIndex && chainDteIndex > -1 ? chainDteIndex : 0);

    if (onChange && optionsChain.length > 0) {
      const chain =
        optionsChain[chainDteIndex && chainDteIndex > -1 ? chainDteIndex : 0];
      onChange(chain["days-to-expiration"], chain["expiration-date"]);
    }
  }, [localDte, onChange, optionsChain]);

  useEffect(() => {
    // Init
    setOptionsChain(service.generateOptionsChains());
  }, []);

  const dimensions = useResizeObserver(galleryRef, 10);

  useEffect(() => {
    if (dimensions) {
      setGalleryKey((prevKey) => prevKey + 1);
    }
  }, [dimensions]);
  return (
    <>
      <div ref={galleryRef} className="options-series-carrossel-picker">
        <Gallery
          key={galleryKey}
          dataSource={optionsChain}
          height={60}
          loop={false}
          showIndicator={false}
          showNavButtons
          selectedIndex={dteIndex}
          onOptionChanged={handleOptionChanged}
          itemRender={ItemPicker}
        />
      </div>
    </>
  );
};

export default OptionsSeriesCarrosselPicker;
