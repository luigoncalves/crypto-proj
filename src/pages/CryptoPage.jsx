import { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CustomTooltip } from '../components/CustomTooltip';
import axios from 'axios';
import { Link as ChakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import {
  Flex,
  Text,
  Box,
  Button,
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

  // ------------------------------------ check if the item is already in the Watchlist    -------  when backend is done

  //  const checkWatchList = async () => {
  //   try {
  //     const response = await getAllUserItems(user);
  //     // console.log('this is the watchList:', response.data);
  //     const check = await response.data.some(
  //       item => item.tickerSymbol === cryptoTicker
  //     );
  //     setAddButton(!check);
  //     // console.log('check', check);
  //     // console.log('inside checkwatchlist', addButton);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // ------------------------------- everytime the button is clicked this runs   -------  when backend is done

  // useEffect(() => {
  //   if (user) {
  //     checkWatchList();
  //   }
  // }, [addButton]);

  return (
    <>
      <Flex
        width='100vw'
        backgroundColor='rgba(15, 22, 97, 0.9)'
        height='200px'
        flexDirection='column'
      >
        <Flex flexDirection='column' marginLeft='2rem' marginTop='2%'>
          <Heading color='yellow.500'>{cryptoInfo.name}</Heading>
          <Text color='white'>{cryptoInfo.symbol}</Text>

          {/*----------------------------------   Button to add crypto to the watchlist, it has to be connected to backend  ------------*/}

          {/* {isLoggedIn && addButton && (
            <Button
              display='flex'
              borderRadius='md'
              border='1px solid rgba(220, 14, 117, 0.9)'
              w='8rem'
              h='2rem'
              alignItems='center'
              justifyContent='center'
              marginTop='0.5rem'
              marginLeft='1rem'
              fontSize='sm'
              color='rgba(220, 14, 117, 0.9)'
              _hover={{ bg: 'rgba(220, 14, 117, 0.9)', color: 'gray.100' }}
              variant='outline'
              onClick={addToWatchList}
            >
              Add to Watchlist
            </Button>
          )}
          {isLoggedIn && !addButton && (
            <Box
              display='flex'
              borderRadius='md'
              border='1px solid gray'
              w='8rem'
              h='2rem'
              alignItems='center'
              justifyContent='center'
              marginTop='0.5rem'
              marginLeft='1rem'
              fontSize='sm'
              color='gray'
            >
              Add to Watchlist
            </Box>
          )} */}
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
                    <Text color='green.300' fontSize='sm' fontWeight='600'>
                      {(
                        Math.round(cryptoQuote.changesPercentage * 100) / 100
                      ).toFixed(3)}
                      %
                    </Text>
                  </Flex>
                ) : (
                  <Flex alignItems='center' marginLeft='5%'>
                    <StatArrow type='decrease' />
                    <Text color='red.300' fontSize='sm' fontWeight='600'>
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

      {/* ----------------------------------------- Graph - Historical Prices ---------------------------- */}
      <Flex ref={gridItemRef} minH='100vh' flexDirection='column'>
        <Box
          display='flex'
          width='100%'
          justifyContent='space-between'
          alignItems='center'
          marginTop='1.5rem'
          marginBottom='2rem'
        >
          <Heading
            as='h3'
            size='md'
            color='rgba(15, 22, 97, 0.9)'
            paddingLeft='1rem'
          >
            Historical Prices
          </Heading>

          {/* -------------------------------------- Buttons to choose the graph time interval -------------- */}
          <Flex
            margin='1rem'
            justifyContent='space-evenly'
            width='min-content'
            alignItems='center'
            overflowX='scroll'
          >
            <Button
              color={graphDate === '5D' ? 'gray.100' : 'rgba(15, 22, 97, 0.9)'}
              size='sm'
              variant='ghost'
              onClick={() => setGraphDate('5D')}
              bg={graphDate === '5D' ? 'rgba(15, 22, 97, 0.9)' : 'transparent'}
              _hover={{
                bg: graphDate === '5D' ? null : 'rgba(15, 22, 97, 0.3)',
              }}
            >
              5D
            </Button>
            <Button
              color={graphDate === '1M' ? 'gray.100' : 'rgba(15, 22, 97, 0.9)'}
              size='sm'
              variant='ghost'
              onClick={() => setGraphDate('1M')}
              bg={graphDate === '1M' ? 'rgba(15, 22, 97, 0.9)' : 'transparent'}
              _hover={{
                bg: graphDate === '1M' ? null : 'rgba(15, 22, 97, 0.3)',
              }}
            >
              1M
            </Button>
            <Button
              color={graphDate === '3M' ? 'gray.100' : 'rgba(15, 22, 97, 0.9)'}
              size='sm'
              variant='ghost'
              onClick={() => setGraphDate('3M')}
              bg={graphDate === '3M' ? 'rgba(15, 22, 97, 0.9)' : 'transparent'}
              _hover={{
                bg: graphDate === '3M' ? null : 'rgba(15, 22, 97, 0.3)',
              }}
            >
              3M
            </Button>
            <Button
              color={graphDate === '6M' ? 'gray.100' : 'rgba(15, 22, 97, 0.9)'}
              size='sm'
              variant='ghost'
              onClick={() => setGraphDate('6M')}
              bg={graphDate === '6M' ? 'rgba(15, 22, 97, 0.9)' : 'transparent'}
              _hover={{
                bg: graphDate === '6M' ? null : 'rgba(15, 22, 97, 0.3)',
              }}
            >
              6M
            </Button>
            <Button
              color={graphDate === '1Y' ? 'gray.100' : 'rgba(15, 22, 97, 0.9)'}
              size='sm'
              variant='ghost'
              onClick={() => setGraphDate('1Y')}
              bg={graphDate === '1Y' ? 'rgba(15, 22, 97, 0.9)' : 'transparent'}
              _hover={{
                bg: graphDate === '1Y' ? null : 'rgba(15, 22, 97, 0.3)',
              }}
            >
              1Y
            </Button>
            <Button
              color={graphDate === '5Y' ? 'gray.100' : 'rgba(15, 22, 97, 0.9)'}
              size='sm'
              variant='ghost'
              onClick={() => setGraphDate('5Y')}
              bg={graphDate === '5Y' ? 'rgba(15, 22, 97, 0.9)' : 'transparent'}
              _hover={{
                bg: graphDate === '5Y' ? null : 'rgba(15, 22, 97, 0.3)',
              }}
            >
              5Y
            </Button>
          </Flex>
        </Box>
        <Flex justifyContent='center' alignItems='center'>
          {historicalPrices.length > 0 && changes.length > 0 ? (
            <LineChart
              width={gridItemWidth * 0.9}
              height={gridItemHeight * 0.85}
              data={auxPrices}
            >
              <Line
                type='monotone'
                dataKey='close'
                stroke={changes[0][graphDate] > 0 ? '#38A169' : '#E53E3E'}
                dot={false}
              />
              <CartesianGrid stroke='#ccc' />
              <XAxis dataKey='label' fontSize='10' />
              <YAxis fontSize='10' />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          ) : (
            <Flex
              width={gridItemWidth * 0.9}
              height={gridItemHeight * 0.85}
              justifyContent='center'
              alignItems='center'
            >
              No Available Data
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default CryptoPage;
