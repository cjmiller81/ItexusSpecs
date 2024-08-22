import { useEffect, useRef, useState } from "react";
import { ListOnItemsRenderedProps } from "react-window";
import { LookUpOption } from "../components";

const filler: LookUpOption = {
  label: "",
  id: "",
  iconUrl: "",
};

function getDefaultArray(bufferSize: number): LookUpOption[] {
  return new Array(bufferSize).fill(filler);
}

type FetchResult = {
  items: LookUpOption[];
  totalCount: number;
};
export function usePaginatedVirtualList(
  key: string,
  pageSize: number,
  renderProps: ListOnItemsRenderedProps,
  fetcher: (pageNumber: number) => Promise<FetchResult>,
): LookUpOption[] {
  const bufferSize = useRef<number>(0);
  const [items, setItems] = useState<LookUpOption[]>(getDefaultArray(0));
  const pagesLoaded = useRef<Set<number>>(new Set<number>());
  useEffect(() => {
    bufferSize.current = 1;
    pagesLoaded.current = new Set();
    handleRenderProps();
  }, [key]);

  const updateBufferItems = (page: number) => {
    if (pagesLoaded.current.has(page)) {
      return;
    }

    pagesLoaded.current.add(page);
    fetcher(page)
      .then(({ items, totalCount }) => {
        const startIndex = page * pageSize;
        setItems(prevItems => {
          const tmpArr = prevItems.length === totalCount ? prevItems : getDefaultArray(totalCount);
          return [...tmpArr.slice(0, startIndex), ...items, ...tmpArr.slice(startIndex + items.length)];
        });
      })
      .catch(() => {
        pagesLoaded.current.delete(page);
      });
  };

  useEffect(() => {
    handleRenderProps();
  }, [renderProps]);

  const handleRenderProps = () => {
    let startIndexToRender = renderProps.visibleStartIndex;
    let lookBackIndex = renderProps.visibleStartIndex - pageSize / 2

    const startPageIndex = Math.floor(startIndexToRender / pageSize);
    const lookBackIndexPageIndex = Math.floor(lookBackIndex / pageSize);

    updateBufferItems(startPageIndex);
    //preload previous page to improve scroll up performance (optional)
    updateBufferItems(lookBackIndex < 0 ? 0 : lookBackIndexPageIndex);
  };

  return items;
}
