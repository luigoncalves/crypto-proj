import { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link as ChakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import {
  Flex,
  Text,
  Box,
  Card,
  Stack,
  CardBody,
  Heading,
  Stat,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { AuthContext } from '../context/auth.context';

const apiKey = `${import.meta.env.VITE_API_KEY}`;

function CryptoPage() {
  const { cryptoTicker } = useParams();
  const [cryptoInfo, setCryptoInfo] = useState([]);
  const [cryptoQuote, setCryptoQuote] = useState([]);

  const [graphDate, setGraphDate] = useState('1Y');

  const gridItemRef = useRef(null);
  const [gridItemWidth, setGridItemWidth] = useState(0);
  const [gridItemHeight, setGridItemHeight] = useState(0);

  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [auxPrices, setAuxPrices] = useState([]);
  const [changes, setChanges] = useState([]);

  // ------------------------------------  fetch Crypto info

  const getCryptoInfo = async () => {
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/search?query=${cryptoTicker}&exchange=CRYPTO&apikey=${apiKey}`
      );
      // console.log(response.data);
      setCryptoInfo(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // ------------------------------------  fetch more Crypto info

  const getCryptoQuote = async () => {
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${cryptoTicker}?apikey=${apiKey}`
      );
      // console.log(response.data);
      setCryptoQuote(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // --------------------------- formats the marketCap number

  const formatNumber = number => {
    if (number >= 1e12) {
      return (number / 1e12).toFixed(2) + 'T';
    } else if (number >= 1e9) {
      return (number / 1e9).toFixed(2) + 'B';
    } else if (number >= 1e6) {
      return (number / 1e6).toFixed(2) + 'M';
    } else {
      return number.toString();
    }
  };

  // ---------------------------------------  this function will get the daily value of the crypto for the last 5 years

  const getHistoricalData = async cryptoTicker => {
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${cryptoTicker}?apikey=${apiKey}`
      );

      const revertArray = response.data.historical.reverse();

      setHistoricalPrices(revertArray);
    } catch (error) {
      console.log(error);
    }
  };

  // -------------------------------------  choosing the time interval

  const chooseGraphDates = () => {
    if (graphDate === '5D') {
      setAuxPrices(historicalPrices.slice(-5));
    } else if (graphDate === '1M') {
      setAuxPrices(historicalPrices.slice(-20));
    } else if (graphDate === '3M') {
      setAuxPrices(historicalPrices.slice(-60));
    } else if (graphDate === '6M') {
      setAuxPrices(historicalPrices.slice(-120));
    } else if (graphDate === '1Y') {
      setAuxPrices(historicalPrices.slice(-240));
    } else if (graphDate === '5Y') {
      setAuxPrices(historicalPrices);
    }
    // if the variable comes as undefined, it's assumed as 1Y
    else {
      setAuxPrices(historicalPrices.slice(-240));
    }
  };

  // ------------------ to know if the difference is negative or positive (will decide the color of the graph)

  const cryptoPriceChanges = async () => {
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/stock-price-change/${cryptoTicker}?apikey=${apiKey}`
      );
      setChanges(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ------------------- main useEffect

  useEffect(() => {
    getCryptoInfo();
    getCryptoQuote();

    getHistoricalData(cryptoTicker);
  }, []);

  // ------------------------------- everytime the button is clicked this runs

  //   useEffect(() => {
  //     if (user) {
  //       checkWatchList();
  //       // console.log(addButton);
  //     }
  //   }, [addButton]);

  // ------------------------ for the graph size

  useEffect(() => {
    const updateDimensions = () => {
      if (gridItemRef.current && graphDate) {
        const width = gridItemRef.current.offsetWidth;
        const height = gridItemRef.current.offsetHeight;
        setGridItemWidth(width);
        setGridItemHeight(height);
      }

      window.addEventListener('resize', updateDimensions);

      // Clean up by removing the event listener when component unmounts
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    };
    updateDimensions();
  }, [window.innerHeight, window.innerWidth]);

  // --------------- everytime the time interval or graph size changes, it will fetch the data again

  useEffect(() => {
    getHistoricalData(cryptoTicker);
  }, [graphDate, gridItemHeight, gridItemWidth]);

  useEffect(() => {
    if (historicalPrices.length > 0 && graphDate) {
      chooseGraphDates();
      cryptoPriceChanges();
    }
  }, [historicalPrices]);

  return (
    <>
      <Flex
        width='100vw'
        backgroundColor='rgba(15, 22, 97, 0.9)'
        height='200px'
        flexDirection='column'
      >
        <Flex flexDirection='column' marginLeft='2%' marginTop='2%'>
          <Heading color='yellow.500'>{cryptoInfo.name}</Heading>
          <Text color='white'>{cryptoInfo.symbol}</Text>
        </Flex>
        <Flex
          margin='2%'
          justifyContent='space-around'
          alignItems='center'
          flexDirection={['column', 'row']}
        >
          <Stat maxWidth='min-content'>
            <Flex alignItems='center'>
              <StatNumber
                fontSize='md'
                color='yellow.500'
                width='max-content'
                height='100%'
              >
                {cryptoQuote.price}
              </StatNumber>
              <StatHelpText display='flex' width='max-content' marginLeft='2px'>
                {cryptoQuote.changesPercentage > 0 ? (
                  <Flex alignItems='center' marginLeft='5%'>
                    <StatArrow type='increase' />
                    <Text color='green' fontSize='sm' fontWeight='600'>
                      {(
                        Math.round(cryptoQuote.changesPercentage * 100) / 100
                      ).toFixed(3)}
                      %
                    </Text>
                  </Flex>
                ) : (
                  <Flex alignItems='center' marginLeft='5%'>
                    <StatArrow type='decrease' />
                    <Text color='red' fontSize='sm' fontWeight='600'>
                      {(Math.round(cryptoQuote.changesPercentage * 100) / 100)
                        .toFixed(3)
                        .slice(1)}
                      %
                    </Text>
                  </Flex>
                )}
              </StatHelpText>
            </Flex>
          </Stat>

          <Text color='yellow.500'>
            Market Cap:{' '}
            {cryptoQuote.marketCap ? formatNumber(cryptoQuote.marketCap) : '-'}
          </Text>

          <Text color='yellow.500'>
            Volume Avg:{' '}
            {cryptoQuote.avgVolume ? formatNumber(cryptoQuote.avgVolume) : '-'}
          </Text>
        </Flex>
      </Flex>
    </>
  );
}

export default CryptoPage;
