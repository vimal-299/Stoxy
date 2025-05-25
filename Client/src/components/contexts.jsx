import { createContext, useState, useEffect, useContext } from 'react';

const InvestedContext = createContext();
const CurrentContext = createContext();
const PercentContext = createContext();
const HoldingsContext = createContext();

const ValuesProvider = ({ children }) => {
  const [invested, setInvested] = useState(0);
  const [current, setCurrent] = useState(0);
  const [percent, setPercent] = useState(0);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    let sum = 0;
    let c = 0;
    for (let i = 0; i < holdings.length; i++) {
      const element = holdings[i].investedamount;
      const x = holdings[i].currentprice * holdings[i].quantity;
      sum += x;
      c += element;
    }
    setCurrent(sum);
    setInvested(c);
  }, [holdings]);

  useEffect(() => {
    if (invested !== 0) {
      setPercent((((current - invested) / invested) * 100).toFixed(2));
    }
  }, [invested, current]);

  return (
    <InvestedContext.Provider value={{ invested, setInvested }}>
      <CurrentContext.Provider value={{ current, setCurrent }}>
        <PercentContext.Provider value={{ percent, setPercent }}>
          <HoldingsContext.Provider value={{ holdings, setHoldings }}>
            {children}
          </HoldingsContext.Provider>
        </PercentContext.Provider>
      </CurrentContext.Provider>
    </InvestedContext.Provider>
  );
};


export { ValuesProvider, InvestedContext, CurrentContext, PercentContext, HoldingsContext };
