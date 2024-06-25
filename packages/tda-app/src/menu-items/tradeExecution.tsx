import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import { FormattedMessage } from 'react-intl';
import { NavItemType } from 'types/menu';

const tradeExecution: NavItemType = {
  id: "group-forms-tables-3",
  title: <FormattedMessage id="trade-execution" />,
  type: "group",
  children: [
    {
      id: "rfq",
      url: "/trading/rfq",
      title: <FormattedMessage id="rfq" />,
      type: "item",
      icon: CandlestickChartIcon,
      breadcrumbs: false,
    },
  ],
}

export default tradeExecution
